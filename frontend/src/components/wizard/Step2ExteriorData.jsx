import React from "react";
import { tiposEntidad } from "../../utils/validation.utils";

export default function Step2ExteriorData({
  formData,
  updateFormData,
  errors,
  setErrors,
  onNext,
  onBack,
}) {
  const handleChange = (field, value) => {
    updateFormData(field, value);
  };

  const validateStep = () => {
    const newErrors = {};

    if (!formData.entityType) {
      newErrors.entityType = "Seleccione el tipo de entidad";
    }

    if (!formData.nombreComercial) {
      newErrors.nombreComercial = "El nombre comercial es obligatorio";
    }

    if (!formData.taxId) {
      newErrors.taxId = "El número fiscal es obligatorio";
    }

    if (!formData.taxType) {
      newErrors.taxType = "Seleccione el tipo de identificación fiscal";
    }

    if (!formData.ciudad) {
      newErrors.ciudad = "La ciudad es obligatoria";
    }

    if (!formData.domicilioFiscal) {
      newErrors.domicilioFiscal = "El domicilio legal es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const taxIdTypes = [
    { value: "VAT", label: "VAT (Europa)" },
    { value: "TAX_ID", label: "Tax ID (EE.UU.)" },
    { value: "CNPJ", label: "CNPJ (Brasil)" },
    { value: "RUT", label: "RUT (Chile/Uruguay)" },
    { value: "RUC", label: "RUC (Perú/Ecuador)" },
    { value: "NIT", label: "NIT (Colombia/Bolivia)" },
    { value: "RFC", label: "RFC (México)" },
    { value: "EIN", label: "EIN (EE.UU.)" },
    { value: "OTHER", label: "Otro" },
  ];

  return (
    <div className="wizard-step">
      <h2 className="step-title">Datos Comerciales - Exterior</h2>
      <p className="step-description">
        Complete la información comercial de su empresa
      </p>

      <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
        ℹ️ Los datos serán verificados manualmente por nuestro equipo. Recibirá
        una notificación cuando su cuenta sea aprobada.
      </div>

      {/* Tipo de entidad */}
      <div className="form-group">
        <label htmlFor="entityType">
          Tipo de entidad <span className="required">*</span>
        </label>
        <div className="radio-group">
          {tiposEntidad.EXTERIOR.map((tipo) => (
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

      {/* Nombre comercial y razón social */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nombreComercial">
            Nombre comercial <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombreComercial"
            value={formData.nombreComercial}
            onChange={(e) => handleChange("nombreComercial", e.target.value)}
            className={errors.nombreComercial ? "error" : ""}
            placeholder="Nombre de su empresa"
          />
          {errors.nombreComercial && (
            <span className="error-message">{errors.nombreComercial}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="razonSocial">Razón social (si aplica)</label>
          <input
            type="text"
            id="razonSocial"
            value={formData.razonSocial}
            onChange={(e) => handleChange("razonSocial", e.target.value)}
            placeholder="Razón social legal"
          />
        </div>
      </div>

      {/* Número fiscal */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="taxId">
            Número fiscal / comercial <span className="required">*</span>
          </label>
          <input
            type="text"
            id="taxId"
            value={formData.taxId}
            onChange={(e) => handleChange("taxId", e.target.value)}
            className={errors.taxId ? "error" : ""}
            placeholder="Ej: 12.345.678/0001-90"
          />
          {errors.taxId && (
            <span className="error-message">{errors.taxId}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="taxType">
            Tipo de identificación <span className="required">*</span>
          </label>
          <select
            id="taxType"
            value={formData.taxType}
            onChange={(e) => handleChange("taxType", e.target.value)}
            className={errors.taxType ? "error" : ""}
          >
            <option value="">Seleccione el tipo</option>
            {taxIdTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.taxType && (
            <span className="error-message">{errors.taxType}</span>
          )}
        </div>
      </div>

      {/* Ubicación */}
      <div className="form-row">
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
            placeholder="Ciudad donde opera"
          />
          {errors.ciudad && (
            <span className="error-message">{errors.ciudad}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="codigoPostal">Código postal</label>
          <input
            type="text"
            id="codigoPostal"
            value={formData.codigoPostal}
            onChange={(e) => handleChange("codigoPostal", e.target.value)}
            placeholder="Código postal"
          />
        </div>
      </div>

      {/* Domicilio */}
      <div className="form-group">
        <label htmlFor="domicilioFiscal">
          Domicilio legal <span className="required">*</span>
        </label>
        <input
          type="text"
          id="domicilioFiscal"
          value={formData.domicilioFiscal}
          onChange={(e) => handleChange("domicilioFiscal", e.target.value)}
          className={errors.domicilioFiscal ? "error" : ""}
          placeholder="Dirección completa"
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
          <span>Oficina virtual (trabajo remoto)</span>
        </label>
      </div>

      {/* Contacto */}
      <div className="form-group">
        <label htmlFor="whatsapp">WhatsApp comercial</label>
        <input
          type="tel"
          id="whatsapp"
          value={formData.whatsapp}
          onChange={(e) => handleChange("whatsapp", e.target.value)}
          placeholder="+XX XXXX XXXX"
        />
      </div>

      <div className="wizard-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Volver
        </button>
        <button type="button" className="btn-primary" onClick={handleNext}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
