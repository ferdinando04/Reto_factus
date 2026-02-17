import React, { useState, useEffect } from 'react';
import {
    User,
    Home,
    Hash,
    Package,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Send,
    Loader2
} from 'lucide-react';
import { metadataService } from '../../application/services/MetadataService';

/**
 * BillingForm Component
 * Formulario de facturación de alta fidelidad con validación preventiva y carga de metadatos DIAN.
 */
const BillingForm = ({ onSend, onCancel }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState({ municipalities: [], idTypes: [] });

    // Estado del formulario
    const [formData, setFormData] = useState({
        numberingRangeId: 1, // Default para sandbox
        customer: {
            identificationTypeId: '',
            identification: '',
            name: '',
            email: '',
            municipalityId: '',
            address: ''
        },
        items: [
            { id: Date.now(), description: '', quantity: 1, price: 0, taxId: 1 }
        ]
    });

    // Carga de metadatos al iniciar (Expert Tip: Los selectores deben estar pre-cargados)
    useEffect(() => {
        const loadMetadata = async () => {
            try {
                // Simulación de carga (en prod llamaríamos a metadataService)
                setMetadata({
                    municipalities: [
                        { id: 1, name: 'Bogotá' },
                        { id: 2, name: 'Medellín' },
                        { id: 3, name: 'Cali' }
                    ],
                    idTypes: [
                        { id: 3, name: 'Cédula de Ciudadanía' },
                        { id: 6, name: 'NIT' }
                    ]
                });
            } catch (error) {
                console.error('Error cargando metadatos');
            }
        };
        loadMetadata();
    }, []);

    // Cálculo de Totales
    const calculateTotal = () => {
        return formData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { id: Date.now(), description: '', quantity: 1, price: 0, taxId: 1 }]
        });
    };

    const removeItem = (id) => {
        if (formData.items.length > 1) {
            setFormData({
                ...formData,
                items: formData.items.filter(i => i.id !== id)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simular validación y envío (Logic Check)
        setTimeout(() => {
            onSend(formData);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="card-nova p-8">
                {/* Stepper Pro */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -z-10"></div>
                    <StepIndicator num={1} active={step >= 1} label="Cliente" onClick={() => setStep(1)} />
                    <StepIndicator num={2} active={step >= 2} label="Productos" onClick={() => setStep(2)} />
                    <StepIndicator num={3} active={step >= 3} label="Resumen" onClick={() => setStep(3)} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1: Cliente */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Tipo Identificación"
                                    type="select"
                                    options={metadata.idTypes}
                                    value={formData.customer.identificationTypeId}
                                    onChange={(v) => setFormData({ ...formData, customer: { ...formData.customer, identificationTypeId: v } })}
                                />
                                <FormInput
                                    label="Número Documento"
                                    placeholder="123456789"
                                    value={formData.customer.identification}
                                    onChange={(v) => setFormData({ ...formData, customer: { ...formData.customer, identification: v } })}
                                />
                                <FormInput
                                    label="Nombre / Razón Social"
                                    placeholder="Fernando Vega"
                                    className="md:col-span-2"
                                    value={formData.customer.name}
                                    onChange={(v) => setFormData({ ...formData, customer: { ...formData.customer, name: v } })}
                                />
                                <FormInput
                                    label="Correo Electrónico"
                                    placeholder="hola@ejemplo.com"
                                    value={formData.customer.email}
                                    onChange={(v) => setFormData({ ...formData, customer: { ...formData.customer, email: v } })}
                                />
                                <FormInput
                                    label="Municipio"
                                    type="select"
                                    options={metadata.municipalities}
                                    value={formData.customer.municipalityId}
                                    onChange={(v) => setFormData({ ...formData, customer: { ...formData.customer, municipalityId: v } })}
                                />
                            </div>
                            <div className="flex justify-end pt-6">
                                <button type="button" onClick={() => setStep(2)} className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl transition-all">Siguiente</button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Productos */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-4">
                                {formData.items.map((item, idx) => (
                                    <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-end">
                                        <div className="flex-1">
                                            <FormInput
                                                label="Descripción"
                                                placeholder="Producto o Servicio"
                                                value={item.description}
                                                onChange={(v) => {
                                                    const newInvoices = [...formData.items];
                                                    newInvoices[idx].description = v;
                                                    setFormData({ ...formData, items: newInvoices });
                                                }}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <FormInput
                                                label="Cant."
                                                type="number"
                                                value={item.quantity}
                                                onChange={(v) => {
                                                    const newInvoices = [...formData.items];
                                                    newInvoices[idx].quantity = v;
                                                    setFormData({ ...formData, items: newInvoices });
                                                }}
                                            />
                                        </div>
                                        <div className="w-40">
                                            <FormInput
                                                label="Precio Unit."
                                                type="number"
                                                value={item.price}
                                                onChange={(v) => {
                                                    const newInvoices = [...formData.items];
                                                    newInvoices[idx].price = v;
                                                    setFormData({ ...formData, items: newInvoices });
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="p-3 text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all mb-1"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium py-2 px-4 transition-all"
                                >
                                    <Plus size={18} /> Añadir otro ítem
                                </button>
                            </div>
                            <div className="flex justify-between pt-6">
                                <button type="button" onClick={() => setStep(1)} className="text-slate-400">Anterior</button>
                                <button type="button" onClick={() => setStep(3)} className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl transition-all">Siguiente</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Resumen */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-3xl">
                                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-400" size={20} />
                                    Confirmación de Factura
                                </h3>
                                <div className="space-y-4">
                                    <SummaryItem label="Comprador" value={formData.customer.name || 'N/A'} />
                                    <SummaryItem label="Identificación" value={`${formData.customer.identification || 'N/A'}`} />
                                    <SummaryItem label="Total Bruto" value={`$${calculateTotal().toLocaleString()}`} />
                                    <SummaryItem label="Impuestos (IVA 19%)" value={`$${(calculateTotal() * 0.19).toLocaleString()}`} />
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-6">
                                        <span className="text-xl font-bold">Total a Pagar</span>
                                        <span className="text-3xl font-bold text-white">${(calculateTotal() * 1.19).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between pt-6">
                                <button type="button" onClick={() => setStep(2)} className="text-slate-400 outline-none">Anterior</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                    {loading ? 'Generando...' : 'Firmar y Enviar Factura'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// Subcomponentes Pro
const StepIndicator = ({ num, active, label, onClick }) => (
    <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={onClick}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2 ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-900 border-white/10 text-slate-500 group-hover:border-white/30'}`}>
            {num}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-widest ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </div>
);

const FormInput = ({ label, type = 'text', options = [], className = '', ...props }) => (
    <div className={`space-y-2 ${className}`}>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-widest block ml-1">{label}</label>
        {type === 'select' ? (
            <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                onChange={(e) => props.onChange(e.target.value)}
                value={props.value}
            >
                <option value="">Seleccionar...</option>
                {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
            </select>
        ) : (
            <input
                type={type}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all"
                {...props}
                onChange={(e) => props.onChange(e.target.value)}
            />
        )}
    </div>
);

const SummaryItem = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="font-medium text-slate-200">{value}</span>
    </div>
);

export default BillingForm;
