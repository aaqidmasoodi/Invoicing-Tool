import React, { useMemo } from 'react';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';

const Dashboard: React.FC = () => {
    const { invoices } = useData();

    const stats = useMemo(() => {
        const totalRevenue = invoices
            .filter(i => i.status === 'paid')
            .reduce((sum, i) => sum + i.total, 0);

        const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'draft');
        const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

        const overdueInvoices = invoices.filter(i => {
            // Simple check: if status is 'overdue' OR if due date is past and status is not paid
            if (i.status === 'overdue') return true;
            if (i.status !== 'paid' && new Date(i.dueDate) < new Date()) return true;
            return false;
        });

        return {
            revenue: totalRevenue,
            pendingCount: pendingInvoices.length,
            pendingValue: pendingAmount,
            overdueCount: overdueInvoices.length
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
                    title="Total Revenue"
                    value={`$${stats.revenue.toFixed(2)}`}
                    change="" // Removed fake percentage
                    trend="neutral"
                    icon={<DollarSign size={20} />}
                />
                <StatCard
                    title="Pending Invoices"
                    value={stats.pendingCount.toString()}
                    change={`Amount: $${stats.pendingValue.toFixed(2)}`}
                    trend="neutral"
                    icon={<Clock size={20} />}
                />
                <StatCard
                    title="Overdue Invoices"
                    value={stats.overdueCount.toString()}
                    change={stats.overdueCount > 0 ? "Action needed" : "Good job!"}
                    trend={stats.overdueCount > 0 ? "down" : "up"} // 'down' red usually implies bad in this context
                    icon={<AlertTriangle size={20} />}
                />
            </div>

            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem'
            }}>
                <div style={{ flex: 2 }}>
                    <RecentActivity />
                </div>
                {/* Placeholder for chart or another widget */}
                <div style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-secondary)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <p>Revenue Chart Placeholder</p>
                        <small>Coming soon</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
