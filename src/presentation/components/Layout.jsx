import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    PackageOpen,
    FileText,
    Receipt,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';

const Layout = ({ children, user, onLogout, setView, currentView }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'customer-form', label: 'Clientes', icon: Users },
        { id: 'products', label: 'Productos / Servicios', icon: PackageOpen },
        { id: 'invoice-form', label: 'Facturación Electrónica', icon: FileText },
        { id: 'credit-notes', label: 'Notas Crédito', icon: Receipt },
    ];

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                            F
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">Factus Nova</span>
                    </div>
                    <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Módulos Principales</p>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
                                className={`
                                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight size={16} className="text-blue-500" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Settings & User */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Settings size={18} className="text-slate-400" />
                        Configuración API
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                        <LogOut size={18} className="text-rose-400" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Menu size={20} />
                        </button>

                        {/* Search Bar (Simulated SaaS Feature) */}
                        <div className="hidden md:flex relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar facturas, clientes..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right utilities */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-700">{user?.name || 'Administrador'}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Sandbox Conectado
                                </p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold overflow-hidden shadow-sm">
                                {user?.name ? user.name.charAt(0) : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main View Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative">
                    {/* Contenedor central ajustando padding para SaaS */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[1400px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
