import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Download } from 'lucide-react';
import { InvoiceTemplate } from '../components/InvoiceTemplate';

const InvoiceView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { invoices, clients, settings } = useData();
    const invoice = invoices.find(i => i.id === id);
    const client = clients.find(c => c.id === invoice?.clientId);

    const handleDownload = async () => {
        const invoiceElement = document.getElementById('invoice-content');
        if (invoiceElement && window.electron) {
            try {
                await window.electron.generatePdf(invoiceElement.outerHTML);
            } catch (e) {
                console.error("PDF Generation failed", e);
                alert("Failed to generate PDF");
            }
        }
    };

    if (!invoice) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Invoice not found.</p>
                <button onClick={() => navigate('/invoices')}>Back to Invoices</button>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button onClick={() => navigate('/invoices')} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <ArrowLeft size={18} /> Back to Invoices
                </button>
                <button onClick={handleDownload} style={{ background: 'var(--color-primary)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                    <Download size={16} /> Download PDF
                </button>
            </div>

            <InvoiceTemplate invoice={invoice} client={client} settings={settings} />
        </div>
    );
};

export default InvoiceView;
