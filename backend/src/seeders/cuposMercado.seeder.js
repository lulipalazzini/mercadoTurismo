import CupoMercado from "../models/CupoMercado.model.js";

const cuposMercadoData = [
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Miami - Buenos Aires, Salida 15/03/2026",
    cantidad: 8,
    precioMayorista: 850.0,
    precioMinorista: 1150.0,
    fechaVencimiento: "2026-03-10",
    observaciones:
      "Aerolínea de bandera. 1 valija de 23kg incluida. Equipaje de mano incluido.",
    estado: "disponible",
    usuarioVendedorId: 2,
  },
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Madrid - Buenos Aires, Salida 20/04/2026",
    cantidad: 12,
    precioMayorista: 1200.0,
    precioMinorista: 1650.0,
    fechaVencimiento: "2026-04-15",
    observaciones: "Vuelo directo. Clase económica premium. Comidas incluidas.",
    estado: "disponible",
    usuarioVendedorId: 3,
  },
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Cancún - Buenos Aires, Salida 10/05/2026",
    cantidad: 15,
    precioMayorista: 750.0,
    precioMinorista: 1050.0,
    fechaVencimiento: "2026-05-05",
    observaciones:
      "Temporada media. 2 valijas de 23kg incluidas. Asientos asignables.",
    estado: "disponible",
    usuarioVendedorId: 2,
  },
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Roma - Buenos Aires, Salida 15/06/2026",
    cantidad: 10,
    precioMayorista: 1350.0,
    precioMinorista: 1850.0,
    fechaVencimiento: "2026-06-10",
    observaciones:
      "Temporada alta. Escalas programadas. Flexible para cambios.",
    estado: "disponible",
    usuarioVendedorId: 4,
  },
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Nueva York - Buenos Aires, Salida 01/07/2026",
    cantidad: 20,
    precioMayorista: 980.0,
    precioMinorista: 1380.0,
    fechaVencimiento: "2026-06-25",
    observaciones:
      "Vuelos nocturnos. Entretenimiento a bordo. WiFi disponible.",
    estado: "disponible",
    usuarioVendedorId: 2,
  },
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Punta Cana - Buenos Aires, Salida 10/08/2026",
    cantidad: 18,
    precioMayorista: 820.0,
    precioMinorista: 1180.0,
    fechaVencimiento: "2026-08-05",
    observaciones:
      "Caribe todo el año. Vuelo charter. Salida garantizada grupo mínimo.",
    estado: "disponible",
    usuarioVendedorId: 3,
  },
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Barcelona - Buenos Aires, Salida 15/09/2026",
    cantidad: 14,
    precioMayorista: 1280.0,
    precioMinorista: 1750.0,
    fechaVencimiento: "2026-09-10",
    observaciones:
      "Temporada baja Europa. Conexión en São Paulo. Upgrade disponible.",
    estado: "disponible",
    usuarioVendedorId: 4,
  },
  {
    tipoProducto: "aereo",
    descripcion: "Buenos Aires - Los Ángeles - Buenos Aires, Salida 20/10/2026",
    cantidad: 16,
    precioMayorista: 1100.0,
    precioMinorista: 1500.0,
    fechaVencimiento: "2026-10-15",
    observaciones:
      "Costa oeste USA. Escala técnica Lima. Tarifa no reembolsable.",
    estado: "disponible",
    usuarioVendedorId: 2,
  },
];

export const seedCuposMercado = async () => {
  try {
    const count = await CupoMercado.count();
    if (count > 0) {
      console.log(
        "⏭️  Cupos de mercado ya existen en la base de datos. Saltando...",
      );
      return;
    }

    await CupoMercado.bulkCreate(cuposMercadoData);
    console.log("✅ Cupos de mercado creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear cupos de mercado:", error.message);
    throw error;
  }
};
