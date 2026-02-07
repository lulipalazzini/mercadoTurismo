import React, { useState } from "react";
import { FaLock, FaTimes } from "react-icons/fa";
import { verifyAdminPassword } from "../../services/auth.service";

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Por favor ingresa la contraseña");
      return;
    }

    try {
      setLoading(true);
      await verifyAdminPassword(password);
      setPassword("");
      onSuccess();
    } catch (error) {
      setError(error.message || "Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaLock style={{ color: "var(--primary)", fontSize: "1.5rem" }} />
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
              Verificación de Administrador
            </h2>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#718096",
              padding: "0.25rem",
            }}
          >
            <FaTimes />
          </button>
        </div>

        <p
          style={{
            color: "#718096",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
          }}
        >
          Para acceder a las funciones de administrador, ingresa tu contraseña
          especial de admin.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#4a5568",
                marginBottom: "0.5rem",
              }}
            >
              Contraseña de Administrador
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Ingresa tu contraseña de admin"
              style={{
                width: "100%",
                padding: "0.625rem",
                border: error ? "1px solid #f56565" : "1px solid #e2e8f0",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }}
              autoFocus
            />
            {error && (
              <p
                style={{
                  color: "#f56565",
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.625rem 1rem",
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
              }}
            >
              <FaLock />
              {loading ? "Verificando..." : "Verificar"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: "0.625rem 1rem",
                background: "#e2e8f0",
                color: "#4a5568",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
