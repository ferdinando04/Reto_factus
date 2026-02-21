import { axiosClient } from '../http/axiosClient';

/**
 * Repositorio para la gestión de Clientes (Customers).
 * Se encarga de la comunicación con la API de Factus para la creación y consulta de clientes.
 */
export class CustomerRepository {
    /**
     * Envía una petición a la DIAN/Factus para registrar un nuevo cliente.
     * @param {Object} customerData Objeto con los datos capturados en el CustomerForm.
     * @returns {Object} Respuesta directa de la API con los datos del cliente creado.
     */
    async crearCliente(customerData) {
        try {
            console.log('[CustomerRepository] Intentando crear cliente en Factus DIAN:', customerData);

            // POST al endpoint de clientes (Sandbox)
            const response = await axiosClient.post('/v1/customers', customerData);

            console.log('[CustomerRepository] Cliente creado con éxito:', response.data || response);
            return response.data || response;

        } catch (error) {
            console.error('[CustomerRepository] Error al crear cliente:', error.response?.data || error.message);

            let errorMessage = 'Ocurrió un error inesperado al registrar el cliente.';

            if (error.response?.data) {
                // Factus puede devolver el error estructurado
                const errorData = error.response.data;

                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.errors) {
                    // Extraer los errores de validación si existen
                    errorMessage = JSON.stringify(errorData.errors);
                }
            }

            throw new Error(errorMessage);
        }
    }
}

export const customerRepository = new CustomerRepository();
