import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Users, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { customerRepository } from '../../infrastructure/repositories/CustomerRepository';

export const CustomerForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            identification: '', names: '', email: '', phone: '',
            municipality_id: 1006, type_document_identification_id: '3',
            type_organization_id: '2', type_liability_id: '29', type_regime_id: '2'
        }
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const onSubmit = async (data) => {
        setLoading(true);
        setResult(null);
        try {
            const response = await customerRepository.crearCliente(data);
            setResult({ type: 'success', message: `Cliente "${data.names}" registrado exitosamente.` });
            reset();
        } catch (error) {
            setResult({ type: 'error', message: error.message || 'Error al registrar cliente. Intente de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1C1C', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <Users size={22} color="#FF6C37" />
                    Alta de Cliente (DIAN)
                </h1>
                <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Registre un nuevo contribuyente en la base de datos de Factus.</p>
            </div>

            {/* Status Messages */}
            {result && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px',
                    borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 500,
                    background: result.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                    border: `1px solid ${result.type === 'success' ? '#C8E6C9' : '#FFCDD2'}`,
                    color: result.type === 'success' ? '#1B7A3D' : '#FF5252'
                }}>
                    {result.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {result.message}
                </div>
            )}

            {/* Form Card */}
            <form onSubmit={handleSubmit(onSubmit)} className="card-factus" style={{ padding: '0' }}>

                {/* Section 1: Tax Classification */}
                <div style={{ padding: '24px', background: '#FAFAFA', borderBottom: '1px solid #E6E6E6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#FFF3EE', color: '#FF6C37', fontSize: '13px', fontWeight: 700 }}>1</span>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C' }}>Clasificación Tributaria</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <label className="input-label">Tipo de Persona</label>
                            <select className="input-factus" {...register('type_organization_id')}>
                                <option value="2">Persona Natural</option>
                                <option value="1">Persona Jurídica</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Responsabilidad Tributaria</label>
                            <select className="input-factus" {...register('type_liability_id')}>
                                <option value="29">No responsable de IVA</option>
                                <option value="5">Responsable de IVA</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Identification */}
                <div style={{ padding: '24px', borderBottom: '1px solid #E6E6E6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#FFF3EE', color: '#FF6C37', fontSize: '13px', fontWeight: 700 }}>2</span>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C' }}>Identificación</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <label className="input-label">Tipo Documento</label>
                            <select className="input-factus" {...register('type_document_identification_id')}>
                                <option value="3">Cédula de Ciudadanía</option>
                                <option value="6">NIT</option>
                                <option value="2">Cédula de Extranjería</option>
                                <option value="4">Pasaporte</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Número de Identificación *</label>
                            <input
                                className="input-factus"
                                placeholder="Ej: 1234567890"
                                {...register('identification', { required: 'Requerido' })}
                                style={errors.identification ? { borderColor: '#FF5252' } : {}}
                            />
                            {errors.identification && <p style={{ color: '#FF5252', fontSize: '12px', marginTop: '4px' }}>{errors.identification.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Section 3: General Information */}
                <div style={{ padding: '24px', borderBottom: '1px solid #E6E6E6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#FFF3EE', color: '#FF6C37', fontSize: '13px', fontWeight: 700 }}>3</span>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C' }}>Información General</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="input-label">Nombres y Apellidos / Razón Social *</label>
                            <input
                                className="input-factus"
                                placeholder="Nombre completo o razón social"
                                {...register('names', { required: 'Requerido' })}
                                style={errors.names ? { borderColor: '#FF5252' } : {}}
                            />
                            {errors.names && <p style={{ color: '#FF5252', fontSize: '12px', marginTop: '4px' }}>{errors.names.message}</p>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                                <label className="input-label">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    className="input-factus"
                                    placeholder="correo@empresa.com"
                                    {...register('email', {
                                        required: 'Requerido',
                                        pattern: { value: /^\S+@\S+$/, message: 'Email inválido' }
                                    })}
                                    style={errors.email ? { borderColor: '#FF5252' } : {}}
                                />
                                {errors.email && <p style={{ color: '#FF5252', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
                            </div>
                            <div>
                                <label className="input-label">Teléfono</label>
                                <input className="input-factus" placeholder="3001234567" {...register('phone')} />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Código DANE Municipio</label>
                            <input type="number" className="input-factus" placeholder="1006" {...register('municipality_id')} />
                            <p style={{ fontSize: '11px', color: '#9A9A9A', marginTop: '4px' }}>Código DANE del municipio. Ejemplo: 1006 = Bogotá D.C.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#FAFAFA' }}>
                    <button type="button" onClick={() => reset()} className="btn-secondary">Cancelar</button>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Guardando...</> : <><Save size={16} /> Guardar Cliente</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
