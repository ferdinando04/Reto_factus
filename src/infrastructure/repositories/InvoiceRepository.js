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
            console.log('[InvoiceRepository] Payload construido correctamente.');

            // Paso C2: Enviamos a /v1/bills/validate
            const response = await axiosClient.post('/v1/bills/validate', payload);
            console.log('[InvoiceRepository] Factura emitida con éxito:', response);

            return response.data || response;

        } catch (error) {
            console.error('[InvoiceRepository] Error Grave en emisión:', error.response?.data || error.message);

            // Extracción amigable de errores para la vista
            let errorMessage = 'Ocurrió un error inesperado al validar ante la DIAN.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // Factus a veces responde con hash de errores de validación
                errorMessage = JSON.stringify(error.response.data.errors);
            }

            throw new Error(errorMessage);
        }
    }
}

export const invoiceRepository = new InvoiceRepository();
