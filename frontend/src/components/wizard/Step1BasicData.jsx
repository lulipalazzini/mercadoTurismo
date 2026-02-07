import React, { useState } from "react";
import {
  validateEmail,
  validateInternationalPhone,
  validatePassword,
  validatePasswordMatch,
  countries,
} from "../../utils/validation.utils";

export default function Step1BasicData({
  formData,
  updateFormData,
  errors,
  setErrors,
  onNext,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    updateFormData(field, value);
  };

  const validateStep = () => {
    const newErrors = {};

    // Email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    // Teléfono
    const phoneValidation = validateInternationalPhone(formData.telefono);
    if (!phoneValidation.valid) {
      newErrors.telefono = phoneValidation.error;
    }

    // Password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error;
    }

    // Confirm password
    const matchValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword,
    );
    if (!matchValidation.valid) {
      newErrors.confirmPassword = matchValidation.error;
    }

    // País
    if (!formData.countryCode) {
      newErrors.countryCode = "Debe seleccionar un país";
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
      <h2 className="step-title">Datos Básicos</h2>
      <p className="step-description">
        Complete la información de contacto para su cuenta profesional
      </p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">
            Email profesional <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "error" : ""}
            placeholder="contacto@tuagencia.com"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">
            Teléfono <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="telefono"
            value={formData.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            className={errors.telefono ? "error" : ""}
            placeholder="+54 11 1234-5678"
          />
          {errors.telefono && (
            <span className="error-message">{errors.telefono}</span>
          )}
          <span className="field-help">
            Incluya código de país (ej: +54 para Argentina)
          </span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password">
            Contraseña <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={errors.password ? "error" : ""}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirmar contraseña <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={errors.confirmPassword ? "error" : ""}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="countryCode">
          País desde donde opera <span className="required">*</span>
        </label>
        <select
          id="countryCode"
          value={formData.countryCode}
          onChange={(e) => handleChange("countryCode", e.target.value)}
          className={errors.countryCode ? "error" : ""}
        >
          <option value="">Seleccione un país</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        {errors.countryCode && (
          <span className="error-message">{errors.countryCode}</span>
        )}
        <span className="field-help">
          El país determina los requisitos de validación fiscal
        </span>
      </div>

      <div className="wizard-actions">
        <button type="button" className="btn-primary" onClick={handleNext}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
