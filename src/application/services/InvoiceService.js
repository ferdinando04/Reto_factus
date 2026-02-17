import FactusApiClient from '../../infrastructure/api/FactusApiClient.js';
import { InvoiceMapper } from '../../infrastructure/mappers/InvoiceMapper.js';

/**
 * Servicio de Facturación
 * Orquesta la creación, envío y consulta de facturas.
 */
export const InvoiceService = {
    /**
     * Envía una factura a la API de Factus
     * @param {Invoice} invoice - Instancia de la entidad Invoice
     */
    async sendInvoice(invoice) {
        try {
            const payload = InvoiceMapper.toFactusJSON(invoice);
            const response = await FactusApiClient.post('/bills', payload);

            return response.data;
        } catch (error) {
            console.error('Error al enviar la factura:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Consulta una factura por su ID
     */
    async getInvoiceById(id) {
        try {
            const response = await FactusApiClient.get(`/bills/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al consultar factura:', error);
            throw error;
        }
    },

    /**
     * Descarga el PDF/XML de una factura
     */
    async downloadInvoiceFile(id) {
        try {
            const response = await FactusApiClient.get(`/bills/download/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            throw error;
        }
    }
};
