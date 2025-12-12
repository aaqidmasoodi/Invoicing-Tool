import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, X, Search, Edit } from 'lucide-react';
import type { Client } from '../types';

const Clients: React.FC = () => {
    const { clients, addClient, updateClient } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<Client, 'id' | 'status'>>({
        name: '',
        email: '',
        address: ''
    });

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (client: Client) => {
        setEditingId(client.id);
        setFormData({
            name: client.name,
            email: client.email,
            address: client.address
        });
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', email: '', address: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            const existingClient = clients.find(c => c.id === editingId);
            if (existingClient) {
                updateClient({
                    ...existingClient,
                    ...formData
                });
            }
        } else {
            addClient({ ...formData, status: 'active' });
        }
        handleClose();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>

                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                            backgroundColor: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            color: 'var(--color-text-primary)',
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
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
                    Add Client
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
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Name</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Email</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Address</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem' }}>{client.name}</td>
                                <td style={{ padding: '1rem' }}>{client.email}</td>
                                <td style={{ padding: '1rem', whiteSpace: 'pre-line' }}>{client.address}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => handleEdit(client)}
                                        style={{ background: 'transparent', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                                        title="Edit Client"
                                    >
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                    No clients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-card)',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '400px',
                        border: '1px solid var(--color-border)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={handleClose}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                            {editingId ? 'Edit Client' : 'Add New Client'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                                <input
                                    required
                                    type="text"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                                <input
                                    required
                                    type="email"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)' }}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Address</label>
                                <textarea
                                    required
                                    rows={4}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-dark)', color: 'var(--color-text-primary)', resize: 'vertical', fontFamily: 'inherit' }}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <button type="submit" style={{
                                marginTop: '1rem',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                                {editingId ? 'Update Client' : 'Create Client'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
