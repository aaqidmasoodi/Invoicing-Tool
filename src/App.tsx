import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import InvoiceBuilder from './pages/InvoiceBuilder';
import InvoiceView from './pages/InvoiceView';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import { useData } from './context/DataContext';

const App: React.FC = () => {
  const { settings, isLoaded } = useData();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-dark)' }}>
        Loading...
      </div>
    );
  }

  // Simple check: if business name is default "Invoicely", assume not onboarded
  // Or check a specific flag if we added one. For now checking name is a good heuristic if we clear defaults.
  const isOnboarded = settings.businessName && settings.businessName !== 'Invoicely';

  // Allow access to onboarding page without redirecting loop
  if (!isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="invoices/new" element={<InvoiceBuilder />} />
        <Route path="invoices/edit/:id" element={<InvoiceBuilder />} />
        <Route path="invoices/:id" element={<InvoiceView />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
