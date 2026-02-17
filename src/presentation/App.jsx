import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import { Rocket, FileText, Settings, LayoutDashboard } from 'lucide-react';
import { authService } from '../infrastructure/services/FactusAuthService';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verificar si ya hay una sesión activa al cargar
        if (authService.isAuthenticated()) {
            setIsLoggedIn(true);
            setUser({ name: 'Usuario Factus' }); // Placeholder hasta obtener perfil real
        }
    }, []);

    const handleLogin = async (credentials) => {
        try {
            // En una app real: await authService.login(credentials.clientId, credentials.clientSecret)
            // Por ahora simulamos éxito para avanzar en la UI
            setIsLoggedIn(true);
            setUser({ name: 'Fernando Vega' });
            console.log('Login exitoso con Nova UI');
        } catch (error) {
            console.error('Error de autenticación');
            alert('Credenciales inválidas (simulado)');
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
        <Layout>
            <div className="flex flex-col items-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="card-nova w-full max-w-4xl text-center p-12">
                    <div className="inline-flex p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-6">
                        <LayoutDashboard size={40} className="text-indigo-400" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Panel de Control
                    </h2>
                    <p className="text-slate-400 text-lg mb-12">
                        Bienvenido de nuevo, <span className="text-indigo-400 font-semibold">{user?.name}</span>. Todo listo para facturar.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<FileText size={24} className="text-purple-400" />}
                            title="Nueva Factura"
                            description="Emisión directa a la DIAN con validación real."
                        />
                        <FeatureCard
                            icon={<LayoutDashboard size={24} className="text-indigo-400" />}
                            title="Historial"
                            description="Consulta y descarga de PDF/XML emitidos."
                        />
                        <FeatureCard
                            icon={<Settings size={24} className="text-indigo-400" />}
                            title="Credenciales"
                            description="Gestiona tu Client ID y Secret."
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
        <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export default App;
