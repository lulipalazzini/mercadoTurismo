import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica de recuperación de contraseña
    console.log("Password recovery for:", email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Revisa tu correo</h1>
            <p>
              Si existe una cuenta con el correo <strong>{email}</strong>,
              recibirás instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <div className="auth-links">
            <Link to="/login" className="link-primary">
              Volver al login
            </Link>
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Recuperar Contraseña</h1>
          <p>Ingresa tu correo electrónico y te enviaremos instrucciones</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          <button type="submit" className="btn-primary">
            Enviar instrucciones
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="link-secondary">
            ← Volver al login
          </Link>
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
