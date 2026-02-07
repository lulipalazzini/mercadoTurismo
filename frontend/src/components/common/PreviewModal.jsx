import React from "react";
import { FaTimes } from "react-icons/fa";
import "../../styles/modal.css";

/**
 * Modal genérico para mostrar la vista previa (card minorista) de cualquier producto
 * @param {boolean} isOpen - Controla si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @param {React.Component} children - El componente card a mostrar (ej: PaqueteCard, CruceroCard)
 * @param {string} title - Título del modal
 */
export default function PreviewModal({
  isOpen,
  onClose,
  children,
  title = "Vista Previa",
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content preview-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body preview-modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
