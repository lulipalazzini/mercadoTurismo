import React, { useState, useRef } from "react";
import { FaUpload, FaTimes, FaImage, FaCloudUploadAlt } from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";
import "../../styles/imageUpload.css";

/**
 * Componente reutilizable para carga de imágenes
 * Soporta drag & drop, archivos locales y URLs
 * Máximo 6 imágenes por defecto
 */
export default function ImageUpload({
  images = [],
  onChange,
  maxImages = 6,
  label = "Imágenes",
  required = false,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // images puede ser array de: File objects, URLs (strings), o data URLs
  const currentImages = images || [];

  // Validar y procesar archivos
  const processFiles = (files) => {
    setError("");
    const fileArray = Array.from(files);

    // Validar límite total
    if (currentImages.length + fileArray.length > maxImages) {
      setError(
        `Máximo ${maxImages} imágenes permitidas. Actualmente tienes ${currentImages.length}.`,
      );
      return;
    }

    // Validar cada archivo
    const validFiles = [];
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen (JPG, PNG, GIF, etc.)");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`La imagen "${file.name}" supera los 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newImages = [...currentImages, ...validFiles];
      onChange && onChange(newImages);
    }
  };

  // Manejar selección de archivos desde input
  const handleFileSelect = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  // Manejar drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Manejar drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Eliminar una imagen
  const handleRemoveImage = (index) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onChange && onChange(newImages);
    setError("");
  };

  // Obtener URL de preview para cualquier tipo de imagen
  const getPreviewUrl = (image) => {
    if (typeof image === "string") {
      return getImageUrl(image) || image; // URL, data URL, o path normalizado
    } else if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return "";
  };

  // Click en zona de drop para abrir selector
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">
        {label} {required && <span className="required">*</span>}
        <span className="image-count">
          ({currentImages.length}/{maxImages})
        </span>
      </label>

      {error && <div className="image-upload-error">{error}</div>}

      {/* Grid de previews */}
      {currentImages.length > 0 && (
        <div className="image-preview-grid">
          {currentImages.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img src={getPreviewUrl(image)} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                className="image-remove-btn"
                onClick={() => handleRemoveImage(index)}
                title="Eliminar imagen"
              >
                <FaTimes />
              </button>
              <span className="image-number">{index + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zona de drag & drop / upload */}
      {currentImages.length < maxImages && (
        <div
          className={`image-dropzone ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClickUpload}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="file-input-hidden"
          />

          <FaCloudUploadAlt className="dropzone-icon" />
          <p className="dropzone-text">
            <strong>Arrastra imágenes aquí</strong> o haz click para seleccionar
          </p>
          <p className="dropzone-hint">
            Máximo {maxImages} imágenes • 5MB por imagen • JPG, PNG, GIF
          </p>
        </div>
      )}

      {currentImages.length >= maxImages && (
        <div className="image-limit-reached">
          ✓ Límite alcanzado ({maxImages} imágenes)
        </div>
      )}
    </div>
  );
}
