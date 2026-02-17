import React, { useState } from 'react';
import { Rocket, Lock, Mail, ArrowRight } from 'lucide-react';

/**
 * Login Component
 * Implementa la estética "Liquid Glass 2026" con validación de baja fricción.
 */
const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ clientId: '', clientSecret: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulación de delay para mostrar feedback visual premium
        setTimeout(() => {
            onLogin(credentials);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="card-nova w-full max-w-md relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full"></div>

                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-4">
                        <Rocket size={32} className="text-indigo-500" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Bienvenido
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">
                        Ingresa tus credenciales de Factus para comenzar.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Client ID</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-sm"
                                placeholder="Ingresa tu Client ID"
                                value={credentials.clientId}
                                onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Client Secret</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-sm"
                                placeholder="••••••••••••••••"
                                value={credentials.clientSecret}
                                onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? 'Validando...' : (
                            <>
                                Iniciar Sesión
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        ¿No tienes credenciales? <a href="https://factus.co" target="_blank" className="text-indigo-400 hover:underline">Solicítalas en Factus.co</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
