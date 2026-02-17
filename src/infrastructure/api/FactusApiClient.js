import axios from 'axios';

/**
 * Cliente API para Factus.co
 * Configurado con interceptores profesionales para gestión de tokens.
 */
const FactusApiClient = axios.create({
    baseURL: 'https://api.factus.co/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor para añadir el Bearer Token automáticamente
FactusApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('factus_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar renovar el token si expira (401)
FactusApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Aquí iría la lógica para refrescar el token si la API lo permite
            // Por ahora, redirigir a login o emitir un evento de sesión expirada
            console.warn('Sesión expirada o token inválido.');
        }
        return Promise.reject(error);
    }
);

export default FactusApiClient;
