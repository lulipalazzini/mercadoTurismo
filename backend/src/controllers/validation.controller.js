const {
  validateCUIT,
  consultarAFIP,
  validarActividadesTurismo,
  validateInternationalTaxId,
} = require("../services/validation.service");

/**
 * Endpoint para validar CUIT y consultar datos en AFIP
 * POST /api/auth/validate-cuit
 * Body: { cuit: string }
 */
const validateCuitEndpoint = async (req, res) => {
  try {
    const { cuit } = req.body;

    console.log(`[VALIDATION] Validando CUIT: ${cuit}`);

    // 1. Validar formato y dígito verificador
    const validation = validateCUIT(cuit);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // 2. Consultar datos en AFIP
    const cleanCuit = cuit.replace(/[-\s]/g, "");
    const afipData = await consultarAFIP(cleanCuit);

    // 3. Verificar estado activo
    if (afipData.estado !== "ACTIVO") {
      return res.status(400).json({
        success: false,
        error: "El CUIT no está activo. Verifique su situación fiscal en AFIP.",
        afipData: {
          estado: afipData.estado,
          razonSocial: afipData.razonSocial,
        },
      });
    }

    // 4. Validar actividades de turismo
    const tieneActividadTurismo = validarActividadesTurismo(
      afipData.actividades,
    );

    if (!tieneActividadTurismo) {
      return res.status(400).json({
        success: false,
        error:
          "El CUIT no tiene actividades registradas relacionadas con turismo. Códigos válidos: 791100, 791200, 799000, 823000.",
        afipData: {
          razonSocial: afipData.razonSocial,
          actividades: afipData.actividades,
        },
      });
    }

    // 5. Todo OK - Retornar datos completos
    console.log(`✅ [VALIDATION] CUIT validado exitosamente`);

    res.json({
      success: true,
      validated: true,
      cuit: validation.formatted,
      afipData: {
        razonSocial: afipData.razonSocial,
        condicionIVA: afipData.condicionIVA,
        actividades: afipData.actividades,
        domicilioFiscal: afipData.domicilioFiscal,
        estado: afipData.estado,
        _simulated: afipData._simulated || false,
      },
    });
  } catch (error) {
    console.error("[VALIDATION] Error en validateCuitEndpoint:", error);
    res.status(500).json({
      success: false,
      error: "Error al validar CUIT. Intente nuevamente.",
    });
  }
};

/**
 * Endpoint para validar número fiscal internacional
 * POST /api/auth/validate-tax-id
 * Body: { taxId: string, countryCode: string }
 */
const validateTaxIdEndpoint = async (req, res) => {
  try {
    const { taxId, countryCode } = req.body;

    console.log(
      `[VALIDATION] Validando Tax ID para país ${countryCode}: ${taxId}`,
    );

    const validation = validateInternationalTaxId(taxId, countryCode);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    res.json({
      success: true,
      validated: true,
      taxId: validation.formatted || taxId,
      message: "Número fiscal válido (validación básica)",
    });
  } catch (error) {
    console.error("[VALIDATION] Error en validateTaxIdEndpoint:", error);
    res.status(500).json({
      success: false,
      error: "Error al validar número fiscal",
    });
  }
};

module.exports = {
  validateCuitEndpoint,
  validateTaxIdEndpoint,
};
