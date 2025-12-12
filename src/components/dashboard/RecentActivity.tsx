import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity: React.FC = () => {
    const { invoices } = useData();

    // Derive activities from invoices
    const activities = useMemo(() => {
        return [...invoices]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5) // Show top 5
            .map(invoice => {
                let type: 'invoice_sent' | 'payment_received' = 'invoice_sent';
                let description = `Invoice #${invoice.id} created for ${invoice.clientName}`;

                if (invoice.status === 'paid') {
                    type = 'payment_received';
                    description = `Payment received for Invoice #${invoice.id}`;
                } else if (invoice.status === 'sent') {
                    type = 'invoice_sent';
                    description = `Invoice #${invoice.id} sent to ${invoice.clientName}`;
                }

                return {
                    id: invoice.id,
                    type,
                    description,
                    time: invoice.date ? formatDistanceToNow(new Date(invoice.date), { addSuffix: true }) : 'Recently'
                };
            });
    }, [invoices]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'payment_received': return <CheckCircle size={18} color="var(--color-success)" />;
            case 'invoice_sent': return <FileText size={18} color="var(--color-primary)" />;
            default: return <Clock size={18} color="var(--color-text-secondary)" />;
        }
    };

    if (activities.length === 0) {
        return (
            <div style={{
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '1.5rem',
                height: '100%'
            }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Recent Activity</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>No recent activity.</p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '1.5rem',
            height: '100%'
        }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {activities.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{
                            marginTop: '2px',
                            padding: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg-card-hover)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {getIcon(item.type)}
                        </div>
                        <div>
                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500 }}>{item.description}</p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
