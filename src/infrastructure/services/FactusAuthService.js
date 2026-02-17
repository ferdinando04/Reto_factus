import axios from 'axios';
import { IAuthService } from '../../application/ports/IAuthService.js';

/**
 * Implementación de Autenticación para Factus
 */
export class FactusAuthService extends IAuthService {
    constructor() {
        super();
        this.authUrl = 'https://api.factus.co/oauth/token';
    }

    async login(clientId, clientSecret) {
        try {
            const response = await axios.post(this.authUrl, {
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            });

            const { access_token, expires_in, refresh_token } = response.data;

            // Persistencia segura (en este caso localStorage para el demo)
            localStorage.setItem('factus_token', access_token);
            localStorage.setItem('factus_refresh_token', refresh_token);

            return response.data;
        } catch (error) {
            console.error('Error en login de Factus:', error.response?.data || error.message);
            throw error;
        }
    }

    getAccessToken() {
        return localStorage.getItem('factus_token');
    }

    isAuthenticated() {
        return !!this.getAccessToken();
    }

    logout() {
        localStorage.removeItem('factus_token');
        localStorage.removeItem('factus_refresh_token');
    }
}

export const authService = new FactusAuthService();
