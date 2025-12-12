import React, { useMemo } from 'react';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { Clock, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';

const Dashboard: React.FC = () => {
    const { invoices } = useData();

    const stats = useMemo(() => {
        const totalInvoices = invoices.length;
        const draftInvoices = invoices.filter(i => i.status === 'draft');

        return {
            totalCount: totalInvoices,
            draftCount: draftInvoices.length
        };
    }, [invoices]);

    return (
        <div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                Overview of your business performance.
            </p>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    title="Total Invoices Created"
                    value={stats.totalCount.toString()}
                    change=""
                    trend="neutral"
                    icon={<FileText size={20} />}
                />
                <StatCard
                    title="Drafts"
                    value={stats.draftCount.toString()}
                    change=""
                    trend="neutral"
                    icon={<Clock size={20} />}
                />
            </div>

            {/* Main Content */}
            <div>
                <RecentActivity />
            </div>
        </div>
    );
};

export default Dashboard;
