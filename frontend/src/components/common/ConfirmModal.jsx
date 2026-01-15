import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import "../../styles/modal.css";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
          >
            <div
              style={{
                fontSize: "2rem",
                color: danger ? "#e53e3e" : "#f59e0b",
                flexShrink: 0,
              }}
            >
              <FaExclamationTriangle />
            </div>
            <p style={{ margin: 0, color: "#2d3748", fontSize: "0.9375rem" }}>
              {message}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button
            type="button"
            className={danger ? "btn-danger" : "btn-primary"}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
