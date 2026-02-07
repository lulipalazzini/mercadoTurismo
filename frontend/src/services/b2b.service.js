import api from "./api";

/**
 * Registro B2B (profesional)
 * @param {object} userData - Datos completos del formulario wizard
 */
export async function registerB2B(userData) {
  try {
    console.log("[AUTH SERVICE] Registrando usuario B2B...");
    const response = await fetch(`${api.baseURL}/auth/register-b2b`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al registrar usuario profesional");
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
    const response = await fetch(`${api.baseURL}/auth/validate-cuit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cuit }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al validar CUIT");
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
    const response = await fetch(`${api.baseURL}/auth/validate-tax-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taxId, countryCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al validar número fiscal");
    }

    return data;
  } catch (error) {
    console.error("[VALIDATION] Error en validateTaxId:", error);
    throw error;
  }
}

// Note: Se usan named exports individuales arriba
// No se exportan funciones de auth.service para evitar duplicación
