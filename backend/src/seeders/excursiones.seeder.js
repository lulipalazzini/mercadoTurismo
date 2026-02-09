import Excursion from "../models/Excursion.model.js";

const excursionesData = [
  {
    nombre: "City Tour Buenos Aires",
    descripcion:
      "Recorrido por los principales atractivos de Buenos Aires incluyendo Plaza de Mayo, La Boca, Recoleta y Palermo",
    destino: "Buenos Aires",
    tipo: "cultural",
    duracion: 4,
    precio: 8500,
    incluye: ["guia", "transporte", "entradas"],
    noIncluye: ["comidas", "propinas"],
    cupoMaximo: 30,
    cupoDisponible: 30,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Trekking Glaciar Perito Moreno",
    descripcion:
      "Caminata sobre el hielo del famoso Glaciar Perito Moreno con guías especializados",
    destino: "El Calafate",
    tipo: "aventura",
    duracion: 8,
    precio: 45000,
    incluye: ["guia", "transporte", "equipo", "entrada_parque"],
    noIncluye: ["comidas"],
    cupoMaximo: 15,
    cupoDisponible: 15,
    dificultad: "dificil",
    activo: true,
  },
  {
    nombre: "Navegación Canal Beagle",
    descripcion:
      "Navegación por el Canal Beagle visitando Isla de los Lobos y Faro Les Eclaireurs",
    destino: "Ushuaia",
    tipo: "naturaleza",
    duracion: 6,
    precio: 32000,
    incluye: ["guia", "navegacion", "refrigerio"],
    noIncluye: ["almuerzo", "puerto_tax"],
    cupoMaximo: 40,
    cupoDisponible: 40,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Tour Vitivinícola Mendoza",
    descripcion: "Visita a 3 bodegas premium con degustaciones y almuerzo",
    destino: "Mendoza",
    tipo: "gastronomica",
    duracion: 7,
    precio: 28000,
    incluye: ["guia", "transporte", "degustaciones", "almuerzo"],
    noIncluye: ["compras_adicionales"],
    cupoMaximo: 20,
    cupoDisponible: 20,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Safari Fotográfico Ibera",
    descripcion:
      "Safari en 4x4 por los Esteros del Iberá observando fauna autóctona",
    destino: "Esteros del Iberá",
    tipo: "naturaleza",
    duracion: 5,
    precio: 22000,
    incluye: ["guia", "4x4", "binoculares"],
    noIncluye: ["comidas", "entrada_reserva"],
    cupoMaximo: 12,
    cupoDisponible: 12,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Rafting Río Mendoza",
    descripcion:
      "Rafting nivel III-IV en el Río Mendoza con guías profesionales",
    destino: "Mendoza",
    tipo: "deportiva",
    duracion: 4,
    precio: 18000,
    incluye: ["guia", "equipo", "transporte", "refrigerio"],
    noIncluye: ["comidas", "fotos"],
    cupoMaximo: 16,
    cupoDisponible: 16,
    dificultad: "dificil",
    activo: true,
  },
  {
    nombre: "Cabalgata Valle de la Luna",
    descripcion:
      "Cabalgata por el Parque Provincial Ischigualasto (Valle de la Luna)",
    destino: "San Juan",
    tipo: "aventura",
    duracion: 6,
    precio: 25000,
    incluye: ["guia", "caballo", "entrada_parque", "refrigerio"],
    noIncluye: ["almuerzo", "traslado"],
    cupoMaximo: 10,
    cupoDisponible: 10,
    dificultad: "moderado",
    activo: true,
  },
  {
    nombre: "Tour Quebrada de Humahuaca",
    descripcion:
      "Recorrido por la colorida Quebrada de Humahuaca declarada Patrimonio de la Humanidad",
    destino: "Jujuy",
    tipo: "cultural",
    duracion: 10,
    precio: 35000,
    incluye: ["guia", "transporte", "almuerzo"],
    noIncluye: ["entradas_museos"],
    cupoMaximo: 25,
    cupoDisponible: 25,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Avistaje de Ballenas",
    descripcion:
      "Salida en embarcación para avistar ballenas francas australes en Puerto Pirámides",
    destino: "Puerto Madryn",
    tipo: "naturaleza",
    duracion: 4,
    precio: 38000,
    incluye: ["guia", "navegacion", "refrigerio"],
    noIncluye: ["traslado", "puerto_tax"],
    cupoMaximo: 35,
    cupoDisponible: 35,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Tren a las Nubes",
    descripcion: "Viaje en el famoso Tren a las Nubes hasta la Puna salteña",
    destino: "Salta",
    tipo: "cultural",
    duracion: 14,
    precio: 55000,
    incluye: ["guia", "tren", "desayuno", "almuerzo"],
    noIncluye: ["bebidas_extras"],
    cupoMaximo: 50,
    cupoDisponible: 50,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Parapente en Bariloche",
    descripcion: "Vuelo en parapente biplaza sobre el lago Nahuel Huapi",
    destino: "San Carlos de Bariloche",
    tipo: "deportiva",
    duracion: 2,
    precio: 42000,
    incluye: ["instructor", "equipo", "seguro", "fotos"],
    noIncluye: ["traslado"],
    cupoMaximo: 8,
    cupoDisponible: 8,
    dificultad: "moderado",
    activo: true,
  },
  {
    nombre: "Circuito Chico Bariloche",
    descripcion:
      "Recorrido panorámico por el Circuito Chico con paradas en miradores",
    destino: "San Carlos de Bariloche",
    tipo: "naturaleza",
    duracion: 5,
    precio: 15000,
    incluye: ["guia", "transporte"],
    noIncluye: ["comidas", "entradas_opcionales"],
    cupoMaximo: 30,
    cupoDisponible: 30,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Cataratas lado Argentino",
    descripcion:
      "Recorrido completo por los circuitos inferior, superior y Garganta del Diablo",
    destino: "Puerto Iguazú",
    tipo: "naturaleza",
    duracion: 6,
    precio: 12000,
    incluye: ["guia", "transporte", "entrada_parque"],
    noIncluye: ["tren_selva", "comidas"],
    cupoMaximo: 40,
    cupoDisponible: 40,
    dificultad: "facil",
    activo: true,
  },
  {
    nombre: "Gran Aventura Iguazú",
    descripcion: "Navegación extrema hasta la base de las Cataratas del Iguazú",
    destino: "Puerto Iguazú",
    tipo: "aventura",
    duracion: 3,
    precio: 28000,
    incluye: ["guia", "navegacion", "equipo_impermeable"],
    noIncluye: ["entrada_parque", "comidas"],
    cupoMaximo: 20,
    cupoDisponible: 20,
    dificultad: "moderado",
    activo: true,
  },
  {
    nombre: "Cena Show en Estancia",
    descripcion:
      "Experiencia gaucha con cena tradicional y show folclórico en estancia",
    destino: "Buenos Aires",
    tipo: "gastronomica",
    duracion: 5,
    precio: 32000,
    incluye: ["transporte", "cena", "show", "bebidas"],
    noIncluye: ["propinas"],
    cupoMaximo: 45,
    cupoDisponible: 45,
    dificultad: "facil",
    activo: true,
  },
];

export const seedExcursiones = async () => {
  try {
    const count = await Excursion.count();
    if (count > 0) {
      console.log(
        "⏭️  Excursiones ya existen en la base de datos. Saltando...",
      );
      return;
    }

    const excursionesWithPublisher = excursionesData.map((excursion) => ({
      ...excursion,
      published_by_user_id: 1,
    }));

    await Excursion.bulkCreate(excursionesWithPublisher);
    console.log("✅ Excursiones creadas exitosamente");
  } catch (error) {
    console.error("❌ Error al crear excursiones:", error.message);
    throw error;
  }
};
