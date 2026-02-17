import React from 'react';
import {
    FileText,
    TrendingUp,
    AlertCircle,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Download,
    Layers
} from 'lucide-react';

/**
 * Dashboard Component
 * Implementa la estética "Liquid Glass 2026" con widgets de estadísticas y logs de actividad.
 */
const Dashboard = ({ onNewInvoice, invoices = [] }) => {
    const stats = [
        {
            title: 'Total Facturado',
            value: '$0.00',
            change: '0%',
            isPositive: true,
            icon: <TrendingUp size={20} className="text-emerald-400" />
        },
        {
            title: 'Facturas Emitidas',
            value: invoices.length.toString(),
            change: '0',
            isPositive: true,
            icon: <FileText size={20} className="text-indigo-400" />
        },
        {
            title: 'Pendientes DIAN',
            value: '0',
            change: '0%',
            isPositive: true,
            icon: <AlertCircle size={20} className="text-amber-400" />
        }
    ];

    return (
        <div className="animate-fade-in space-y-12">
            {/* Header Secion */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sincronizado con DIAN</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gradient">
                        Vista General
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Control inteligente de facturación electrónica.</p>
                </div>
                <button
                    onClick={onNewInvoice}
                    className="btn-primary"
                >
                    <Plus size={20} />
                    Nueva Factura Nova
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="card-nova p-8 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-500">
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold tracking-tighter ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stat.change}
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.title}</h3>
                        <p className="text-3xl font-bold mt-2 text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Clock size={22} className="text-indigo-400" />
                        </div>
                        Historial de Transacciones
                    </h2>
                    <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors flex items-center gap-2">
                        Ver Reporte Completo
                        <ArrowRight size={14} />
                    </button>
                </div>

                <div className="card-nova p-0 overflow-hidden">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Identificador</th>
                                    <th>Cofituyente / Cliente</th>
                                    <th>Monto Total</th>
                                    <th>Validación DIAN</th>
                                    <th>Documentación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length > 0 ? invoices.map((invoice, idx) => (
                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="font-bold text-indigo-400">#{invoice.number}</td>
                                        <td className="text-slate-300 font-medium">{invoice.customer_name}</td>
                                        <td className="font-bold">${invoice.total.toLocaleString()}</td>
                                        <td>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                                                Certificada
                                            </span>
                                        </td>
                                        <td>
                                            <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg">
                                                <Download size={14} />
                                                PDF/XML
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-30">
                                                <Layers size={40} />
                                                <p className="text-sm font-medium italic">Esperando primera emisión de factura...</p>
                                            </div>
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
