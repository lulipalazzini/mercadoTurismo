/**
 * EJEMPLO DE USO DE SEEDERS
 *
 * Este archivo muestra diferentes formas de usar los seeders
 */

// ============================================
// OPCIÓN 1: Ejecutar todos los seeders
// ============================================

// Desde terminal:
// npm run seed

// O ejecutar directamente:
// node src/seeders/index.js

// ============================================
// OPCIÓN 2: Ejecutar seeders individuales
// ============================================

import { seedUsers } from "./users.seeder.js";
import { seedClientes } from "./clientes.seeder.js";

// Ejecutar solo usuarios
const poblarUsuarios = async () => {
  try {
    await seedUsers();
    console.log("Usuarios creados");
  } catch (error) {
    console.error("Error:", error);
  }
};

// poblarUsuarios();

// ============================================
// OPCIÓN 3: Usar en tu aplicación
// ============================================

// En tu archivo index.js o donde inicialices la app:

import { runAllSeeders } from "./seeders/index.js";
import { sequelize } from "./config/database.js";

const inicializarApp = async () => {
  try {
    // Sincronizar base de datos
    await sequelize.sync({ force: false }); // force: false no borra datos existentes

    // Ejecutar seeders (solo poblarán si las tablas están vacías)
    await runAllSeeders();

    // Iniciar servidor
    console.log("Aplicación lista");
  } catch (error) {
    console.error("Error inicializando:", error);
  }
};

// inicializarApp();

// ============================================
// OPCIÓN 4: Ejecutar seeders con sync force
// ============================================

// CUIDADO: Esto BORRARÁ todos los datos existentes

const resetearYPoblar = async () => {
  try {
    // Eliminar todas las tablas y volver a crearlas
    await sequelize.sync({ force: true });
    console.log("Base de datos reseteada");

    // Poblar con datos de ejemplo
    await runAllSeeders();
    console.log("Datos de ejemplo insertados");
  } catch (error) {
    console.error("Error:", error);
  }
};

// resetearYPoblar(); // ⚠️ USAR SOLO EN DESARROLLO

// ============================================
// OPCIÓN 5: Ejecutar seeders específicos en orden
// ============================================

import { seedAlojamientos } from "./alojamientos.seeder.js";
import { seedPaquetes } from "./paquetes.seeder.js";

const poblarTurismo = async () => {
  try {
    // Primero usuarios (pueden ser necesarios para otras tablas)
    await seedUsers();

    // Luego los servicios turísticos
    await seedAlojamientos();
    await seedPaquetes();

    console.log("Servicios turísticos poblados");
  } catch (error) {
    console.error("Error:", error);
  }
};

// poblarTurismo();

// ============================================
// VERIFICAR SI HAY DATOS ANTES DE POBLAR
// ============================================

import User from "../models/User.model.js";

const verificarYPoblar = async () => {
  try {
    const usuariosExistentes = await User.count();

    if (usuariosExistentes === 0) {
      console.log("No hay usuarios, ejecutando seeders...");
      await runAllSeeders();
    } else {
      console.log(`Ya existen ${usuariosExistentes} usuarios`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// verificarYPoblar();

// ============================================
// PERSONALIZAR DATOS ANTES DE INSERTAR
// ============================================

// Si necesitas modificar los datos antes de insertarlos:

const poblarPersonalizado = async () => {
  try {
    // Importar el modelo
    const Usuario = (await import("../models/User.model.js")).default;

    // Verificar si está vacío
    const count = await Usuario.count();
    if (count > 0) {
      console.log("Ya hay datos");
      return;
    }

    // Crear datos personalizados
    const usuarios = [
      {
        nombre: "Mi Admin",
        email: "miadmin@email.com",
        password: await bcrypt.hash("mipassword", 10),
        role: "admin",
      },
      // ... más usuarios
    ];

    await Usuario.bulkCreate(usuarios);
    console.log("Usuarios personalizados creados");
  } catch (error) {
    console.error("Error:", error);
  }
};

// poblarPersonalizado();

// ============================================
// CONSEJOS DE USO
// ============================================

/*
1. DESARROLLO:
   - Usa `npm run seed` después de crear las tablas
   - Los seeders no se ejecutarán si ya hay datos
   - Puedes ejecutarlos múltiples veces sin problemas

2. PRODUCCIÓN:
   - NO uses estos seeders en producción
   - Los datos son solo de ejemplo
   - Crea seeders específicos con datos reales si es necesario

3. TESTING:
   - Usa sync({ force: true }) para resetear la DB entre tests
   - Ejecuta seeders para tener datos consistentes en tests
   - Considera usar transacciones para rollback

4. AGREGAR MÁS DATOS:
   - Copia un archivo seeder existente
   - Modifica el array de datos
   - Importa y ejecuta en index.js

5. DEBUGGING:
   - Cada seeder muestra mensajes de éxito/error
   - Revisa los logs para ver qué se insertó
   - Si hay errores, verifica las validaciones del modelo
*/
