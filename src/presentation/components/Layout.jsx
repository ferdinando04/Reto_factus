import React, { useState } from 'react';
import {
    LayoutDashboard, Users, PackageOpen, FileText, Receipt,
    Settings, LogOut, Bell, Search, Menu, X, Rocket, ChevronRight
} from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'invoice-form', label: 'Facturación Electrónica', icon: FileText },
    { id: 'customer-form', label: 'Clientes', icon: Users },
    { id: 'products', label: 'Productos', icon: PackageOpen },
    { id: 'credit-notes', label: 'Notas Crédito', icon: Receipt },
];

const Layout = ({ children, user, onLogout, setView, currentView }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        zIndex: 40, display: 'block'
                    }}
                    className="sidebar-overlay"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
                style={{
                    width: '260px',
                    background: '#1C1C1C',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    height: '100vh',
                    position: 'fixed',
                    left: sidebarOpen ? 0 : '-260px',
                    top: 0,
                    zIndex: 50,
                    transition: 'left 0.3s ease'
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '20px 20px 16px',
                    borderBottom: '1px solid #2D2D2D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: '#FF6C37', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Rocket size={20} color="#fff" />
                        </div>
                        <span style={{ color: '#fff', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                            Factus Nova
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar-close-btn"
                        style={{
                            background: 'none', border: 'none', color: '#9A9A9A',
                            cursor: 'pointer', padding: '4px', display: 'none'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    <div style={{
                        fontSize: '10px', fontWeight: 700, color: '#6B6B6B',
                        textTransform: 'uppercase', letterSpacing: '0.12em',
                        padding: '0 8px', marginBottom: '12px'
                    }}>
                        Menú Principal
                    </div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setView(item.id); setSidebarOpen(false); }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    marginBottom: '2px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#FFFFFF' : '#9A9A9A',
                                    background: isActive ? '#2D2D2D' : 'transparent',
                                    borderLeft: isActive ? '3px solid #FF6C37' : '3px solid transparent',
                                    transition: 'all 0.15s ease',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Icon size={18} color={isActive ? '#FF6C37' : '#6B6B6B'} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight size={14} color="#FF6C37" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '12px', borderTop: '1px solid #2D2D2D' }}>
                    <button
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 12px', borderRadius: '8px', border: 'none',
                            background: 'transparent', color: '#9A9A9A', cursor: 'pointer',
                            fontSize: '14px', textAlign: 'left', marginBottom: '4px'
                        }}
                    >
                        <Settings size={18} color="#6B6B6B" />
                        Configuración
                    </button>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '8px', background: '#2D2D2D',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: '#FF6C37', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0
                        }}>
                            {user?.name ? user.name.charAt(0) : 'A'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name || 'Administrador'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#9A9A9A' }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00C853' }}></span>
                                Sandbox
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 12px', borderRadius: '8px', border: 'none',
                            background: 'transparent', color: '#FF5252', cursor: 'pointer',
                            fontSize: '13px', fontWeight: 600, textAlign: 'left'
                        }}
                    >
                        <LogOut size={16} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main wrapper */}
            <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Topbar */}
                <header style={{
                    height: '56px', background: '#FFFFFF', borderBottom: '1px solid #E6E6E6',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 20px', flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="hamburger-btn"
                            style={{
                                background: 'none', border: 'none', color: '#6B6B6B',
                                cursor: 'pointer', padding: '4px', display: 'block'
                            }}
                        >
                            <Menu size={22} />
                        </button>

                        {/* Search */}
                        <div className="topbar-search" style={{ position: 'relative', width: '280px' }}>
                            <Search size={15} color="#9A9A9A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Buscar facturas, clientes..."
                                className="input-factus"
                                style={{ paddingLeft: '36px', height: '36px', fontSize: '13px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button style={{
                            position: 'relative', background: 'none', border: 'none',
                            color: '#6B6B6B', cursor: 'pointer', padding: '4px'
                        }}>
                            <Bell size={20} />
                            <span style={{
                                position: 'absolute', top: '2px', right: '2px', width: '7px', height: '7px',
                                borderRadius: '50%', background: '#FF5252', border: '1.5px solid #fff'
                            }}></span>
                        </button>

                        <div className="topbar-user" style={{
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: '#FF6C37', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700
                            }}>
                                {user?.name ? user.name.charAt(0) : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main style={{
                    flex: 1, overflowY: 'auto', overflowX: 'hidden',
                    background: '#F5F5F5', padding: '24px'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>

            {/* Responsive CSS */}
            <style>{`
                @media (min-width: 1024px) {
                    .sidebar {
                        position: fixed !important;
                        left: 0 !important;
                    }
                    .main-wrapper {
                        margin-left: 260px !important;
                    }
                    .hamburger-btn { display: none !important; }
                    .sidebar-close-btn { display: none !important; }
                    .sidebar-overlay { display: none !important; }
                }
                @media (max-width: 1023px) {
                    .sidebar-close-btn { display: block !important; }
                    .topbar-search { display: none !important; }
                }
                @media (max-width: 640px) {
                    .topbar-user { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Layout;
