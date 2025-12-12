import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload, CheckCircle, ArrowRight } from 'lucide-react';

const Onboarding: React.FC = () => {
    const { updateSettings } = useData();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: '',
        businessAddress: '',
        logoUrl: '',
        logoPath: '' // used for display if local file blob
    });

    const handleNext = () => setStep(step + 1);

    const handleFinish = async () => {
        await updateSettings({
            businessName: formData.businessName,
            businessAddress: formData.businessAddress,
            logoUrl: formData.logoUrl,
            theme: 'light', // Default
            logoPosition: 'right',
            clientDetailsPosition: 'left',
            amountPosition: 'right'
        });
        navigate('/'); // Go to dashboard
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && window.electron) {
            try {
                // Try getting path via webUtils helper first, fallback to .path property
                const filePath = window.electron.getPathForFile ? window.electron.getPathForFile(file) : (file as any).path;

                const savedPath = await window.electron.saveLogo(filePath);
                setFormData({ ...formData, logoUrl: savedPath, logoPath: URL.createObjectURL(file) });
            } catch (err) {
                console.error("Upload failed", err);
                alert("Failed to upload logo locally: " + (err instanceof Error ? err.message : String(err)));
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-dark)',
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '500px',
                padding: '3rem',
                borderRadius: '16px',
                border: '1px solid var(--color-border)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        borderRadius: '12px',
                        background: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 4px 20px rgba(13, 148, 136, 0.4)'
                    }}>
                        <Building2 color="white" size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome to Your Invoicing App</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Let's get your business set up in just a few steps.</p>
                </div>

                {/* Steps Indicator */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            height: '4px',
                            width: '40px',
                            borderRadius: '2px',
                            backgroundColor: i <= step ? 'var(--color-primary)' : 'var(--color-border)'
                        }} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>What is your Business Name?</label>
                        <input
                            type="text"
                            placeholder="e.g. Acme Studio"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '1.1rem' }}
                            autoFocus
                        />
                        <button
                            onClick={handleNext}
                            disabled={!formData.businessName}
                            style={{
                                width: '100%', padding: '1rem',
                                backgroundColor: 'var(--color-primary)', color: 'white',
                                border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                                opacity: !formData.businessName ? 0.7 : 1
                            }}
                        >
                            Continue <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Where are you located?</label>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>This will appear on your invoices.</p>
                        <textarea
                            placeholder="e.g. 123 Creative Ave, Design City"
                            value={formData.businessAddress}
                            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                            style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '1rem', minHeight: '100px', fontFamily: 'inherit' }}
                            autoFocus
                        />
                        <button
                            onClick={handleNext}
                            disabled={!formData.businessAddress}
                            style={{
                                width: '100%', padding: '1rem',
                                backgroundColor: 'var(--color-primary)', color: 'white',
                                border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
                                opacity: !formData.businessAddress ? 0.7 : 1
                            }}
                        >
                            Continue <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Upload your Logo (Optional)</label>

                        <div style={{
                            border: '2px dashed var(--color-border)',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(255,255,255,0.02)'
                        }} onClick={() => document.getElementById('logo-upload')?.click()}>
                            {formData.logoUrl ? (
                                <img src={formData.logoUrl || formData.logoPath} alt="Logo" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                            ) : (
                                <>
                                    <Upload size={32} color="var(--color-text-secondary)" style={{ marginBottom: '1rem' }} />
                                    <p style={{ margin: 0, color: 'var(--color-text-primary)' }}>Click to upload image</p>
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>JPG, PNG recommended</p>
                                </>
                            )}
                            <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleLogoUpload}
                            />
                        </div>

                        <button
                            onClick={handleFinish}
                            style={{
                                width: '100%', padding: '1rem',
                                backgroundColor: 'var(--color-primary)', color: 'white',
                                border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
                            }}
                        >
                            Get Started <CheckCircle size={18} style={{ verticalAlign: 'middle', marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
