/**
 * Puerto de Servicio de Autenticación
 * Define las operaciones que cualquier servicio de auth debe implementar.
 */
export class IAuthService {
    async login(clientId, clientSecret) {
        throw new Error('Metodo login() no implementado');
    }

    async refreshToken() {
        throw new Error('Metodo refreshToken() no implementado');
    }

    getAccessToken() {
        throw new Error('Metodo getAccessToken() no implementado');
    }

    isAuthenticated() {
        throw new Error('Metodo isAuthenticated() no implementado');
    }
}
