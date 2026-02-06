/**
 * Validaciones frontend para el flujo de registro B2B
 */

/**
 * Valida formato de email
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return { valid: false, error: "Email inválido" };
  }
  return { valid: true };
}

/**
 * Valida formato de teléfono internacional
 * Esperado: +[código país] [área] [número]
 */
export function validateInternationalPhone(phone) {
  if (!phone) {
    return { valid: false, error: "Teléfono requerido" };
  }

  const cleaned = phone.replace(/[\s()-]/g, "");

  if (!cleaned.startsWith("+")) {
    return {
      valid: false,
      error: "Debe comenzar con + y código de país",
    };
  }

  if (cleaned.length < 8 || cleaned.length > 15) {
    return { valid: false, error: "Longitud de teléfono inválida" };
  }

  if (!/^\+\d+$/.test(cleaned)) {
    return { valid: false, error: "Solo números después del +" };
  }

  return { valid: true, formatted: cleaned };
}

/**
 * Valida formato de CUIT (solo frontend, la validación real es en backend)
 */
export function validateCUITFormat(cuit) {
  if (!cuit) {
    return { valid: false, error: "CUIT requerido" };
  }

  const cleaned = cuit.replace(/[-\s]/g, "");

  if (cleaned.length !== 11) {
    return { valid: false, error: "El CUIT debe tener 11 dígitos" };
  }

  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: "El CUIT debe contener solo números" };
  }

  return { valid: true, formatted: cleaned };
}

/**
 * Valida contraseña
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: "Contraseña requerida" };
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: "Debe tener al menos 6 caracteres",
    };
  }

  return { valid: true };
}

/**
 * Valida coincidencia de contraseñas
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, error: "Las contraseñas no coinciden" };
  }
  return { valid: true };
}

/**
 * Valida código postal argentino
 */
export function validateArgentinaPostalCode(postalCode) {
  if (!postalCode) {
    return { valid: true }; // Opcional
  }

  const cleaned = postalCode.replace(/\s/g, "");

  // Formato: XXXX o CXXXXXXX (C1234ABC)
  if (!/^[A-Z]?\d{4}([A-Z]{3})?$/.test(cleaned)) {
    return { valid: false, error: "Código postal inválido" };
  }

  return { valid: true };
}

/**
 * Lista de países disponibles
 */
export const countries = [
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "MX", name: "México", flag: "🇲🇽" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "ES", name: "España", flag: "🇪🇸" },
  { code: "OTHER", name: "Otro país", flag: "🌐" },
];

/**
 * Provincias de Argentina
 */
export const provinciasArgentina = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

/**
 * Condiciones frente al IVA (Argentina)
 */
export const condicionesIVA = [
  { value: "MONOTRIBUTO", label: "Monotributo" },
  { value: "RESPONSABLE_INSCRIPTO", label: "Responsable Inscripto" },
  { value: "EXENTO", label: "Exento" },
  { value: "CONSUMIDOR_FINAL", label: "Consumidor Final" },
];

/**
 * Tipos de entidad
 */
export const tiposEntidad = {
  AR: [
    { value: "fisica", label: "Persona Física" },
    { value: "juridica", label: "Persona Jurídica" },
  ],
  EXTERIOR: [
    { value: "empresa", label: "Empresa" },
    { value: "independiente", label: "Profesional Independiente" },
  ],
};
