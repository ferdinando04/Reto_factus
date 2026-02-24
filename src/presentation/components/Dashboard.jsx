import React from 'react';
import { TrendingUp, Users, FileText, Clock, Download, CheckCircle2, ArrowRight, Search } from 'lucide-react';

const Dashboard = ({ setView, invoices = [] }) => {
    const stats = [
        { title: 'Ingresos Totales', value: `$${invoices.reduce((a, i) => a + (i.total || 0), 0).toLocaleString()}`, sub: 'COP — Sandbox', icon: TrendingUp, color: '#2D7FF9', bg: '#E3F2FD' },
        { title: 'Facturas Emitidas', value: invoices.length.toString(), sub: 'Sincronización al día', icon: FileText, color: '#00C853', bg: '#E8F5E9' },
        { title: 'Clientes Registrados', value: '24', sub: '+3 nuevos esta semana', icon: Users, color: '#7C4DFF', bg: '#EDE7F6' }
    ];

    return (
        <div className="animate-fade-in">
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1C1C', marginBottom: '4px' }}>Resumen General</h1>
                    <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Monitorea la actividad de facturación y estado DIAN.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => setView('customer-form')} className="btn-secondary">
                        <Users size={16} /> Nuevo Cliente
                    </button>
                    <button onClick={() => setView('invoice-form')} className="btn-primary">
                        <FileText size={16} /> Emitir Factura
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="card-factus" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={22} color={s.color} />
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.title}</span>
                            </div>
                            <div style={{ fontSize: '30px', fontWeight: 800, color: '#1C1C1C', letterSpacing: '-0.02em', marginBottom: '4px' }}>{s.value}</div>
                            <div style={{ fontSize: '13px', color: '#6B6B6B' }}>{s.sub}</div>
                        </div>
                    );
                })}
            </div>

            {/* Invoices Table */}
            <div className="card-factus">
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #E6E6E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} color="#9A9A9A" /> Historial de Emisiones
                    </h2>
                    <div style={{ position: 'relative', width: '240px' }}>
                        <Search size={14} color="#9A9A9A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder="Buscar en historial..." className="input-factus" style={{ paddingLeft: '34px', height: '36px', fontSize: '13px' }} />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table-factus">
                        <thead>
                            <tr>
                                <th>Identificador</th>
                                <th>Cliente</th>
                                <th>Monto Total</th>
                                <th>Estado DIAN</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length > 0 ? invoices.map((inv, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 600, color: '#2D7FF9' }}>#{inv.number}</td>
                                    <td>{inv.customer_name}</td>
                                    <td style={{ fontWeight: 700 }}>${inv.total?.toLocaleString()}</td>
                                    <td>
                                        <span className="badge badge-success">
                                            <CheckCircle2 size={14} /> Certificada
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', color: '#9A9A9A', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}>
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '48px 16px' }}>
                                        <FileText size={36} color="#E6E6E6" style={{ margin: '0 auto 12px', display: 'block' }} />
                                        <p style={{ color: '#9A9A9A', fontSize: '14px', marginBottom: '8px' }}>No hay facturas emitidas todavía.</p>
                                        <button
                                            onClick={() => setView('invoice-form')}
                                            style={{ background: 'none', border: 'none', color: '#FF6C37', fontWeight: 600, cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            Crear primera factura <ArrowRight size={14} />
                                        </button>
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
