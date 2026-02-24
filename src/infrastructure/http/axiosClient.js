import axios from 'axios';

/**
 * Cliente HTTP Base (Axios)
 * Configurado para apuntar al Proxy de Vite y solucionar problemas de CORS.
 * Incluye auto-refresh del token cuando expira (401).
 */
export const axiosClient = axios.create({
    baseURL: '',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Flag para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * Auto re-authenticate using env credentials
 */
async function refreshToken() {
    const clientId = import.meta.env.VITE_FACTUS_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_FACTUS_CLIENT_SECRET;
    const email = import.meta.env.VITE_FACTUS_EMAIL;
    const password = import.meta.env.VITE_FACTUS_PASSWORD;

    if (!clientId || !email) {
        throw new Error('No hay credenciales para re-autenticar.');
    }

    console.log('[axiosClient] Token expirado. Re-autenticando automáticamente...');

    const response = await axios.post('/oauth/token', {
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: email,
        password: password
    }, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });

    const newToken = response.data?.access_token;
    if (newToken) {
        sessionStorage.setItem('factus_access_token', newToken);
        console.log('[axiosClient] ✅ Token renovado exitosamente.');
        return newToken;
    }

    throw new Error('No se pudo renovar el token.');
}

/**
 * Request Interceptor — Inyecta Bearer token
 */
axiosClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('factus_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor — Auto-refresh en 401
 */
axiosClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Si es 401 y NO es el endpoint de OAuth (evita loop infinito)
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/oauth/')) {
            if (isRefreshing) {
                // Si ya estamos refreshing, encolar esta request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosClient(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Si el refresh falla, limpiar sesión
                sessionStorage.removeItem('factus_access_token');
                console.error('[axiosClient] ❌ No se pudo renovar el token. Requiere re-login.');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Logging de otros errores
        if (error.response) {
            console.error('[API ERROR]', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('[NETWORK ERROR] Sin respuesta del servidor');
        }
        return Promise.reject(error);
    }
);
