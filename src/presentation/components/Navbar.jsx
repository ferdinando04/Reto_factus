import React from 'react';
import { Rocket, Bell, User, LogOut } from 'lucide-react';

/**
 * Navbar Component
 * Refinado con soporte para sesión de usuario y logout.
 */
const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/20">
                    <Rocket size={24} className="text-indigo-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-none">
                        Factus Nova
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold mt-1">
                        Enterprise Edition
                    </span>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
                <NavLink href="#" active>Dashboard</NavLink>
                <NavLink href="#">Facturas</NavLink>
                <NavLink href="#">Buzón DIAN</NavLink>
                <NavLink href="#">Configuración</NavLink>
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
        </nav>
    );
};

const NavLink = ({ href, children, active }) => (
    <a
        href={href}
        className={`text-sm font-medium transition-all ${active ? 'text-indigo-400 border-b-2 border-indigo-400 pb-1' : 'text-slate-400 hover:text-white pb-1'}`}
    >
        {children}
    </a>
);

export default Navbar;
