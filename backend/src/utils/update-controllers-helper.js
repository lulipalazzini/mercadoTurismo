/**
 * Script para actualizar funciones create/update en controllers
 * Agrega soporte para procesamiento de imágenes con multer
 */

const fs = require("fs");
const path = require("path");

// Configuración de controllers a actualizar
const controllers = [
  {
    file: "alojamientos.controller.js",
    createFunc: "createAlojamiento",
    updateFunc: "updateAlojamiento",
    model: "Alojamiento",
    entityName: "alojamiento",
  },
  {
    file: "excursiones.controller.js",
    createFunc: "createExcursion",
    updateFunc: "updateExcursion",
    model: "Excursion",
    entityName: "excursión",
  },
  {
    file: "autos.controller.js",
    createFunc: "createAuto",
    updateFunc: "updateAuto",
    model: "Auto",
    entityName: "auto",
  },
  {
    file: "circuitos.controller.js",
    createFunc: "createCircuito",
    updateFunc: "updateCircuito",
    model: "Circuito",
    entityName: "circuito",
  },
  {
    file: "salidasGrupales.controller.js",
    createFunc: "createSalidaGrupal",
    updateFunc: "updateSalidaGrupal",
    model: "SalidaGrupal",
    entityName: "salida grupal",
  },
  {
    file: "transfers.controller.js",
    createFunc: "createTransfer",
    updateFunc: "updateTransfer",
    model: "Transfer",
    entityName: "transfer",
  },
  {
    file: "seguros.controller.js",
    createFunc: "createSeguro",
    updateFunc: "updateSeguro",
    model: "Seguro",
    entityName: "seguro",
  },
  {
    file: "paquetes.controller.js",
    createFunc: "createPaquete",
    updateFunc: "updatePaquete",
    model: "Paquete",
    entityName: "paquete",
  },
];

// Template para función create con soporte de imágenes
const createFunctionTemplate = (modelVar, entityName) => `const create${modelVar} = async (req, res) => {
  try {
    const ${modelVar.toLowerCase()}Data = { ...req.body };
    
    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      ${modelVar.toLowerCase()}Data.imagenes = req.files.map((file) => \`/uploads/\${file.filename}\`);
    } else if (req.body.imagenes) {
      // Si vienen imágenes como JSON string, parsear
      ${modelVar.toLowerCase()}Data.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    const ${modelVar.toLowerCase()} = await ${modelVar}.create(${modelVar.toLowerCase()}Data);
    res.status(201).json({ message: "${modelVar} creado exitosamente", ${modelVar.toLowerCase()} });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => \`/uploads/\${f.filename}\`));
    }
    res
      .status(500)
      .json({ message: "Error al crear ${entityName}", error: error.message });
  }
};`;

// Template para función update con soporte de imágenes
const updateFunctionTemplate = (modelVar, entityName) => `const update${modelVar} = async (req, res) => {
  try {
    const ${modelVar.toLowerCase()} = await ${modelVar}.findByPk(req.params.id);
    if (!${modelVar.toLowerCase()}) {
      return res.status(404).json({ message: "${modelVar} no encontrado" });
    }

    const updateData = { ...req.body };

    // Si hay nuevas imágenes subidas
    if (req.files && req.files.length > 0) {
      // Eliminar imágenes antiguas del filesystem
      if (${modelVar.toLowerCase()}.imagenes && ${modelVar.toLowerCase()}.imagenes.length > 0) {
        deleteOldImages(${modelVar.toLowerCase()}.imagenes);
      }
      // Agregar nuevas imágenes
      updateData.imagenes = req.files.map((file) => \`/uploads/\${file.filename}\`);
    } else if (req.body.imagenes) {
      // Si vienen imágenes como JSON string, parsear
      updateData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    await ${modelVar.toLowerCase()}.update(updateData);
    res.json({ message: "${modelVar} actualizado exitosamente", ${modelVar.toLowerCase()} });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => \`/uploads/\${f.filename}\`));
    }
    res
      .status(500)
      .json({ message: "Error al actualizar ${entityName}", error: error.message });
  }
};`;

console.log("🔧 Script de actualización de controllers");
console.log("=========================================\n");

console.log("📝 Controllers a actualizar:");
controllers.forEach((ctrl) => {
  console.log(`  - ${ctrl.file}`);
  console.log(`    ✓ ${ctrl.createFunc}`);
  console.log(`    ✓ ${ctrl.updateFunc}`);
});

console.log("\n✅ Los templates están listos.");
console.log("⚠️  Aplica manualmente los cambios usando replace_string_in_file");
console.log("    para cada función create/update en los controllers listados.\n");

// Exportar templates para uso manual
module.exports = {
  controllers,
  createFunctionTemplate,
  updateFunctionTemplate,
};
