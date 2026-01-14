import Cliente from "../models/Cliente.model.js";

const clientesData = [
  {
    nombre: "Roberto Martínez",
    email: "roberto.martinez@email.com",
    telefono: "+54 11 4321-5678",
    direccion: "Calle Falsa 123, CABA",
    dni: "35123456",
    fechaNacimiento: new Date("1990-03-15"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Laura Fernández",
    email: "laura.fernandez@email.com",
    telefono: "+54 11 4322-5679",
    direccion: "Av. Libertador 456, CABA",
    dni: "36234567",
    fechaNacimiento: new Date("1988-07-22"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    telefono: "+54 11 4323-5680",
    direccion: "Calle Principal 789, CABA",
    dni: "37345678",
    fechaNacimiento: new Date("1985-11-10"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Ana Silva",
    email: "ana.silva@email.com",
    telefono: "+54 11 4324-5681",
    direccion: "Av. Cabildo 1011, CABA",
    dni: "38456789",
    fechaNacimiento: new Date("1992-01-30"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Pedro González",
    email: "pedro.gonzalez@email.com",
    telefono: "+54 11 4325-5682",
    direccion: "Calle Uruguay 1213, CABA",
    dni: "39567890",
    fechaNacimiento: new Date("1987-05-18"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Sofía Torres",
    email: "sofia.torres@email.com",
    telefono: "+54 11 4326-5683",
    direccion: "Av. Las Heras 1415, CABA",
    dni: "40678901",
    fechaNacimiento: new Date("1995-09-25"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Diego Romero",
    email: "diego.romero@email.com",
    telefono: "+54 11 4327-5684",
    direccion: "Calle Juncal 1617, CABA",
    dni: "41789012",
    fechaNacimiento: new Date("1989-12-08"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Valentina Morales",
    email: "valentina.morales@email.com",
    telefono: "+54 11 4328-5685",
    direccion: "Av. Pueyrredón 1819, CABA",
    dni: "42890123",
    fechaNacimiento: new Date("1993-04-14"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Martín Castro",
    email: "martin.castro@email.com",
    telefono: "+54 11 4329-5686",
    direccion: "Calle Paraguay 2021, CABA",
    dni: "43901234",
    fechaNacimiento: new Date("1986-08-03"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Carolina Díaz",
    email: "carolina.diaz@email.com",
    telefono: "+54 11 4330-5687",
    direccion: "Av. Córdoba 2223, CABA",
    dni: "44012345",
    fechaNacimiento: new Date("1991-02-19"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Javier Herrera",
    email: "javier.herrera@email.com",
    telefono: "+54 11 4331-5688",
    direccion: "Calle Lavalle 2425, CABA",
    dni: "45123456",
    fechaNacimiento: new Date("1984-06-27"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Lucía Vargas",
    email: "lucia.vargas@email.com",
    telefono: "+54 11 4332-5689",
    direccion: "Av. Callao 2627, CABA",
    dni: "46234567",
    fechaNacimiento: new Date("1994-10-12"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Sebastián Ruiz",
    email: "sebastian.ruiz@email.com",
    telefono: "+54 11 4333-5690",
    direccion: "Calle Maipú 2829, CABA",
    dni: "47345678",
    fechaNacimiento: new Date("1988-03-05"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Camila Sánchez",
    email: "camila.sanchez@email.com",
    telefono: "+54 11 4334-5691",
    direccion: "Av. 9 de Julio 3031, CABA",
    dni: "48456789",
    fechaNacimiento: new Date("1996-07-21"),
    nacionalidad: "Argentina",
  },
  {
    nombre: "Federico Flores",
    email: "federico.flores@email.com",
    telefono: "+54 11 4335-5692",
    direccion: "Calle Reconquista 3233, CABA",
    dni: "49567890",
    fechaNacimiento: new Date("1990-11-16"),
    nacionalidad: "Argentina",
  },
];

export const seedClientes = async () => {
  try {
    const count = await Cliente.count();
    if (count > 0) {
      console.log("⏭️  Clientes ya existen en la base de datos. Saltando...");
      return;
    }

    await Cliente.bulkCreate(clientesData);
    console.log("✅ Clientes creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear clientes:", error.message);
    throw error;
  }
};
