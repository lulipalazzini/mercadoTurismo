import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DevHelper from "./DevHelper";
import { exampleUsers } from "../data/exampleUsers";
import "../styles/auth.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFillForm = (email, password) => {
    setFormData({
      email: email,
      password: password,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica de autenticación real
    console.log("Login attempt:", formData);

    // Buscar usuario en los ejemplos basado en el email
    let currentUser = null;

    if (formData.email === exampleUsers.independiente.email) {
      currentUser = exampleUsers.independiente;
    } else if (formData.email === exampleUsers.agencia.email) {
      currentUser = exampleUsers.agencia;
    } else if (formData.email === exampleUsers.operadorAgencia.email) {
      currentUser = exampleUsers.operadorAgencia;
    } else {
      // Usuario por defecto si no coincide
      currentUser = {
        firstName: "Usuario",
        lastName: "Demo",
        operatorType: "independiente",
        email: formData.email,
      };
    }

    // Guardar usuario en localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Redirigir al dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <DevHelper onFillForm={handleFillForm} />
      <div className="auth-card">
        <div className="auth-header">
          <h1>Acceso Mayorista</h1>
          <p>Operadores independientes, agencias y operadores de agencias</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary">
            Ingresar
          </button>
        </form>

        <div className="auth-links">
          <Link to="/recuperar-contrasena" className="link-secondary">
            ¿Olvidaste tu contraseña?
          </Link>
          <div className="divider">
            <span>o</span>
          </div>
          <p className="register-prompt">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="link-primary">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="auth-footer">
          <Link to="/" className="link-back">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
