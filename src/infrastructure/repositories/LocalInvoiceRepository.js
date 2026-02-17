/**
 * Repositorio Local de Facturas
 * Implementa persistencia en localStorage para mantener un historial local.
 */
export const LocalInvoiceRepository = {
    save(invoiceResult) {
        const history = this.getAll();
        history.push({
            ...invoiceResult,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem('factus_history', JSON.stringify(history));
    },

    getAll() {
        const data = localStorage.getItem('factus_history');
        return data ? JSON.parse(data) : [];
    },

    clear() {
        localStorage.removeItem('factus_history');
    }
};
