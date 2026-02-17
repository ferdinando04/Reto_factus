import React from 'react';
import {
    FileText,
    TrendingUp,
    AlertCircle,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Download
} from 'lucide-react';

/**
 * Dashboard Component
 * Implementa la estética "Liquid Glass 2026" con widgets de estadísticas y logs de actividad.
 */
const Dashboard = ({ onNewInvoice, invoices = [] }) => {
    // Datos simulados para el Dashboard
    const stats = [
        {
            title: 'Total Facturado',
            value: '$0.00',
            change: '0%',
            isPositive: true,
            icon: <TrendingUp className="text-emerald-400" />
        },
        {
            title: 'Facturas Emitidas',
            value: invoices.length.toString(),
            change: '0',
            isPositive: true,
            icon: <FileText className="text-indigo-400" />
        },
        {
            title: 'Pendientes DIAN',
            value: '0',
            change: '0%',
            isPositive: true,
            icon: <AlertCircle className="text-amber-400" />
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Vista General
                    </h1>
                    <p className="text-slate-400 mt-1">Monitorea tu actividad de facturación en tiempo real.</p>
                </div>
                <button
                    onClick={onNewInvoice}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 group"
                >
                    <Plus size={20} />
                    Nueva Factura
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="card-nova p-6 hover:border-white/20 transition-all cursor-default group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Clock size={20} className="text-indigo-400" />
                        Actividad Reciente
                    </h2>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Ver todo</button>
                </div>

                <div className="card-nova overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/2">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Número</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Monto</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado DIAN</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {invoices.length > 0 ? invoices.map((invoice, idx) => (
                                    <tr key={idx} className="hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4 font-medium text-sm">#{invoice.number}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300">{invoice.customer_name}</td>
                                        <td className="px-6 py-4 text-sm font-semibold">${invoice.total}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Validada
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                                                <Download size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                                            No hay facturas emitidas recientemente.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
