const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const usersData = [
  {
    nombre: "Admin Principal",
    email: "admin@mercadoturismo.com",
    password: "admin123",
    passwordAdmin: "admin456",
    role: "admin",
    telefono: "+54 11 4444-5555",
    direccion: "Av. Corrientes 1234, CABA",
    razonSocial: "Mercado Turismo S.A.",
  },
  {
    nombre: "Viajes Premier SA",
    email: "agencia@viajespremier.com",
    password: "agencia123",
    role: "agencia",
    telefono: "+54 11 5555-6666",
    direccion: "Av. Santa Fe 2345, CABA",
    razonSocial: "Viajes Premier S.A.",
  },
  {
    nombre: "Juan García",
    email: "juan.garcia@email.com",
    password: "operador123",
    role: "operador_agencia",
    telefono: "+54 11 6666-7777",
    direccion: "Av. Rivadavia 3456, CABA",
    agenciaId: 2,
  },
  {
    nombre: "María López",
    email: "maria.lopez@email.com",
    password: "operador123",
    role: "operador_independiente",
    telefono: "+54 11 7777-8888",
    direccion: "Av. Callao 4567, CABA",
    razonSocial: "María López - Operador Turístico",
  },
];

const seedUsers = async () => {
  try {
    const count = await User.count();
    if (count > 0) {
      console.log("⏭️  Usuarios ya existen en la base de datos. Saltando...");
      return;
    }

    // No hasheamos aquí porque el modelo User tiene un hook beforeCreate que lo hace automáticamente
    await User.bulkCreate(usersData, { individualHooks: true });
    console.log("✅ Usuarios creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear usuarios:", error.message);
    throw error;
  }
};

module.exports = { seedUsers };
