import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Upload } from 'lucide-react';

const Settings: React.FC = () => {
    const { settings, updateSettings, resetApp } = useData();
    const [formData, setFormData] = useState(settings);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetConfirmationText, setResetConfirmationText] = useState('');
    const [appVersion, setAppVersion] = useState<string>('');

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    useEffect(() => {
        if (window.electron && window.electron.getVersion) {
            window.electron.getVersion().then(v => setAppVersion(v));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && window.electron) {
            try {
                // Try getting path via webUtils helper first, fallback to .path property
                const filePath = window.electron.getPathForFile ? window.electron.getPathForFile(file) : (file as any).path;

                const savedPath = await window.electron.saveLogo(filePath);
                setFormData({ ...formData, logoUrl: savedPath });
            } catch (err) {
                console.error("Upload failed", err);
                alert("Failed to upload logo locally: " + (err instanceof Error ? err.message : String(err)));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(formData);
        alert('Settings saved successfully!');
    };

    return (
        <div style={{ maxWidth: '1200px' }}>


            <form onSubmit={handleSubmit}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Left Column: Business Info */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Business Information</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Business Name</label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-card)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Business Address</label>
                                <textarea
                                    name="businessAddress"
                                    value={formData.businessAddress}
                                    onChange={handleChange}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-card)',
                                        color: 'var(--color-text-primary)',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {/* Logo Upload Section */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Business Logo</label>
                                <div style={{
                                    border: '2px dashed var(--color-border)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }} onClick={() => document.getElementById('settings-logo-upload')?.click()}>

                                    {formData.logoUrl ? (
                                        <div style={{ position: 'relative' }}>
                                            <img src={formData.logoUrl} alt="Logo Preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Click to replace</div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={24} color="var(--color-text-secondary)" />
                                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>Click to upload logo</div>
                                        </>
                                    )}

                                    <input
                                        id="settings-logo-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleLogoUpload}
                                    />
                                </div>
                            </div>

                            {/* Tax Configuration */}
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Tax / VAT Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tax Name</label>
                                        <input
                                            type="text"
                                            name="taxLabel"
                                            placeholder="e.g. VAT, GST"
                                            value={formData.taxLabel || ''}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--color-border)',
                                                background: 'var(--color-bg-card)',
                                                color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            name="taxRate"
                                            placeholder="0"
                                            min="0"
                                            step="0.1"
                                            value={formData.taxRate || ''}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--color-border)',
                                                background: 'var(--color-bg-card)',
                                                color: 'var(--color-text-primary)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Appearance */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Appearance & Layout</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Theme</label>
                                <select
                                    name="theme"
                                    value={formData.theme}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-card)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                >
                                    <option value="light">Light Mode</option>
                                    <option value="dark">Dark Mode</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Client Details Position</label>
                                <select
                                    name="clientDetailsPosition"
                                    value={formData.clientDetailsPosition || 'left'}
                                    onChange={(e) => setFormData({ ...formData, clientDetailsPosition: e.target.value as any })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-card)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                >
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Amount Position</label>
                                <select
                                    name="amountPosition"
                                    value={formData.amountPosition || 'right'}
                                    onChange={(e) => setFormData({ ...formData, amountPosition: e.target.value as any })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-bg-card)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                >
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" style={{
                        padding: '1rem 2rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        Save Changes
                    </button>
                </div>

                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                    <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Advanced</h3>

                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)' }}>Application Version</h4>
                            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                                Currently installed version
                            </p>
                        </div>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--color-bg-dark)',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border)'
                        }}>
                            v{appVersion || '...'}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-danger)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)' }}>Factory Reset</h4>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                            This will permanently delete all your clients, invoices, and settings. This action cannot be undone.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsResetModalOpen(true)}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'var(--color-danger)',
                                border: '1px solid var(--color-danger)',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Reset Application
                        </button>
                    </div>
                </div>
            </form>

            {/* Reset Confirmation Modal */}
            {isResetModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid var(--color-danger)',
                        background: 'var(--color-bg-card)'
                    }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-danger)' }}>Are you absolutely sure?</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                            This action will wipe all your data including clients, invoices, and business details.
                            <br /><br />
                            To confirm, please type <strong>Delete all content and reset</strong> below:
                        </p>

                        <input
                            type="text"
                            value={resetConfirmationText}
                            onChange={(e) => setResetConfirmationText(e.target.value)}
                            placeholder="Type the confirmation text"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                            autoFocus
                        />

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setIsResetModalOpen(false);
                                    setResetConfirmationText('');
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '1px solid var(--color-border)',
                                    background: 'transparent',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-primary)'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await resetApp();
                                    // No need to close modal or navigate manually as context will clear settings 
                                    // and App.tsx will redirect to Onboarding.
                                    // But good to clean up state just in case.
                                    setIsResetModalOpen(false);
                                    setResetConfirmationText('');
                                }}
                                disabled={resetConfirmationText !== 'Delete all content and reset'}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: 'var(--color-danger)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: resetConfirmationText === 'Delete all content and reset' ? 'pointer' : 'not-allowed',
                                    opacity: resetConfirmationText === 'Delete all content and reset' ? 1 : 0.5
                                }}
                            >
                                I understand the consequences
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
