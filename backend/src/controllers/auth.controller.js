import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const register = async (req, res) => {
  try {
    const { nombre, email, password, role, telefono, direccion } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Nombre, email y contraseña son requeridos",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Crear nuevo usuario
    const user = await User.create({
      nombre,
      email,
      password,
      role: role || "user",
      telefono,
      direccion,
    });

    // Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.errors.map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son requeridos",
      });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfil", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, currentPassword, newPassword } = req.body;

    // Verificar que el usuario solo pueda actualizar su propia información
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para actualizar este usuario",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si está cambiando la contraseña
    if (currentPassword && newPassword) {
      // Verificar contraseña actual
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Contraseña actual incorrecta" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "La nueva contraseña debe tener al menos 6 caracteres",
        });
      }

      user.password = newPassword;
    }

    // Actualizar otros campos si fueron proporcionados
    if (nombre) user.nombre = nombre;
    if (email) {
      // Verificar que el email no esté en uso por otro usuario
      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          message: "El email ya está en uso por otro usuario",
        });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      message: "Usuario actualizado exitosamente",
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};
