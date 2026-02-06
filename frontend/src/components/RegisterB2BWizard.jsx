import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Step1BasicData from "./wizard/Step1BasicData";
import Step2ArgentinaData from "./wizard/Step2ArgentinaData";
import Step2ExteriorData from "./wizard/Step2ExteriorData";
import Step3Confirmation from "./wizard/Step3Confirmation";
import { registerB2B } from "../services/b2b.service";
import "../styles/registerWizard.css";

export default function RegisterB2BWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Datos básicos
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    countryCode: "",

    // Step 2: Identidad
    entityType: "",
    nombre: "",
    razonSocial: "",

    // Argentina
    cuit: "",
    condicionIVA: "",

    // Exterior
    taxId: "",
    taxType: "",

    // Datos del negocio
    provincia: "",
    ciudad: "",
    codigoPostal: "",
    domicilioFiscal: "",
    domicilioFisico: "",
    oficinaVirtual: false,
    whatsapp: "",
    nombreComercial: "",

    // Step 3
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Datos de validación de AFIP (si aplica)
  const [afipData, setAfipData] = useState(null);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = (targetStep) => {
    if (typeof targetStep === "number") {
      // Navegación directa desde confirmación
      setCurrentStep(targetStep);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      console.log("[WIZARD] Enviando registro B2B...", formData);

      // Preparar datos para enviar
      const dataToSend = {
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        countryCode: formData.countryCode,
        acceptedTerms: formData.acceptedTerms,

        entityType: formData.entityType,
        nombre: formData.nombre,
        razonSocial: formData.razonSocial,

        // Datos fiscales según país
        ...(formData.countryCode === "AR"
          ? {
              cuit: formData.cuit,
              condicionIVA: formData.condicionIVA,
            }
          : {
              taxId: formData.taxId,
              taxType: formData.taxType,
            }),

        // Datos del negocio
        provincia: formData.provincia,
        ciudad: formData.ciudad,
        codigoPostal: formData.codigoPostal,
        domicilioFiscal: formData.domicilioFiscal,
        domicilioFisico: formData.domicilioFisico,
        oficinaVirtual: formData.oficinaVirtual,
        whatsapp: formData.whatsapp,
        nombreComercial: formData.nombreComercial,
      };

      const response = await registerB2B(dataToSend);

      console.log("[WIZARD] Registro exitoso:", response);

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("[WIZARD] Error en registro:", error);
      setErrorMessage(error.message || "Error al completar el registro");
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicData
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
            onNext={handleNext}
          />
        );
      case 2:
        return formData.countryCode === "AR" ? (
          <Step2ArgentinaData
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
            onNext={handleNext}
            onBack={handleBack}
            afipData={afipData}
            setAfipData={setAfipData}
          />
        ) : (
          <Step2ExteriorData
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            setErrors={setErrors}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3Confirmation
            formData={formData}
            errors={errors}
            setErrors={setErrors}
            isArgentina={formData.countryCode === "AR"}
            afipData={afipData}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        {/* Header */}
        <div className="wizard-header">
          <Link to="/" className="back-to-home">
            ← Volver al inicio
          </Link>
          <h1>Registro Profesional</h1>
          <p>Complete los datos para crear su cuenta B2B</p>
        </div>

        {/* Progress indicator */}
        <div className="wizard-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
          <div className="progress-steps">
            <div
              className={`step ${currentStep >= 1 ? "active completed" : ""}`}
            >
              <div className="step-circle">1</div>
              <div className="step-label">Datos básicos</div>
            </div>
            <div
              className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}
            >
              <div className="step-circle">2</div>
              <div className="step-label">Identidad fiscal</div>
            </div>
            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
              <div className="step-circle">3</div>
              <div className="step-label">Confirmación</div>
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="wizard-content">
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Procesando su solicitud...</p>
            </div>
          )}
          {errorMessage && (
            <div
              className="alert alert-error"
              style={{ marginBottom: "1.5rem" }}
            >
              {errorMessage}
            </div>
          )}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
