import React from "react";
import {
  FaTimes,
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import "../../styles/modal.css";

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle style={{ color: "#48bb78" }} />;
      case "info":
        return <FaInfoCircle style={{ color: "#4299e1" }} />;
      case "error":
      default:
        return <FaExclamationCircle style={{ color: "#e53e3e" }} />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "success":
        return "Éxito";
      case "info":
        return "Información";
      case "error":
      default:
        return "Error";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="btn-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
          >
            <div style={{ fontSize: "2rem", flexShrink: 0 }}>{getIcon()}</div>
            <p style={{ margin: 0, color: "#2d3748", fontSize: "0.9375rem" }}>
              {message}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
