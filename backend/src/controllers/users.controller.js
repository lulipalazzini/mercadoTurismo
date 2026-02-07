const User = require("../models/User.model");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res
      .status(500)
      .json({ message: "Error al obtener usuario", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { nombre, email, password, role, telefono, direccion, agenciaId } =
      req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nombre, email y contraseña son requeridos" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const user = await User.create({
      nombre,
      email,
      password,
      role: role || "operador_independiente",
      telefono,
      direccion,
      agenciaId,
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res
      .status(500)
      .json({ message: "Error al crear usuario", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, role, telefono, direccion, agenciaId, fotoPerfil } =
      req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res
          .status(400)
          .json({ message: "El email ya está en uso por otro usuario" });
      }
    }

    if (nombre) user.nombre = nombre;
    if (email) user.email = email;
    if (role) user.role = role;
    if (telefono !== undefined) user.telefono = telefono;
    if (direccion !== undefined) user.direccion = direccion;
    if (agenciaId !== undefined) user.agenciaId = agenciaId;
    if (fotoPerfil !== undefined) user.fotoPerfil = fotoPerfil;

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      message: "Usuario actualizado exitosamente",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir que un usuario se elimine a sí mismo
    if (req.user.id === parseInt(id)) {
      return res
        .status(400)
        .json({ message: "No puedes eliminar tu propia cuenta" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar usuario", error: error.message });
  }
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
