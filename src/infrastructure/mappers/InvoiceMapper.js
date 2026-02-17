/**
 * Mapeador de Factura
 * Convierte nuestra entidad profesional de Dominio al JSON espagueti 
 * que requiere la API de Factus.
 */
export const InvoiceMapper = {
    toFactusJSON(invoice) {
        return {
            numbering_range_id: invoice.numberingRangeId,
            reference_code: `INV-${Date.now()}`,
            observation: invoice.notes,
            payment_form: invoice.paymentForm,
            payment_method_code: invoice.paymentMethod,
            customer: {
                identification_type_id: invoice.customer.identificationTypeId,
                identification: invoice.customer.identification,
                names: invoice.customer.name,
                email: invoice.customer.email,
                phone: invoice.customer.phone,
                address: invoice.customer.address,
                municipality_id: invoice.customer.municipalityId,
            },
            items: invoice.items.map(item => ({
                code: item.code,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                tax_id: item.taxId,
                unit_measure_id: item.unitId,
                standard_code_id: 1, // Codigo estandar por defecto
            }))
        };
    }
};
