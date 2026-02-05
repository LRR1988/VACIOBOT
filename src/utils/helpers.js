// Funciones de ayuda para la aplicación Travabus

/**
 * Calcula la comisión basada en el precio y el mínimo
 * @param {number} price - Precio del servicio
 * @returns {number} - Monto de la comisión
 */
export const calculateCommission = (price) => {
  const commission = price * 0.05; // 5%
  return Math.max(commission, 25); // mínimo 25€
};

/**
 * Formateador de fechas
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Formateador de precios
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Moneda (por defecto EUR)
 * @returns {string} - Precio formateado
 */
export const formatPrice = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} - Si es válido o no
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Genera un ID único
 * @returns {string} - ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Verifica si un usuario es administrador
 * @param {object} user - Usuario a verificar
 * @returns {boolean} - Si es administrador o no
 */
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} - Cadena capitalizada
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Verifica si una cadena es un número
 * @param {*} value - Valor a verificar
 * @returns {boolean} - Si es un número o no
 */
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};