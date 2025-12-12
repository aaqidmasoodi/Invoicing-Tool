import React from 'react';
import { useNavigate } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { useData } from '../context/DataContext';
import { Plus, Search, Eye, Download, Edit, Trash2 } from 'lucide-react';
import { InvoiceTemplate } from '../components/InvoiceTemplate';

const Invoices: React.FC = () => {
    const navigate = useNavigate();
    const { invoices, clients, settings, deleteInvoice } = useData();
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleDownload = async (e: React.MouseEvent, invoice: any) => {
        e.stopPropagation();
        try {
            const client = clients.find(c => c.id === invoice.clientId);
            const html = renderToStaticMarkup(
                <InvoiceTemplate invoice={invoice} settings={settings} client={client} />
            );
            if (window.electron) {
                await window.electron.generatePdf(html);
            }
        } catch (err) {
            console.error("PDF download failed", err);
            alert("Failed to generate PDF");
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            deleteInvoice(id);
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                            backgroundColor: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            color: 'white',
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>

                <button
                    onClick={() => navigate('/invoices/new')}
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                    <Plus size={18} />
                    Create Invoice
                </button>
            </div>

            <div style={{
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <tr>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Invoice ID</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Client</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Date</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Amount</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map(invoice => (
                            <tr key={invoice.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>#{invoice.id}</td>
                                <td style={{ padding: '1rem' }}>{invoice.clientName}</td>
                                <td style={{ padding: '1rem' }}>{invoice.date}</td>
                                <td style={{ padding: '1rem' }}>${invoice.total.toFixed(2)}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        backgroundColor:
                                            invoice.status === 'paid' ? 'rgba(16, 185, 129, 0.2)' :
                                                invoice.status === 'overdue' ? 'rgba(239, 68, 68, 0.2)' :
                                                    invoice.status === 'sent' ? 'rgba(59, 130, 246, 0.2)' :
                                                        'rgba(245, 158, 11, 0.2)',
                                        color:
                                            invoice.status === 'paid' ? 'var(--color-success)' :
                                                invoice.status === 'overdue' ? 'var(--color-danger)' :
                                                    invoice.status === 'sent' ? '#3b82f6' :
                                                        'var(--color-warning)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'capitalize'
                                    }}>{invoice.status}</span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                                        style={{ background: 'transparent', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', padding: '4px' }}
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    {invoice.status === 'draft' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/invoices/edit/${invoice.id}`);
                                            }}
                                            style={{ background: 'transparent', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', padding: '4px' }}
                                            title="Edit Invoice"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    )}


                                    <button
                                        onClick={(e) => handleDownload(e, invoice)}
                                        style={{ background: 'transparent', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', padding: '4px' }}
                                        title="Download PDF"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, invoice.id)}
                                        style={{ background: 'transparent', color: 'var(--color-danger)', border: 'none', cursor: 'pointer', padding: '4px' }}
                                        title="Delete Invoice"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredInvoices.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                    No invoices found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
