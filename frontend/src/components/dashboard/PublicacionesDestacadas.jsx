import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaSave,
  FaImage,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";
import { API_URL } from "../../config/api.config";
import { getFirstImageUrl } from "../../utils/imageUtils";
import AlertModal from "../common/AlertModal";

const TIPO_LABELS = {
  paquete: "Paquete",
  alojamiento: "Alojamiento",
  auto: "Auto",
  transfer: "Transfer",
  crucero: "Crucero",
  excursion: "Excursión",
  salidaGrupal: "Salida Grupal",
  circuito: "Circuito",
  tren: "Tren",
  seguro: "Seguro",
};

const TIPO_COLORS = {
  paquete: "#3b82f6",
  alojamiento: "#10b981",
  auto: "#f59e0b",
  transfer: "#8b5cf6",
  crucero: "#06b6d4",
  excursion: "#ec4899",
  salidaGrupal: "#f97316",
  circuito: "#6366f1",
  tren: "#14b8a6",
  seguro: "#ef4444",
};

export default function PublicacionesDestacadas() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [destacadasSeleccionadas, setDestacadasSeleccionadas] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    loadPublicaciones();
  }, []);

  const loadPublicaciones = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const response = await fetch(`${API_URL}/admin/publicaciones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar publicaciones");
      }

      const data = await response.json();
      setPublicaciones(data.publicaciones || []);

      // Pre-seleccionar las publicaciones que ya están destacadas
      const yaDestacadas = (data.publicaciones || [])
        .filter((p) => p.destacado)
        .map((p) => ({ tipo: p.tipo, id: p.id }));
      setDestacadasSeleccionadas(yaDestacadas);
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
      setError(err.message || "Error al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDestacada = (publicacion) => {
    const existe = destacadasSeleccionadas.some(
      (d) => d.tipo === publicacion.tipo && d.id === publicacion.id,
    );

    if (existe) {
      // Remover
      setDestacadasSeleccionadas(
        destacadasSeleccionadas.filter(
          (d) => !(d.tipo === publicacion.tipo && d.id === publicacion.id),
        ),
      );
    } else {
      // Agregar
      setDestacadasSeleccionadas([
        ...destacadasSeleccionadas,
        { tipo: publicacion.tipo, id: publicacion.id },
      ]);
    }
  };

  const isDestacada = (publicacion) => {
    return destacadasSeleccionadas.some(
      (d) => d.tipo === publicacion.tipo && d.id === publicacion.id,
    );
  };

  const handleGuardar = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      const response = await fetch(
        `${API_URL}/admin/publicaciones-destacadas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destacadas: destacadasSeleccionadas,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error al guardar publicaciones destacadas");
      }

      const data = await response.json();

      setAlertType("success");
      setAlertMessage(
        `✅ Publicaciones destacadas actualizadas correctamente (${data.actualizadas} publicaciones)`,
      );
      setShowAlert(true);

      // Recargar publicaciones para reflejar los cambios
      await loadPublicaciones();
    } catch (err) {
      console.error("Error al guardar:", err);
      setAlertType("error");
      setAlertMessage(err.message || "Error al guardar cambios");
      setShowAlert(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = () => {
    const filtradas = getPublicacionesFiltradas();
    const todasSeleccionadas = filtradas.every((p) => isDestacada(p));

    if (todasSeleccionadas) {
      // Desmarcar todas las filtradas
      const filteredKeys = filtradas.map((p) => ({ tipo: p.tipo, id: p.id }));
      setDestacadasSeleccionadas(
        destacadasSeleccionadas.filter(
          (d) => !filteredKeys.some((f) => f.tipo === d.tipo && f.id === d.id),
        ),
      );
    } else {
      // Marcar todas las filtradas
      const nuevasDestacadas = [...destacadasSeleccionadas];
      filtradas.forEach((p) => {
        if (!isDestacada(p)) {
          nuevasDestacadas.push({ tipo: p.tipo, id: p.id });
        }
      });
      setDestacadasSeleccionadas(nuevasDestacadas);
    }
  };

  const getPublicacionesFiltradas = () => {
    return publicaciones.filter((pub) => {
      const matchSearch =
        pub.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.descripcion &&
          pub.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchTipo = !tipoFilter || pub.tipo === tipoFilter;
      return matchSearch && matchTipo;
    });
  };

  // Obtener tipos únicos
  const tiposUnicos = [...new Set(publicaciones.map((p) => p.tipo))].sort();

  const publicacionesFiltradas = getPublicacionesFiltradas();

  if (loading) {
    return (
      <div className="section-container">
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div
            className="spinner"
            style={{
              margin: "0 auto 1rem",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #4a5568",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "#718096" }}>Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container">
        <div className="alert alert-danger" style={{ margin: "2rem" }}>
          {error}
          <button
            onClick={loadPublicaciones}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <FaStar className="section-icon" />
            Publicaciones Destacadas
          </h2>
          <p className="section-subtitle">
            Selecciona las publicaciones que se mostrarán destacadas en el Hero
            principal
          </p>
        </div>
        <button
          onClick={handleGuardar}
          disabled={saving}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
          }}
        >
          <FaSave />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
          <FaSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 0.75rem 0.75rem 2.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div style={{ minWidth: "200px", position: "relative" }}>
          <FaFilter
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 0.75rem 0.75rem 2.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            <option value="">Todos los tipos</option>
            {tiposUnicos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_LABELS[tipo] || tipo}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSelectAll}
          className="btn-secondary"
          style={{ whiteSpace: "nowrap" }}
        >
          <FaCheckCircle style={{ marginRight: "0.5rem" }} />
          {publicacionesFiltradas.every((p) => isDestacada(p))
            ? "Desmarcar todas"
            : "Marcar todas"}
        </button>
      </div>

      {/* Contador */}
      <div
        style={{
          padding: "1rem",
          background: "#f3f4f6",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600 }}>
          {publicacionesFiltradas.length} publicaciones encontradas
        </span>
        <span style={{ color: "#f59e0b", fontWeight: 600 }}>
          {destacadasSeleccionadas.length} destacadas seleccionadas
        </span>
      </div>

      {/* Lista de publicaciones */}
      {publicacionesFiltradas.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#9ca3af",
          }}
        >
          <p>No se encontraron publicaciones con los filtros aplicados</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {publicacionesFiltradas.map((pub) => {
            const imageUrl = getFirstImageUrl(pub.imagenes);
            const esDestacada = isDestacada(pub);

            return (
              <div
                key={`${pub.tipo}-${pub.id}`}
                onClick={() => handleToggleDestacada(pub)}
                style={{
                  border: esDestacada
                    ? "3px solid #f59e0b"
                    : "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: esDestacada ? "#fffbeb" : "white",
                  position: "relative",
                }}
                className="hover-card"
              >
                {/* Badge de destacado */}
                {esDestacada && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      background: "#f59e0b",
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <FaStar /> Destacada
                  </div>
                )}

                {/* Imagen */}
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    background: imageUrl
                      ? `url(${imageUrl}) center/cover`
                      : "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!imageUrl && (
                    <FaImage style={{ fontSize: "3rem", color: "#9ca3af" }} />
                  )}
                </div>

                {/* Contenido */}
                <div style={{ padding: "1rem" }}>
                  {/* Tipo */}
                  <div
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      background: TIPO_COLORS[pub.tipo] || "#6b7280",
                      color: "white",
                    }}
                  >
                    {TIPO_LABELS[pub.tipo] || pub.tipo}
                  </div>

                  {/* Nombre */}
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      color: "#1f2937",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pub.nombre}
                  </h3>

                  {/* Descripción */}
                  {pub.descripcion && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginBottom: "0.75rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {pub.descripcion}
                    </p>
                  )}

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        color: "#059669",
                        fontWeight: 600,
                      }}
                    >
                      <FaDollarSign />$
                      {parseFloat(pub.precio || 0).toLocaleString("es-AR")}
                    </div>
                    {pub.vendedor && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                        }}
                      >
                        {pub.vendedor.nombre}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Modal */}
      {showAlert && (
        <AlertModal
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          type={alertType}
        />
      )}

      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
