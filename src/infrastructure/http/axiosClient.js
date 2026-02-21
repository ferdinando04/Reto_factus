import axios from 'axios';

/**
 * Cliente HTTP Base (Axios)
 * Configurado para apuntar al Proxy de Vite y solucionar problemas de CORS.
 */
export const axiosClient = axios.create({
    // El baseURL es relativo para que el proxy en vite.config.js lo intercepte.
    // Si la llamada empieza con /v1 o /oauth, Vite la redirigirá a Factus.
    baseURL: '',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

/**
 * Request Interceptor
 * Inyecta el token Bearer en cada petición automáticamente si existe en memoria (sessionStorage).
 */
axiosClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('factus_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Global error handling y token refresh (si la API lo permite/retorna 401).
 */
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Logging centralizado de errores API
        if (error.response) {
            console.error('[API ERROR]', error.response.status, error.response.data);

            // Si retorna 401 Unauthorized, podríamos forzar re-login aquí
            if (error.response.status === 401) {
                // sessionStorage.removeItem('factus_access_token');
                // Redirigir a login o despachar evento
                console.warn('[AUTH] Token expirado o inválido.');
            }
        } else if (error.request) {
            console.error('[NETWORK ERROR] No response received', error.request);
        } else {
            console.error('[REQ CONFIG ERROR]', error.message);
        }
        return Promise.reject(error);
    }
);
