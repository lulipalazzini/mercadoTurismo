import { API_URL as API_BASE_URL } from "../config/api.config.js";

const AUTH_URL = `${API_BASE_URL}/auth`;

const parseResponseSafely = async (response) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (_error) {
    return {};
  }
};

const normalizeB2BPayload = (userData) => {
  const fallbackName =
    userData?.nombre?.trim() ||
    userData?.razonSocial?.trim() ||
    userData?.nombreComercial?.trim() ||
    userData?.email?.split("@")[0] ||
    "Usuario B2B";

  return {
    ...userData,
    nombre: fallbackName,
    role: userData?.role || "operador",
    direccion: userData?.direccion || userData?.domicilioFiscal || "",
  };
};

/**
 * Registro B2B (profesional)
 * @param {object} userData - Datos completos del formulario wizard
 */
export async function registerB2B(userData) {
  try {
    console.log("[AUTH SERVICE] Registrando usuario B2B...");
    const payload = normalizeB2BPayload(userData);

    const response = await fetch(`${AUTH_URL}/register-b2b`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponseSafely(response);

    if (!response.ok) {
      throw new Error(
        data.message || "Error al registrar usuario profesional",
      );
    }

    // Guardar token y usuario en localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("[AUTH SERVICE] Error en registerB2B:", error);
    throw error;
  }
}

/**
 * Validar CUIT y obtener datos de AFIP
 * @param {string} cuit - CUIT a validar
 */
export async function validateCUIT(cuit) {
  try {
    console.log("[VALIDATION] Validando CUIT:", cuit);
    const response = await fetch(`${AUTH_URL}/validate-cuit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cuit }),
    });

    const data = await parseResponseSafely(response);

    if (!response.ok) {
      throw new Error(data.error || data.message || "Error al validar CUIT");
    }

    return data;
  } catch (error) {
    console.error("[VALIDATION] Error en validateCUIT:", error);
    throw error;
  }
}

/**
 * Validar Tax ID internacional
 * @param {string} taxId - Número fiscal
 * @param {string} countryCode - Código de país
 */
export async function validateTaxId(taxId, countryCode) {
  try {
    console.log("[VALIDATION] Validando Tax ID:", taxId, countryCode);
    const response = await fetch(`${AUTH_URL}/validate-tax-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taxId, countryCode }),
    });

    const data = await parseResponseSafely(response);

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Error al validar número fiscal",
      );
    }

    return data;
  } catch (error) {
    console.error("[VALIDATION] Error en validateTaxId:", error);
    throw error;
  }
}

// Note: Se usan named exports individuales arriba
// No se exportan funciones de auth.service para evitar duplicación
