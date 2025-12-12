import React from 'react';
import { Download, Monitor, Laptop } from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div className="glass-panel" style={{
                padding: '4rem',
                borderRadius: '24px',
                textAlign: 'center',
                maxWidth: '600px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
                <img
                    src="/invoice-tool-app-icon.png"
                    alt="App Icon"
                    style={{
                        width: '96px',
                        height: '96px',
                        marginBottom: '2rem',
                        borderRadius: '20px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />

                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    fontWeight: 800,
                    background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Invoicing Tool
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: '#cbd5e1',
                    lineHeight: 1.6,
                    marginBottom: '3rem'
                }}>
                    This professional invoicing application is designed for
                    <strong> Desktop</strong> (macOS, Windows & Linux).
                    <br />
                    Please download the native app for the full experience.
                </p>

                <div style={{ display: 'grid', gap: '1rem', justifyContent: 'center' }}>
                    <a
                        href="https://github.com/aaqidmasoodi/Invoicing-Tool/releases"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Download size={24} />
                        Download Latest Release
                    </a>
                </div>

                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    color: '#94a3b8'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Monitor size={20} />
                        <span>macOS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Laptop size={20} />
                        <span>Windows</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Monitor size={20} />
                        <span>Linux</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
