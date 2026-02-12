const Cliente = require("../models/Cliente.model");

const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ order: [["createdAt", "DESC"]] });
    res.json(clientes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener clientes", error: error.message });
  }
};

const getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cliente", error: error.message });
  }
};

const createCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json({ message: "Cliente creado exitosamente", cliente });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear cliente", error: error.message });
  }
};

const updateCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    await cliente.update(req.body);
    res.json({ message: "Cliente actualizado exitosamente", cliente });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar cliente", error: error.message });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    await cliente.destroy();
    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar cliente", error: error.message });
  }
};


module.exports = {
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente
};
