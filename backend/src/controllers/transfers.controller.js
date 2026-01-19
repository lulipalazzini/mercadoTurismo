import Transfer from "../models/Transfer.model.js";
import User from "../models/User.model.js";

export const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll({
      where: { disponible: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "vendedor",
          attributes: ["id", "nombre", "email", "razonSocial", "role"],
        },
      ],
    });
    res.json(transfers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transfers", error: error.message });
  }
};

export const getTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer no encontrado" });
    }
    res.json(transfer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener transfer", error: error.message });
  }
};

export const createTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.create(req.body);
    res.status(201).json({ message: "Transfer creado exitosamente", transfer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear transfer", error: error.message });
  }
};

export const updateTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer no encontrado" });
    }
    await transfer.update(req.body);
    res.json({ message: "Transfer actualizado exitosamente", transfer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar transfer", error: error.message });
  }
};

export const deleteTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer no encontrado" });
    }
    await transfer.update({ disponible: false });
    res.json({ message: "Transfer desactivado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar transfer", error: error.message });
  }
};
