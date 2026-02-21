import { axiosClient } from '../http/axiosClient';

/**
 * Repositorio para la gestión de Rangos de Numeración.
 * Paso B: Obtener el ID del rango activo para la facturación.
 */
export class NumberingRangeRepository {
    async getActiveRangeId() {
        try {
            const response = await axiosClient.get('/v1/numbering-ranges');

            // La respuesta de Factus suele venir paginada o en un array "data".
            const ranges = response.data?.data || response.data || [];

            // Buscamos un rango que esté activo (is_active === 1). Toma el primero si no se especifica.
            const activeRange = ranges.find(r => r.is_active === 1 || r.is_active === true) || ranges[0];

            if (!activeRange || !activeRange.id) {
                throw new Error('No se encontró un rango de numeración activo en el Sandbox.');
            }

            return activeRange.id;
        } catch (error) {
            console.error('[NumberingRangeRepository] Error al obtener rangos:', error.response?.data || error.message);
            throw new Error('Fallo al obtener los rangos de numeración de la DIAN/Factus.');
        }
    }
}

export const numberingRangeRepository = new NumberingRangeRepository();
