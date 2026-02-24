import React, { useState } from 'react';
import { Loader2, Mail, Lock, Rocket } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        clientId: import.meta.env.VITE_FACTUS_CLIENT_ID || '',
        clientSecret: import.meta.env.VITE_FACTUS_CLIENT_SECRET || '',
        email: import.meta.env.VITE_FACTUS_EMAIL || '',
        password: import.meta.env.VITE_FACTUS_PASSWORD || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onLogin(credentials);
        } catch (err) {
            setError('Credenciales inválidas. Verifique email y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Left Branding Panel */}
            <div style={{
                flex: '0 0 45%',
                background: '#1C1C1C',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden'
            }}
                className="login-branding"
            >
                {/* Subtle glow */}
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255,108,55,0.15), transparent 70%)',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#FF6C37',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 8px 32px rgba(255,108,55,0.3)'
                    }}>
                        <Rocket size={40} color="#fff" />
                    </div>
                    <h1 style={{
                        color: '#FFFFFF',
                        fontSize: '32px',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        marginBottom: '8px'
                    }}>Factus Nova</h1>
                    <p style={{
                        color: '#9A9A9A',
                        fontSize: '15px',
                        fontWeight: 400
                    }}>Facturación Electrónica DIAN — Simplificada</p>

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '48px',
                        justifyContent: 'center'
                    }}>
                        {[
                            { icon: '⚡', title: 'Alta Velocidad', sub: 'Procesamiento inmediato' },
                            { icon: '🔒', title: 'Seguridad Total', sub: 'Cifrado de grado bancario' }
                        ].map((feat, i) => (
                            <div key={i} style={{
                                background: '#2D2D2D',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                textAlign: 'center',
                                minWidth: '140px'
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{feat.icon}</div>
                                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{feat.title}</div>
                                <div style={{ color: '#9A9A9A', fontSize: '11px' }}>{feat.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div style={{
                flex: 1,
                background: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px'
            }}>
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '48px 40px',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    border: '1px solid #E6E6E6'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#1C1C1C',
                        marginBottom: '4px'
                    }}>Iniciar Sesión</h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#6B6B6B',
                        marginBottom: '32px'
                    }}>Bienvenido de nuevo a Factus Nova</p>

                    {error && (
                        <div style={{
                            background: '#FFEBEE',
                            border: '1px solid #FFCDD2',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '20px',
                            fontSize: '13px',
                            color: '#FF5252',
                            fontWeight: 500
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1C1C1C',
                                marginBottom: '8px'
                            }}>
                                <Mail size={14} color="#6B6B6B" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                placeholder="nombre@empresa.com"
                                className="input-factus"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1C1C1C',
                                marginBottom: '8px'
                            }}>
                                <Lock size={14} color="#6B6B6B" />
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="••••••••"
                                className="input-factus"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: loading ? '#E6E6E6' : '#FF6C37',
                                color: loading ? '#9A9A9A' : '#FFFFFF',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                'Iniciar Sesión →'
                            )}
                        </button>
                    </form>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '24px',
                        fontSize: '12px',
                        color: '#9A9A9A'
                    }}>
                        <span style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: '#00C853',
                            display: 'inline-block'
                        }}></span>
                        Conectado al Sandbox de Factus API
                    </div>
                </div>
            </div>

            {/* Responsive: Hide branding on mobile */}
            <style>{`
                @media (max-width: 768px) {
                    .login-branding { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;
