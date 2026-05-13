export const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export const getAuthHeaders = () => {
  const t = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (t && typeof t === 'string' && t.trim() && t.split('.').length === 3) {
    headers['Authorization'] = `Bearer ${t.trim()}`;
  }
  return headers;
};

export const apiFetch = async (endpoint, options = {}) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return response;
  } catch (error) {
    console.error('Error de red:', error);
    throw error;
  }
};