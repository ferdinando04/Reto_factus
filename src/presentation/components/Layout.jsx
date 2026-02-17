import React from 'react';
import Navbar from './Navbar';

/**
 * Layout Component
 * Proporciona la estructura visual base con efectos de Glassmorphism
 * y fondo animado (Blobs).
 */
const Layout = ({ children, user, onLogout, setView, currentView }) => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="blob" style={{ top: '-10%', left: '-5%' }}></div>
            <div className="blob" style={{ bottom: '0%', right: '-5%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', opacity: '0.05' }}></div>

            <Navbar user={user} onLogout={onLogout} setView={setView} currentView={currentView} />

            <main className="flex-1 relative z-10">
                {children}
            </main>

            <footer className="py-8 text-center text-sm text-slate-400 z-10">
                &copy; 2026 Factus Nova | Enterprise Invoicing Solution
            </footer>
        </div>
    );
};

export default Layout;
