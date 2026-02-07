import { useState, useRef } from "react";
import AlertModal from "./common/AlertModal";
import "../styles/ImageUploader.css";

export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 6,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState(
    images.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img),
    ),
  );
  const fileInputRef = useRef(null);

  // Estado para modal de alerta
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const totalImages = previews.length + fileArray.length;

    if (totalImages > maxImages) {
      setAlertMessage(`Máximo ${maxImages} imágenes permitidas`);
      setShowAlert(true);
      return;
    }

    // Validar tipo de archivo
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setAlertMessage(`${file.name} no es una imagen válida`);
        setShowAlert(true);
        return false;
      }
      return true;
    });

    // Crear previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);

    // Notificar al componente padre
    const allFiles = [
      ...images.filter((img) => typeof img === "string"),
      ...validFiles,
    ];
    onChange(allFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    // Actualizar archivos
    const newFiles = images.filter((_, i) => i !== index);
    onChange(newFiles);

    // Limpiar URL.createObjectURL para evitar memory leaks
    if (previews[index] && previews[index].startsWith("blob:")) {
      URL.revokeObjectURL(previews[index]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <div className="upload-icon">📷</div>
        <p className="upload-text">
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <p className="upload-hint">
          Máximo {maxImages} imágenes • JPG, PNG, WEBP
        </p>
        <p className="upload-count">
          {previews.length} / {maxImages} imágenes
        </p>
      </div>

      {previews.length > 0 && (
        <div className="previews-grid">
          {previews.map((preview, index) => (
            <div key={index} className="preview-item">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="preview-image"
              />
              <button
                type="button"
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                aria-label="Eliminar imagen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de alerta */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type="error"
        message={alertMessage}
      />
    </div>
  );
}
