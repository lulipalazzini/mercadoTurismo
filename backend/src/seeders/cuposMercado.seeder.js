import CupoMercado from "../models/CupoMercado.model.js";

const cuposMercadoData = [
  {
    tipoProducto: "Paquete Todo Incluido",
    descripcion: "Paquete 7 días Riviera Maya - Hotel 5 estrellas con todo incluido",
    cantidad: 10,
    precioMayorista: 1200.00,
    precioMinorista: 1800.00,
    fechaVencimiento: "2026-03-15",
    observaciones: "Salida garantizada. Incluye vuelos, traslados y excursiones.",
    estado: "disponible",
    usuarioVendedorId: 2, // Agencia
  },
  {
    tipoProducto: "Alojamiento",
    descripcion: "5 noches Hotel Boutique en Bariloche - Temporada alta",
    cantidad: 15,
    precioMayorista: 450.00,
    precioMinorista: 650.00,
    fechaVencimiento: "2026-02-28",
    observaciones: "Desayuno incluido. Vista al lago.",
    estado: "disponible",
    usuarioVendedorId: 2,
  },
  {
    tipoProducto: "Excursión",
    descripcion: "Tour Glaciar Perito Moreno con navegación",
    cantidad: 20,
    precioMayorista: 180.00,
    precioMinorista: 250.00,
    fechaVencimiento: "2026-04-30",
    observaciones: "Incluye almuerzo y guía bilingüe.",
    estado: "disponible",
    usuarioVendedorId: 3, // Operador
  },
  {
    tipoProducto: "Pasaje Aéreo",
    descripcion: "Buenos Aires - Miami - Buenos Aires",
    cantidad: 8,
    precioMayorista: 850.00,
    precioMinorista: 1150.00,
    fechaVencimiento: "2026-03-01",
    observaciones: "Aerolínea de bandera. 1 valija de 23kg incluida.",
    estado: "disponible",
    usuarioVendedorId: 2,
  },
  {
    tipoProducto: "Circuito",
    descripcion: "Europa Clásica 15 días - 7 países",
    cantidad: 5,
    precioMayorista: 3200.00,
    precioMinorista: 4500.00,
    fechaVencimiento: "2026-05-20",
    observaciones: "Incluye hoteles 4*, desayunos, guía español. No incluye vuelos.",
    estado: "disponible",
    usuarioVendedorId: 4, // Operador independiente
  },
  {
    tipoProducto: "Crucero",
    descripcion: "Crucero Mediterráneo 10 noches - All Inclusive",
    cantidad: 12,
    precioMayorista: 2800.00,
    precioMinorista: 3900.00,
    fechaVencimiento: "2026-06-15",
    observaciones: "Cabina balcón. Bebidas incluidas. Propinas incluidas.",
    estado: "disponible",
    usuarioVendedorId: 2,
  },
  {
    tipoProducto: "Transfer",
    descripcion: "Traslado privado Aeropuerto-Hotel Punta Cana",
    cantidad: 30,
    precioMayorista: 45.00,
    precioMinorista: 75.00,
    fechaVencimiento: "2026-12-31",
    observaciones: "Servicio 24hs. Vehículos climatizados.",
    estado: "disponible",
    usuarioVendedorId: 3,
  },
  {
    tipoProducto: "Salida Grupal",
    descripcion: "Nueva York Express - 5 días con tour completo",
    cantidad: 8,
    precioMayorista: 1450.00,
    precioMinorista: 2100.00,
    fechaVencimiento: "2026-04-10",
    observaciones: "Grupo máximo 15 personas. Coordinador argentino. Hotel Manhattan.",
    estado: "disponible",
    usuarioVendedorId: 4,
  },
];

export const seedCuposMercado = async () => {
  try {
    const count = await CupoMercado.count();
    if (count > 0) {
      console.log("⏭️  Cupos de mercado ya existen en la base de datos. Saltando...");
      return;
    }

    await CupoMercado.bulkCreate(cuposMercadoData);
    console.log("✅ Cupos de mercado creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear cupos de mercado:", error.message);
    throw error;
  }
};
