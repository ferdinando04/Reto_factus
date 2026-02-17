import React from 'react';
import { Rocket, Bell, User, LogOut } from 'lucide-react';

/**
 * Navbar Component
 * Refinado con soporte para sesión de usuario y logout.
 */
const NavLink = ({ children, active, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`text-sm font-medium transition-all bg-transparent border-none cursor-pointer p-0 ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${active ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-400 hover:text-white pb-1'}`}
    >
        {children}
    </button>
);

const Navbar = ({ user, onLogout, setView, currentView }) => {
    return (
        <nav className="navbar-nova z-50">
            <div className="container py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20 shadow-inner">
                        <Rocket size={24} className="text-indigo-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gradient leading-none">
                            Factus Nova
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold mt-1">
                            Enterprise Edition
                        </span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8">
                    <NavLink
                        onClick={() => user && setView('dashboard')}
                        active={currentView === 'dashboard'}
                        disabled={!user}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        onClick={() => user && setView('billing-form')}
                        active={currentView === 'billing-form'}
                        disabled={!user}
                    >
                        Facturador
                    </NavLink>
                    <NavLink href="#" disabled={true}>Buzón DIAN</NavLink>
                    <NavLink href="#" disabled={true}>Configuración</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-semibold text-white">{user.name}</span>
                            <span className="text-xs text-slate-500">{user.role}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                        <button className="p-2 text-slate-400 hover:text-white transition-all hover:bg-white/5 rounded-xl">
                            <Bell size={20} />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20">
                            <User size={20} className="text-white" />
                        </div>
                        {user && (
                            <button
                                onClick={onLogout}
                                className="p-2 text-rose-400 hover:text-rose-300 transition-all hover:bg-rose-400/10 rounded-xl"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
