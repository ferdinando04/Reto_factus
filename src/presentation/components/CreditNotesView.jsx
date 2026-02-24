import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Search, Eye, FileText, AlertCircle, CheckCircle2, X, Send, Loader2 } from 'lucide-react';

const STORAGE_KEY = 'factus_credit_notes';

const getCreditNotes = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
};

const saveCreditNotes = (notes) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

const INITIAL_NOTES = [
    { id: 1, number: 'NC-001', invoiceRef: 'SETT-1', customerName: 'Empresa Demo SAS', reason: 'Devolución parcial de productos', amount: 150000, date: '2026-02-20', status: 'approved' },
    { id: 2, number: 'NC-002', invoiceRef: 'SETT-2', customerName: 'Juan Pérez', reason: 'Descuento no aplicado en factura original', amount: 25000, date: '2026-02-21', status: 'pending' },
];

const CreditNotesView = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [viewingNote, setViewingNote] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        let stored = getCreditNotes();
        if (stored.length === 0) {
            saveCreditNotes(INITIAL_NOTES);
            stored = INITIAL_NOTES;
        }
        setNotes(stored);
    }, []);

    const showNotif = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCreate = (noteData) => {
        const newNote = {
            ...noteData,
            id: Date.now(),
            number: `NC-${String(notes.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        const updated = [newNote, ...notes];
        setNotes(updated);
        saveCreditNotes(updated);
        setShowForm(false);
        showNotif(`Nota Crédito ${newNote.number} generada exitosamente`);
    };

    const filtered = notes.filter(n =>
        n.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 100,
                    background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '8px',
                    padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#1B7A3D', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <CheckCircle2 size={18} /> {notification}
                </div>
            )}

            {/* Detail Modal */}
            {viewingNote && (
                <NoteDetail note={viewingNote} onClose={() => setViewingNote(null)} />
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1C1C', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <Receipt size={22} color="#FF6C37" /> Notas Crédito
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Gestione ajustes y anulaciones de facturas electrónicas ante la DIAN.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={16} /> Nueva Nota Crédito
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="card-factus" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Total Emitidas</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#1C1C1C' }}>{notes.length}</div>
                </div>
                <div className="card-factus" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Aprobadas DIAN</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#00C853' }}>{notes.filter(n => n.status === 'approved').length}</div>
                </div>
                <div className="card-factus" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Pendientes</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#FF9800' }}>{notes.filter(n => n.status === 'pending').length}</div>
                </div>
                <div className="card-factus" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Valor Total</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#1C1C1C' }}>${notes.reduce((a, n) => a + n.amount, 0).toLocaleString()}</div>
                </div>
            </div>

            {/* Search */}
            <div className="card-factus" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 250px', minWidth: '200px' }}>
                    <Search size={15} color="#9A9A9A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text" className="input-factus" placeholder="Buscar por número, cliente o factura..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                    />
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <CreditNoteForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
            )}

            {/* Table */}
            <div className="card-factus">
                <div style={{ overflowX: 'auto' }}>
                    <table className="table-factus">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Factura Ref.</th>
                                <th>Cliente</th>
                                <th>Motivo</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? filtered.map(note => (
                                <tr key={note.id}>
                                    <td style={{ fontWeight: 600, color: '#2D7FF9' }}>{note.number}</td>
                                    <td style={{ fontSize: '13px' }}>{note.invoiceRef}</td>
                                    <td style={{ fontWeight: 500 }}>{note.customerName}</td>
                                    <td style={{ fontSize: '13px', color: '#6B6B6B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.reason}</td>
                                    <td style={{ fontWeight: 700 }}>${note.amount.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${note.status === 'approved' ? 'badge-success' : note.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                                            {note.status === 'approved' ? 'Aprobada' : note.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => setViewingNote(note)} style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}>
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        <Receipt size={32} color="#E6E6E6" style={{ margin: '0 auto 8px', display: 'block' }} />
                                        <p style={{ color: '#9A9A9A', fontSize: '14px' }}>No se encontraron notas crédito.</p>
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

// Credit Note Form
const CreditNoteForm = ({ onSave, onCancel }) => {
    const [form, setForm] = useState({
        invoiceRef: '', customerName: '', reason: '', amount: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.invoiceRef || !form.customerName || !form.amount) return;
        setLoading(true);
        // Simulate brief API delay
        await new Promise(r => setTimeout(r, 800));
        onSave({ ...form, amount: Number(form.amount) });
        setLoading(false);
    };

    return (
        <div className="card-factus" style={{ marginBottom: '20px', border: '2px solid #FF6C37' }}>
            <div style={{ padding: '20px 24px', background: '#FFF3EE', borderBottom: '1px solid #FFD4C2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Receipt size={18} color="#FF6C37" /> Generar Nota Crédito
                </h3>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <div style={{ padding: '20px 24px', background: '#FFF3E0', borderBottom: '1px solid #FFE0B2' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#7A4A00' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>La Nota Crédito anulará o ajustará parcialmente la factura electrónica referenciada. Este documento será transmitido a la DIAN una vez enviado.</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <label className="input-label">Factura de Referencia *</label>
                        <input className="input-factus" value={form.invoiceRef} onChange={e => setForm({ ...form, invoiceRef: e.target.value })} placeholder="SETT-123" required />
                    </div>
                    <div>
                        <label className="input-label">Cliente *</label>
                        <input className="input-factus" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Nombre del cliente" required />
                    </div>
                    <div>
                        <label className="input-label">Monto a Acreditar ($) *</label>
                        <input type="number" className="input-factus" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="100000" required />
                    </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label className="input-label">Motivo / Concepto de la Nota Crédito *</label>
                    <textarea
                        className="input-factus"
                        value={form.reason}
                        onChange={e => setForm({ ...form, reason: e.target.value })}
                        placeholder="Describa el motivo de la nota crédito..."
                        rows="3"
                        style={{ resize: 'vertical', minHeight: '80px' }}
                        required
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : <><Send size={16} /> Generar Nota Crédito</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Note Detail Modal
const NoteDetail = ({ note, onClose }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
        <div className="card-factus" style={{ maxWidth: '500px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E6E6E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1C' }}>Detalle: {note.number}</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', marginBottom: '4px' }}>Factura Referencia</div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#2D7FF9' }}>{note.invoiceRef}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', marginBottom: '4px' }}>Fecha</div>
                        <div style={{ fontSize: '15px', fontWeight: 500 }}>{note.date}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', marginBottom: '4px' }}>Cliente</div>
                        <div style={{ fontSize: '15px', fontWeight: 500 }}>{note.customerName}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', marginBottom: '4px' }}>Monto</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#1C1C1C' }}>${note.amount.toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', marginBottom: '4px' }}>Motivo</div>
                    <div style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.5 }}>{note.reason}</div>
                </div>
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', marginBottom: '4px' }}>Estado DIAN</div>
                    <span className={`badge ${note.status === 'approved' ? 'badge-success' : note.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                        {note.status === 'approved' ? 'Aprobada por DIAN' : note.status === 'rejected' ? 'Rechazada' : 'Pendiente de Aprobación'}
                    </span>
                </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E6E6E6', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={onClose} className="btn-secondary">Cerrar</button>
            </div>
        </div>
    </div>
);

export default CreditNotesView;
