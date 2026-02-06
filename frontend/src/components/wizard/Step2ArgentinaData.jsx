import React, { useState } from "react";
import {
  validateCUITFormat,
  provinciasArgentina,
  condicionesIVA,
  tiposEntidad,
} from "../../utils/validation.utils";
import { validateCUIT } from "../../services/b2b.service";

export default function Step2ArgentinaData({
  formData,
  updateFormData,
  errors,
  setErrors,
  onNext,
  onBack,
  afipData,
  setAfipData,
}) {
  const [validatingCUIT, setValidatingCUIT] = useState(false);
  const [cuitValidated, setCuitValidated] = useState(false);

  const handleChange = (field, value) => {
    updateFormData(field, value);

    // Si cambia el CUIT, resetear validación
    if (field === "cuit") {
      setCuitValidated(false);
      setAfipData(null);
    }
  };

  const handleValidateCUIT = async () => {
    // Validar formato primero
    const formatValidation = validateCUITFormat(formData.cuit);
    if (!formatValidation.valid) {
      setErrors({ ...errors, cuit: formatValidation.error });
      return;
    }

    try {
      setValidatingCUIT(true);
      setErrors({ ...errors, cuit: null });

      console.log("[STEP2A] Validando CUIT:", formData.cuit);

      const result = await validateCUIT(formData.cuit);

      console.log("[STEP2A] Resultado validación:", result);

      if (result.success && result.validated) {
        // CUIT válido
        setAfipData(result.afipData);
        setCuitValidated(true);

        // Pre-completar razón social si viene de AFIP
        if (result.afipData.razonSocial && !formData.razonSocial) {
          updateFormData("razonSocial", result.afipData.razonSocial);
        }

        // Pre-completar condición IVA si viene de AFIP
        if (result.afipData.condicionIVA && !formData.condicionIVA) {
          updateFormData("condicionIVA", result.afipData.condicionIVA);
        }

        setErrors({ ...errors, cuit: null });
      }
    } catch (error) {
      console.error("[STEP2A] Error validando CUIT:", error);
      setErrors({ ...errors, cuit: error.message });
      setCuitValidated(false);
      setAfipData(null);
    } finally {
      setValidatingCUIT(false);
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (!formData.entityType) {
      newErrors.entityType = "Seleccione el tipo de persona";
    }

    if (!formData.cuit) {
      newErrors.cuit = "El CUIT es obligatorio";
    } else if (!cuitValidated) {
      newErrors.cuit = "Debe validar el CUIT antes de continuar";
    }

    if (!formData.razonSocial) {
      newErrors.razonSocial = "La razón social es obligatoria";
    }

    if (!formData.condicionIVA) {
      newErrors.condicionIVA = "Seleccione la condición frente al IVA";
    }

    if (!formData.provincia) {
      newErrors.provincia = "La provincia es obligatoria";
    }

    if (!formData.ciudad) {
      newErrors.ciudad = "La ciudad es obligatoria";
    }

    if (!formData.domicilioFiscal) {
      newErrors.domicilioFiscal = "El domicilio fiscal es obligatorio";
    }

    if (!formData.oficinaVirtual && !formData.domicilioFisico) {
      newErrors.domicilioFisico = "El domicilio físico es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="wizard-step">
      <h2 className="step-title">Datos Fiscales - Argentina</h2>
      <p className="step-description">
        Complete la información fiscal y comercial de su empresa
      </p>

      {/* Validación AFIP */}
      {afipData && afipData._simulated && (
        <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
          ℹ️ Validación en modo simulado. En producción se consultará AFIP en
          tiempo real.
        </div>
      )}

      {/* Tipo de persona */}
      <div className="form-group">
        <label htmlFor="entityType">
          Tipo de persona <span className="required">*</span>
        </label>
        <div className="radio-group">
          {tiposEntidad.AR.map((tipo) => (
            <label key={tipo.value} className="radio-label">
              <input
                type="radio"
                name="entityType"
                value={tipo.value}
                checked={formData.entityType === tipo.value}
                onChange={(e) => handleChange("entityType", e.target.value)}
              />
              <span>{tipo.label}</span>
            </label>
          ))}
        </div>
        {errors.entityType && (
          <span className="error-message">{errors.entityType}</span>
        )}
      </div>

      {/* CUIT con validación */}
      <div className="form-group">
        <label htmlFor="cuit">
          CUIT <span className="required">*</span>
        </label>
        <div className="input-with-button">
          <input
            type="text"
            id="cuit"
            value={formData.cuit}
            onChange={(e) => handleChange("cuit", e.target.value)}
            className={errors.cuit ? "error" : ""}
            placeholder="20-12345678-9"
            maxLength="13"
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleValidateCUIT}
            disabled={validatingCUIT || !formData.cuit}
          >
            {validatingCUIT ? "Validando..." : "Validar CUIT"}
          </button>
        </div>
        {errors.cuit && <span className="error-message">{errors.cuit}</span>}
        {cuitValidated && afipData && (
          <div className="validation-status success">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>
              CUIT validado: {afipData.razonSocial} - Estado: {afipData.estado}
            </span>
          </div>
        )}
      </div>

      {/* Razón Social */}
      <div className="form-group">
        <label htmlFor="razonSocial">
          Razón Social <span className="required">*</span>
        </label>
        <input
          type="text"
          id="razonSocial"
          value={formData.razonSocial}
          onChange={(e) => handleChange("razonSocial", e.target.value)}
          className={errors.razonSocial ? "error" : ""}
          placeholder="Nombre o Razón Social"
          disabled={afipData && afipData.razonSocial}
        />
        {errors.razonSocial && (
          <span className="error-message">{errors.razonSocial}</span>
        )}
      </div>

      {/* Condición IVA */}
      <div className="form-group">
        <label htmlFor="condicionIVA">
          Condición frente al IVA <span className="required">*</span>
        </label>
        <select
          id="condicionIVA"
          value={formData.condicionIVA}
          onChange={(e) => handleChange("condicionIVA", e.target.value)}
          className={errors.condicionIVA ? "error" : ""}
        >
          <option value="">Seleccione una condición</option>
          {condicionesIVA.map((condicion) => (
            <option key={condicion.value} value={condicion.value}>
              {condicion.label}
            </option>
          ))}
        </select>
        {errors.condicionIVA && (
          <span className="error-message">{errors.condicionIVA}</span>
        )}
      </div>

      {/* Ubicación */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="provincia">
            Provincia <span className="required">*</span>
          </label>
          <select
            id="provincia"
            value={formData.provincia}
            onChange={(e) => handleChange("provincia", e.target.value)}
            className={errors.provincia ? "error" : ""}
          >
            <option value="">Seleccione una provincia</option>
            {provinciasArgentina.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.provincia && (
            <span className="error-message">{errors.provincia}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">
            Ciudad <span className="required">*</span>
          </label>
          <input
            type="text"
            id="ciudad"
            value={formData.ciudad}
            onChange={(e) => handleChange("ciudad", e.target.value)}
            className={errors.ciudad ? "error" : ""}
            placeholder="Ciudad"
          />
          {errors.ciudad && (
            <span className="error-message">{errors.ciudad}</span>
          )}
        </div>
      </div>

      {/* Domicilios */}
      <div className="form-group">
        <label htmlFor="domicilioFiscal">
          Domicilio fiscal <span className="required">*</span>
        </label>
        <input
          type="text"
          id="domicilioFiscal"
          value={formData.domicilioFiscal}
          onChange={(e) => handleChange("domicilioFiscal", e.target.value)}
          className={errors.domicilioFiscal ? "error" : ""}
          placeholder="Calle, número, piso, depto"
        />
        {errors.domicilioFiscal && (
          <span className="error-message">{errors.domicilioFiscal}</span>
        )}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.oficinaVirtual}
            onChange={(e) => handleChange("oficinaVirtual", e.target.checked)}
          />
          <span>Oficina virtual (sin domicilio físico)</span>
        </label>
      </div>

      {!formData.oficinaVirtual && (
        <div className="form-group">
          <label htmlFor="domicilioFisico">
            Domicilio físico / comercial <span className="required">*</span>
          </label>
          <input
            type="text"
            id="domicilioFisico"
            value={formData.domicilioFisico}
            onChange={(e) => handleChange("domicilioFisico", e.target.value)}
            className={errors.domicilioFisico ? "error" : ""}
            placeholder="Calle, número (si es diferente al fiscal)"
          />
          {errors.domicilioFisico && (
            <span className="error-message">{errors.domicilioFisico}</span>
          )}
        </div>
      )}

      {/* Contacto */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="codigoPostal">Código postal</label>
          <input
            type="text"
            id="codigoPostal"
            value={formData.codigoPostal}
            onChange={(e) => handleChange("codigoPostal", e.target.value)}
            placeholder="C1043"
          />
        </div>

        <div className="form-group">
          <label htmlFor="whatsapp">WhatsApp comercial</label>
          <input
            type="tel"
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            placeholder="+54 11 1234-5678"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nombreComercial">Nombre comercial (opcional)</label>
        <input
          type="text"
          id="nombreComercial"
          value={formData.nombreComercial}
          onChange={(e) => handleChange("nombreComercial", e.target.value)}
          placeholder="Nombre de fantasía o marca"
        />
      </div>

      <div className="wizard-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Volver
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleNext}
          disabled={!cuitValidated}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
