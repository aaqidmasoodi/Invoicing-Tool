import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Search
} from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const { settings } = useData();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/clients': return 'Clients';
      case '/invoices': return 'Invoices';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{
        width: '260px',
        borderRight: '1px solid var(--color-border)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 10
      }}>
        <div style={{
          padding: '0 1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" style={{
              maxWidth: '180px',
              maxHeight: '120px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }} />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} color="white" />
            </div>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/clients" icon={<Users size={20} />} label="Clients" />
          <NavItem to="/invoices" icon={<FileText size={20} />} label="Invoices" />
        </nav>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '2rem',
      }}>
        {/* Header */}
        <header style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>{getPageTitle(location.pathname)}</h2>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}>
              <Search size={20} />
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        color: isActive ? 'var(--color-primary-hover)' : 'var(--color-text-secondary)',
        fontWeight: 500,
        backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
      })}
    >
      <span style={{ color: 'inherit' }}>{icon}</span>
      {label}
    </NavLink>
  );
};

export default Layout;
