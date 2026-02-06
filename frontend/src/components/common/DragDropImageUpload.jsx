/**
 * Componente de Drag & Drop para imágenes
 * JavaScript puro, sin librerías
 * Inspirado en la UI de sistemas PHP clásicos
 */

import { useState, useRef, useEffect } from "react";
import "../../styles/dragDropUpload.css";

export default function DragDropImageUpload({
  onChange,
  maxFiles = 6,
  maxSizeMB = 5,
  existingImages = [],
}) {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Cargar imágenes existentes cuando cambian
  useEffect(() => {
    if (existingImages && existingImages.length > 0 && images.length === 0) {
      setImages(existingImages);
    }
  }, [existingImages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validaciones (equivalente a validaciones PHP)
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return `${file.name}: Tipo no permitido. Solo JPG, PNG, WEBP`;
    }

    if (file.size > maxSize) {
      return `${file.name}: Muy grande. Máximo ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFiles = (files) => {
    setError("");
    const fileArray = Array.from(files);

    // Validar cantidad
    if (images.length + fileArray.length > maxFiles) {
      setError(`Máximo ${maxFiles} imágenes permitidas`);
      return;
    }

    // Validar cada archivo
    const errors = [];
    const validFiles = [];

    fileArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    // Crear previews
    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    // Notificar al componente padre con toda la información
    if (onChange) {
      onChange(updatedImages);
    }
  };

  // Drag & Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // Revocar URL preview para liberar memoria (solo para nuevas)
    if (images[index].preview && images[index].file) {
      URL.revokeObjectURL(images[index].preview);
    }

    // Notificar cambio
    if (onChange) {
      onChange(updatedImages);
    }
  };

  return (
    <div className="drag-drop-upload">
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          style={{ display: "none" }}
        />

        <div className="drop-zone-content">
          <svg
            className="upload-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className="drop-zone-text">
            {isDragging
              ? "Suelta las imágenes aquí"
              : "Arrastra imágenes o haz clic para seleccionar"}
          </p>

          <p className="drop-zone-hint">
            Máximo {maxFiles} imágenes • {maxSizeMB}MB por imagen • JPG, PNG,
            WEBP
          </p>
        </div>
      </div>

      {error && <div className="upload-error">{error}</div>}

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img
                src={image.preview || image}
                alt={image.name || `Imagen ${index + 1}`}
                className="preview-image"
              />
              <button
                type="button"
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                title="Eliminar imagen"
              >
                ×
              </button>
              <div className="image-name">
                {image.name || "Imagen existente"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
