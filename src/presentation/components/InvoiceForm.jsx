import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { invoiceRepository } from '../../infrastructure/repositories/InvoiceRepository';

export const InvoiceForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'idle', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            customer_identification: '',
            customer_names: '',
            customer_email: '',
            customer_phone: '',
            items: [
                { code_reference: 'SERV-001', name: '', quantity: 1, price: 0 }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    // Calcular Subtotal interactivo para mejor UX
    const watchItems = watch("items");
    const totalAmount = watchItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            await invoiceRepository.emitirFactura(data);
            setSubmitStatus('success');
            // Opcional: Podríamos hacer un reset() del form aquí si lo deamos
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 pt-8 pb-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <FileText size={24} className="text-blue-600" />
                        Emisión de Factura
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium ml-9">Defina el cliente y añada los productos a facturar electrónicamente.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
                    {/* -- Sección 1: Datos del Cliente -- */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Datos del Receptor</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Documento (NIT/CC)</label>
                                <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Ej: 900123456"
                                    {...register('customer_identification', { required: true })}
                                />
                                {errors.customer_identification && <span className="text-rose-500 text-xs mt-1.5 ml-1 block font-medium">Documento requerido</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Razón Social / Nombre Completo</label>
                                <input
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Ej: Halltec SAS"
                                    {...register('customer_names', { required: true })}
                                />
                                {errors.customer_names && <span className="text-rose-500 text-xs mt-1.5 ml-1 block font-medium">Nombre requerido</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="facturacion@empresa.com"
                                    {...register('customer_email', { required: true })}
                                />
                                {errors.customer_email && <span className="text-rose-500 text-xs mt-1.5 ml-1 block font-medium">Email requerido</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Teléfono Móvil / Fijo</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="3001234567"
                                    {...register('customer_phone')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* -- Sección 2: Productos / Servicios -- */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Líneas de Factura</h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => append({ code_reference: `ITEM-${fields.length + 1}`, name: '', quantity: 1, price: 0 })}
                                className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-4 py-2 rounded-lg"
                            >
                                <Plus size={16} /> Añadir Fila
                            </button>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {fields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        initial={{ opacity: 0, height: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-12 gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
                                    >
                                        <div className="col-span-12 md:col-span-5 relative">
                                            <input
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                placeholder="Descripción del concepto"
                                                {...register(`items.${index}.name`, { required: true })}
                                            />
                                        </div>
                                        <div className="col-span-4 md:col-span-2 relative">
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                placeholder="Cant."
                                                {...register(`items.${index}.quantity`, { required: true, valueAsNumber: true })}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase pointer-events-none">UND</span>
                                        </div>
                                        <div className="col-span-6 md:col-span-4 relative flex items-center">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none text-sm">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                placeholder="Precio Unit."
                                                {...register(`items.${index}.price`, { required: true, valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1 flex justify-end items-center h-[38px]">
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                                                title="Eliminar ítem"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {fields.length === 0 && (
                                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                                    <p className="text-slate-500 text-sm font-medium">No hay conceptos en la factura. Añade al menos uno para continuar.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* -- Resumen y Acciones Finales -- */}
                    <div className="bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">

                        <div className="text-center md:text-left">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Estimado</p>
                            <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                                ${totalAmount.toLocaleString('es-CO')}
                                <span className="text-sm font-bold text-slate-400 ml-2 tracking-normal">COP</span>
                            </p>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                            {submitStatus === 'error' && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-lg text-sm w-full md:w-auto max-w-md">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <span className="font-medium">{errorMessage}</span>
                                </motion.div>
                            )}

                            {submitStatus === 'success' && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-lg text-sm w-full md:w-auto">
                                    <CheckCircle2 size={20} className="shrink-0" />
                                    <span className="font-bold">Factura Emitida a la DIAN Exitosamente</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || fields.length === 0}
                                className={`
                                    w-full md:w-auto px-8 py-3.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm
                                    ${isSubmitting || fields.length === 0
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-transparent'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:shadow-md'
                                    }
                                `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin text-blue-200" size={20} />
                                        <span>Transmitiendo...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        <span>Emitir Factura Electrónica</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};
