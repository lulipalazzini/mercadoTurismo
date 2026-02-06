const fs = require("fs");
const path = require("path");

// Template reutilizable para create function
function getCreateFunction(modelName, varName, entityDisplayName) {
  return `const create${modelName} = async (req, res) => {
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

    const ${varName} = await ${modelName}.create(${varName}Data);
    res.status(201).json({ message: "${entityDisplayName} creado exitosamente", ${varName} });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => \`/uploads/\${f.filename}\`));
    }
    res
      .status(500)
      .json({ message: "Error al crear ${entityDisplayName}", error: error.message });
  }
};`;
}

// Template reutilizable para update function
function getUpdateFunction(modelName, varName, entityDisplayName) {
  return `const update${modelName} = async (req, res) => {
  try {
    const ${varName} = await ${modelName}.findByPk(req.params.id);
    if (!${varName}) {
      return res.status(404).json({ message: "${entityDisplayName} no encontrado" });
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
    res.json({ message: "${entityDisplayName} actualizado exitosamente", ${varName} });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => \`/uploads/\${f.filename}\`));
    }
    res
      .status(500)
      .json({ message: "Error al actualizar ${entityDisplayName}", error: error.message });
  }
};`;
}

// Controllers pendientes de actualizar (ya actualizamos cruceros y alojamientos)
const pendingControllers = [
  {
    file: "excursiones.controller.js",
    model: "Excursion",
    var: "excursion",
    display: "excursión",
  },
  { file: "autos.controller.js", model: "Auto", var: "auto", display: "auto" },
  {
    file: "circuitos.controller.js",
    model: "Circuito",
    var: "circuito",
    display: "circuito",
  },
  {
    file: "salidasGrupales.controller.js",
    model: "SalidaGrupal",
    var: "salidaGrupal",
    display: "salida grupal",
  },
  {
    file: "transfers.controller.js",
    model: "Transfer",
    var: "transfer",
    display: "transfer",
  },
  {
    file: "seguros.controller.js",
    model: "Seguro",
    var: "seguro",
    display: "seguro",
  },
  {
    file: "paquetes.controller.js",
    model: "Paquete",
    var: "paquete",
    display: "paquete",
  },
];

console.log("🔧 ACTUALIZADOR DE CONTROLLERS - Sistema de Imágenes");
console.log("=".repeat(60));
console.log("\n📋 Controllers pendientes:\n");

pendingControllers.forEach((ctrl, index) => {
  console.log(`${index + 1}. ${ctrl.file}`);
  console.log(
    `   Modelo: ${ctrl.model} | Var: ${ctrl.var} | Display: ${ctrl.display}`,
  );
  console.log(`   Funciones: create${ctrl.model}(), update${ctrl.model}()\n`);
});

console.log("\n💡 TEMPLATES GENERADOS:\n");
console.log("=".repeat(60));

// Generar y mostrar ejemplos
const exampleCtrl = pendingControllers[0];
console.log(`\n📝 Ejemplo para ${exampleCtrl.file}:\n`);
console.log("CREATE FUNCTION:");
console.log(
  getCreateFunction(exampleCtrl.model, exampleCtrl.var, exampleCtrl.display),
);
console.log("\nUPDATE FUNCTION:");
console.log(
  getUpdateFunction(exampleCtrl.model, exampleCtrl.var, exampleCtrl.display),
);

console.log("\n" + "=".repeat(60));
console.log("✅ Templates listos para aplicar manualmente\n");
