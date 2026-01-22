import CupoMercado from "../models/CupoMercado.model.js";
import User from "../models/User.model.js";
import { Op } from "sequelize";

// Obtener cupos del marketplace (solo para agencias)
export const getCuposMercado = async (req, res) => {
  try {
    // Solo las agencias pueden ver el marketplace
    if (req.user.role !== "agencia") {
      return res.status(403).json({ 
        message: "Solo las agencias pueden ver el marketplace de cupos" 
      });
    }

    // Obtener cupos de operadores, con información del vendedor
    const cupos = await CupoMercado.findAll({
      include: [{
        model: User,
        as: "vendedor",
        attributes: ["id", "nombre", "email", "telefono", "razonSocial"],
        where: {
          role: "operador"
        }
      }],
      where: {
        estado: "disponible",
        cantidad: { [Op.gt]: 0 }
      },
      order: [["createdAt", "DESC"]],
    });

    // Actualizar estados según fecha de vencimiento
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const cupo of cupos) {
      const vencimiento = new Date(cupo.fechaVencimiento);
      if (vencimiento < hoy && cupo.estado === "disponible") {
        await cupo.update({ estado: "vencido" });
      }
    }

    res.json(cupos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupos", error: error.message });
  }
};

// Obtener mis cupos publicados (operadores y agencias)
export const getMisCupos = async (req, res) => {
  try {
    const cupos = await CupoMercado.findAll({
      where: {
        usuarioVendedorId: req.user.id
      },
      include: [{
        model: User,
        as: "vendedor",
        attributes: ["id", "nombre", "email", "telefono"]
      }],
      order: [["createdAt", "DESC"]],
    });

    res.json(cupos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupos", error: error.message });
  }
};

export const getCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id, {
      include: [{
        model: User,
        as: "vendedor",
        attributes: ["id", "nombre", "email", "telefono", "razonSocial"]
      }]
    });
    
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }

    // Verificar permisos: solo el vendedor o agencias pueden ver detalles
    if (req.user.role === "operador" && cupo.usuarioVendedorId !== req.user.id) {
      return res.status(403).json({ 
        message: "No tienes permiso para ver este cupo" 
      });
    }

    res.json(cupo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cupo", error: error.message });
  }
};

export const createCupoMercado = async (req, res) => {
  try {
    // Validar que el usuario tenga teléfono
    const user = await User.findByPk(req.user.id);
    if (!user.telefono) {
      return res.status(400).json({ 
        message: "Debes agregar un número de teléfono a tu perfil para publicar cupos" 
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

export const updateCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }

    // Solo el vendedor puede actualizar su cupo
    if (cupo.usuarioVendedorId !== req.user.id) {
      return res.status(403).json({ 
        message: "Solo puedes actualizar tus propios cupos" 
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

export const deleteCupoMercado = async (req, res) => {
  try {
    const cupo = await CupoMercado.findByPk(req.params.id);
    if (!cupo) {
      return res.status(404).json({ message: "Cupo no encontrado" });
    }

    // Solo el vendedor puede eliminar su cupo
    if (cupo.usuarioVendedorId !== req.user.id && req.user.role !== "admin" && req.user.role !== "sysadmin") {
      return res.status(403).json({ 
        message: "Solo puedes eliminar tus propios cupos" 
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
export const importarCupos = async (req, res) => {
  try {
    const { cupos } = req.body;

    if (!Array.isArray(cupos) || cupos.length === 0) {
      return res.status(400).json({ 
        message: "Debes proporcionar un array de cupos válido" 
      });
    }

    // Validar que el usuario tenga teléfono
    const user = await User.findByPk(req.user.id);
    if (!user.telefono) {
      return res.status(400).json({ 
        message: "Debes agregar un número de teléfono a tu perfil para publicar cupos" 
      });
    }

    const errores = [];
    const cuposCreados = [];

    // Validar y crear cada cupo
    for (let i = 0; i < cupos.length; i++) {
      const cupoData = cupos[i];
      
      try {
        // Validar campos requeridos
        if (!cupoData.tipoProducto || !cupoData.origen || !cupoData.destino || 
            !cupoData.descripcion || !cupoData.cantidad || !cupoData.precioUnitario || 
            !cupoData.fechaVencimiento) {
          errores.push({
            fila: i + 2, // +2 porque Excel empieza en 1 y tiene header
            error: "Faltan campos requeridos"
          });
          continue;
        }

        // Validar que sea tipo aereo
        if (cupoData.tipoProducto.toLowerCase() !== "aereo") {
          errores.push({
            fila: i + 2,
            error: "Solo se permiten cupos de tipo 'aereo'"
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
          error: error.message
        });
      }
    }

    res.status(201).json({
      message: `Importación completada: ${cuposCreados.length} cupos creados`,
      importados: cuposCreados.length,
      errores: errores.length,
      detalleErrores: errores,
      cupos: cuposCreados
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al importar cupos", 
      error: error.message 
    });
  }
};
