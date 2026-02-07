/**
 * Helper para construir URLs de imágenes desde el backend
 */

import { BASE_URL } from '../config/api.config.js';

/**
 * Convierte una ruta de imagen relativa a URL completa
 * @param {string|undefined} imagePath - Ruta relativa de la imagen (ej: "/uploads/imagen.jpg")
 * @returns {string|null} URL completa o null si no hay imagen
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Si ya es una URL completa, devolverla tal cual
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  // Construir URL completa
  // Asegurar que la ruta empiece con /
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${path}`;
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
