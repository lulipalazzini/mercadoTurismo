import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "../utils/validation.utils";
import { registerCliente } from "../services/auth.service";

export default function RegisterCliente({ onBack }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (errorMessage) setErrorMessage("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error;
    }

    const matchValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword,
    );
    if (!matchValidation.valid) {
      newErrors.confirmPassword = matchValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setErrorMessage("");
      await registerCliente(formData);
      navigate("/");
    } catch (error) {
      console.error("[REGISTRO CLIENTE] Error:", error);
      setErrorMessage(error.message || "Error al completar el registro");
      setLoading(false);
    }
  };

  return (
    <div className="wizard-step">
      <h2 className="step-title">Datos personales</h2>
      <p className="step-description">
        Completá tu información para crear una cuenta de cliente
      </p>

      {errorMessage && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre <span className="required">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              className={`form-input ${errors.nombre ? "error" : ""}`}
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              placeholder="Tu nombre"
              autoComplete="given-name"
              disabled={loading}
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">
              Apellido <span className="required">*</span>
            </label>
            <input
              id="apellido"
              type="text"
              className={`form-input ${errors.apellido ? "error" : ""}`}
              value={formData.apellido}
              onChange={(e) => handleChange("apellido", e.target.value)}
              placeholder="Tu apellido"
              autoComplete="family-name"
              disabled={loading}
            />
            {errors.apellido && (
              <span className="error-message">{errors.apellido}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? "error" : ""}`}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={loading}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">
            Teléfono <span className="required">*</span>
          </label>
          <input
            id="telefono"
            type="tel"
            className={`form-input ${errors.telefono ? "error" : ""}`}
            value={formData.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            placeholder="+54 9 11 1234 5678"
            autoComplete="tel"
            disabled={loading}
          />
          {errors.telefono && (
            <span className="error-message">{errors.telefono}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">
              Contraseña <span className="required">*</span>
            </label>
            <div
              className="password-input-container"
              style={{ position: "relative" }}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? "error" : ""}`}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                disabled={loading}
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmar contraseña <span className="required">*</span>
            </label>
            <div
              className="password-input-container"
              style={{ position: "relative" }}
            >
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
                disabled={loading}
                style={{ paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        <div className="step-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onBack}
            disabled={loading}
          >
            ← Volver
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </div>
      </form>
    </div>
  );
}
