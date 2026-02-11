/**
 * Helper para construir URLs de imágenes desde el backend
 */

import { BASE_URL } from '../config/api.config.js';

const extractImagePath = (imagePath) => {
  if (!imagePath) return null;

  if (typeof imagePath === "string") {
    return imagePath.trim();
  }

  if (typeof imagePath === "object") {
    if (typeof imagePath.url === "string") {
      return imagePath.url.trim();
    }
    if (typeof imagePath.path === "string") {
      return imagePath.path.trim();
    }
  }

  return null;
};

const normalizeUploadsPath = (rawPath) => {
  if (!rawPath) return null;

  // Protocol-relative URL
  if (rawPath.startsWith("//")) {
    const abs = `https:${rawPath}`;
    const uploadsIndex = abs.indexOf("/uploads/");
    if (uploadsIndex !== -1) return abs.slice(uploadsIndex);
    return abs.replace("/api/uploads/", "/uploads/");
  }

  // Absolute URL
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    const uploadsIndex = rawPath.indexOf("/uploads/");
    if (uploadsIndex !== -1) return rawPath.slice(uploadsIndex);
    return rawPath.replace("/api/uploads/", "/uploads/");
  }

  // If the value already contains /uploads/, normalize from there
  const uploadsIndex = rawPath.indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    return rawPath.slice(uploadsIndex);
  }

  // Handle cases like "uploads/..." or "api/uploads/..."
  let path = rawPath.replace(/^\/?api\/uploads\//, "/uploads/");
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return path;
};

/**
 * Convierte una ruta de imagen relativa a URL completa
 * @param {string|undefined} imagePath - Ruta relativa de la imagen (ej: "/uploads/imagen.jpg")
 * @returns {string|null} URL completa o null si no hay imagen
 */
export const getImageUrl = (imagePath) => {
  const rawPath = extractImagePath(imagePath);
  if (!rawPath) return null;

  // Si ya es una URL completa, devolverla tal cual
  if (rawPath.startsWith("data:")) return rawPath;

  // Normalizar paths raros (ej: ".mercadoturismo.ar/api/uploads/...")
  const normalizedPath = normalizeUploadsPath(rawPath);
  if (!normalizedPath) return null;

  // Construir URL completa (si normalizedPath es relativa)
  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
    return normalizedPath;
  }

  return `${BASE_URL}${normalizedPath}`;
};

/**
 * Convierte array de rutas de imágenes a URLs completas
 * @param {Array<string>|undefined} imagePaths - Array de rutas relativas
 * @returns {Array<string>} Array de URLs completas
 */
export const getImageUrls = (imagePaths) => {
  if (!imagePaths || !Array.isArray(imagePaths)) return [];
  return imagePaths.map(getImageUrl).filter((url) => url !== null);
};

/**
 * Obtiene la primera imagen de un array o una imagen individual
 * @param {Array<string>|string|undefined} images - Array de rutas o ruta única
 * @returns {string|null} URL completa de la primera imagen o null
 */
export const getFirstImageUrl = (images) => {
  if (!images) return null;

  if (Array.isArray(images)) {
    return images.length > 0 ? getImageUrl(images[0]) : null;
  }

  return getImageUrl(images);
};
