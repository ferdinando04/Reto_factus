import { axiosClient } from '../http/axiosClient';
import { numberingRangeRepository } from './NumberingRangeRepository';
import { InvoiceMapper } from '../../domain/mappers/InvoiceMapper';

/**
 * Repositorio de Facturación Orquestador.
 * Coordina los servicios (Rangos + Mapper) y hace POST a la DIAN.
 */
export class InvoiceRepository {
    /**
     * Emite una factura electrónica validada.
     * @param {Object} datosFormulario 
     */
    async emitirFactura(datosFormulario) {
        try {
            console.log('[InvoiceRepository] Iniciando proceso de emisión DIAN...');

            // Paso B: Obtenemos el ID del Rango de Numeración
            const rangeId = await numberingRangeRepository.getActiveRangeId();
            console.log(`[InvoiceRepository] Rango asignado: ${rangeId}`);

            // Paso C1: Mapeamos los datos al JSON de Factus
            const payload = InvoiceMapper.toFactusPayload(datosFormulario, rangeId);
            console.log('[InvoiceRepository] Payload completo:', JSON.stringify(payload, null, 2));

            // Paso C2: Enviamos a /v1/bills/validate
            const response = await axiosClient.post('/v1/bills/validate', payload);
            console.log('[InvoiceRepository] Factura emitida con éxito:', response);

            return response.data || response;

        } catch (error) {
            console.error('[InvoiceRepository] Error completo:', error);
            console.error('[InvoiceRepository] Response data:', error.response?.data);

            // Extraer TODOS los detalles del error
            let errorMessage = 'Ocurrió un error inesperado al validar ante la DIAN.';
            let fieldErrors = null;
            const statusCode = error.response?.status || null;

            // El axiosClient interceptor ya desenvuelve response.data en success
            // Pero en error, error.response.data contiene el body raw
            const apiData = error.response?.data;

            if (apiData) {
                // Mensaje principal
                if (apiData.message) {
                    errorMessage = apiData.message;
                }
                // Errores por campo de validación
                if (apiData.errors && typeof apiData.errors === 'object') {
                    fieldErrors = apiData.errors;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Enriquecer el error para que el modal lo muestre correctamente
            const enrichedError = new Error(errorMessage);
            enrichedError.details = {
                message: errorMessage,
                errors: fieldErrors,
                statusCode: statusCode
            };
            throw enrichedError;
        }
    }
}

export const invoiceRepository = new InvoiceRepository();
