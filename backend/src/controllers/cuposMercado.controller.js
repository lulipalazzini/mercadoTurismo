const CupoMercado = require("../models/CupoMercado.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");
const { isAdmin } = require("../middleware/publisherSecurity");

// Obtener cupos del marketplace
// Visible para: agencias, proveedores y ADMIN
const getCuposMercado = async (req, res) => {
  try {
    console.log("\n💰 [CUPOS MERCADO] Obteniendo cupos del marketplace...");
    console.log(`   Usuario ID: ${req.user.id}`);
    console.log(`   Role: ${req.user.role}`);

    // ADMIN puede ver todo sin restricciones
    const isAdmin = req.user.role === "admin" || req.user.role === "sysadmin";

    console.log(`   Es Admin: ${isAdmin}`);

    // Construir query
    const whereClause = {};
    
    // Solo filtrar por estado si no es admin
    if (!isAdmin) {
      whereClause.estado = "disponible";
      whereClause.cantidad = { [Op.gt]: 0 };
    }

    console.log("   Consultando base de datos...");
    const cupos = await CupoMercado.findAll({
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: [
            "id",
            "nombre",
            "email",
            "telefono",
            "razonSocial",
            "role",
          ],
        },
      ],
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });
    console.log(`   Cupos encontrados: ${cupos.length}`);

    // Actualizar estados según fecha de vencimiento
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const cupo of cupos) {
      const vencimiento = new Date(cupo.fechaVencimiento);
      if (vencimiento < hoy && cupo.estado === "disponible") {
        console.log(`   Actualizando cupo ${cupo.id} a vencido`);
        await cupo.update({ estado: "vencido" });
      }
    }

    console.log("✅ [CUPOS MERCADO] Cupos obtenidos exitosamente");
    res.json(cupos);
  } catch (error) {
    console.error("❌ [CUPOS MERCADO] Error en getCuposMercado:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res
      .status(500)
      .json({ message: "Error al obtener cupos", error: error.message });
  }
};

// Obtener mis cupos publicados (operadores, agencias y ADMIN)
const getMisCupos = async (req, res) => {
  try {
    console.log("\n📋 [CUPOS MERCADO] Obteniendo mis cupos...");
    console.log(`   Usuario ID: ${req.user.id}`);
    console.log(`   Role: ${req.user.role}`);

    // ADMIN ve TODOS los cupos
    const isAdminUser = isAdmin(req.user);
    
    const whereClause = isAdminUser 
      ? {} // Admin: sin filtro
      : { published_by_user_id: req.user.id }; // Otros: solo propios

    const cupos = await CupoMercado.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "telefono", "razonSocial"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(`   Cupos encontrados: ${cupos.length} ${isAdminUser ? "(TODOS - Admin)" : "(propios)"}`);
    console.log("✅ [CUPOS MERCADO] Mis cupos obtenidos exitosamente");
    res.json(cupos);
  } catch (error) {
    console.error("❌ [CUPOS MERCADO] Error en getMisCupos:");
    console.error("   Mensaje:", error.message);
    console.error("   Stack:", error.stack);
    res
      .status(500)
      .json({ message: "Error al obtener cupos", error: error.message });
  }
};

const getCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "telefono", "razonSocial"],
        },
      ],
    });

    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }

    // Mercado de Cupos: TODOS pueden ver todos los cupos (no hay verificación de ownership en GET)

    res.json(cupo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupo", error: error.message });
  }
};

