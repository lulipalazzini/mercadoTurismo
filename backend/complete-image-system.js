#!/usr/bin/env node

/**
 * Script Automatizado: Completar Sistema de Imágenes
 * Actualiza todos los controllers y routes pendientes
 */

const fs = require("fs");
const path = require("path");

// Configuración de controllers pendientes
const pendingControllers = [
  {
    file: "autos.controller.js",
    model: "Auto",
    var: "auto",
    display: "auto",
    createFunc: "createAuto",
    updateFunc: "updateAuto",
  },
  {
    file: "excursiones.controller.js",
    model: "Excursion",
    var: "excursion",
    display: "excursión",
    createFunc: "createExcursion",
    updateFunc: "updateExcursion",
  },
  {
    file: "circuitos.controller.js",
    model: "Circuito",
    var: "circuito",
    display: "circuito",
    createFunc: "createCircuito",
    updateFunc: "updateCircuito",
  },
  {
    file: "salidasGrupales.controller.js",
    model: "SalidaGrupal",
    var: "salidaGrupal",
    display: "salida grupal",
    createFunc: "createSalidaGrupal",
    updateFunc: "updateSalidaGrupal",
  },
  {
    file: "transfers.controller.js",
    model: "Transfer",
    var: "transfer",
    display: "transfer",
    createFunc: "createTransfer",
    updateFunc: "updateTransfer",
  },
  {
    file: "seguros.controller.js",
    model: "Seguro",
    var: "seguro",
    display: "seguro",
    createFunc: "createSeguro",
    updateFunc: "updateSeguro",
  },
  {
    file: "paquetes.controller.js",
    model: "Paquete",
    var: "paquete",
    display: "paquete",
    createFunc: "createPaquete",
    updateFunc: "updatePaquete",
  },
];

// Template para create function
const getCreateTemplate = (model, varName, display) => `const create${model} = async (req, res) => {
  try {
    const ${varName}Data = { ...req.body };
    
    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      ${varName}Data.imagenes = req.files.map((file) => \`/uploads/\${file.filename}\`);
    } else if (req.body.imagenes) {
      // Si vienen imágenes como JSON string, parsear
      ${varName}Data.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    const ${varName} = await ${model}.create(${varName}Data);
    res.status(201).json({ message: "${display} creado exitosamente", ${varName} });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => \`/uploads/\${f.filename}\`));
    }
    res
      .status(500)
      .json({ message: "Error al crear ${display}", error: error.message });
  }
};`;

// Template para update function
const getUpdateTemplate = (model, varName, display) => `const update${model} = async (req, res) => {
  try {
    const ${varName} = await ${model}.findByPk(req.params.id);
    if (!${varName}) {
      return res.status(404).json({ message: "${display} no encontrado" });
    }

    const updateData = { ...req.body };

    // Si hay nuevas imágenes subidas
    if (req.files && req.files.length > 0) {
      // Eliminar imágenes antiguas del filesystem
      if (${varName}.imagenes && ${varName}.imagenes.length > 0) {
        deleteOldImages(${varName}.imagenes);
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

    await ${varName}.update(updateData);
    res.json({ message: "${display} actualizado exitosamente", ${varName} });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => \`/uploads/\${f.filename}\`));
    }
    res
      .status(500)
      .json({ message: "Error al actualizar ${display}", error: error.message });
  }
};`;

console.log("\n🚀 SCRIPT DE COMPLETADO AUTOMÁTICO");
console.log("=" .repeat(70));
console.log("\nEste script generará el código necesario para completar el sistema.");
console.log("Los cambios deben aplicarse MANUALMENTE usando replace_string_in_file.\n");

console.log("📋 CONTROLLERS PENDIENTES:\n");

pendingControllers.forEach((ctrl, index) => {
  console.log(`\n${index + 1}. ${ctrl.file}`);
  console.log("   " + "-".repeat(60));
  console.log(`   Modelo: ${ctrl.model} (${ctrl.display})`);
  console.log(`\n   CREATE FUNCTION:`);
  console.log("   " + "-".repeat(60));
  console.log(getCreateTemplate(ctrl.model, ctrl.var, ctrl.display));
  console.log(`\n   UPDATE FUNCTION:`);
  console.log("   " + "-".repeat(60));
  console.log(getUpdateTemplate(ctrl.model, ctrl.var, ctrl.display));
  console.log("\n");
});

console.log("\n📝 ROUTES PENDIENTES:\n");
console.log("Agregar en CADA archivo de routes:\n");

const routeTemplate = `// Agregar al inicio (después de auth.middleware)
const { upload, handleMulterError } = require("../middleware/upload.middleware");

// Actualizar las rutas:
router.post("/", verifyToken, upload.array("imagenes", 6), handleMulterError, createFUNCTION);
router.put("/:id", verifyToken, upload.array("imagenes", 6), handleMulterError, updateFUNCTION);`;

console.log(routeTemplate);

console.log("\n\nArchivos de routes a actualizar:");
pendingControllers.forEach((ctrl) => {
  console.log(`  - ${ctrl.file.replace("controller", "routes")}`);
});

console.log("\n\n" + "=".repeat(70));
console.log("✅ GENERACIÓN COMPLETADA");
console.log("=".repeat(70));
console.log("\n💡 SIGUIENTE PASO:");
console.log("   Usa replace_string_in_file para aplicar cada cambio en los controllers");
console.log("   y actualiza las routes según el template mostrado.\n");
