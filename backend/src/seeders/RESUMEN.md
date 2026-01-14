# 🌱 Seeders Creados - Mercado Turismo

## ✅ Resumen

Se han creado **16 archivos de seeders** con datos de ejemplo para poblar la base de datos:

### 📁 Archivos Creados

| Archivo                     | Registros | Descripción                             |
| --------------------------- | --------- | --------------------------------------- |
| `users.seeder.js`           | 3         | Usuarios del sistema (1 admin, 2 users) |
| `clientes.seeder.js`        | 15        | Clientes con datos completos            |
| `alojamientos.seeder.js`    | 15        | Hoteles, hostels, resorts, etc.         |
| `autos.seeder.js`           | 15        | Vehículos de alquiler                   |
| `paquetes.seeder.js`        | 15        | Paquetes turísticos                     |
| `pasajes.seeder.js`         | 15        | Pasajes aéreos y terrestres             |
| `excursiones.seeder.js`     | 15        | Excursiones y tours                     |
| `transfers.seeder.js`       | 15        | Servicios de transfer                   |
| `seguros.seeder.js`         | 15        | Seguros de viaje                        |
| `cruceros.seeder.js`        | 15        | Cruceros internacionales                |
| `circuitos.seeder.js`       | 15        | Circuitos turísticos                    |
| `salidasGrupales.seeder.js` | 15        | Salidas grupales                        |
| `cupos.seeder.js`           | 15        | Control de cupos/disponibilidad         |
| `index.js`                  | -         | Orquestador principal                   |
| `README.md`                 | -         | Documentación completa                  |
| `EJEMPLO_USO.js`            | -         | Guía de uso con ejemplos                |

**Total: 198 registros** de datos de ejemplo

---

## 🚀 Cómo Usar

### 1️⃣ Ejecutar Todos los Seeders

```bash
cd backend
npm run seed
```

### 2️⃣ Comportamiento Inteligente

Los seeders son **condicionales**:

- ✅ Si la tabla está **vacía** → Inserta los datos
- ⏭️ Si la tabla **tiene datos** → Salta la inserción

### 3️⃣ Salida Esperada

```
🌱 Iniciando seeders...

✅ Conexión a la base de datos establecida

✅ Usuarios creados exitosamente
✅ Clientes creados exitosamente
✅ Paquetes creados exitosamente
✅ Alojamientos creados exitosamente
✅ Autos creados exitosamente
✅ Pasajes creados exitosamente
✅ Excursiones creadas exitosamente
✅ Transfers creados exitosamente
✅ Seguros creados exitosamente
✅ Cruceros creados exitosamente
✅ Circuitos creados exitosamente
✅ Salidas grupales creadas exitosamente
✅ Cupos creados exitosamente

✨ Todos los seeders se ejecutaron exitosamente
```

---

## 📊 Datos de Ejemplo Incluidos

### 👥 Usuarios

```javascript
{
  email: "admin@mercadoturismo.com",
  password: "admin123", // (hasheado)
  role: "admin"
}
```

### 🏨 Alojamientos

- Hotel Sheraton Buenos Aires (5⭐) - $25,000/noche
- Hostel Milhouse (3⭐) - $3,500/noche
- Llao Llao Resort (5⭐) - $45,000/noche
- Y 12 más...

### 🚗 Autos

- Toyota Corolla (Sedan) - $8,500/día
- Ford Ranger 4x4 (SUV) - $15,000/día
- Mercedes-Benz Clase E (Lujo) - $35,000/día
- Y 12 más...

### 📦 Paquetes

- Buenos Aires Clásico (4 días) - $45,000
- Patagonia Aventura (10 días) - $180,000
- Cataratas del Iguazú (3 días) - $65,000
- Y 12 más...

### 🎫 Excursiones

- City Tour Buenos Aires - $8,500
- Trekking Glaciar Perito Moreno - $45,000
- Navegación Canal Beagle - $32,000
- Y 12 más...

### 🛡️ Seguros

- Seguro Viajero Básico - $1,500
- Seguro Premium Internacional - $8,500
- Seguro Deportes Aventura - $15,000
- Y 12 más...

---

## 🎯 Características Especiales

### ✨ Datos Realistas

- Nombres, direcciones y fechas coherentes
- Precios representativos del mercado argentino
- Relaciones entre entidades respetadas

### 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Validaciones de email
- Datos normalizados

### 📅 Fechas Futuras

- Todas las fechas están en 2026
- Permite probar reservas futuras
- Evita conflictos con datos pasados

### 🌍 Cobertura Nacional

- Destinos por toda Argentina
- Principales ciudades turísticas
- Variedad de experiencias

---

## 🔧 Personalización

### Agregar Más Datos

1. Abre el archivo seeder correspondiente
2. Agrega objetos al array de datos
3. Guarda y ejecuta `npm run seed`

Ejemplo:

```javascript
// alojamientos.seeder.js
const alojamientosData = [
  // ... datos existentes
  {
    nombre: "Mi Hotel Nuevo",
    tipo: "hotel",
    ubicacion: "Tu Ciudad",
    precioNoche: 20000,
    // ... más campos
  },
];
```

### Modificar Datos Existentes

Simplemente edita los valores en el array de cada seeder.

---

## ⚠️ Advertencias

### ❌ NO Usar en Producción

Estos seeders son **solo para desarrollo y testing**.

### 🔄 Resetear Datos

Para limpiar y volver a poblar:

```bash
# CUIDADO: Esto borrará todos los datos
# Elimina manualmente la base de datos y vuelve a ejecutar seeders
```

### 🔗 Dependencias

Algunos seeders dependen de otros (ej: Reservas necesitan Clientes y Paquetes).
El orden de ejecución en `index.js` maneja esto automáticamente.

---

## 📚 Documentación Adicional

- [README.md](./README.md) - Documentación detallada
- [EJEMPLO_USO.js](./EJEMPLO_USO.js) - Ejemplos prácticos de uso

---

## 🎉 ¡Listo para Usar!

Tu base de datos ahora puede poblarse automáticamente con datos de ejemplo realistas.

```bash
npm run seed
```

Y empieza a desarrollar con datos consistentes! 🚀
