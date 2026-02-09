const { sequelize } = require("./src/config/database");
const User = require("./src/models/User.model");
const Paquete = require("./src/models/Paquete.model");
const Tren = require("./src/models/Tren.model");
const Alojamiento = require("./src/models/Alojamiento.model");
const Auto = require("./src/models/Auto.model");
const bcrypt = require("bcryptjs");

async function seedTestData() {
  try {
    console.log("🌱 Creando datos de prueba...\n");

    // Crear usuario vendedor
    const hashedPassword = await bcrypt.hash("test123", 10);
    
    const [user] = await User.findOrCreate({
      where: { email: "vendedor@test.com" },
      defaults: {
        nombre: "Vendedor Test",
        email: "vendedor@test.com",
        password: hashedPassword,
        role: "B2B",
        activo: true,
      },
    });    

    console.log(`✅ Usuario creado: ${user.nombre} (ID: ${user.id})`);

    // Crear paquetes
    const paquete1 = await Paquete.findOrCreate({
      where: { nombre: "Paquete Test Destacado" },
      defaults: {
        nombre: "Paquete Test Destacado",
        descripcion: "Un paquete de prueba destacado",
        destino: "Buenos Aires",
        duracion: "5 días",
        noches: 4,
        precio: 1500,
        cupoMaximo: 10,
        cupoDisponible: 10,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        incluye: JSON.stringify(["Hotel", "Traslados", "Desayuno"]),
        imagenes: JSON.stringify([]),
        vendedorId: user.id,
        userId: user.id,
        published_by_user_id: user.id,
        activo: true,
        destacado: true,
      },
    });

    console.log(`✅ Paquete destacado creado: ${paquete1[0].nombre}`);

    // Crear tren
    const tren1 = await Tren.findOrCreate({
      where: { nombre: "Tren Test Destacado" },
      defaults: {
        nombre: "Tren Test Destacado",
        empresa: "Trenes Test SA",
        tipo: "alta-velocidad",
        clase: "ejecutiva",
        origen: "Buenos Aires",
        destino: "Mar del Plata",
        duracionHoras: 5.5,
        distanciaKm: 400,
        precio: 500,
        moneda: "USD",
        descripcion: "Servicio de alta velocidad",
        paradas: JSON.stringify(["Chascomús", "Dolores"]),
        servicios: JSON.stringify(["WiFi", "Restaurant"]),
        imagenes: JSON.stringify([]),
        vendedorId: user.id,
        userId: user.id,
        published_by_user_id: user.id,
        activo: true,
        destacado: true,
      },
    });

    console.log(`✅ Tren destacado creado: ${tren1[0].nombre}`);

    // Crear alojamiento
    const alojamiento1 = await Alojamiento.findOrCreate({
      where: { nombre: "Hotel Test Destacado" },
      defaults: {
        nombre: "Hotel Test Destacado",
        tipo: "hotel",
        ubicacion: "Buenos Aires",
        direccion: "Av. Corrientes 1234",
        estrellas: 4,
        descripcion: "Hotel de prueba",
        precioNoche: 100,
        habitacionesDisponibles: 50,
        servicios: JSON.stringify(["WiFi", "Piscina", "Gym"]),
        imagenes: JSON.stringify([]),
        vendedorId: user.id,
        userId: user.id,
        published_by_user_id: user.id,
        activo: true,
        destacado: true,
      },
    });

    console.log(`✅ Alojamiento destacado creado: ${alojamiento1[0].nombre}`);

    // Crear auto
    const auto1 = await Auto.findOrCreate({
      where: { marca: "Toyota", modelo: "Corolla" },
      defaults: {
        marca: "Toyota",
        modelo: "Corolla",
        categoria: "sedan",
        año: 2023,
        capacidadPasajeros: 5,
        transmision: "automatica",
        combustible: "nafta",
        precioDia: 50,
        ubicacion: "Buenos Aires",
        descripcion: "Auto de prueba",
        caracteristicas: JSON.stringify(["AC", "GPS", "Bluetooth"]),
        imagenes: JSON.stringify([]),
        vendedorId: user.id,
        userId: user.id,
        published_by_user_id: user.id,
        disponible: true,
        destacado: true,
      },
    });

    console.log(`✅ Auto destacado creado: ${auto1[0].marca} ${auto1[0].modelo}`);

    console.log("\n✅ DATOS DE PRUEBA CREADOS EXITOSAMENTE\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedTestData();
