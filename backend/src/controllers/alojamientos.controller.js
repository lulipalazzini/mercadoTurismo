const Alojamiento = require("../models/Alojamiento.model");
const User = require("../models/User.model");
const { deleteOldImages } = require("../middleware/upload.middleware");

const getAlojamientos = async (req, res) => {
  try {
    const alojamientos = await Alojamiento.findAll({
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
    res.json(alojamientos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener alojamientos", error: error.message });
  }
};

const getAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
    }
    res.json(alojamiento);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener alojamiento", error: error.message });
  }
};

const createAlojamiento = async (req, res) => {
  try {
    const alojamientoData = { ...req.body };
    
    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      alojamientoData.imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.imagenes) {
      alojamientoData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    const alojamiento = await Alojamiento.create(alojamientoData);
    res
      .status(201)
      .json({ message: "Alojamiento creado exitosamente", alojamiento });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res
      .status(500)
      .json({ message: "Error al crear alojamiento", error: error.message });
  }
};

const updateAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      if (alojamiento.imagenes && alojamiento.imagenes.length > 0) {
        deleteOldImages(alojamiento.imagenes);
      }
      updateData.imagenes = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.body.imagenes) {
      updateData.imagenes =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    await alojamiento.update(updateData);
    res.json({ message: "Alojamiento actualizado exitosamente", alojamiento });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      deleteOldImages(req.files.map((f) => `/uploads/${f.filename}`));
    }
    res.status(500).json({
      message: "Error al actualizar alojamiento",
      error: error.message,
    });
  }
};

const deleteAlojamiento = async (req, res) => {
  try {
    const alojamiento = await Alojamiento.findByPk(req.params.id);
    if (!alojamiento) {
      return res.status(404).json({ message: "Alojamiento no encontrado" });
    }
    await alojamiento.update({ activo: false });
    res.json({ message: "Alojamiento desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar alojamiento", error: error.message });
  }
};


module.exports = {
  getAlojamientos,
  getAlojamiento,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento
};
