const Crucero = require("../models/Crucero.model");
const User = require("../models/User.model");
const { deleteOldImages } = require("../middleware/upload.middleware");

const getCruceros = async (req, res) => {
  try {
    const cruceros = await Crucero.findAll({
      where: { activo: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "razonSocial", "role"],
        },
      ],
    });
    res.json(cruceros);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cruceros", error: error.message });
  }
};

const getCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }
    res.json(crucero);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener crucero", error: error.message });
  }
};

const createCrucero = async (req, res) => {
  try {
    const cruceroData = { ...req.body };
    
    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      cruceroData.imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.imagenes) {
      // Si vienen imágenes como JSON string, parsear
      cruceroData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    const crucero = await Crucero.create(cruceroData);
    res.status(201).json({ message: "Crucero creado exitosamente", crucero });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res
      .status(500)
      .json({ message: "Error al crear crucero", error: error.message });
  }
};

const updateCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }

    const updateData = { ...req.body };

    // Si hay nuevas imágenes subidas
    if (req.files && req.files.length > 0) {
      // Eliminar imágenes antiguas del filesystem
      if (crucero.imagenes && crucero.imagenes.length > 0) {
        deleteOldImages(crucero.imagenes);
      }
      // Agregar nuevas imágenes
      updateData.imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.imagenes) {
      // Si vienen imágenes como JSON string, parsear
      updateData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    await crucero.update(updateData);
    res.json({ message: "Crucero actualizado exitosamente", crucero });
  } catch (error) {
    // Limpiar archivos subidos si hubo error
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res
      .status(500)
      .json({ message: "Error al actualizar crucero", error: error.message });
  }
};

const deleteCrucero = async (req, res) => {
  try {
    const crucero = await Crucero.findByPk(req.params.id);
    if (!crucero) {
      return res.status(404).json({ message: "Crucero no encontrado" });
    }
    await crucero.update({ activo: false });
    res.json({ message: "Crucero desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar crucero", error: error.message });
  }
};


module.exports = {
  getCruceros,
  getCrucero,
  createCrucero,
  updateCrucero,
  deleteCrucero
};
