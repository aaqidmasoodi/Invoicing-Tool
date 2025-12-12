import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend = 'neutral', icon }) => {
    return (
        <div style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</h3>
                {icon && <div style={{ color: 'var(--color-text-secondary)', opacity: 0.7 }}>{icon}</div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>{value}</span>
            </div>

            {change && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                    {trend === 'up' && <ArrowUpRight size={16} color="var(--color-success)" />}
                    {trend === 'down' && <ArrowDownRight size={16} color="var(--color-danger)" />}
                    <span style={{
                        color: trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-danger)' : 'var(--color-text-secondary)'
                    }}>
                        {change}
                    </span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>from last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
