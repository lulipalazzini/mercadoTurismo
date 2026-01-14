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
    nombre: "Juan García",
    email: "juan.garcia@email.com",
    password: "user123",
    role: "user",
    telefono: "+54 11 5555-6666",
    direccion: "Av. Santa Fe 2345, CABA",
  },
  {
    nombre: "María López",
    email: "maria.lopez@email.com",
    password: "user123",
    role: "user",
    telefono: "+54 11 6666-7777",
    direccion: "Av. Rivadavia 3456, CABA",
  },
];

export const seedUsers = async () => {
  try {
    const count = await User.count();
    if (count > 0) {
      console.log("⏭️  Usuarios ya existen en la base de datos. Saltando...");
      return;
    }

    // Hash passwords before inserting
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await User.bulkCreate(usersWithHashedPasswords);
    console.log("✅ Usuarios creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear usuarios:", error.message);
    throw error;
  }
};
