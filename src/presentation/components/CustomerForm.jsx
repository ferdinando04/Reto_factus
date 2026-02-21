import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, Building2, User, Save, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import { customerRepository } from '../../infrastructure/repositories/CustomerRepository';

export const CustomerForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            legal_organization_id: "2", // 2 = Natural (por defecto)
            identification_document_id: "3", // 3 = Cédula de Ciudadanía
            identification: "",
            names: "",
            email: "",
            phone: "",
            municipality_id: "149", // Ejemplo genérico (corresponde a un municipio real en BD Factus)
            tribute_id: "21" // 21 = No responsable (por defecto)
        }
    });

    // Observar el tipo de persona para cambiar el icono de feedback dinámicamente
    const watchOrganizationId = watch("legal_organization_id");
    const isJuridica = watchOrganizationId === "1";

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        console.log('[CustomerForm] Intentando guardar payload del cliente:', data);

        try {
            // Llamada real al CustomerRepository
            await customerRepository.crearCliente(data);

            console.log('[CustomerForm] ¡Cliente guardado exitosamente en Factus DIAN!');
            setSubmitStatus('success');

            // Revertir el estado visual de éxito después de 4s
            setTimeout(() => setSubmitStatus(null), 4000);

        } catch (error) {
            console.error('[CustomerForm] Fallo al guardar:', error);
            setSubmitStatus('error');
            // Podríamos mostrar el error con un state si quisiéramos renderizarlo
            // setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            <UserPlus size={24} className="text-blue-600" />
                            Alta de Cliente (DIAN)
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm font-medium">Registre un nuevo contribuyente en la base de datos de Factus Nova.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">

                    {/* -- Filtros Maestros DIAN -- */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-5">
                        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3">
                            <ShieldAlert size={14} className="text-blue-500" /> Clasificación Tributaria Obligatoria
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Tipo de Persona</label>
                                <div className="relative">
                                    <select
                                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none shadow-sm"
                                        {...register('legal_organization_id', { required: true })}
                                    >
                                        <option value="2">Persona Natural</option>
                                        <option value="1">Persona Jurídica</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        {isJuridica ? <Building2 size={16} /> : <User size={16} />}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Responsabilidad (Tributo)</label>
                                <select
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none shadow-sm"
                                    {...register('tribute_id', { required: true })}
                                >
                                    <option value="21">No responsable de IVA (Régimen Simplificado)</option>
                                    <option value="18">Responsable de IVA (Régimen Común)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* -- Datos de Identificación -- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-600 mb-2">Tipo Doc.</label>
                            <select
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none shadow-sm"
                                {...register('identification_document_id', { required: true })}
                            >
                                <option value="3">Cédula de Ciudadanía (CC)</option>
                                <option value="6">NIT</option>
                                <option value="4">Cédula de Extranjería (CE)</option>
                                <option value="5">Pasaporte (PP)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-2">Número de Identificación</label>
                            <input
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                placeholder="Sin puntos ni guiones (Ej: 900123456)"
                                {...register('identification', { required: true, pattern: /^[0-9]+$/ })}
                            />
                            {errors.identification && <span className="text-rose-500 text-xs mt-1.5 ml-1 block font-medium">Número de documento inválido o requerido</span>}
                        </div>
                    </div>

                    {/* -- Información General -- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-2">
                                {isJuridica ? 'Razón Social' : 'Nombres y Apellidos Completos'}
                            </label>
                            <input
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                placeholder={isJuridica ? 'Empresa Ejemplo S.A.S.' : 'Juan Pérez'}
                                {...register('names', { required: true })}
                            />
                            {errors.names && <span className="text-rose-500 text-xs mt-1.5 ml-1 block font-medium">Este campo es requerido por DIAN</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Correo Electrónico (Recepción FE)</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                placeholder="facturacion@cliente.com"
                                {...register('email', { required: true })}
                            />
                            {errors.email && <span className="text-rose-500 text-xs mt-1.5 ml-1 block font-medium">Email requerido para envío de XML/PDF</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Teléfono</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                placeholder="300 000 0000"
                                {...register('phone')}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-2">Código DANE Municipio</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                                placeholder="Ej: 149 (Bogotá D.C.)"
                                {...register('municipality_id', { required: true })}
                            />
                            {errors.municipality_id && <span className="text-rose-500 text-xs mt-1.5 ml-1 block font-medium">Código DANE requerido</span>}
                            <p className="text-[10px] text-slate-500 mt-1.5 ml-1">Debe ser el ID interno de municipio provisto por la API de Factus.</p>
                        </div>
                    </div>

                    {/* -- Botón de Acción -- */}
                    <div className="pt-8 border-t border-slate-200 mt-8 flex flex-col md:flex-row gap-4 items-center justify-end">
                        {submitStatus === 'error' && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 px-4 py-2 rounded-lg text-sm md:w-auto w-full">
                                <AlertCircle size={18} className="shrink-0" />
                                <span className="font-medium">Error al registrar cliente.</span>
                            </motion.div>
                        )}

                        {submitStatus === 'success' && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-sm md:w-auto w-full">
                                <CheckCircle2 size={18} className="shrink-0" />
                                <span className="font-medium">Cliente guardado exitosamente.</span>
                            </motion.div>
                        )}

                        <button
                            type="button"
                            className="w-full md:w-auto px-6 py-2.5 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded-lg text-sm transition-colors shadow-sm"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                w-full md:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm
                                ${isSubmitting
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:shadow-md'
                                }
                            `}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin text-blue-400" size={18} />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Guardar Cliente</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </motion.div>
    );
};
