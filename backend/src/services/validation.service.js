const TOURISM_ACTIVITY_CODES = new Set(["791100", "791200", "799000", "823000"]);

const COUNTRY_PATTERNS = {
  BR: /^(?:\d{11}|\d{14})$/,
  CL: /^\d{7,9}[0-9K]$/i,
  MX: /^[A-Z0-9]{10,18}$/i,
  US: /^\d{9}$/,
};

const cleanNumeric = (value = "") => String(value).replace(/\D/g, "");

const formatCuit = (cleanCuit) =>
  `${cleanCuit.slice(0, 2)}-${cleanCuit.slice(2, 10)}-${cleanCuit.slice(10)}`;

const computeCuitVerifier = (firstTenDigits) => {
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = firstTenDigits
    .split("")
    .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
  const mod = 11 - (sum % 11);

  if (mod === 11) return 0;
  if (mod === 10) return 9;
  return mod;
};

const normalizeActivityCode = (activity) => {
  if (!activity) return "";
  if (typeof activity === "string") return activity.trim();
  if (typeof activity.codigo === "string") return activity.codigo.trim();
  if (typeof activity.code === "string") return activity.code.trim();
  return "";
};

const validateCUIT = (cuit) => {
  if (!cuit) {
    return { valid: false, error: "CUIT requerido" };
  }

  const cleanCuit = cleanNumeric(cuit);

  if (cleanCuit.length !== 11) {
    return { valid: false, error: "El CUIT debe tener 11 digitos" };
  }

  const verifier = computeCuitVerifier(cleanCuit.slice(0, 10));
  if (verifier !== Number(cleanCuit[10])) {
    return { valid: false, error: "CUIT invalido (digito verificador incorrecto)" };
  }

  return {
    valid: true,
    cleaned: cleanCuit,
    formatted: formatCuit(cleanCuit),
  };
};

const consultarAFIP = async (cuit) => {
  const cleanCuit = cleanNumeric(cuit);

  if (cleanCuit.length !== 11) {
    throw new Error("CUIT invalido para consulta AFIP");
  }

  // Modo simulado: responde con formato compatible para el wizard.
  const actividadPrincipal = cleanCuit.endsWith("1") ? "791100" : "791200";
  const condicionIVA = cleanCuit.endsWith("3")
    ? "MONOTRIBUTO"
    : "RESPONSABLE_INSCRIPTO";

  return {
    razonSocial: `Contribuyente ${cleanCuit.slice(2, 10)}`,
    condicionIVA,
    actividades: [
      {
        codigo: actividadPrincipal,
        descripcion:
          actividadPrincipal === "791100"
            ? "Servicios minoristas de agencias de viajes"
            : "Servicios mayoristas de agencias de viajes",
      },
    ],
    domicilioFiscal: "Domicilio fiscal informado por AFIP (simulado)",
    estado: "ACTIVO",
    _simulated: true,
  };
};

const validarActividadesTurismo = (activities = []) => {
  if (!Array.isArray(activities) || activities.length === 0) return false;

  return activities.some((activity) =>
    TOURISM_ACTIVITY_CODES.has(normalizeActivityCode(activity)),
  );
};

const validateInternationalTaxId = (taxId, countryCode) => {
  if (!taxId) {
    return { valid: false, error: "Tax ID requerido" };
  }

  if (!countryCode) {
    return { valid: false, error: "Codigo de pais requerido" };
  }

  const normalizedCountry = String(countryCode).toUpperCase();
  const normalizedTaxId = String(taxId).replace(/[\s-]/g, "").toUpperCase();

  if (normalizedCountry === "AR") {
    return validateCUIT(normalizedTaxId);
  }

  const pattern = COUNTRY_PATTERNS[normalizedCountry];
  if (pattern && !pattern.test(normalizedTaxId)) {
    return {
      valid: false,
      error: `Formato de Tax ID invalido para ${normalizedCountry}`,
    };
  }

  if (normalizedTaxId.length < 5 || normalizedTaxId.length > 20) {
    return { valid: false, error: "Tax ID con longitud invalida" };
  }

  return { valid: true, formatted: normalizedTaxId };
};

module.exports = {
  validateCUIT,
  consultarAFIP,
  validarActividadesTurismo,
  validateInternationalTaxId,
};
