/**
 * Configuración centralizada de la API
 * Cambiar API_BASE_URL aquí para apuntar a otro servidor
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

let token = localStorage.getItem('token') || null;

export const setAuthToken = (newToken) => {
  if (newToken) {
    localStorage.setItem('token', newToken);
    token = newToken;
  } else {
    localStorage.removeItem('token');
    token = null;
  }
};

/**
 * Helper para construir headers con autenticación
 */
export const getAuthHeaders = () => {
  const t = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (t && typeof t === 'string' && t.trim() && t.split('.').length === 3) {
    headers['Authorization'] = `Bearer ${t.trim()}`;
  }
  return headers;
};

export const apiFetch = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && typeof token === 'string' && token.trim() && token.split('.').length === 3) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    setAuthToken(null);
    window.location.href = '/login';
  }

  return response;
};
