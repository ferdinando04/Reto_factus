import { axiosClient } from '../http/axiosClient';

/**
 * Repositorio para la gestión de Rangos de Numeración.
 * Paso B: Obtener el ID del rango activo para la facturación.
 * 
 * La API de Factus devuelve: { status, message, data: { data: [...rangos], pagination: {...} } }
 * El interceptor de axiosClient ya desenvuelve un nivel (response.data),
 * entonces aquí recibimos: { status, message, data: { data: [...], pagination: {...} } }
 * O directamente: { data: [...], pagination: {...} }
 */
export class NumberingRangeRepository {
    async getActiveRangeId() {
        try {
            const response = await axiosClient.get('/v1/numbering-ranges');

            console.log('[NumberingRangeRepository] Response raw:', JSON.stringify(response).substring(0, 200));

            // Extraer el array de rangos de la estructura anidada
            let ranges = [];
            if (Array.isArray(response)) {
                ranges = response;
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                // { data: { data: [...] } }
                ranges = response.data.data;
            } else if (response?.data && Array.isArray(response.data)) {
                // { data: [...] }
                ranges = response.data;
            } else if (Array.isArray(response?.data)) {
                ranges = response.data;
            }

            console.log('[NumberingRangeRepository] Rangos encontrados:', ranges.length);
            ranges.forEach(r => console.log(`  → ID:${r.id} | ${r.document} | Prefijo:${r.prefix} | Activo:${r.is_active}`));

            // PRIORIDAD 1: Buscar "Factura de Venta" activa
            const invoiceRange = ranges.find(r =>
                r.document === 'Factura de Venta' &&
                (r.is_active === 1 || r.is_active === true)
            );

            if (invoiceRange) {
                console.log(`[NumberingRangeRepository] ✅ Rango FACTURA: ID=${invoiceRange.id}, Prefijo=${invoiceRange.prefix}`);
                return invoiceRange.id;
            }

            // PRIORIDAD 2: Buscar por prefijo SETP/SETT (sandbox)
            const fallback = ranges.find(r =>
                (r.prefix === 'SETP' || r.prefix === 'SETT') &&
                (r.is_active === 1 || r.is_active === true)
            );

            if (fallback) {
                console.log(`[NumberingRangeRepository] ⚠️ Usando rango por prefijo: ID=${fallback.id}`);
                return fallback.id;
            }

            // PRIORIDAD 3: Hacer log de todos los rangos para debugging si ninguno funciona
            console.warn('[NumberingRangeRepository] No se encontró rango de Factura de Venta. Rangos disponibles:', ranges);

            if (ranges.length > 0) {
                // Tomar cualquier rango activo excluyendo Notas
                const any = ranges.find(r =>
                    !r.document?.includes('Nota') &&
                    !r.document?.includes('Ajuste') &&
                    (r.is_active === 1 || r.is_active === true)
                );
                if (any) return any.id;
                return ranges[0].id; // último recurso
            }

            throw new Error('No se encontró ningún rango de numeración activo.');
        } catch (error) {
            console.error('[NumberingRangeRepository] Error completo:', error);
            throw new Error(`Fallo al obtener rangos: ${error.message}`);
        }
    }
}

export const numberingRangeRepository = new NumberingRangeRepository();
