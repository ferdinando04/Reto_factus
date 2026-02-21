import { axiosClient } from '../http/axiosClient';

/**
 * AuthRepository (Adapter de Autenticación)
 * Encargado de obtener el token (Paso A) e implementando la interfaz IAuthService.
 */
export class AuthRepository {
    async login(clientId, clientSecret, email, password) {
        try {
            // Documentación de Factus: Endpoint para oauth (A veces es /oauth/token u /v1/oauth/token)
            const response = await axiosClient.post('/oauth/token', {
                grant_type: 'password',
                client_id: clientId,
                client_secret: clientSecret,
                username: email,
                password: password
            });

            // Asumiendo que Factus responde con { access_token: '...', refresh_token: '...' }
            const { access_token } = response.data || response; // axiosClient interceptor ya desenvuelve a data o dependemos del formato

            if (access_token) {
                // Almaceno en sessionStorage (Podría ser localStorage o Memory, pero sessionStorage previene persitencias eternas de login)
                sessionStorage.setItem('factus_access_token', access_token);
                return access_token;
            }

            throw new Error('No access token in response');
        } catch (error) {
            console.error('[AuthRepository] Error obtaining token:', error.response?.data || error.message);
            throw new Error('Autenticación fallida con la API de Factus');
        }
    }

    getAccessToken() {
        return sessionStorage.getItem('factus_access_token');
    }

    isAuthenticated() {
        return !!this.getAccessToken();
    }

    logout() {
        sessionStorage.removeItem('factus_access_token');
    }
}

// Singleton de preferencia para inyectar si no usamos contenedores de DI
export const authRepository = new AuthRepository();
