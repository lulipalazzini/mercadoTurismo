const CupoMercado = require("../models/CupoMercado.model");
const User = require("../models/User.model");
const { Op } = require("sequelize");

// Obtener cupos del marketplace
// ⚠️ EXCEPCIÓN: Todos los usuarios B2B pueden ver TODOS los cupos (sin filtro de ownership)
const getCuposMercado = async (req, res) => {
  try {
    console.log("\n💰 [CUPOS MERCADO] Obteniendo cupos del marketplace...");
    console.log(`   Usuario ID: ${req.user.id}`);
    console.log(`   Role: ${req.user.role}`);
    console.log(`   Calculated Role: ${req.user.calculatedRole}`);

    // Verificar que el usuario sea B2B
    if (req.user.userType !== "B2B") {
      console.log("❌ [CUPOS MERCADO] Acceso denegado - No es usuario B2B");
      return res.status(403).json({
        message: "Solo los usuarios B2B pueden ver el marketplace de cupos",
      });
    }

    // ⚠️ EXCEPCIÓN: NO FILTRAR POR OWNERSHIP
    // Tanto agencias como operadores/proveedores ven TODOS los cupos
    console.log("   ⚠️ MODO GLOBAL: Mostrando TODOS los cupos (sin filtro de ownership)");
    
    // Obtener cupos de todos los usuarios B2B, con información del vendedor
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
            "calculatedRole",
            "businessModel",
          ],
          where: {
            userType: "B2B", // Solo cupos de usuarios B2B
          },
        },
      ],
      where: {
        estado: "disponible",
        cantidad: { [Op.gt]: 0 },
      },
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

// Obtener mis cupos publicados (operadores y agencias)
const getMisCupos = async (req, res) => {
  try {
    console.log("\n📋 [CUPOS MERCADO] Obteniendo mis cupos...");
    console.log(`   Usuario ID: ${req.user.id}`);

    const cupos = await CupoMercado.findAll({
      where: {
        usuarioVendedorId: req.user.id,
      },
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "telefono"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(`   Cupos encontrados: ${cupos.length}`);
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

    // Verificar permisos: solo el vendedor o agencias pueden ver detalles
    if (
      req.user.role === "operador" &&
      cupo.usuarioVendedorId !== req.user.id
    ) {
      return res.status(403).json({
        message: "No tienes permiso para ver este cupo",
      });
    }

    res.json(cupo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupo", error: error.message });
  }
};

const createCupoMercado = async (req, res) => {
  try {
    // Validar que el usuario tenga teléfono
    const user = await User.findByPk(req.user.id);
    if (!user.telefono) {
      return res.status(400).json({
        message:
          "Debes agregar un número de teléfono a tu perfil para publicar cupos",
      });
    }

    const cupo = await CupoMercado.create({
      ...req.body,
      usuarioVendedorId: req.user.id,
    });

    res.status(201).json({ message: "Cupo publicado exitosamente", cupo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear cupo", error: error.message });
  }
};

const updateCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }

    // Solo el vendedor puede actualizar su cupo
    if (cupo.usuarioVendedorId !== req.user.id) {
      return res.status(403).json({
        message: "Solo puedes actualizar tus propios cupos",
      });
    }

    // No permitir cambiar el vendedor
    delete req.body.usuarioVendedorId;
    delete req.body.usuarioCompradorId;

    await cupo.update(req.body);
    res.json({ message: "Cupo actualizado exitosamente", cupo });
  } catch (error) {
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

    // Solo el vendedor puede eliminar su cupo
    if (
      cupo.usuarioVendedorId !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "sysadmin"
    ) {
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

// Importar cupos desde Excel
const importarCupos = async (req, res) => {
  try {
    const { cupos } = req.body;

    if (!Array.isArray(cupos) || cupos.length === 0) {
      return res.status(400).json({
        message: "Debes proporcionar un array de cupos válido",
      });
    }

    // Validar que el usuario tenga teléfono
    const user = await User.findByPk(req.user.id);
    if (!user.telefono) {
      return res.status(400).json({
        message:
          "Debes agregar un número de teléfono a tu perfil para publicar cupos",
      });
    }

    const errores = [];
    const cuposCreados = [];

    // Validar y crear cada cupo
    for (let i = 0; i < cupos.length; i++) {
      const cupoData = cupos[i];

      try {
        // Validar campos requeridos
        if (
          !cupoData.tipoProducto ||
          !cupoData.origen ||
          !cupoData.destino ||
          !cupoData.descripcion ||
          !cupoData.cantidad ||
          !cupoData.precioUnitario ||
          !cupoData.fechaVencimiento
        ) {
          errores.push({
            fila: i + 2, // +2 porque Excel empieza en 1 y tiene header
            error: "Faltan campos requeridos",
          });
          continue;
        }

        // Validar que sea tipo aereo
        if (cupoData.tipoProducto.toLowerCase() !== "aereo") {
          errores.push({
            fila: i + 2,
            error: "Solo se permiten cupos de tipo 'aereo'",
          });
          continue;
        }

        // Crear el cupo
        const cupo = await CupoMercado.create({
          tipoProducto: "aereo",
          origen: cupoData.origen,
          destino: cupoData.destino,
          descripcion: cupoData.descripcion,
          cantidad: parseInt(cupoData.cantidad),
          precioUnitario: parseFloat(cupoData.precioUnitario),
          fechaVencimiento: cupoData.fechaVencimiento,
          fechaViaje: cupoData.fechaViaje || null,
          aerolinea: cupoData.aerolinea || null,
          clase: cupoData.clase || null,
          equipaje: cupoData.equipaje || null,
          observaciones: cupoData.observaciones || null,
          estado: "disponible",
          usuarioVendedorId: req.user.id,
        });

        cuposCreados.push(cupo);
      } catch (error) {
        errores.push({
          fila: i + 2,
          error: error.message,
        });
      }
    }

    res.status(201).json({
      message: `Importación completada: ${cuposCreados.length} cupos creados`,
      importados: cuposCreados.length,
      errores: errores.length,
      detalleErrores: errores,
      cupos: cuposCreados,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al importar cupos",
      error: error.message,
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
