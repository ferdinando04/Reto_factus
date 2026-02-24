import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FileText, Send, Loader2, Plus, Trash2, CheckCircle2, AlertCircle, X, AlertTriangle, Download, Mail, Eye } from 'lucide-react';
import { invoiceRepository } from '../../infrastructure/repositories/InvoiceRepository';
import { axiosClient } from '../../infrastructure/http/axiosClient';

/* ─── Error Modal ─── */
const ErrorModal = ({ error, onClose }) => {
    if (!error) return null;
    const details = error.details || {};
    const fieldErrors = details.errors || {};
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
            <div className="card-factus animate-fade-in" style={{ maxWidth: '560px', width: '100%', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #FFCDD2', background: '#FFEBEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FF5252', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={20} color="#fff" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1C' }}>Error al Emitir Factura</h3>
                            {details.statusCode && <span style={{ fontSize: '12px', color: '#FF5252', fontWeight: 600 }}>Código HTTP: {details.statusCode}</span>}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '20px 24px' }}>
                    <div style={{ background: '#FFF3E0', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <AlertCircle size={18} color="#B36B00" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '14px', color: '#7A4A00', lineHeight: 1.5 }}>{details.message || error.message}</p>
                    </div>
                    {hasFieldErrors ? (
                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1C1C1C', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Errores de Validación</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {Object.entries(fieldErrors).map(([field, msgs]) => (
                                    <div key={field} style={{ background: '#FAFAFA', border: '1px solid #E6E6E6', borderRadius: '8px', padding: '12px 14px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#FF5252', marginBottom: '4px', fontFamily: 'monospace' }}>📌 {field}</div>
                                        {(Array.isArray(msgs) ? msgs : [msgs]).map((m, i) => (
                                            <div key={i} style={{ fontSize: '13px', color: '#6B6B6B', paddingLeft: '20px' }}>• {m}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ background: '#FAFAFA', borderRadius: '8px', padding: '16px', border: '1px solid #E6E6E6' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>¿Cómo solucionarlo?</h4>
                            <ul style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.8, paddingLeft: '20px' }}>
                                <li>Verifique el <strong>Documento (NIT/CC)</strong></li>
                                <li>Incluya <strong>Razón Social</strong> y <strong>Dirección</strong></li>
                                <li><strong>Municipio:</strong> 169=Bogotá, 80=Medellín, 1079=Cali</li>
                                <li>Cada ítem: <strong>nombre, cantidad y precio</strong></li>
                            </ul>
                        </div>
                    )}
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid #E6E6E6', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn-primary">Entendido, Corregir Datos</button>
                </div>
            </div>
        </div>
    );
};

