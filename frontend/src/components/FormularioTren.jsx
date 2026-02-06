import React, { useState, useEffect } from "react";
import trenesService from "../services/trenesService";
import "../styles/dashboard.css";

export default function FormularioTren({ trenId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    tipo: "regional",
    clase: "economica",
    origen: "",
    destino: "",
    duracionHoras: "",
    distanciaKm: "",
    frecuenciaSemanal: "",
    horarioSalida: "",
    horarioLlegada: "",
    precio: "",
    moneda: "USD",
    descripcion: "",
    paradas: [],
    servicios: [],
    politicaCancelacion: "",
    requisitos: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paradaInput, setParadaInput] = useState("");
  const [servicioInput, setServicioInput] = useState("");

  useEffect(() => {
    if (trenId) {
      loadTren();
    }
  }, [trenId]);

  const loadTren = async () => {
    try {
      const data = await trenesService.getTren(trenId);
      setFormData({
        nombre: data.nombre || "",
        empresa: data.empresa || "",
        tipo: data.tipo || "regional",
        clase: data.clase || "economica",
        origen: data.origen || "",
        destino: data.destino || "",
        duracionHoras: data.duracionHoras || "",
        distanciaKm: data.distanciaKm || "",
        frecuenciaSemanal: data.frecuenciaSemanal || "",
        horarioSalida: data.horarioSalida || "",
        horarioLlegada: data.horarioLlegada || "",
        precio: data.precio || "",
        moneda: data.moneda || "USD",
        descripcion: data.descripcion || "",
        paradas: data.paradas || [],
        servicios: data.servicios || [],
        politicaCancelacion: data.politicaCancelacion || "",
        requisitos: data.requisitos || "",
      });
    } catch (err) {
      setError("Error al cargar el tren");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddParada = () => {
    if (paradaInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        paradas: [...prev.paradas, paradaInput.trim()],
      }));
      setParadaInput("");
    }
  };

  const handleRemoveParada = (index) => {
    setFormData((prev) => ({
      ...prev,
      paradas: prev.paradas.filter((_, i) => i !== index),
    }));
  };

  const handleAddServicio = () => {
    if (servicioInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        servicios: [...prev.servicios, servicioInput.trim()],
      }));
      setServicioInput("");
    }
  };

  const handleRemoveServicio = (index) => {
    setFormData((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (trenId) {
        await trenesService.updateTren(trenId, formData);
      } else {
        await trenesService.createTren(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el tren");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{trenId ? "Editar Tren" : "Nuevo Tren"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre del Servicio *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Tren de Alta Velocidad Madrid-Barcelona"
            />
          </div>

          <div className="form-group">
            <label>Empresa Operadora *</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              required
              placeholder="Ej: Renfe, Trenitalia, etc"
            />
          </div>

          <div className="form-group">
            <label>Tipo de Tren *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="alta-velocidad">Alta Velocidad</option>
              <option value="regional">Regional</option>
              <option value="turistico">Turístico</option>
              <option value="nocturno">Nocturno</option>
              <option value="suburbano">Suburbano</option>
            </select>
          </div>

          <div className="form-group">
            <label>Clase *</label>
            <select
              name="clase"
              value={formData.clase}
              onChange={handleChange}
              required
            >
              <option value="economica">Económica</option>
              <option value="primera">Primera Clase</option>
              <option value="ejecutiva">Ejecutiva</option>
              <option value="premium">Premium</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estación de Origen *</label>
            <input
              type="text"
              name="origen"
              value={formData.origen}
              onChange={handleChange}
              required
              placeholder="Ej: Madrid Atocha"
            />
          </div>

          <div className="form-group">
            <label>Estación de Destino *</label>
            <input
              type="text"
              name="destino"
              value={formData.destino}
              onChange={handleChange}
              required
              placeholder="Ej: Barcelona Sants"
            />
          </div>

          <div className="form-group">
            <label>Duración (horas) *</label>
            <input
              type="number"
              name="duracionHoras"
              value={formData.duracionHoras}
              onChange={handleChange}
              required
              step="0.1"
              min="0.1"
              placeholder="Ej: 2.5"
            />
          </div>

          <div className="form-group">
            <label>Distancia (km)</label>
            <input
              type="number"
              name="distanciaKm"
              value={formData.distanciaKm}
              onChange={handleChange}
              min="1"
              placeholder="Ej: 620"
            />
          </div>

          <div className="form-group">
            <label>Frecuencia Semanal</label>
            <input
              type="number"
              name="frecuenciaSemanal"
              value={formData.frecuenciaSemanal}
              onChange={handleChange}
              min="1"
              max="50"
              placeholder="Salidas por semana"
            />
          </div>

          <div className="form-group">
            <label>Horario de Salida</label>
            <input
              type="time"
              name="horarioSalida"
              value={formData.horarioSalida}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Horario de Llegada</label>
            <input
              type="time"
              name="horarioLlegada"
              value={formData.horarioLlegada}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Precio *</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="Ej: 89.90"
            />
          </div>

          <div className="form-group">
            <label>Moneda *</label>
            <select
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ARS">ARS</option>
              <option value="BRL">BRL</option>
              <option value="CLP">CLP</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            placeholder="Describe el servicio, comodidades, etc..."
          />
        </div>

        <div className="form-group full-width">
          <label>Paradas Intermedias</label>
          <div className="array-input">
            <input
              type="text"
              value={paradaInput}
              onChange={(e) => setParadaInput(e.target.value)}
              placeholder="Agregar parada..."
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddParada())
              }
            />
            <button type="button" onClick={handleAddParada} className="btn-add">
              Agregar
            </button>
          </div>
          <div className="tags-list">
            {formData.paradas.map((parada, index) => (
              <span key={index} className="tag">
                {parada}
                <button type="button" onClick={() => handleRemoveParada(index)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label>Servicios Incluidos</label>
          <div className="array-input">
            <input
              type="text"
              value={servicioInput}
              onChange={(e) => setServicioInput(e.target.value)}
              placeholder="Ej: WiFi gratuito, Comida, Asientos reclinables..."
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddServicio())
              }
            />
            <button
              type="button"
              onClick={handleAddServicio}
              className="btn-add"
            >
              Agregar
            </button>
          </div>
          <div className="tags-list">
            {formData.servicios.map((servicio, index) => (
              <span key={index} className="tag">
                {servicio}
                <button
                  type="button"
                  onClick={() => handleRemoveServicio(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group full-width">
          <label>Política de Cancelación</label>
          <textarea
            name="politicaCancelacion"
            value={formData.politicaCancelacion}
            onChange={handleChange}
            rows="3"
            placeholder="Describe la política de cancelación y reembolsos..."
          />
        </div>

        <div className="form-group full-width">
          <label>Requisitos</label>
          <textarea
            name="requisitos"
            value={formData.requisitos}
            onChange={handleChange}
            rows="3"
            placeholder="Documentos necesarios, restricciones, etc..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : trenId ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
