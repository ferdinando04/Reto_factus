import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { CustomerForm } from './components/CustomerForm';
import { InvoiceForm } from './components/InvoiceForm';
import { authRepository } from '../infrastructure/repositories/AuthRepository';
import { localInvoiceRepository } from '../infrastructure/repositories/LocalInvoiceRepository';

/**
 * App Component
 * Orquestador principal de Factus Nova.
 * Integra la lógica de UI con los servicios de dominio y persistencia local.
 */
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'customer-form' | 'invoice-form'
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        // Cargar sesión y datos locales al iniciar
        const token = sessionStorage.getItem('factus_access_token');
        if (token) {
            setIsLoggedIn(true);
            setUser({ name: 'Admin Factus', role: 'Enterprise' });
            loadInvoices();
        }
    }, []);

    const loadInvoices = () => {
        const history = localInvoiceRepository.findAll();
        setInvoices(history);
    };

    const handleLogin = async (credentials) => {
        try {
            await authRepository.login(
                credentials.clientId,
                credentials.clientSecret,
                credentials.email,
                credentials.password
            );
            setIsLoggedIn(true);
            setUser({ name: 'Admin Factus', role: 'Enterprise' });
            loadInvoices();
        } catch (error) {
            alert('Fallo de Autenticación con Factus: Verifique credenciales.');
            throw error;
        }
    };

    // La lógica de envío ahora está contenida en los propios formularios
    // InvoiceForm y CustomerForm coordinan sus repsectivos Submit y repositorios.

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    if (!isLoggedIn) {
        return (
            <Layout>
                <Login onLogin={handleLogin} />
            </Layout>
        );
    }

    // Componente temporal para vistas en construcción
    const PlaceholderView = ({ title, icon: Icon, description }) => (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Icon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-500 max-w-md">{description}</p>
        </div>
    );

    return (
        <Layout user={user} onLogout={handleLogout} setView={setView} currentView={view}>
            {view === 'dashboard' ? (
                <Dashboard
                    onNewInvoice={() => setView('invoice-form')}
                    onNewCustomer={() => setView('customer-form')}
                    setView={setView}
                    invoices={invoices}
                />
            ) : view === 'customer-form' ? (
                <div className="animate-fade-in w-full">
                    <CustomerForm />
                </div>
            ) : view === 'invoice-form' ? (
                <div className="animate-fade-in w-full">
                    <InvoiceForm />
                </div>
            ) : view === 'products' ? (
                <div className="animate-fade-in w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <PlaceholderView
                        title="Gestión de Productos y Servicios"
                        description="Este módulo está en construcción. Aquí podrá administrar su catálogo de ítems, precios, impuestos aplicables y códigos estándar de la DIAN."
                        icon={PackageOpen}
                    />
                </div>
            ) : view === 'credit-notes' ? (
                <div className="animate-fade-in w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <PlaceholderView
                        title="Notas Crédito"
                        description="Este módulo está en construcción. Aquí podrá anular o ajustar facturas electrónicas previamente emitidas ante la DIAN mediante la generación de Notas Crédito."
                        icon={Receipt}
                    />
                </div>
            ) : null}
        </Layout>
    );
}

export default App;
