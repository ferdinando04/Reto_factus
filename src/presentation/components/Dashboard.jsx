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
    Layers,
    ArrowRight
} from 'lucide-react';

/**
 * Dashboard Component
 * Implementa la estética "Liquid Glass 2026" con widgets de estadísticas y logs de actividad.
 */
const Dashboard = ({ onNewInvoice, invoices = [] }) => {
    const instances_count = invoices.length > 0 ? `+${invoices.length}` : '0';

    const stats = [
        {
            title: 'Monto Total Facturado',
            value: `$${invoices.reduce((acc, inv) => acc + inv.total, 0).toLocaleString()}`,
            change: '+12.5%',
            isPositive: true,
            icon: <TrendingUp size={24} className="text-emerald-400" />,
            isLarge: true
        },
        {
            title: 'Documentos Emitidos',
            value: invoices.length.toString(),
            change: instances_count,
            isPositive: true,
            icon: <FileText size={20} className="text-indigo-400" />
        },
        {
            title: 'Pendientes DIAN',
            value: '0',
            change: 'Sin errores',
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

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`card-nova p-6 group transition-all duration-500 overflow-hidden relative ${stat.isLarge ? 'md:col-span-2' : ''}`}
                    >
                        {/* Spotlight Effect Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">{stat.title}</h3>
                                <p className={`font-bold text-white tracking-tight ${stat.isLarge ? 'text-4xl' : 'text-2xl'}`}>{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-500`}>
                                {stat.icon}
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between relative z-10">
                            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {stat.change}
                                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </div>
                            <div className="h-[2px] w-12 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500/40 w-1/2"></div>
                            </div>
                        </div>
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
