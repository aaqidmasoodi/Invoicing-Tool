import { forwardRef } from 'react';
import type { Invoice, Settings, Client } from '../types';

interface InvoiceTemplateProps {
    invoice: Invoice;
    client?: Client;
    settings: Settings;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ invoice, client, settings }, ref) => {

    return (
        <div ref={ref} id="invoice-content" className="invoice-container">
            <style>{`
                .invoice-container {
                    position: relative;
                    background: white;
                    min-height: 1000px; /* For screen "paper" look */
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: var(--font-primary, sans-serif);
                    font-size: 0.85rem;
                    color: #333;
                    box-sizing: border-box; /* Ensure padding/border are included in element's total width and height */
                }
                
                /* Layout Structure for Header/Footer */
                .invoice-header { height: 120px; width: 100%; z-index: 10; background: white; }
                .invoice-footer { height: 80px; width: 100%; z-index: 10; background: white; }
                
                .header-content { 
                    padding: 2rem 3rem 0; 
                    height: 100%; 
                    box-sizing: border-box; 
                    display: flex; 
                    justify-content: flex-end; 
                    align-items: flex-start; /* Align logo to top */
                }
                
                .footer-content { 
                    padding: 0 3rem 2rem; 
                    height: 100%; 
                    box-sizing: border-box; 
                    text-align: center; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: flex-end; /* Align content to bottom */
                    font-size: 0.75rem;
                    color: #888;
                }

                /* Print vs Screen Positioning */
                @media print {
                    .invoice-header { position: fixed; top: 0; left: 0; right: 0; }
                    .invoice-footer { position: fixed; bottom: 0; left: 0; right: 0; }
                    /* Reset container min-height for print to avoid excess blank pages */
                    .invoice-container { min-height: 0; }
                }
                @media screen {
                    .invoice-header { position: absolute; top: 0; left: 0; right: 0; }
                    .invoice-footer { position: absolute; bottom: 0; left: 0; right: 0; }
                }

                /* Table Layout for Spacing */
                .invoice-table-wrapper { width: 100%; border-collapse: collapse; }
                .body-content { padding: 0 3rem; } /* Side padding for main content */
                
                .spacer-header { height: 120px; }
                .spacer-footer { height: 80px; }

                /* Typography & Inner Layout */
                .client-name { font-size: 1.1rem; font-weight: 700; color: #000; margin-bottom: 0.25rem; }
                .client-address { font-size: 0.85rem; color: #555; white-space: pre-line; line-height: 1.4; }
                .meta-grid { display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 1rem; margin-top: 1.5rem; align-items: center; }
                
                .invoice-title-container { text-align: center; margin-bottom: 1.5rem; }
                .invoice-title { font-size: 1rem; letterSpacing: 3px; text-transform: uppercase; color: #888; font-weight: 500; }

                .items-table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.85rem; }
                .items-table th { text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd; color: #666; font-weight: 600; }
                .items-table td { padding: 0.5rem; border-bottom: 1px solid #f0f0f0; color: #333; }
                
                .totals-section { display: flex; justify-content: flex-end; }
                .totals-table { width: 250px; text-align: right; }
            `}</style>

            {/* Visual Header (fixed/absolute) */}
            <div className="invoice-header">
                <div className="header-content">
                    {settings.logoUrl && (
                        <img src={settings.logoUrl} alt="Logo" style={{ maxHeight: '100%', maxWidth: '200px', objectFit: 'contain' }} />
                    )}
                </div>
            </div>

            {/* Visual Footer (fixed/absolute) */}
            <div className="invoice-footer">
                <div className="footer-content">
                    {(settings.businessName || settings.businessAddress) && (
                        <>
                            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{settings.businessName}</p>
                            <p>{settings.businessAddress}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content Flow (uses table for spacing) */}
            <table className="invoice-table-wrapper">
                <thead>
                    <tr><td><div className="spacer-header">&nbsp;</div></td></tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="body-content">
                                {/* Client Info */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <p className="client-name">{client?.name || invoice.clientName || 'Client Name'}</p>
                                    {client?.address && <p className="client-address">{client.address}</p>}

                                    <div className="meta-grid">
                                        <span style={{ color: '#666' }}>Invoice No:</span>
                                        <span style={{ fontWeight: 600, color: '#000' }}>#{invoice.id}</span>
                                        <span style={{ color: '#666' }}>Date:</span>
                                        <span>{invoice.date}</span>
                                        <span style={{ color: '#666' }}>Due Date:</span>
                                        <span>{invoice.dueDate}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="invoice-title-container">
                                    <h1 className="invoice-title">Invoice</h1>
                                </div>

                                {/* Items Table */}
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th style={{ textAlign: 'right' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.description}</td>
                                                <td>{item.quantity}</td>
                                                <td>${Number(item.price).toFixed(2)}</td>
                                                <td style={{ textAlign: 'right' }}>${(Number(item.quantity) * Number(item.price)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Totals */}
                                <div className="totals-section">
                                    <div className="totals-table">
                                        <div style={{ marginBottom: '0.25rem', color: '#666' }}>
                                            Subtotal: ${invoice.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0).toFixed(2)}
                                        </div>
                                        <div style={{ marginBottom: '0.25rem', color: '#666' }}>
                                            {invoice.taxLabel} ({invoice.taxRate}%): ${(invoice.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0) * (Number(invoice.taxRate) / 100)).toFixed(2)}
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                                            ${invoice.total.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr><td><div className="spacer-footer">&nbsp;</div></td></tr>
                </tfoot>
            </table>

            {/* Simple Recalculation logic for Template to be safe */}
            {/* 
                const subtotal = invoice.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
                const tax = subtotal * (Number(invoice.taxRate)/100);
             */}
            <div style={{ display: 'none' }}>
                Debug: {invoice.items.length} items
            </div>
        </div>
    );
});

