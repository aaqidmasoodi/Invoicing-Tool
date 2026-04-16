import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, Download, Mail } from 'lucide-react';
import { InvoiceTemplate } from '../components/InvoiceTemplate';

const InvoiceView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { invoices, clients, settings } = useData();
    const invoice = invoices.find(i => i.id === id);
    const client = clients.find(c => c.id === invoice?.clientId);

    const sanitizeFilename = (str: string) => str.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const getFilename = () => {
        if (!invoice) return 'invoice.pdf';
        return `${sanitizeFilename(invoice.clientName)}-${invoice.id}.pdf`;
    };

    const handleDownload = async () => {
        const invoiceElement = document.getElementById('invoice-content');
        if (invoiceElement && window.electron) {
            try {
                await window.electron.generatePdf(invoiceElement.outerHTML, { defaultFilename: getFilename() });
            } catch (e) {
                console.error("PDF Generation failed", e);
                alert("Failed to generate PDF");
            }
        }
    };

    const handleSendEmail = async () => {
        const invoiceElement = document.getElementById('invoice-content');
        if (invoiceElement && window.electron && invoice && client) {
            try {
                const tempFilename = getFilename();
                const pdfPath = await window.electron.generatePdf(invoiceElement.outerHTML, { silent: true, defaultFilename: tempFilename });
                
                if (!pdfPath) return; 
                
                const to = client.email || '';
                const subject = `Invoice - ${invoice.id}`;
                const body = `Dear ${client.name || 'Client'},\n\nPlease find the invoice attached.\n\nThank you,\n${settings?.businessName || 'Our Company'}\n${settings?.businessAddress || ''}`;
                
                const response = await window.electron.openOutlook({
                    to,
                    subject,
                    body,
                    attachmentPath: pdfPath
                });
                
                if (response && response.success === false) {
                    alert(response.message || "Could not open Outlook on this platform.");
                }
            } catch (err) {
                console.error("Email send failed", err);
                alert("Failed to open email client");
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
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={handleSendEmail} style={{ background: 'var(--color-bg-dark)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        <Mail size={16} /> Send via Email
                    </button>
                    <button onClick={handleDownload} style={{ background: 'var(--color-primary)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            <InvoiceTemplate invoice={invoice} client={client} settings={settings} />
        </div>
    );
};

export default InvoiceView;
