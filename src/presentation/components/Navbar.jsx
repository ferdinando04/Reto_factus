import React from 'react';
import { Rocket, Bell, User } from 'lucide-react';

/**
 * Navbar Component
 */
const Navbar = () => {
    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/20">
                    <Rocket size={24} className="text-indigo-500" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Factus Nova
                </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <NavLink href="#" active>Dashboard</NavLink>
                <NavLink href="#">Facturas</NavLink>
                <NavLink href="#">Clientes</NavLink>
                <NavLink href="#">Productos</NavLink>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/20">
                    <User size={20} className="text-white" />
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ href, children, active }) => (
    <a
        href={href}
        className={`text-sm font-medium transition-colors ${active ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
    >
        {children}
    </a>
);

export default Navbar;
