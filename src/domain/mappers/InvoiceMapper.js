/**
 * Mapper de Facturas (Paso C - Preparación del Payload)
 * Centraliza la lógica de transformación: de Formulario React -> al esquema estricto de Factus API v1.
 */
export class InvoiceMapper {
    /**
     * Transforma los datos crudos en el payload oficial.
     * @param {Object} formData Datos estructurados en la UI (React Hook Form)
     * @param {number|string} numberingRangeId El ID del rango obtenido de Factus (Paso B)
     * @returns {Object} JSON estricto que espera la API
     */
    static toFactusPayload(formData, numberingRangeId) {
        return {
            numbering_range_id: numberingRangeId,
            reference_code: formData.reference_code || `FAC_${Date.now()}`, // Autogenerar si no aplica
            observation: formData.observation || "Factura generada desde Factus Nova",
            payment_form: formData.payment_form || "1", // 1 = Contado
            payment_due_date: formData.payment_due_date || new Date().toISOString().split('T')[0],
            payment_method_code: formData.payment_method_code || "10", // 10 = Efectivo
            billing_period: {
                start_date: formData.start_date || new Date().toISOString().split('T')[0],
                start_time: "00:00:00",
                end_date: formData.end_date || new Date().toISOString().split('T')[0],
                end_time: "23:59:59"
            },
            customer: {
                identification: formData.customer_identification,
                dv: formData.customer_dv || "3",
                company: formData.customer_company || "",
                trade_name: formData.customer_trade_name || "",
                names: formData.customer_names,
                address: formData.customer_address,
                email: formData.customer_email,
                phone: formData.customer_phone,
                legal_organization_id: formData.customer_legal_organization_id || "2", // 1=Jurídico, 2=Natural
                tribute_id: formData.customer_tribute_id || "21",
                identification_document_id: formData.customer_identification_document_id || "3", // 3=C.C.
                municipality_id: formData.customer_municipality_id
            },
            items: formData.items.map(item => ({
                code_reference: item.code_reference,
                name: item.name,
                quantity: item.quantity,
                discount_rate: item.discount_rate || 0,
                price: item.price,
                tax_rate: item.tax_rate || "19.00",
                unit_measure_id: item.unit_measure_id || 70, // 70 = Unidad universal
                standard_code_id: item.standard_code_id || 1,
                is_excluded: item.is_excluded || 0,
                tribute_id: item.tribute_id || 1, // 1 = IVA
                withholding_taxes: [] // Módulo opcional de retenciones
            }))
        };
    }
}
