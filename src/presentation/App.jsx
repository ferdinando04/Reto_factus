import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BillingForm from './components/BillingForm';
import { authService } from '../infrastructure/services/FactusAuthService';
import { invoiceService } from '../application/services/InvoiceService';
import { localInvoiceRepository } from '../infrastructure/repositories/LocalInvoiceRepository';

/**
 * App Component
 * Orquestador principal de Factus Nova.
 * Integra la lógica de UI con los servicios de dominio y persistencia local.
 */
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'billing-form'
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        // Cargar sesión y datos locales al iniciar
        if (authService.isAuthenticated()) {
            setIsLoggedIn(true);
            setUser({ name: 'Fernando Vega', role: 'Administrador' });
            loadInvoices();
        }
    }, []);

    const loadInvoices = () => {
        const history = localInvoiceRepository.findAll();
        setInvoices(history);
    };

    const handleLogin = async (credentials) => {
        // Simulación de login para avance de UI
        setIsLoggedIn(true);
        setUser({ name: 'Fernando Vega', role: 'Administrador' });
        loadInvoices();
    };

    const handleSendInvoice = async (invoiceData) => {
        try {
            console.log('Factus Nova: Iniciando proceso de firma y envío...');

            // En una implementación real conectaríamos con invoiceService.sendInvoice(invoiceData)
            // Para esta fase, simulamos el éxito y guardamos localmente
            const newInvoice = {
                number: `SETT${1000 + invoices.length}`,
                customer_name: invoiceData.customer.name,
                total: invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0),
                date: new Date().toISOString()
            };

            localInvoiceRepository.save(newInvoice);
            loadInvoices();
            setView('dashboard');

            alert('¡Factura enviada con éxito a la DIAN!');
        } catch (error) {
            console.error('Error enviando factura:', error);
            alert('Error en la comunicación con Factus API');
        }
    };

    if (!isLoggedIn) {
        return (
            <Layout>
                <Login onLogin={handleLogin} />
            </Layout>
        );
    }

    return (
        <Layout user={user}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === 'dashboard' ? (
                    <Dashboard
                        onNewInvoice={() => setView('billing-form')}
                        invoices={invoices}
                    />
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Emisión de Factura Electrónica
                            </h2>
                            <button
                                onClick={() => setView('dashboard')}
                                className="text-sm text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest font-bold"
                            >
                                ← Volver al Dashboard
                            </button>
                        </div>

                        <BillingForm
                            onSend={handleSendInvoice}
                            onCancel={() => setView('dashboard')}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default App;
