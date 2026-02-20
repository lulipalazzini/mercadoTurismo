/**
 * Utilidad para gestionar reservas por WhatsApp
 * Usa la API de WhatsApp para enviar mensajes
 */

// Número de WhatsApp de la agencia (cambiar por el número real)
const WHATSAPP_NUMBER = "5491162086559"; // Formato: código país + código área + número (sin espacios ni guiones)

/**
 * Genera el mensaje de WhatsApp para un servicio
 * @param {string} tipoServicio - Tipo de servicio (alojamiento, vuelo, auto, etc.)
 * @param {object} datos - Datos del servicio
 * @returns {string} Mensaje formateado
 */
const generarMensaje = (tipoServicio, datos) => {
  let mensaje = `Hola! Me interesa reservar:\n\n`;
  mensaje += `📌 *${tipoServicio.toUpperCase()}*\n`;

  switch (tipoServicio.toLowerCase()) {
    case "alojamiento":
      mensaje += `🏨 ${datos.nombre || "N/A"}\n`;
      mensaje += `📍 ${datos.ubicacion || "N/A"}\n`;
      mensaje += `⭐ ${datos.estrellas || "N/A"} estrellas\n`;
      mensaje += `💰 $${datos.precioNoche || "N/A"} por noche\n`;
      break;

    case "pasaje":
    case "vuelo":
      mensaje += `✈️ ${datos.origen || "N/A"} → ${datos.destino || "N/A"}\n`;
      mensaje += `🛫 ${datos.aerolinea || "N/A"}${datos.numeroVuelo ? ` (${datos.numeroVuelo})` : ""}\n`;
      mensaje += `📅 Salida: ${datos.fechaSalida ? new Date(datos.fechaSalida).toLocaleDateString("es-ES") : "N/A"}\n`;
      mensaje += `🎫 Clase: ${datos.clase || "N/A"}\n`;
      mensaje += `💰 $${datos.precio || "N/A"}\n`;
      break;

    case "auto":
      mensaje += `🚗 ${datos.marca || "N/A"} ${datos.modelo || "N/A"}\n`;
      mensaje += `📍 ${datos.ubicacion || "N/A"}\n`;
      mensaje += `👥 ${datos.capacidadPasajeros || "N/A"} pasajeros\n`;
      mensaje += `⚙️ ${datos.transmision || "N/A"}\n`;
      mensaje += `💰 $${datos.precioDia || "N/A"} por día\n`;
      break;

    case "excursion":
      mensaje += `🎯 ${datos.nombre || "N/A"}\n`;
      mensaje += `📍 ${datos.ubicacion || "N/A"}\n`;
      mensaje += `⏱️ ${datos.duracion || "N/A"} horas\n`;
      mensaje += `📊 Dificultad: ${datos.nivelDificultad || "N/A"}\n`;
      mensaje += `💰 $${datos.precio || "N/A"}\n`;
      break;

    case "crucero":
      mensaje += `🚢 ${datos.nombre || "N/A"}\n`;
      mensaje += `⚓ ${datos.naviera || "N/A"} - ${datos.barco || "N/A"}\n`;
      mensaje += `📅 ${datos.fechaSalida ? new Date(datos.fechaSalida).toLocaleDateString("es-ES") : "N/A"}\n`;
      mensaje += `🌊 ${datos.duracion || "N/A"} noches\n`;
      mensaje += `💰 Desde $${datos.precioDesde || "N/A"}\n`;
      break;

    case "circuito":
      mensaje += `🗺️ ${datos.nombre || "N/A"}\n`;
      mensaje += `📍 ${datos.destinos ? datos.destinos.slice(0, 3).join(", ") : "N/A"}\n`;
      mensaje += `📅 ${datos.fechaInicio ? new Date(datos.fechaInicio).toLocaleDateString("es-ES") : "N/A"}\n`;
      mensaje += `⏱️ ${datos.duracion || "N/A"} días\n`;
      mensaje += `💰 $${datos.precio || "N/A"}\n`;
      break;

    case "paquete":
      mensaje += `📦 ${datos.nombre || "N/A"}\n`;
      mensaje += `📍 ${datos.destino || "N/A"}\n`;
      mensaje += `📅 ${datos.fechaInicio ? new Date(datos.fechaInicio).toLocaleDateString("es-ES") : "N/A"}\n`;
      mensaje += `⏱️ ${datos.duracion || "N/A"} días\n`;
      mensaje += `💰 $${datos.precio || "N/A"}\n`;
      break;

    case "transfer":
      mensaje += `🚐 ${datos.origen || "N/A"} → ${datos.destino || "N/A"}\n`;
      mensaje += `🚗 ${datos.tipoVehiculo || "N/A"}\n`;
      mensaje += `👥 ${datos.capacidadPasajeros || "N/A"} pasajeros\n`;
      mensaje += `💰 $${datos.precio || "N/A"}\n`;
      break;

    case "seguro":
      mensaje += `🛡️ ${datos.nombre || "N/A"}\n`;
      mensaje += `🏢 ${datos.aseguradora || "N/A"}\n`;
      mensaje += `📋 ${datos.tipo || "N/A"}\n`;
      mensaje += `💵 Cobertura: $${datos.montoCobertura ? datos.montoCobertura.toLocaleString() : "N/A"}\n`;
      mensaje += `💰 $${datos.precio || "N/A"}\n`;
      break;

    case "salida-grupal":
      mensaje += `👥 ${datos.nombre || "N/A"}\n`;
      mensaje += `📍 ${datos.destinos ? datos.destinos.slice(0, 2).join(", ") : "N/A"}\n`;
      mensaje += `📅 ${datos.fechaSalida ? new Date(datos.fechaSalida).toLocaleDateString("es-ES") : "N/A"}\n`;
      mensaje += `⏱️ ${datos.duracion || "N/A"} días\n`;
      mensaje += `💰 $${datos.precio || "N/A"}\n`;
      break;

    default:
      mensaje += `${JSON.stringify(datos, null, 2)}\n`;
  }

  mensaje += `\n¿Podrían brindarme más información?`;

  return mensaje;
};

/**
 * Abre WhatsApp con el mensaje pre-cargado
 * @param {string} tipoServicio - Tipo de servicio
 * @param {object} datos - Datos del servicio
 */
export const abrirWhatsApp = (tipoServicio, datos) => {
  const mensaje = generarMensaje(tipoServicio, datos);
  const mensajeCodificado = encodeURIComponent(mensaje);

  // URL de WhatsApp con el mensaje
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;

  // Abrir en nueva pestaña
  window.open(url, "_blank");
};

/**
 * Obtiene el número de WhatsApp configurado
 * @returns {string} Número de WhatsApp en formato internacional
 */
export const getWhatsAppNumber = () => {
  return WHATSAPP_NUMBER;
};
