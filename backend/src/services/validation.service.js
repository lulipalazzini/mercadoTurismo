/**
 * Servicio de validaciones fiscales y comerciales
 * Incluye validación de CUIT (Argentina) y preparación para APIs de AFIP/ARCA
 */

/**
 * Valida el formato y dígito verificador de un CUIT argentino
 * @param {string} cuit - CUIT con o sin guiones (20-12345678-9 o 20123456789)
 * @returns {object} - { valid: boolean, formatted: string, error: string }
 */
function validateCUIT(cuit) {
  if (!cuit) {
    return { valid: false, error: "CUIT no proporcionado" };
  }

  // Remover guiones y espacios
  const cleanCUIT = cuit.replace(/[-\s]/g, "");

  // Verificar longitud
  if (cleanCUIT.length !== 11) {
    return { valid: false, error: "El CUIT debe tener 11 dígitos" };
  }

  // Verificar que sean solo números
  if (!/^\d{11}$/.test(cleanCUIT)) {
    return { valid: false, error: "El CUIT debe contener solo números" };
  }

  // Algoritmo de validación del dígito verificador
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const digits = cleanCUIT.split("").map(Number);
  const digitoVerificador = digits[10];

  let suma = 0;
  for (let i = 0; i < 10; i++) {
    suma += digits[i] * multiplicadores[i];
  }

  const resto = suma % 11;
  const verificadorCalculado = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;

  if (verificadorCalculado !== digitoVerificador) {
    return {
      valid: false,
      error: "Dígito verificador inválido. Verifique el CUIT ingresado",
    };
  }

  // Formatear CUIT: XX-XXXXXXXX-X
  const formatted = `${cleanCUIT.slice(0, 2)}-${cleanCUIT.slice(2, 10)}-${cleanCUIT.slice(10)}`;

  return {
    valid: true,
    formatted,
    error: null,
  };
}

/**
 * Consulta datos del CUIT en AFIP/ARCA (placeholder para integración futura)
 * @param {string} cuit - CUIT limpio (11 dígitos)
 * @returns {Promise<object>} - Datos del contribuyente
 */
async function consultarAFIP(cuit) {
  // TODO: Implementar integración con API de AFIP cuando esté disponible
  // Por ahora, retorna datos simulados para desarrollo

  console.log(`[VALIDATION] Consultando CUIT ${cuit} en AFIP (simulado)...`);

  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Datos simulados basados en CUIT válido
  // En producción, esto vendría de la API de AFIP/ARCA
  return {
    cuit: cuit,
    razonSocial: "RAZON SOCIAL EJEMPLO SRL",
    estado: "ACTIVO",
    condicionIVA: "RESPONSABLE_INSCRIPTO",
    actividades: [
      {
        codigo: 791200,
        descripcion:
          "Servicios minoristas de agencias de viajes - Actividad principal",
      },
      {
        codigo: 799000,
        descripcion: "Servicios de reservas y actividades conexas n.c.p.",
      },
    ],
    domicilioFiscal: {
      direccion: "AV CORRIENTES 1234",
      localidad: "CAPITAL FEDERAL",
      provincia: "CIUDAD AUTONOMA DE BUENOS AIRES",
      codigoPostal: "1043",
    },
    fechaInscripcion: "2020-01-15",
    // Flag para indicar que es simulado
    _simulated: true,
  };
}

/**
 * Valida que las actividades del CUIT estén relacionadas con turismo
 * @param {array} actividades - Array de actividades AFIP
 * @returns {boolean} - true si tiene al menos una actividad de turismo
 */
function validarActividadesTurismo(actividades) {
  const codigosTurismo = [
    791100, // Agencias de viajes minoristas
    791200, // Agencias de viajes mayoristas
    799000, // Servicios de reservas y actividades conexas
    823000, // Organización de convenciones y exposiciones comerciales
    551000, // Servicios de alojamiento en hoteles
    552000, // Servicios de alojamiento en campamentos y parques
    493100, // Servicio de transporte de pasajeros por autobús
    511000, // Transporte aéreo de pasajeros
    // Agregar más códigos según necesidad
  ];

  return actividades.some((act) =>
    codigosTurismo.includes(parseInt(act.codigo)),
  );
}

/**
 * Valida formato de email
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida formato de teléfono internacional
 * @param {string} phone - Formato: +XX XXXXXXXXXX
 * @returns {object} - { valid: boolean, error: string }
 */
function validateInternationalPhone(phone) {
  if (!phone) {
    return { valid: false, error: "Teléfono no proporcionado" };
  }

  // Formato esperado: +[código país] [área] [número]
  // Ejemplo: +54 11 12345678
  const cleaned = phone.replace(/[\s()-]/g, "");

  if (!cleaned.startsWith("+")) {
    return {
      valid: false,
      error: "El teléfono debe comenzar con + y código de país",
    };
  }

  if (cleaned.length < 8 || cleaned.length > 15) {
    return { valid: false, error: "Longitud de teléfono inválida" };
  }

  if (!/^\+\d+$/.test(cleaned)) {
    return { valid: false, error: "El teléfono debe contener solo números" };
  }

  return { valid: true, formatted: cleaned };
}

/**
 * Valida número fiscal internacional (VAT, TAX ID, etc)
 * @param {string} taxId - Número fiscal
 * @param {string} countryCode - Código de país (BR, UY, CL, etc)
 * @returns {object} - { valid: boolean, error: string }
 */
function validateInternationalTaxId(taxId, countryCode) {
  if (!taxId) {
    return { valid: false, error: "Número fiscal no proporcionado" };
  }

  // Validaciones básicas por país
  // TODO: Expandir según necesidades
  switch (countryCode) {
    case "BR": // CNPJ Brasil
      return validateBrazilCNPJ(taxId);
    case "UY": // RUT Uruguay
      return validateUruguayRUT(taxId);
    default:
      // Validación genérica para otros países
      if (taxId.length < 5) {
        return {
          valid: false,
          error: "Número fiscal demasiado corto",
        };
      }
      return { valid: true };
  }
}

/**
 * Valida CNPJ de Brasil (simplificado)
 */
function validateBrazilCNPJ(cnpj) {
  const cleaned = cnpj.replace(/[^\d]/g, "");

  if (cleaned.length !== 14) {
    return { valid: false, error: "CNPJ debe tener 14 dígitos" };
  }

  // TODO: Implementar algoritmo completo de validación CNPJ
  return { valid: true, formatted: cleaned };
}

/**
 * Valida RUT de Uruguay (simplificado)
 */
function validateUruguayRUT(rut) {
  const cleaned = rut.replace(/[^\d]/g, "");

  if (cleaned.length !== 12) {
    return { valid: false, error: "RUT debe tener 12 dígitos" };
  }

  return { valid: true, formatted: cleaned };
}

module.exports = {
  validateCUIT,
  consultarAFIP,
  validarActividadesTurismo,
  validateEmail,
  validateInternationalPhone,
  validateInternationalTaxId,
};
