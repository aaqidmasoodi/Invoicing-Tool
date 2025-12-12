import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Trash, Plus } from 'lucide-react';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import type { Invoice } from '../types';

const InvoiceBuilder: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { clients, addInvoice, updateInvoice, invoices, settings } = useData();

    const [clientId, setClientId] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState([{ id: Date.now(), description: '', quantity: 1, price: 0 }]);
    const [taxLabel, setTaxLabel] = useState(settings.taxLabel || 'Tax');
    const [taxRate, setTaxRate] = useState(settings.taxRate || 0);
    const [statusData, setStatusData] = useState<'draft' | 'created'>('created');

    useEffect(() => {
        if (id) {
            const invoice = invoices.find(i => i.id === id);
            if (invoice) {
                if (invoice.status !== 'draft') {
                    alert('Only draft invoices can be edited.');
                    navigate('/invoices');
                    return;
                }
                setClientId(invoice.clientId);
                setInvoiceNumber(invoice.id);
                setDate(invoice.date);
                setDueDate(invoice.dueDate);
                // Ensure IDs are unique numbers for keying, though DB stores as string
                setItems(invoice.items.map((i, idx) => ({
                    id: Date.now() + idx, // Regenerate temp IDs for React keys or parse? InvoiceItem id is string.
                    description: i.description,
                    quantity: i.quantity,
                    price: i.price
                })));
                setTaxLabel(invoice.taxLabel || 'Tax');
                setTaxRate(invoice.taxRate || 0);
            }
        }
    }, [id, invoices, navigate]); // Careful with `invoices` dependency causing loops if updates change it

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = subtotal * (Number(taxRate) / 100);
        return subtotal + taxAmount;
    };

    // ... items handlers ...

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
    };

    const handleRemoveItem = (id: number) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleItemChange = (id: number, field: string, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const client = clients.find(c => c.id === clientId);
        if (!client) return;

        const invoiceData = {
            clientId,
            clientName: client.name,
            date,
            dueDate: dueDate || date,
            items: items.map(i => ({
                id: i.id.toString(),
                description: i.description,
                quantity: Number(i.quantity),
                price: Number(i.price)
            })),
            status: statusData,
            total: calculateTotal(),
            taxLabel,
            taxRate: Number(taxRate)
        };

        if (id) {
            updateInvoice({ ...invoiceData, id: id }); // Use original ID, ignore invoiceNumber field changes if any
        } else {
            addInvoice({ ...invoiceData, id: invoiceNumber || undefined });
        }
        navigate('/invoices');
    };

    return (
        <div>
            <button onClick={() => navigate('/invoices')} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                <ArrowLeft size={18} /> Back to Invoices
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Form */}
                <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>{id ? 'Edit Invoice' : 'Create New Invoice'}</h2>
                    <form onSubmit={handleSubmit} id="invoice-form">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Client</label>
                                <select
                                    required
                                    value={clientId}
                                    onChange={e => setClientId(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                >
                                    <option value="">Select a client</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Invoice Number (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Auto-generated if empty"
                                    value={invoiceNumber}
                                    disabled={!!id}
                                    onChange={e => setInvoiceNumber(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Issue Date</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                />
                            </div>
                        </div>

                        {/* Tax Inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Tax Label</label>
                                <input
                                    type="text"
                                    value={taxLabel}
                                    onChange={e => setTaxLabel(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Tax Rate (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={taxRate}
                                    onChange={e => setTaxRate(Number(e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Line Items</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {items.map((item) => (
                                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 0.5fr', gap: '0.5rem', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            required
                                            value={item.description}
                                            onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            min="1"
                                            required
                                            value={item.quantity}
                                            onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            min="0"
                                            required
                                            value={item.price}
                                            onChange={e => handleItemChange(item.id, 'price', Number(e.target.value))}
                                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                style={{ marginTop: '1rem', background: 'transparent', border: '1px dashed var(--color-border)', width: '100%', padding: '0.5rem', color: 'var(--color-text-secondary)', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>

                            <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{taxLabel} ({taxRate}%): ${(calculateSubtotal() * (Number(taxRate) / 100)).toFixed(2)}</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>${calculateTotal().toFixed(2)}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                type="submit"
                                onClick={() => setStatusData('draft')}
                                style={{ flex: 1, padding: '1rem', backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                onClick={() => setStatusData('created')}
                                style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Create Invoice
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview (Paper Style) */}
                <InvoiceTemplate
                    invoice={{
                        id: invoiceNumber || 'DRAFT',
                        clientId,
                        clientName: clients.find(c => c.id === clientId)?.name || 'Client Name',
                        date,
                        dueDate: dueDate || date,
                        items: items.map(i => ({ ...i, id: String(i.id) })),
                        status: statusData,
                        total: calculateTotal(),
                        taxLabel,
                        taxRate: Number(taxRate)
                    } as Invoice}
                    client={clients.find(c => c.id === clientId)}
                    settings={settings}
                />
            </div>
        </div>
    );
};

export default InvoiceBuilder;
