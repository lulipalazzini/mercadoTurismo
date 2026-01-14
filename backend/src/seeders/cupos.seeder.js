import Cupo from "../models/Cupo.model.js";

const cuposData = [
  {
    tipoServicio: "paquete",
    servicioId: 1,
    fecha: new Date("2026-02-01"),
    cupoTotal: 20,
    cupoReservado: 5,
    cupoDisponible: 15,
    precioAjustado: 45000,
    estado: "disponible",
    notas: "Cupo regular temporada baja",
  },
  {
    tipoServicio: "paquete",
    servicioId: 2,
    fecha: new Date("2026-03-10"),
    cupoTotal: 15,
    cupoReservado: 3,
    cupoDisponible: 12,
    precioAjustado: 180000,
    estado: "disponible",
    notas: "Temporada media",
  },
  {
    tipoServicio: "alojamiento",
    servicioId: 1,
    fecha: new Date("2026-02-15"),
    cupoTotal: 50,
    cupoReservado: 35,
    cupoDisponible: 15,
    precioAjustado: 27000,
    estado: "limitado",
    notas: "Fin de semana largo - demanda alta",
  },
  {
    tipoServicio: "alojamiento",
    servicioId: 2,
    fecha: new Date("2026-03-20"),
    cupoTotal: 30,
    cupoReservado: 8,
    cupoDisponible: 22,
    precioAjustado: 3500,
    estado: "disponible",
    notas: "Cupo normal",
  },
  {
    tipoServicio: "excursion",
    servicioId: 1,
    fecha: new Date("2026-02-10"),
    cupoTotal: 30,
    cupoReservado: 22,
    cupoDisponible: 8,
    precioAjustado: 9000,
    estado: "limitado",
    notas: "Pocas plazas disponibles",
  },
  {
    tipoServicio: "excursion",
    servicioId: 2,
    fecha: new Date("2026-03-15"),
    cupoTotal: 15,
    cupoReservado: 10,
    cupoDisponible: 5,
    precioAjustado: 48000,
    estado: "limitado",
    notas: "Trekking glaciar - grupo reducido",
  },
  {
    tipoServicio: "circuito",
    servicioId: 1,
    fecha: new Date("2026-04-10"),
    cupoTotal: 25,
    cupoReservado: 12,
    cupoDisponible: 13,
    precioAjustado: 185000,
    estado: "disponible",
    notas: "Circuito Norte Argentino",
  },
  {
    tipoServicio: "circuito",
    servicioId: 2,
    fecha: new Date("2026-11-05"),
    cupoTotal: 18,
    cupoReservado: 6,
    cupoDisponible: 12,
    precioAjustado: 450000,
    estado: "disponible",
    notas: "Patagonia Completa",
  },
  {
    tipoServicio: "salida_grupal",
    servicioId: 1,
    fecha: new Date("2026-07-15"),
    cupoTotal: 25,
    cupoReservado: 18,
    cupoDisponible: 7,
    precioAjustado: 125000,
    estado: "limitado",
    notas: "Bariloche invierno - última plaza",
  },
  {
    tipoServicio: "salida_grupal",
    servicioId: 2,
    fecha: new Date("2026-03-05"),
    cupoTotal: 35,
    cupoReservado: 25,
    cupoDisponible: 10,
    precioAjustado: 85000,
    estado: "disponible",
    notas: "Vendimia Mendoza",
  },
  {
    tipoServicio: "crucero",
    servicioId: 1,
    fecha: new Date("2026-03-15"),
    cupoTotal: 3000,
    cupoReservado: 2200,
    cupoDisponible: 800,
    precioAjustado: 870000,
    estado: "disponible",
    notas: "Caribe - cabinas disponibles",
  },
  {
    tipoServicio: "crucero",
    servicioId: 2,
    fecha: new Date("2026-05-20"),
    cupoTotal: 2500,
    cupoReservado: 1800,
    cupoDisponible: 700,
    precioAjustado: 1220000,
    estado: "disponible",
    notas: "Mediterráneo",
  },
  {
    tipoServicio: "pasaje",
    servicioId: 1,
    fecha: new Date("2026-02-15"),
    cupoTotal: 180,
    cupoReservado: 150,
    cupoDisponible: 30,
    precioAjustado: 48000,
    estado: "limitado",
    notas: "Vuelo Buenos Aires - Bariloche",
  },
  {
    tipoServicio: "pasaje",
    servicioId: 3,
    fecha: new Date("2026-04-05"),
    cupoTotal: 150,
    cupoReservado: 45,
    cupoDisponible: 105,
    precioAjustado: 28000,
    estado: "disponible",
    notas: "Vuelo Buenos Aires - Mendoza",
  },
  {
    tipoServicio: "paquete",
    servicioId: 3,
    fecha: new Date("2026-02-15"),
    cupoTotal: 25,
    cupoReservado: 20,
    cupoDisponible: 5,
    precioAjustado: 68000,
    estado: "limitado",
    notas: "Cataratas - últimas plazas",
  },
];

export const seedCupos = async () => {
  try {
    const count = await Cupo.count();
    if (count > 0) {
      console.log("⏭️  Cupos ya existen en la base de datos. Saltando...");
      return;
    }

    // Insertar registros uno por uno para evitar problemas con índices
    for (const cupo of cuposData) {
      await Cupo.create(cupo);
    }
    console.log("✅ Cupos creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear cupos:", error.message);
    throw error;
  }
};
