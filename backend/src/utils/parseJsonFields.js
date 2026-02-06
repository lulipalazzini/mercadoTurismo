/**
 * Parsea campos JSON que pueden venir como strings (desde FormData)
 * y normaliza los datos para evitar errores en el frontend
 */

/**
 * Parsea un único item (objeto DB)
 * @param {Object} item - Objeto de la DB (paquete, auto, etc.)
 * @param {Array<string>} jsonFields - Nombres de campos que deberían ser arrays/objects
 * @returns {Object} Item con campos parseados
 */
const parseItemJsonFields = (item, jsonFields = []) => {
  if (!item) return item;

  const parsed = item.toJSON ? item.toJSON() : { ...item };

  jsonFields.forEach((field) => {
    if (parsed[field]) {
      // Si es string, intentar parsear
      if (typeof parsed[field] === "string") {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch (e) {
          // Si falla el parse, dejar como array vacío o valor por defecto
          parsed[field] = [];
        }
      }
      // Si no es array ni objeto, convertir a array vacío
      if (!Array.isArray(parsed[field]) && typeof parsed[field] !== "object") {
        parsed[field] = [];
      }
    } else {
      // Si el campo no existe, inicializarlo como array vacío
      parsed[field] = [];
    }
  });

  return parsed;
};

/**
 * Parsea múltiples items (array de resultados DB)
 * @param {Array<Object>} items - Array de objetos de la DB
 * @param {Array<string>} jsonFields - Nombres de campos que deberían ser arrays/objects
 * @returns {Array<Object>} Items con campos parseados
 */
const parseItemsJsonFields = (items, jsonFields = []) => {
  if (!Array.isArray(items)) return items;
  return items.map((item) => parseItemJsonFields(item, jsonFields));
};

/**
 * Parsea campos en req.body antes de crear/actualizar
 * @param {Object} data - Datos del request body
 * @param {Array<string>} jsonFields - Nombres de campos que deberían ser arrays/objects
 * @returns {Object} Data con campos parseados
 */
const parseRequestJsonFields = (data, jsonFields = []) => {
  const parsed = { ...data };

  jsonFields.forEach((field) => {
    if (parsed[field] && typeof parsed[field] === "string") {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch (e) {
        parsed[field] = [];
      }
    }
  });

  return parsed;
};

module.exports = {
  parseItemJsonFields,
  parseItemsJsonFields,
  parseRequestJsonFields,
};
