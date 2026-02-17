/**
 * Entidad de Producto / Ítem de Factura
 */
export class Product {
    constructor({
        code,
        name,
        price,
        quantity = 1,
        taxId = 1, // 1: IVA
        taxAmount = 0,
        unitId = 94, // 94: Unidad
    }) {
        this.code = code;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.taxId = taxId;
        this.taxAmount = taxAmount;
        this.unitId = unitId;
    }
}
