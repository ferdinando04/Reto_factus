import React, { useState } from 'react';
import { Rocket, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

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
        setTimeout(() => {
            onLogin(credentials);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-12 animate-fade-in relative z-10">
            <div className="card-nova w-full max-w-md p-10 relative">
                {/* Accent blobs */}
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/10 blur-2xl rounded-full"></div>
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/10 blur-2xl rounded-full"></div>

                <div className="text-center mb-10 relative">
                    <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 mb-6 shadow-inner">
                        <Rocket size={40} className="text-indigo-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-gradient mb-3">
                        Factus Nova
                    </h2>
                    <p className="text-slate-400 text-sm font-medium tracking-wide">
                        ENTERPRISE INVOICING SOLUTION
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-widest">Client Credentials</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                className="input-nova pl-12"
                                placeholder="Client ID"
                                value={credentials.clientId}
                                onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                className="input-nova pl-12"
                                placeholder="Client Secret"
                                value={credentials.clientSecret}
                                onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full group shadow-2xl shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Autenticando...' : (
                            <>
                                Iniciar Sesión Segura
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mt-4">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Conexión Encriptada TLS 1.3
                    </div>
                </form>

                <div className="mt-10 text-center border-t border-white/10 pt-6">
                    <p className="text-xs text-slate-400">
                        ¿Requieres acceso? <a href="https://factus.co" target="_blank" className="text-indigo-400 hover:text-indigo-300 font-bold no-underline transition-colors uppercase tracking-wider">Solicitar credenciales</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
