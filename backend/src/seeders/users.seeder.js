import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

const usersData = [
  {
    nombre: "Admin Principal",
    email: "admin@mercadoturismo.com",
    password: "admin123",
    role: "admin",
    telefono: "+54 11 4444-5555",
    direccion: "Av. Corrientes 1234, CABA",
  },
  {
    nombre: "Viajes Premier SA",
    email: "agencia@viajespremier.com",
    password: "agencia123",
    role: "agencia",
    telefono: "+54 11 5555-6666",
    direccion: "Av. Santa Fe 2345, CABA",
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
  },
];

export const seedUsers = async () => {
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
