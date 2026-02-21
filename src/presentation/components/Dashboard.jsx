import React from 'react';
import {
    TrendingUp,
    Users,
    FileText,
    Clock,
    Download,
    CheckCircle2,
    ArrowRight,
    Search
} from 'lucide-react';

const Dashboard = ({ setView, invoices = [] }) => {
    const stats = [
        {
            title: 'Ingresos Totales (Sandbox)',
            value: `$${invoices.reduce((acc, inv) => acc + inv.total, 0).toLocaleString()}`,
            trend: '+12.5% este mes',
            icon: TrendingUp,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'Facturas Emitidas',
            value: invoices.length.toString(),
            trend: 'Sincronización al día',
            icon: FileText,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            title: 'Clientes Registrados',
            value: '24', // Dato estático de ejemplo visual
            trend: '+3 nuevos esta semana',
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in w-full">

            {/* Page Header SaaS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Resumen General</h1>
                    <p className="text-sm text-slate-500 mt-1">Monitorea la actividad de facturación y estado de la DIAN.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setView('customer-form')}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <Users size={16} />
                        Nuevo Cliente
                    </button>
                    <button
                        onClick={() => setView('invoice-form')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <FileText size={16} />
                        Emitir Factura
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.title}</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-500 mt-auto">{stat.trend}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main Area: Recent Activity Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} className="text-slate-400" />
                        Historial de Emisiones
                    </h2>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar en historial..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-bold border-b border-slate-200">Identificador</th>
                                <th className="px-6 py-4 font-bold border-b border-slate-200">Cliente</th>
                                <th className="px-6 py-4 font-bold border-b border-slate-200">Monto Total</th>
                                <th className="px-6 py-4 font-bold border-b border-slate-200">Estado DIAN</th>
                                <th className="px-6 py-4 font-bold border-b border-slate-200 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.length > 0 ? invoices.map((invoice, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-blue-600">#{invoice.number}</td>
                                    <td className="px-6 py-4 text-slate-700 font-medium">{invoice.customer_name}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">${invoice.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <CheckCircle2 size={14} />
                                            Certificada
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                            <FileText size={40} className="text-slate-300" />
                                            <p className="text-sm font-medium">No hay facturas emitidas todavía.</p>
                                            <button
                                                onClick={() => setView('invoice-form')}
                                                className="mt-2 text-blue-600 font-bold hover:underline text-sm flex items-center gap-1"
                                            >
                                                Crear primera factura <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
