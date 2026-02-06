import React, { useState } from "react";
import {
  FaUpload,
  FaTimes,
  FaFileExcel,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaDownload,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import "../../styles/modal.css";

export default function ImportarCuposModal({
  isOpen,
  onClose,
  onImportSuccess,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const requiredColumns = [
    { key: "origen", label: "Origen", ejemplo: "Buenos Aires, Argentina" },
    {
      key: "destino",
      label: "Destino",
      ejemplo: "Miami, Florida, Estados Unidos",
    },
    {
      key: "descripcion",
      label: "Descripción",
      ejemplo: "Vuelo BA-MIA clase económica",
    },
    { key: "cantidad", label: "Cantidad", ejemplo: "10" },
    { key: "precioUnitario", label: "Precio Unitario", ejemplo: "45000" },
    { key: "aerolinea", label: "Aerolínea", ejemplo: "American Airlines" },
    { key: "fechaOrigen", label: "Fecha Origen", ejemplo: "2026-03-15" },
    {
      key: "fechaVencimiento",
      label: "Fecha Vencimiento",
      ejemplo: "2026-12-31",
    },
  ];

  const optionalColumns = [
    { key: "clase", label: "Clase", ejemplo: "Económica" },
    { key: "equipaje", label: "Equipaje", ejemplo: "23kg incluido" },
    { key: "observaciones", label: "Observaciones", ejemplo: "Sin escalas" },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError("Por favor selecciona un archivo Excel válido (.xlsx o .xls)");
      return;
    }

    setFile(selectedFile);
    setError(null);
    readExcelFile(selectedFile);
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError("El archivo Excel está vacío");
          setPreview([]);
          return;
        }

        // Validar columnas requeridas
        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(
          (col) => !(col.key in firstRow),
        );

        if (missingColumns.length > 0) {
          setError(
            `Faltan columnas requeridas: ${missingColumns
              .map((c) => c.label)
              .join(", ")}`,
          );
          setPreview([]);
          return;
        }

        // Validar campos requeridos en cada fila
        const errors = [];
        jsonData.forEach((row, index) => {
          const rowErrors = [];

          if (!row.aerolinea || !row.aerolinea.trim()) {
            rowErrors.push("falta aerolínea");
          }
          if (!row.fechaOrigen) {
            rowErrors.push("falta fecha origen");
          }
          if (!row.descripcion || !row.descripcion.trim()) {
            rowErrors.push("falta descripción");
          }
          if (!row.cantidad || row.cantidad <= 0) {
            rowErrors.push("cantidad inválida");
          }
          if (!row.precioUnitario || row.precioUnitario <= 0) {
            rowErrors.push("precio inválido");
          }
          if (!row.fechaVencimiento) {
            rowErrors.push("falta fecha vencimiento");
          }

          if (rowErrors.length > 0) {
            errors.push(`Fila ${index + 2}: ${rowErrors.join(", ")}`);
          }
        });

        if (errors.length > 0) {
          setError(
            `Se encontraron errores en ${errors.length} fila(s):\n${errors.slice(0, 5).join("\n")}${
              errors.length > 5
                ? `\n... y ${errors.length - 5} errores más`
                : ""
            }`,
          );
          setPreview([]);
          return;
        }

        setPreview(jsonData);
        setShowInstructions(false);
        setError(null);
      } catch (error) {
        console.error("Error leyendo archivo Excel:", error);
        setError(
          "Error al leer el archivo. Asegúrate de que sea un Excel válido.",
        );
        setPreview([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      setError("No hay datos para importar");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3000/api/cupos-mercado/importar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ cupos: preview }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        let errorMessage = result.error || "Error al importar cupos";

        if (result.detalle) {
          errorMessage += `\n\n${result.detalle}`;
        }

        if (result.errores && result.errores.length > 0) {
          const errorDetails = result.errores
            .slice(0, 10)
            .map((e) => `Fila ${e.fila}: ${e.error}`)
            .join("\n");
          errorMessage += `\n\nErrores encontrados:\n${errorDetails}`;

          if (result.errores.length > 10) {
            errorMessage += `\n... y ${result.errores.length - 10} errores más`;
          }
        }

        throw new Error(errorMessage);
      }

      onImportSuccess(result);
      handleClose();
    } catch (err) {
      setError(err.message || "Error al importar cupos");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setError(null);
    setShowInstructions(true);
    onClose();
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        origen: "Buenos Aires, Argentina",
        destino: "Miami, Florida, Estados Unidos",
        descripcion: "Vuelo directo BA-MIA clase económica",
        cantidad: 10,
        precioUnitario: 45000,
        aerolinea: "American Airlines",
        fechaOrigen: "2026-03-15",
        fechaVencimiento: "2026-12-31",
        clase: "Económica",
        equipaje: "23kg incluido",
        observaciones: "Sin escalas",
      },
      {
        origen: "Buenos Aires, Argentina",
        destino: "Madrid, España",
        descripcion: "Vuelo BA-MAD vía São Paulo",
        cantidad: 5,
        precioUnitario: 75000,
        aerolinea: "Iberia",
        fechaOrigen: "2026-04-20",
        fechaVencimiento: "2026-11-30",
        clase: "Business",
        equipaje: "32kg incluido",
        observaciones: "Escala en São Paulo",
      },
      {
        origen: "Mendoza, Argentina",
        destino: "Santiago, Chile",
        descripcion: "Vuelo MDZ-SCL directo",
        cantidad: 15,
        precioUnitario: 25000,
        aerolinea: "LATAM",
        fechaOrigen: "2026-05-10",
        fechaVencimiento: "2026-10-15",
        clase: "Económica",
        equipaje: "23kg incluido",
        observaciones: "Vuelo regional",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cupos");
    XLSX.writeFile(wb, "plantilla_cupos.xlsx");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-importar-cupos">
        <div className="modal-header">
          <div className="modal-header-content">
            <FaFileExcel className="modal-icon" />
            <div>
              <h2>Importar Cupos desde Excel</h2>
              <p className="modal-subtitle">
                Carga múltiples cupos de forma rápida y sencilla
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {showInstructions && (
            <div className="import-instructions">
              <div className="instruction-header">
                <FaInfoCircle />
                <h3>Instrucciones de importación</h3>
              </div>

              <div className="instruction-section">
                <h4>📋 Columnas Requeridas</h4>
                <div className="columns-grid">
                  {requiredColumns.map((col) => (
                    <div key={col.key} className="column-item required">
                      <strong>{col.label}</strong>
                      <span className="column-example">Ej: {col.ejemplo}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="instruction-section">
                <h4>✨ Columnas Opcionales</h4>
                <div className="columns-grid">
                  {optionalColumns.map((col) => (
                    <div key={col.key} className="column-item optional">
                      <strong>{col.label}</strong>
                      <span className="column-example">Ej: {col.ejemplo}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="instruction-alert">
                <FaExclamationTriangle />
                <div>
                  <strong>Importante:</strong>
                  <ul>
                    <li>
                      Todos los cupos serán automáticamente de tipo "aereo"
                    </li>
                    <li>
                      Usa el formato completo de destinos: "Ciudad,
                      Provincia/Estado, País" (Ej: "Mendoza, Argentina")
                    </li>
                    <li>
                      Todas las fechas deben estar en formato AAAA-MM-DD
                      (2026-12-31)
                    </li>
                    <li>
                      La <strong>fecha origen</strong> es obligatoria (fecha del
                      vuelo)
                    </li>
                    <li>
                      La <strong>aerolínea</strong> es obligatoria
                    </li>
                    <li>
                      Los precios deben ser números sin símbolos ni puntos
                    </li>
                    <li>La cantidad debe ser un número entero positivo</li>
                    <li>
                      Si hay errores, NO se importará ningún cupo (todo o nada)
                    </li>
                  </ul>
                </div>
              </div>

              <button
                className="btn-secondary"
                onClick={downloadTemplate}
                style={{ width: "100%", marginTop: "1rem" }}
              >
                <FaDownload /> Descargar Plantilla de Ejemplo
              </button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}

          <div className="file-upload-zone">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              id="excel-file"
              style={{ display: "none" }}
            />
            <label htmlFor="excel-file" className="file-upload-label">
              <FaUpload className="upload-icon" />
              <span className="upload-text">
                {file
                  ? file.name
                  : "Haz click o arrastra tu archivo Excel aquí"}
              </span>
              {file && (
                <span className="upload-success">
                  <FaCheckCircle /> Archivo cargado correctamente
                </span>
              )}
            </label>
          </div>

          {preview.length > 0 && (
            <div className="preview-section">
              <div className="preview-header">
                <h3>
                  <FaCheckCircle style={{ color: "var(--success)" }} />
                  Vista previa ({preview.length} cupos)
                </h3>
                <button
                  className="btn-link"
                  onClick={() => {
                    setPreview([]);
                    setFile(null);
                    setShowInstructions(true);
                  }}
                >
                  Cambiar archivo
                </button>
              </div>

              <div className="preview-table-container">
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Aerolínea</th>
                      <th>Origen</th>
                      <th>Destino</th>
                      <th>Fecha Vuelo</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.aerolinea}</td>
                        <td>{row.origen}</td>
                        <td>{row.destino}</td>
                        <td>{row.fechaOrigen}</td>
                        <td>{row.cantidad}</td>
                        <td>${row.precioUnitario?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 5 && (
                  <p className="preview-more">
                    ... y {preview.length - 5} cupos más
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className="btn-primary"
            onClick={handleImport}
            disabled={loading || preview.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span> Importando...
              </>
            ) : (
              <>
                <FaUpload /> Importar {preview.length} Cupos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
