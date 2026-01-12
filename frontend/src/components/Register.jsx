import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    operatorType: "",
    firstName: "",
    lastName: "",
    agencyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Aquí irá la lógica de registro
    console.log("Registration attempt:", formData);
  };

  const renderConditionalFields = () => {
    if (!formData.operatorType) return null;

    switch (formData.operatorType) {
      case "independiente":
        return (
          <>
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Juan"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Pérez"
              />
            </div>
          </>
        );

      case "agencia":
        return (
          <div className="form-group">
            <label htmlFor="agencyName">Nombre de la agencia</label>
            <input
              type="text"
              id="agencyName"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              required
              placeholder="Viajes del Sur S.A."
            />
          </div>
        );

      case "operador-agencia":
        return (
          <>
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Juan"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Pérez"
              />
            </div>
            <div className="form-group">
              <label htmlFor="agencyName">Nombre de la agencia</label>
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                required
                placeholder="Viajes del Sur S.A."
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Registro de Operador</h1>
          <p>Únete a nuestra plataforma mayorista</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="operatorType">Tipo de operador</label>
            <select
              id="operatorType"
              name="operatorType"
              value={formData.operatorType}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="independiente">Operador Independiente</option>
              <option value="agencia">Agencia de Viajes</option>
              <option value="operador-agencia">Operador de Agencia</option>
            </select>
          </div>

          {renderConditionalFields()}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contacto@tuempresa.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+54 11 1234-5678"
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
              autoComplete="new-password"
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="new-password"
              minLength="8"
            />
          </div>

          <button type="submit" className="btn-primary">
            Crear cuenta
          </button>
        </form>

        <div className="auth-links">
          <p className="register-prompt">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="link-primary">
              Inicia sesión
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
