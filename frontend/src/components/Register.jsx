import React, { useState } from "react";
import { Link } from "react-router-dom";
import RegisterCliente from "./RegisterCliente";
import RegisterB2BWizard from "./RegisterB2BWizard";
import "../styles/registerWizard.css";
import "../styles/register.css";

// Opciones de tipo de usuario disponibles al registrarse
const USER_TYPES = [
  {
    id: "cliente",
    label: "Cliente",
    icon: "fa-solid fa-user",
    colorClass: "card-color-cliente",
    description:
      "Quiero buscar y reservar viajes, alojamientos y servicios turísticos.",
  },
  {
    id: "agencia",
    label: "Agencia de viajes",
    icon: "fa-solid fa-building",
    colorClass: "card-color-agencia",
    description:
      "Soy una agencia que vende paquetes y servicios a pasajeros finales.",
  },
  {
    id: "operador",
    label: "Operador / Proveedor",
    icon: "fa-solid fa-industry",
    colorClass: "card-color-operador",
    description:
      "Soy un operador mayorista o proveedor de servicios turísticos.",
  },
];

function UserTypeSelector({ onSelect }) {
  return (
    <div className="wizard-step user-type-selector">
      <h2 className="step-title">¿Cómo vas a usar Mercado Turismo?</h2>
      <p className="step-description">
        Elegí el tipo de cuenta que mejor se adapta a vos
      </p>

      <div className="user-type-grid">
        {USER_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`user-type-card ${type.colorClass}`}
            onClick={() => onSelect(type.id)}
          >
            <span className="user-type-icon-wrap" aria-hidden="true">
              <i className={type.icon}></i>
            </span>
            <span className="user-type-label">{type.label}</span>
            <span className="user-type-description">{type.description}</span>
            <span className="user-type-cta">
              Continuar <i className="fa-solid fa-arrow-right"></i>
            </span>
          </button>
        ))}
      </div>

      <p className="auth-prompt">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="link-primary">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}

export default function Register() {
  // null = mostrando selector | "cliente" | "agencia" | "operador"
  const [selectedType, setSelectedType] = useState(null);

  const handleBack = () => setSelectedType(null);

  // Agencia u Operador → delegamos al wizard B2B pasando initialRole
  if (selectedType === "agencia" || selectedType === "operador") {
    return <RegisterB2BWizard initialRole={selectedType} />;
  }

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        {/* Header */}
        <div className="wizard-header">
          <Link to="/" className="back-to-home">
            <i className="fa-solid fa-arrow-left"></i> Volver al inicio
          </Link>
          <div className="register-header-icon">
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <h1>Crear cuenta</h1>
          <p>Registrate gratis y empezá a explorar</p>
        </div>

        {/* Contenido dinámico */}
        <div className="wizard-content">
          {selectedType === null && (
            <UserTypeSelector onSelect={setSelectedType} />
          )}

          {selectedType === "cliente" && (
            <RegisterCliente onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}
