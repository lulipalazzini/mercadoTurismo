import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { abrirWhatsApp } from "../utils/whatsapp";
import { useAuth } from "../hooks/useAuth";

/**
 * Botón de reserva por WhatsApp con captura de lead.
 *
 * - Autenticado  → abre WhatsApp con el mensaje prearmado.
 * - No autenticado → guarda la ruta actual en localStorage
 *   ('redirectAfterLogin') y redirige al login.
 *
 * Props:
 *  - tipo       {string}  Tipo de servicio (ej: "paquete", "auto", etc.)
 *  - item       {object}  Datos del servicio a reservar.
 *  - isPreview  {bool}    Deshabilita el botón en modo preview (editor).
 *  - disabled   {bool}    Deshabilita por falta de disponibilidad (cupos, etc.).
 *                         Solo aplica cuando el usuario está autenticado.
 *  - className  {string}  Clase CSS del botón (por defecto "btn-primary").
 *  - showIcon   {bool}    Muestra el ícono de WhatsApp antes del texto.
 *  - children   {node}    Texto del botón cuando el usuario está autenticado.
 */
export default function ReservarWhatsAppButton({
  tipo,
  item,
  isPreview = false,
  disabled = false,
  className = "btn-primary",
  showIcon = false,
  children = "Reservar",
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (isAuthenticated) {
        abrirWhatsApp(tipo, item);
      } else {
        localStorage.setItem("redirectAfterLogin", location.pathname);
        navigate("/login");
      }
    },
    [isAuthenticated, tipo, item, location.pathname, navigate],
  );

  // Cuando no está autenticado, el botón nunca se deshabilita por disponibilidad
  // (queremos que el usuario pueda hacer clic para ir al login).
  const isDisabled = isPreview || (isAuthenticated && disabled);

  return (
    <button className={className} onClick={handleClick} disabled={isDisabled}>
      {showIcon && <FaWhatsapp />}
      {isAuthenticated ? children : "Iniciá sesión para reservar"}
    </button>
  );
}
