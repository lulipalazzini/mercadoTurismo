import React, { useState } from "react";
import { quickLoginCredentials } from "../data/exampleUsers";
import "../styles/devhelper.css";

// Componente auxiliar para desarrollo - REMOVER EN PRODUCCIÓN
export default function DevHelper({ onFillForm }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyCredentials = (email, password) => {
    if (onFillForm) {
      onFillForm(email, password);
    }
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="dev-helper">
      <button
        className="dev-helper-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Usuarios de prueba"
      >
        👤 DEV
      </button>

      {isOpen && (
        <div className="dev-helper-panel">
          <div className="dev-helper-header">
            <h3>👨‍💻 Usuarios de Prueba</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="dev-helper-content">
            <p className="dev-note">
              ⚠️ Solo para desarrollo - Remover en producción
            </p>

            {quickLoginCredentials.map((user, index) => (
              <div key={index} className="dev-user-card">
                <h4>{user.type}</h4>
                <div className="dev-credentials">
                  <div className="dev-field">
                    <strong>Email:</strong>
                    <code>{user.email}</code>
                  </div>
                  <div className="dev-field">
                    <strong>Contraseña:</strong>
                    <code>{user.password}</code>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopyCredentials(user.email, user.password)
                  }
                  className="dev-copy-btn"
                >
                  📋 Copiar credenciales
                </button>
              </div>
            ))}

            <div className="dev-info">
              <p>
                <strong>💡 Tip:</strong> Estos usuarios son para testing del
                sistema de login y registro.
              </p>
              <p>
                Los datos pueden usarse para probar el flujo completo de
                autenticación.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
