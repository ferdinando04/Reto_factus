/**
 * Entidad de Factura
 * Define la estructura base de una factura electrónica.
 */
export class Invoice {
    constructor({
        id = null,
        numberingRangeId,
        customer,
        items = [],
        paymentForm = 1, // 1: Contado, 2: Crédito
        paymentMethod = 10, // 10: Efectivo, etc.
        notes = '',
    }) {
        this.id = id;
        this.numberingRangeId = numberingRangeId;
        this.customer = customer;
        this.items = items;
        this.paymentForm = paymentForm;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
        this.createdAt = new Date();
    }

    getTotal() {
        return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    getTaxTotal() {
        return this.items.reduce((acc, item) => acc + (item.taxAmount * item.quantity), 0);
    }
}
