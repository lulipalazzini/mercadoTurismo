import React, { useState } from "react";
import { countries } from "../../utils/validation.utils";

export default function Step3Confirmation({
  formData,
  errors,
  setErrors,
  onBack,
  onSubmit,
  isArgentina,
  afipData,
}) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = () => {
    if (!acceptedTerms) {
      setErrors({ ...errors, terms: "Debe aceptar los Términos y Condiciones" });
      return;
    }

    setErrors({ ...errors, terms: null });
    onSubmit();
  };

  const getCountryName = (code) => {
    const country = countries.find((c) => c.code === code);
    return country ? `${country.flag} ${country.name}` : code;
  };

  const handleEdit = (step) => {
    // onBack puede recibir un número de step para navegar directamente
    if (typeof onBack === "function") {
      onBack(step);
    }
  };

  return (
    <div className="wizard-step">
      <h2 className="step-title">Confirmación de Datos</h2>
      <p className="step-description">
        Revise la información antes de enviar su solicitud de registro
      </p>

      {/* Validación */}
      {isArgentina && afipData && (
        <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: "0.5rem" }}
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <strong>CUIT validado correctamente</strong>
          <br />
          Su cuenta será activada automáticamente tras completar el registro.
        </div>
      )}

      {!isArgentina && (
        <div className="alert alert-warning" style={{ marginBottom: "1.5rem" }}>
          ⏳ <strong>Validación manual requerida</strong>
          <br />
          Su solicitud será revisada por nuestro equipo en las próximas 48
          horas. Le notificaremos por email cuando su cuenta sea aprobada.
        </div>
      )}

      {/* Resumen de datos */}
      <div className="summary-container">
        {/* Sección 1: Datos de contacto */}
        <div className="summary-section">
          <div className="summary-header">
            <h3>Datos de contacto</h3>
            <button
              type="button"
              className="btn-link"
              onClick={() => handleEdit(1)}
            >
              Editar
            </button>
          </div>
          <div className="summary-content">
            <div className="summary-row">
              <span className="summary-label">Email:</span>
              <span className="summary-value">{formData.email}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Teléfono:</span>
              <span className="summary-value">{formData.telefono}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">País:</span>
              <span className="summary-value">
                {getCountryName(formData.countryCode)}
              </span>
            </div>
          </div>
        </div>

        {/* Sección 2: Datos fiscales/comerciales */}
        <div className="summary-section">
          <div className="summary-header">
            <h3>{isArgentina ? "Datos fiscales" : "Datos comerciales"}</h3>
            <button
              type="button"
              className="btn-link"
              onClick={() => handleEdit(2)}
            >
              Editar
            </button>
          </div>
          <div className="summary-content">
            {isArgentina ? (
              <>
                <div className="summary-row">
                  <span className="summary-label">CUIT:</span>
                  <span className="summary-value">
                    {formData.cuit}
                    {afipData && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        style={{ marginLeft: "0.5rem", verticalAlign: "middle" }}
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Razón Social:</span>
                  <span className="summary-value">{formData.razonSocial}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tipo:</span>
                  <span className="summary-value">
                    {formData.entityType === "fisica"
                      ? "Persona Física"
                      : "Persona Jurídica"}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Condición IVA:</span>
                  <span className="summary-value">{formData.condicionIVA}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Provincia:</span>
                  <span className="summary-value">{formData.provincia}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Ciudad:</span>
                  <span className="summary-value">{formData.ciudad}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Domicilio fiscal:</span>
                  <span className="summary-value">
                    {formData.domicilioFiscal}
                  </span>
                </div>
                {formData.oficinaVirtual ? (
                  <div className="summary-row">
                    <span className="summary-label">Modalidad:</span>
                    <span className="summary-value">Oficina Virtual</span>
                  </div>
                ) : (
                  <div className="summary-row">
                    <span className="summary-label">Domicilio físico:</span>
                    <span className="summary-value">
                      {formData.domicilioFisico}
                    </span>
                  </div>
                )}
                {formData.nombreComercial && (
                  <div className="summary-row">
                    <span className="summary-label">Nombre comercial:</span>
                    <span className="summary-value">
                      {formData.nombreComercial}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="summary-row">
                  <span className="summary-label">Nombre comercial:</span>
                  <span className="summary-value">
                    {formData.nombreComercial}
                  </span>
                </div>
                {formData.razonSocial && (
                  <div className="summary-row">
                    <span className="summary-label">Razón social:</span>
                    <span className="summary-value">{formData.razonSocial}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span className="summary-label">Tipo:</span>
                  <span className="summary-value">
                    {formData.entityType === "empresa"
                      ? "Empresa"
                      : formData.entityType === "independiente"
                      ? "Independiente"
                      : formData.entityType === "agencia"
                      ? "Agencia"
                      : formData.entityType === "operador"
                      ? "Tour Operador"
                      : "Proveedor"}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">
                    {formData.taxType || "ID Fiscal"}:
                  </span>
                  <span className="summary-value">{formData.taxId}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Ciudad:</span>
                  <span className="summary-value">{formData.ciudad}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Domicilio:</span>
                  <span className="summary-value">
                    {formData.domicilioFiscal}
                  </span>
                </div>
                {formData.oficinaVirtual && (
                  <div className="summary-row">
                    <span className="summary-label">Modalidad:</span>
                    <span className="summary-value">Oficina Virtual</span>
                  </div>
                )}
              </>
            )}

            {formData.whatsapp && (
              <div className="summary-row">
                <span className="summary-label">WhatsApp:</span>
                <span className="summary-value">{formData.whatsapp}</span>
              </div>
            )}

            {formData.codigoPostal && (
              <div className="summary-row">
                <span className="summary-label">Código postal:</span>
                <span className="summary-value">{formData.codigoPostal}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="form-group" style={{ marginTop: "2rem" }}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => {
              setAcceptedTerms(e.target.checked);
              if (e.target.checked) {
                setErrors({ ...errors, terms: null });
              }
            }}
          />
          <span>
            Acepto los{" "}
            <a
              href="/terminos-y-condiciones"
              target="_blank"
              rel="noopener noreferrer"
            >
              Términos y Condiciones
            </a>{" "}
            y la{" "}
            <a
              href="/politica-privacidad"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de Privacidad
            </a>
          </span>
        </label>
        {errors.terms && (
          <span className="error-message" style={{ marginTop: "0.5rem" }}>
            {errors.terms}
          </span>
        )}
      </div>

      <div className="wizard-actions">
        <button type="button" className="btn-secondary" onClick={() => onBack()}>
          Volver
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!acceptedTerms}
        >
          Enviar Solicitud
        </button>
      </div>
    </div>
  );
}
