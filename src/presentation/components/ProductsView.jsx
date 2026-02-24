import React, { useState, useEffect } from 'react';
import { PackageOpen, Plus, Pencil, Trash2, Search, Save, X, Loader2, CheckCircle2 } from 'lucide-react';

// Local storage key
const STORAGE_KEY = 'factus_products';

const getProducts = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
};

const saveProducts = (products) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

const INITIAL_PRODUCTS = [
    { id: 1, code: 'SRV-001', name: 'Consultoría Técnica Profesional', price: 250000, tax: '19', status: 'active' },
    { id: 2, code: 'SRV-002', name: 'Desarrollo de Software a Medida', price: 1500000, tax: '19', status: 'active' },
    { id: 3, code: 'SRV-003', name: 'Auditoría Contable y Tributaria', price: 800000, tax: '0', status: 'active' },
    { id: 4, code: 'PRD-001', name: 'Licencia SaaS Mensual - Plan Pro', price: 120000, tax: '19', status: 'active' },
    { id: 5, code: 'PRD-002', name: 'Certificado Digital de Firma', price: 95000, tax: '0', status: 'inactive' },
];

const ProductsView = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        let stored = getProducts();
        if (stored.length === 0) {
            saveProducts(INITIAL_PRODUCTS);
            stored = INITIAL_PRODUCTS;
        }
        setProducts(stored);
    }, []);

    const showNotif = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSave = (product) => {
        let updated;
        if (product.id) {
            updated = products.map(p => p.id === product.id ? product : p);
            showNotif('Producto actualizado exitosamente');
        } else {
            const newProduct = { ...product, id: Date.now(), status: 'active' };
            updated = [...products, newProduct];
            showNotif('Producto creado exitosamente');
        }
        setProducts(updated);
        saveProducts(updated);
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('¿Está seguro de eliminar este producto?')) return;
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        saveProducts(updated);
        showNotif('Producto eliminado');
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1C1C', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <PackageOpen size={22} color="#FF6C37" /> Catálogo de Productos y Servicios
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6B6B6B' }}>Administre los ítems disponibles para facturación electrónica.</p>
                </div>
                <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>

            {/* Search & Filters */}
            <div className="card-factus" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 250px', minWidth: '200px' }}>
                    <Search size={15} color="#9A9A9A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        className="input-factus"
                        placeholder="Buscar por nombre o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                    />
                </div>
                <div style={{ fontSize: '13px', color: '#6B6B6B' }}>
                    {filtered.length} de {products.length} productos
                </div>
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingProduct(null); }}
                />
            )}

            {/* Products Table */}
            <div className="card-factus">
                <div style={{ overflowX: 'auto' }}>
                    <table className="table-factus">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre del Producto/Servicio</th>
                                <th>Precio Unitario</th>
                                <th>Impuesto</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? filtered.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600, color: '#2D7FF9', fontSize: '13px' }}>{p.code}</td>
                                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                                    <td style={{ fontWeight: 700 }}>${Number(p.price).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${p.tax === '0' ? 'badge-info' : 'badge-warning'}`}>
                                            {p.tax === '0' ? 'Excluido' : `IVA ${p.tax}%`}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                            {p.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', color: '#2D7FF9', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}>
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        <PackageOpen size={32} color="#E6E6E6" style={{ margin: '0 auto 8px', display: 'block' }} />
                                        <p style={{ color: '#9A9A9A', fontSize: '14px' }}>No se encontraron productos.</p>
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

// Product Form (inline modal)
const ProductForm = ({ product, onSave, onCancel }) => {
    const [form, setForm] = useState({
        code: product?.code || '',
        name: product?.name || '',
        price: product?.price || '',
        tax: product?.tax || '19',
        status: product?.status || 'active',
        id: product?.id || null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.code || !form.name || !form.price) return;
        onSave({ ...form, price: Number(form.price) });
    };

    return (
        <div className="card-factus" style={{ marginBottom: '20px', border: '2px solid #FF6C37' }}>
            <div style={{ padding: '20px 24px', background: '#FFF3EE', borderBottom: '1px solid #FFD4C2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1C1C' }}>
                    {product ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div>
                        <label className="input-label">Código *</label>
                        <input className="input-factus" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SRV-001" required />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">Nombre *</label>
                        <input className="input-factus" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Servicio de consultoría" required />
                    </div>
                    <div>
                        <label className="input-label">Precio Unitario ($) *</label>
                        <input type="number" className="input-factus" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="100000" required />
                    </div>
                    <div>
                        <label className="input-label">Impuesto (%)</label>
                        <select className="input-factus" value={form.tax} onChange={e => setForm({ ...form, tax: e.target.value })}>
                            <option value="19">IVA 19%</option>
                            <option value="5">IVA 5%</option>
                            <option value="0">Excluido (0%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="input-label">Estado</label>
                        <select className="input-factus" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                    <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
                    <button type="submit" className="btn-primary"><Save size={16} /> Guardar</button>
                </div>
            </form>
        </div>
    );
};

export default ProductsView;
