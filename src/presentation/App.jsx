import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { CustomerForm } from './components/CustomerForm';
import { InvoiceForm } from './components/InvoiceForm';
import ProductsView from './components/ProductsView';
import CreditNotesView from './components/CreditNotesView';
import { authRepository } from '../infrastructure/repositories/AuthRepository';
import { localInvoiceRepository } from '../infrastructure/repositories/LocalInvoiceRepository';

/**
 * App Component — Orquestador principal Factus Nova
 * Postman-Inspired SaaS UI + Clean Architecture
 */
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [view, setView] = useState('dashboard');
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
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
        await authRepository.login(
            credentials.clientId,
            credentials.clientSecret,
            credentials.email,
            credentials.password
        );
        setIsLoggedIn(true);
        setUser({ name: 'Admin Factus', role: 'Enterprise' });
        loadInvoices();
    };

    const handleLogout = () => {
        sessionStorage.removeItem('factus_access_token');
        setIsLoggedIn(false);
        setUser(null);
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <Layout user={user} onLogout={handleLogout} setView={setView} currentView={view}>
            {view === 'dashboard' && <Dashboard setView={setView} invoices={invoices} />}
            {view === 'customer-form' && <CustomerForm />}
            {view === 'invoice-form' && <InvoiceForm />}
            {view === 'products' && <ProductsView />}
            {view === 'credit-notes' && <CreditNotesView />}
        </Layout>
    );
}

export default App;
