import FactusApiClient from '../../infrastructure/api/FactusApiClient.js';

/**
 * Servicio de Metadatos
 * Se encarga de obtener la información necesaria para llenar los formularios
 * cumpliendo con los estándares de la DIAN.
 */
export const MetadataService = {
    /**
     * Obtiene la lista de municipios (Códigos DANE)
     */
    async getMunicipalities() {
        try {
            const response = await FactusApiClient.get('/municipalities');
            return response.data;
        } catch (error) {
            console.error('Error al obtener municipios:', error);
            throw error;
        }
    },

    /**
     * Obtiene los tipos de documentos de identidad
     */
    async getIdentificationTypes() {
        try {
            const response = await FactusApiClient.get('/identification-types');
            return response.data;
        } catch (error) {
            console.error('Error al obtener tipos de identificación:', error);
            throw error;
        }
    },

    /**
     * Obtiene los tipos de impuestos
     */
    async getTaxTypes() {
        try {
            const response = await FactusApiClient.get('/tax-types');
            return response.data;
        } catch (error) {
            console.error('Error al obtener tipos de impuestos:', error);
            throw error;
        }
    }
};