const createCupoMercado = async (req, res) => {
  try {
    console.log("\n➕ [CUPOS MERCADO] Creando nuevo cupo...");
    console.log(`   Usuario ID: ${req.user.id}, Role: ${req.user.role}`);

    // Validaciones obligatorias
    const {
      descripcion,
      cantidad,
      precioMayorista,
      precioMinorista,
      fechaVencimiento,
      fechaOrigen,
      aerolinea,
    } = req.body;

    // Validar campos obligatorios
    if (!descripcion || !cantidad || !precioMayorista || !precioMinorista || !fechaVencimiento) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios",
        detalle: "Descripción, cantidad, precios y fecha de vencimiento son requeridos",
      });
    }

    // Validar campos nuevos obligatorios
    if (!fechaOrigen) {
      return res.status(400).json({
        success: false,
        error: "Campo obligatorio faltante",
        detalle: "La fecha de origen es obligatoria",
      });
    }

    if (!aerolinea || !aerolinea.trim()) {
      return res.status(400).json({
        success: false,
        error: "Campo obligatorio faltante",
        detalle: "La aerolínea es obligatoria",
      });
    }

    // Validar tipos de datos
    if (isNaN(cantidad) || parseInt(cantidad) < 0) {
      return res.status(400).json({
        success: false,
        error: "Tipo de dato inválido",
        detalle: "La cantidad debe ser un número positivo",
      });
    }

    if (isNaN(precioMayorista) || parseFloat(precioMayorista) < 0) {
      return res.status(400).json({
        success: false,
        error: "Tipo de dato inválido",
        detalle: "El precio mayorista debe ser un número positivo",
      });
    }

    if (isNaN(precioMinorista) || parseFloat(precioMinorista) < 0) {
      return res.status(400).json({
        success: false,
        error: "Tipo de dato inválido",
        detalle: "El precio minorista debe ser un número positivo",
      });
    }

    // Validar que el usuario tenga teléfono (excepto admin)
    if (req.user.role !== "admin" && req.user.role !== "sysadmin") {
      const user = await User.findByPk(req.user.id);
      if (!user.telefono) {
        return res.status(400).json({
          success: false,
          error: "Perfil incompleto",
          detalle: "Debes agregar un número de teléfono a tu perfil para publicar cupos",
        });
      }
    }

    const cupo = await CupoMercado.create({
      ...req.body,
      tipoProducto: "aereo", // Siempre aereo
      published_by_user_id: req.user.id,
    });

    console.log(`✅ Cupo creado: ID ${cupo.id}`);
    res.status(201).json({ message: "Cupo publicado exitosamente", cupo });
  } catch (error) {
    console.error("❌ Error al crear cupo:", error);
    
    // Errores de validación de Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        detalle: error.errors.map(e => e.message).join(", "),
      });
    }

    res
      .status(500)
      .json({ message: "Error al crear cupo", error: error.message });
  }
};

const updateCupoMercado = async (req, res) => {
  try {
    console.log(`\n✏️ [CUPOS MERCADO] Actualizando cupo ID: ${req.params.id}`);
    console.log(`   Usuario ID: ${req.user.id}, Role: ${req.user.role}`);

    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ 
        success: false,
        error: "Cupo no encontrado" 
      });
    }

    // ADMIN puede editar cualquier cupo
    const isAdminUser = isAdmin(req.user);

    // Solo el vendedor o ADMIN pueden actualizar el cupo
    if (!isAdminUser && cupo.published_by_user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Permiso denegado",
        detalle: "Solo puedes actualizar tus propios cupos",
      });
    }

    // Validar campos obligatorios si se están actualizando
    if (req.body.fechaOrigen !== undefined && !req.body.fechaOrigen) {
      return res.status(400).json({
        success: false,
        error: "Campo obligatorio faltante",
        detalle: "La fecha de origen no puede estar vacía",
      });
    }

    if (req.body.aerolinea !== undefined && (!req.body.aerolinea || !req.body.aerolinea.trim())) {
      return res.status(400).json({
        success: false,
        error: "Campo obligatorio faltante",
        detalle: "La aerolínea no puede estar vacía",
      });
    }

    // No permitir cambiar el publisher (excepto admin)
    if (!isAdminUser) {
      delete req.body.published_by_user_id;
      delete req.body.usuarioVendedorId;
    }
    delete req.body.usuarioCompradorId;

    await cupo.update(req.body);
    console.log(`✅ Cupo actualizado: ID ${cupo.id}`);
    res.json({ message: "Cupo actualizado exitosamente", cupo });
  } catch (error) {
    console.error("❌ Error al actualizar cupo:", error);
    
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        detalle: error.errors.map(e => e.message).join(", "),
      });
    }

    res
      .status(500)
      .json({ message: "Error al actualizar cupo", error: error.message });
  }
};

const deleteCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }

    // Solo el vendedor o ADMIN pueden eliminar el cupo
    if (!isAdmin(req.user) && cupo.published_by_user_id !== req.user.id) {
      return res.status(403).json({
        message: "Solo puedes eliminar tus propios cupos",
      });
    }

    await cupo.destroy();
    res.json({ message: "Cupo eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar cupo", error: error.message });
  }
};

// Importar cupos desde Excel con validaciones estrictas
const importarCupos = async (req, res) => {
  try {
    console.log("\n📥 [CUPOS MERCADO] Importando cupos desde Excel...");
    console.log(`   Usuario ID: ${req.user.id}, Role: ${req.user.role}`);

    const { cupos } = req.body;

    // Validación 1: Array debe existir y no estar vacío
    if (!Array.isArray(cupos) || cupos.length === 0) {
      return res.status(400).json({
        success: false,
        error: "El archivo no cumple con el formato requerido",
        detalle: "El archivo está vacío o no contiene datos válidos",
      });
    }

    console.log(`   Cupos a procesar: ${cupos.length}`);

    // Validación 2: Verificar columnas obligatorias en el primer registro
    const columnasRequeridas = [
      "descripcion",
      "cantidad",
      "precioMayorista",
      "precioMinorista",
      "fechaVencimiento",
      "fechaOrigen",
      "aerolinea",
    ];

    const primeraFila = cupos[0];
    const columnasFaltantes = columnasRequeridas.filter(
      (col) => !(col in primeraFila)
    );

    if (columnasFaltantes.length > 0) {
      return res.status(400).json({
        success: false,
        error: "El archivo no cumple con el formato requerido",
        detalle: `Faltan las siguientes columnas obligatorias: ${columnasFaltantes.join(", ")}`,
      });
    }

    // Validar que el usuario tenga teléfono (excepto admin)
    if (req.user.role !== "admin" && req.user.role !== "sysadmin") {
      const user = await User.findByPk(req.user.id);
      if (!user.telefono) {
        return res.status(400).json({
          success: false,
          error: "Perfil incompleto",
          detalle: "Debes agregar un número de teléfono a tu perfil para publicar cupos",
        });
      }
    }

    const erroresValidacion = [];
    const cuposValidos = [];

    // Validación 3: Validar cada fila antes de insertar
    for (let i = 0; i < cupos.length; i++) {
      const cupoData = cupos[i];
      const fila = i + 2; // +2 porque Excel empieza en 1 y tiene header

      // Validar campos obligatorios
      const camposFaltantes = [];
      if (!cupoData.descripcion || !cupoData.descripcion.trim()) {
        camposFaltantes.push("descripcion");
      }
      if (!cupoData.cantidad && cupoData.cantidad !== 0) {
        camposFaltantes.push("cantidad");
      }
      if (!cupoData.precioMayorista && cupoData.precioMayorista !== 0) {
        camposFaltantes.push("precioMayorista");
      }
      if (!cupoData.precioMinorista && cupoData.precioMinorista !== 0) {
        camposFaltantes.push("precioMinorista");
      }
      if (!cupoData.fechaVencimiento) {
        camposFaltantes.push("fechaVencimiento");
      }
      if (!cupoData.fechaOrigen) {
        camposFaltantes.push("fechaOrigen");
      }
      if (!cupoData.aerolinea || !cupoData.aerolinea.trim()) {
        camposFaltantes.push("aerolinea");
      }

      if (camposFaltantes.length > 0) {
        erroresValidacion.push({
          fila,
          error: `Campos obligatorios faltantes: ${camposFaltantes.join(", ")}`,
        });
        continue;
      }

      // Validar tipos de datos
      const cantidad = parseInt(cupoData.cantidad);
      if (isNaN(cantidad) || cantidad < 0) {
        erroresValidacion.push({
          fila,
          error: "La cantidad debe ser un número entero positivo",
        });
        continue;
      }

      const precioMayorista = parseFloat(cupoData.precioMayorista);
      if (isNaN(precioMayorista) || precioMayorista < 0) {
        erroresValidacion.push({
          fila,
          error: "El precio mayorista debe ser un número positivo",
        });
        continue;
      }

      const precioMinorista = parseFloat(cupoData.precioMinorista);
      if (isNaN(precioMinorista) || precioMinorista < 0) {
        erroresValidacion.push({
          fila,
          error: "El precio minorista debe ser un número positivo",
        });
        continue;
      }

      // Validar formato de fechas
      const fechaVencimiento = new Date(cupoData.fechaVencimiento);
      if (isNaN(fechaVencimiento.getTime())) {
        erroresValidacion.push({
          fila,
          error: "La fecha de vencimiento no tiene un formato válido (esperado: YYYY-MM-DD)",
        });
        continue;
      }

      const fechaOrigen = new Date(cupoData.fechaOrigen);
      if (isNaN(fechaOrigen.getTime())) {
        erroresValidacion.push({
          fila,
          error: "La fecha de origen no tiene un formato válido (esperado: YYYY-MM-DD)",
        });
        continue;
      }

      // Si llegó aquí, el cupo es válido
      cuposValidos.push({
        tipoProducto: "aereo",
        descripcion: cupoData.descripcion.trim(),
        cantidad,
        precioMayorista,
        precioMinorista,
        fechaVencimiento: cupoData.fechaVencimiento,
        fechaOrigen: cupoData.fechaOrigen,
        aerolinea: cupoData.aerolinea.trim(),
        observaciones: cupoData.observaciones || null,
        estado: "disponible",
        published_by_user_id: req.user.id,
      });
    }

    // Validación 4: Si hay errores, NO insertar nada (transacción bloqueante)
    if (erroresValidacion.length > 0) {
      console.log(`❌ Importación fallida: ${erroresValidacion.length} errores de validación`);
      return res.status(400).json({
        success: false,
        error: "El archivo contiene errores de validación",
        detalle: `Se encontraron ${erroresValidacion.length} filas con errores. No se importó ningún cupo.`,
        errores: erroresValidacion.slice(0, 10), // Mostrar máximo 10 errores
        totalErrores: erroresValidacion.length,
      });
    }

    // Validación 5: Si no hay cupos válidos, error
    if (cuposValidos.length === 0) {
      return res.status(400).json({
        success: false,
        error: "El archivo no contiene cupos válidos",
        detalle: "Todas las filas fueron rechazadas por errores de validación",
      });
    }

    // Inserción en bloque (todo o nada)
    console.log(`   Insertando ${cuposValidos.length} cupos válidos...`);
    const cuposCreados = await CupoMercado.bulkCreate(cuposValidos);

    console.log(`✅ Importación exitosa: ${cuposCreados.length} cupos creados`);
    res.status(201).json({
      success: true,
      message: `Importación completada exitosamente`,
      importados: cuposCreados.length,
      cupos: cuposCreados,
    });
  } catch (error) {
    console.error("❌ Error al importar cupos:", error);
    res.status(500).json({
      success: false,
      error: "Error al importar cupos",
      detalle: error.message,
    });
  }
};

module.exports = {
  getCuposMercado,
  getMisCupos,
  getCupoMercado,
  createCupoMercado,
  updateCupoMercado,
  deleteCupoMercado,
  importarCupos,
};
