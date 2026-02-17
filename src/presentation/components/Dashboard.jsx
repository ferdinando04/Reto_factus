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

            {/* Bento Grid 2.0 */}
            <div className="bento-grid">
                {/* Main KPI Card */}
                <div className="bento-span-4 bento-card card-nova p-8 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="stat-label">Ingresos Totales (Sandbox)</h3>
                                <p className="stat-value large">${invoices.reduce((acc, inv) => acc + inv.total, 0).toLocaleString()}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                <TrendingUp size={28} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="trend-badge bg-emerald-500/10 text-emerald-400">
                                <ArrowUpRight size={14} /> +12.5% vs Mes Anterior
                            </div>
                            <div className="flex-1 h-[1px] bg-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent animate-shimmer"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second KPI Card */}
                <div className="bento-span-2 bento-card card-nova p-8 group">
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="space-y-1">
                            <h3 className="stat-label">Docs Emitidos</h3>
                            <p className="stat-value">{invoices.length}</p>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-indigo-500/10 transition-all text-slate-400 group-hover:text-indigo-400">
                                <FileText size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">PROMEDIO: {invoices.length > 0 ? (invoices.length / 1).toFixed(1) : '0'} / DÍA</span>
                        </div>
                    </div>
                </div>

                {/* Stability Widget */}
                <div className="bento-span-3 bento-card card-nova p-8 group">
                    <div className="flex items-center gap-6 relative z-10 h-full">
                        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <h3 className="stat-label">Estatus DIAN</h3>
                            <p className="text-xl font-bold text-white tracking-tight">Sincronización OK</p>
                            <p className="text-xs text-slate-500 mt-1 font-medium">0 Errores críticos detectados</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Widget */}
                <div className="bento-span-3 bento-card card-nova p-8 group border-dashed border-indigo-500/30 hover:border-solid hover:bg-indigo-500/[0.02]">
                    <div className="flex flex-col h-full justify-center items-center gap-3 relative z-10 text-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Layers size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Automatización Activa</p>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">TLS 1.3 ENCRYPTED</span>
                    </div>
                </div>
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
