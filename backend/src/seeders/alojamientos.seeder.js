import Alojamiento from "../models/Alojamiento.model.js";

const alojamientosData = [
  {
    nombre: "Hotel Sheraton Buenos Aires",
    tipo: "hotel",
    ubicacion: "Buenos Aires, Argentina",
    direccion: "San Martín 1225, CABA",
    estrellas: 5,
    descripcion:
      "Hotel de lujo en el corazón de Buenos Aires con vistas al río",
    precioNoche: 25000,
    servicios: ["wifi", "piscina", "gimnasio", "spa", "restaurant"],
    capacidad: 200,
    habitacionesDisponibles: 35,
    disponible: true,
    vendedorId: 2,
  },
  {
    nombre: "Hostel Milhouse",
    tipo: "hostel",
    ubicacion: "Buenos Aires, Argentina",
    direccion: "Av. de Mayo 1245, CABA",
    estrellas: 3,
    descripcion: "Hostel económico con ambiente joven y actividades diarias",
    precioNoche: 3500,
    servicios: ["wifi", "cocina_compartida", "bar"],
    capacidad: 80,
    habitacionesDisponibles: 18,
    disponible: true,
    vendedorId: 4,
  },
  {
    nombre: "Llao Llao Hotel & Resort",
    tipo: "resort",
    ubicacion: "Bariloche, Argentina",
    direccion: "Av. Ezequiel Bustillo Km 25",
    estrellas: 5,
    descripcion: "Resort exclusivo con vistas a la montaña y el lago",
    precioNoche: 45000,
    servicios: ["wifi", "piscina", "gimnasio", "spa", "golf", "restaurant"],
    capacidad: 150,
    habitacionesDisponibles: 28,
    disponible: true,
    vendedorId: 2,
  },
  {
    nombre: "Apartamento Palermo Soho",
    tipo: "apartamento",
    ubicacion: "Buenos Aires, Argentina",
    direccion: "Honduras 4785, CABA",
    estrellas: 4,
    descripcion: "Apartamento moderno en el trendy barrio de Palermo",
    precioNoche: 12000,
    servicios: ["wifi", "cocina", "aire_acondicionado"],
    capacidad: 4,
    habitacionesDisponibles: 1,
    disponible: true,
    vendedorId: 4,
  },
  {
    nombre: "Cabaña Los Arrayanes",
    tipo: "cabaña",
    ubicacion: "Villa La Angostura, Argentina",
    direccion: "Los Arrayanes 123",
    estrellas: 4,
    descripcion: "Cabaña acogedora rodeada de naturaleza",
    precioNoche: 18000,
    servicios: ["wifi", "cocina", "chimenea", "parrilla"],
    capacidad: 6,
    habitacionesDisponibles: 3,
    disponible: true,
    vendedorId: 2,
  },
  {
    nombre: "Hotel Continental Mendoza",
    tipo: "hotel",
    ubicacion: "Mendoza, Argentina",
    direccion: "Av. España 1324",
    estrellas: 4,
    descripcion: "Hotel céntrico ideal para explorar la región vitivinícola",
    precioNoche: 15000,
    servicios: ["wifi", "piscina", "restaurant", "estacionamiento"],
    capacidad: 100,
    habitacionesDisponibles: 22,
    disponible: true,
  },
  {
    nombre: "Hostel Che Lagarto",
    tipo: "hostel",
    ubicacion: "El Calafate, Argentina",
    direccion: "Av. del Libertador 3456",
    estrellas: 3,
    descripcion: "Hostel con tours al Glaciar Perito Moreno",
    precioNoche: 4500,
    servicios: ["wifi", "cocina_compartida", "tours"],
    capacidad: 60,
    habitacionesDisponibles: 14,
    disponible: true,
  },
  {
    nombre: "Resort Termas de Río Hondo",
    tipo: "resort",
    ubicacion: "Santiago del Estero, Argentina",
    direccion: "Av. Alberdi 789",
    estrellas: 4,
    descripcion: "Resort termal con aguas medicinales",
    precioNoche: 28000,
    servicios: ["wifi", "termas", "spa", "piscina", "restaurant"],
    capacidad: 180,
    habitacionesDisponibles: 32,
    disponible: true,
  },
  {
    nombre: "Hotel Salta Premium",
    tipo: "hotel",
    ubicacion: "Salta, Argentina",
    direccion: "Calle Caseros 567",
    estrellas: 4,
    descripcion: "Hotel colonial en el centro histórico de Salta",
    precioNoche: 14000,
    servicios: ["wifi", "restaurant", "bar", "terraza"],
    capacidad: 75,
    habitacionesDisponibles: 16,
    disponible: true,
  },
  {
    nombre: "Apartamento Puerto Madero",
    tipo: "apartamento",
    ubicacion: "Buenos Aires, Argentina",
    direccion: "Pierina Dealessi 1234, CABA",
    estrellas: 5,
    descripcion: "Lujoso apartamento con vista al río en Puerto Madero",
    precioNoche: 22000,
    servicios: ["wifi", "cocina", "gimnasio_edificio", "seguridad"],
    capacidad: 4,
    habitacionesDisponibles: 1,
    disponible: true,
  },
  {
    nombre: "Cabaña Patagonia Dreams",
    tipo: "cabaña",
    ubicacion: "El Bolsón, Argentina",
    direccion: "Av. San Martín 890",
    estrellas: 4,
    descripcion: "Cabaña con vista panorámica a la cordillera",
    precioNoche: 16000,
    servicios: ["wifi", "cocina", "chimenea", "deck"],
    capacidad: 5,
    habitacionesDisponibles: 2,
    disponible: true,
  },
  {
    nombre: "Hotel Plaza Córdoba",
    tipo: "hotel",
    ubicacion: "Córdoba, Argentina",
    direccion: "Av. Colón 123",
    estrellas: 4,
    descripcion: "Hotel boutique en el centro de Córdoba",
    precioNoche: 13000,
    servicios: ["wifi", "restaurant", "business_center"],
    capacidad: 90,
    habitacionesDisponibles: 20,
    disponible: true,
  },
  {
    nombre: "Hostel Tucumán Backpackers",
    tipo: "hostel",
    ubicacion: "San Miguel de Tucumán, Argentina",
    direccion: "Calle Maipú 456",
    estrellas: 2,
    descripcion: "Hostel económico para mochileros",
    precioNoche: 2800,
    servicios: ["wifi", "cocina_compartida"],
    capacidad: 40,
    habitacionesDisponibles: 10,
    disponible: true,
  },
  {
    nombre: "Resort Costa del Sol",
    tipo: "resort",
    ubicacion: "Mar del Plata, Argentina",
    direccion: "Av. Costanera 789",
    estrellas: 5,
    descripcion: "Resort frente al mar con playa privada",
    precioNoche: 32000,
    servicios: ["wifi", "piscina", "spa", "restaurant", "playa_privada"],
    capacidad: 220,
    habitacionesDisponibles: 40,
    disponible: true,
  },
  {
    nombre: "Hotel Iguazú Grand",
    tipo: "hotel",
    ubicacion: "Puerto Iguazú, Argentina",
    direccion: "Av. Tres Fronteras 650",
    estrellas: 5,
    descripcion: "Hotel de lujo cerca de las Cataratas del Iguazú",
    precioNoche: 38000,
    servicios: ["wifi", "piscina", "spa", "restaurant", "tours"],
    capacidad: 160,
    habitacionesDisponibles: 30,
    disponible: true,
  },
];

export const seedAlojamientos = async () => {
  try {
    const count = await Alojamiento.count();
    if (count >= 15) {
      console.log(
        "⏭️  Alojamientos ya existen en la base de datos. Saltando..."
      );
      return;
    }

    // Insertar uno por uno para evitar conflictos con datos existentes
    let insertados = 0;
    for (const alojamiento of alojamientosData) {
      try {
        await Alojamiento.create(alojamiento);
        insertados++;
      } catch (error) {
        // Ignorar errores de duplicados y continuar con el siguiente
        if (error.name === "SequelizeUniqueConstraintError") {
          continue;
        }
        throw error;
      }
    }

    console.log(`✅ Alojamientos creados exitosamente (${insertados} nuevos)`);
  } catch (error) {
    console.error("❌ Error al crear alojamientos:", error.message);
    throw error;
  }
};