/* ─── Success Modal (PDF / Email / Detalle) ─── */
const SuccessModal = ({ data, onClose, onDownloadPDF, onSendEmail, loadingAction }) => {
    if (!data) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
            <div className="card-factus animate-fade-in" style={{ maxWidth: '520px', width: '100%', margin: 'auto' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '32px 24px 16px', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                        <CheckCircle2 size={28} color="#00C853" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1C1C', marginBottom: '6px' }}>¡Factura Emitida Exitosamente!</h3>
                    <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.5 }}>
                        Factura <strong>#{data.billNumber}</strong> certificada ante la DIAN.
                    </p>
                    <span className="badge badge-success" style={{ fontSize: '12px', padding: '5px 12px', marginTop: '10px', display: 'inline-block' }}>
                        Certificada por la DIAN ✓
                    </span>
                </div>

                {/* Resumen */}
                <div style={{ margin: '0 20px', padding: '14px', background: '#F5F9FF', borderRadius: '10px', border: '1px solid #E0ECFF' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                        <div><span style={{ color: '#9A9A9A', display: 'block', marginBottom: '2px' }}>Número</span><strong>{data.billNumber}</strong></div>
                        <div><span style={{ color: '#9A9A9A', display: 'block', marginBottom: '2px' }}>Referencia</span><strong>{data.referenceCode || '—'}</strong></div>
                        <div><span style={{ color: '#9A9A9A', display: 'block', marginBottom: '2px' }}>Cliente</span><strong>{data.customerName || '—'}</strong></div>
                        <div><span style={{ color: '#9A9A9A', display: 'block', marginBottom: '2px' }}>Total</span><strong style={{ color: '#FF6C37' }}>${data.total ? Number(data.total).toLocaleString() : '—'} COP</strong></div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={onDownloadPDF} disabled={loadingAction === 'pdf'}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: '#FF6C37', color: '#fff', fontWeight: 700, fontSize: '14px', opacity: loadingAction === 'pdf' ? 0.7 : 1 }}>
                        {loadingAction === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        Descargar PDF de Factura
                    </button>

                    <button onClick={onSendEmail} disabled={loadingAction === 'email'}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: '2px solid #FF6C37', cursor: 'pointer', background: '#FFF3EE', color: '#FF6C37', fontWeight: 700, fontSize: '14px', opacity: loadingAction === 'email' ? 0.7 : 1 }}>
                        {loadingAction === 'email' ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                        Enviar PDF por Correo
                    </button>

                    <a href={`https://app-sandbox.factus.com.co/documents/bills`} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: '1px solid #E6E6E6', cursor: 'pointer', background: '#FAFAFA', color: '#6B6B6B', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
                        <Eye size={16} /> Ver en Portal Factus
                    </a>
                </div>

                <div style={{ padding: '0 20px 16px', textAlign: 'center' }}>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9A9A9A', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                        Cerrar y emitir otra factura
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Invoice Form ─── */
export const InvoiceForm = () => {
    const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            customer_identification: '',
            customer_names: '',
            customer_email: '',
            customer_phone: '',
            customer_address: '',
            customer_municipality_id: 169, // 169 = Bogotá D.C.
            items: [{ name: '', code_reference: 'SRV001', quantity: 1, price: 0 }]
        }
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'items' });
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState(null);
    const [successData, setSuccessData] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null);
    const watchItems = watch('items');

    const calculateTotal = () => (watchItems || []).reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0);

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorModal(null);
        setSuccessData(null);
        try {
            const response = await invoiceRepository.emitirFactura(data);
            const bill = response?.bill || response?.data?.bill || {};
            setSuccessData({
                billNumber: bill.number || 'N/A',
                referenceCode: bill.reference_code || '',
                customerName: data.customer_names,
                customerEmail: data.customer_email,
                total: calculateTotal(),
                fullResponse: response
            });
        } catch (error) {
            setErrorModal(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!successData?.billNumber || successData.billNumber === 'N/A') return;
        setLoadingAction('pdf');
        try {
            const response = await axiosClient.get(`/v1/bills/download-pdf/${successData.billNumber}`);
            // Factus devuelve el PDF en base64 dentro del campo "pdf_base_64_encoded"
            const pdfB64 = response?.data?.pdf_base_64_encoded || response?.pdf_base_64_encoded;
            if (pdfB64) {
                const byteCharacters = atob(pdfB64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                // Abrir en nueva pestaña para ver e imprimir
                window.open(url, '_blank');
            } else {
                // Si no hay base64, abrir en el portal
                window.open(`https://app-sandbox.factus.com.co/documents/bills`, '_blank');
            }
        } catch (error) {
            console.error('[PDF] Error:', error);
            // Fallback: intentar con /show/ endpoint
            try {
                const res2 = await axiosClient.get(`/v1/bills/show/${successData.billNumber}`);
                const bill2 = res2?.data?.bill || res2?.bill || {};
                if (bill2.public_url) {
                    window.open(bill2.public_url, '_blank');
                } else {
                    window.open(`https://app-sandbox.factus.com.co/documents/bills`, '_blank');
                }
            } catch {
                window.open(`https://app-sandbox.factus.com.co/documents/bills`, '_blank');
            }
        } finally {
            setLoadingAction(null);
        }
    };

    const handleSendEmail = async () => {
        if (!successData?.billNumber) return;
        setLoadingAction('email');
        try {
            // Intentar enviar por la API de Factus
            await axiosClient.post(`/v1/bills/send-email`, {
                number: successData.billNumber,
                email: successData.customerEmail
            });
            alert(`✅ PDF enviado exitosamente al correo ${successData.customerEmail}.`);
        } catch (error) {
            console.error('[Email] Error:', error);
            // En sandbox, el envío puede no estar disponible
            alert(`⚠️ El envío por correo no está disponible en el Sandbox de Factus.\n\nPuedes descargar el PDF y enviarlo manualmente a ${successData.customerEmail}.`);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCloseSuccess = () => {
        setSuccessData(null);
        reset();
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 12px' }}>
            <ErrorModal error={errorModal} onClose={() => setErrorModal(null)} />
            <SuccessModal data={successData} onClose={handleCloseSuccess} onDownloadPDF={handleDownloadPDF} onSendEmail={handleSendEmail} loadingAction={loadingAction} />

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 700, color: '#1C1C1C', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <FileText size={22} color="#FF6C37" />
                    Comprobante Electrónico de Facturación
                </h1>
                <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Complete los datos del receptor y añada los conceptos a facturar.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Section 1: Receptor */}
                <div className="card-factus" style={{ marginBottom: '20px' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E6E6E6', background: '#FAFAFA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#FFF3EE', color: '#FF6C37', fontSize: '13px', fontWeight: 700 }}>1</span>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C' }}>Datos del Receptor</h3>
                        </div>
                    </div>
                    <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        <div>
                            <label className="input-label">Documento (NIT / CC) *</label>
                            <input className="input-factus" placeholder="Ej: 900123456" {...register('customer_identification', { required: 'Requerido' })} style={errors.customer_identification ? { borderColor: '#FF5252' } : {}} />
                            {errors.customer_identification && <p style={{ color: '#FF5252', fontSize: '12px', marginTop: '4px' }}>{errors.customer_identification.message}</p>}
                        </div>
                        <div>
                            <label className="input-label">Razón Social / Nombre *</label>
                            <input className="input-factus" placeholder="Nombre del cliente" {...register('customer_names', { required: 'Requerido' })} style={errors.customer_names ? { borderColor: '#FF5252' } : {}} />
                        </div>
                        <div>
                            <label className="input-label">Correo Electrónico</label>
                            <input type="email" className="input-factus" placeholder="correo@empresa.com" {...register('customer_email')} />
                        </div>
                        <div>
                            <label className="input-label">Teléfono</label>
                            <input className="input-factus" placeholder="3001234567" {...register('customer_phone')} />
                        </div>
                        <div>
                            <label className="input-label">Dirección *</label>
                            <input className="input-factus" placeholder="Calle 100 #15-20" {...register('customer_address', { required: 'Requerido' })} />
                        </div>
                        <div>
                            <label className="input-label">Municipio (ID Factus)</label>
                            <select className="input-factus" {...register('customer_municipality_id', { valueAsNumber: true })} style={{ height: '44px' }}>
                                <option value={169}>Bogotá D.C.</option>
                                <option value={80}>Medellín</option>
                                <option value={1079}>Cali</option>
                                <option value={88}>Barranquilla</option>
                                <option value={318}>Cartagena</option>
                                <option value={238}>Bucaramanga</option>
                                <option value={885}>Pereira</option>
                                <option value={622}>Manizales</option>
                                <option value={448}>Ibagué</option>
                                <option value={792}>Pasto</option>
                                <option value={1061}>Villavicencio</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Items */}
                <div className="card-factus" style={{ marginBottom: '20px' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #E6E6E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: '#FAFAFA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#FFF3EE', color: '#FF6C37', fontSize: '13px', fontWeight: 700 }}>2</span>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C' }}>Líneas de Factura</h3>
                        </div>
                        <button type="button" onClick={() => append({ name: '', code_reference: `SRV${String(fields.length + 1).padStart(3, '0')}`, quantity: 1, price: 0 })} className="btn-secondary" style={{ fontSize: '13px', padding: '8px 14px' }}>
                            <Plus size={14} /> Añadir Ítem
                        </button>
                    </div>
                    <div style={{ padding: '14px 24px' }}>
                        {fields.length === 0 ? (
                            <div style={{ border: '2px dashed #E6E6E6', borderRadius: '10px', padding: '32px', textAlign: 'center', color: '#9A9A9A', fontSize: '14px' }}>
                                <FileText size={24} color="#E6E6E6" style={{ margin: '0 auto 6px', display: 'block' }} />
                                No hay conceptos. Añade al menos uno.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {fields.map((field, index) => (
                                    <div key={field.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '14px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E6E6E6', flexWrap: 'wrap' }}>
                                        <div style={{ flex: '3 1 180px', minWidth: '180px' }}>
                                            <label className="input-label">Descripción *</label>
                                            <input className="input-factus" placeholder="Producto o servicio..." {...register(`items.${index}.name`, { required: true })} />
                                        </div>
                                        <div style={{ flex: '1 1 80px', minWidth: '80px' }}>
                                            <label className="input-label">Cant.</label>
                                            <input type="number" className="input-factus" min="1" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                                        </div>
                                        <div style={{ flex: '1.5 1 110px', minWidth: '110px' }}>
                                            <label className="input-label">$ Precio Unit.</label>
                                            <input type="number" className="input-factus" min="0" {...register(`items.${index}.price`, { valueAsNumber: true })} />
                                        </div>
                                        <button type="button" onClick={() => remove(index)} style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: Summary + Submit */}
                <div className="card-factus" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', flexWrap: 'wrap', gap: '14px' }}>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Total Estimado</div>
                        <div style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, color: '#1C1C1C' }}>
                            ${calculateTotal().toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#6B6B6B' }}>COP</span>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '14px 24px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Emitiendo...</> : <><Send size={16} /> Emitir Factura Electrónica</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;
