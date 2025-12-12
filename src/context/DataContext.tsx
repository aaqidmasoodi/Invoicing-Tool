import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Client, Invoice, Settings } from '../types';

interface DataContextType {
    clients: Client[];
    invoices: Invoice[];
    settings: Settings;
    addClient: (client: Omit<Client, 'id'>) => void;
    addInvoice: (invoice: Omit<Invoice, 'id'> & { id?: string }) => void;
    updateInvoice: (invoice: Invoice) => void;
    updateClient: (client: Client) => void;
    deleteClient: (id: string) => void;
    deleteInvoice: (id: string) => void;
    updateSettings: (settings: Settings) => void;
    isLoaded: boolean;
    resetApp: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

const defaultSettings: Settings = {
    businessName: 'Invoicely', // Will trigger onboarding if matches
    businessAddress: '',
    logoUrl: '',
    theme: 'light',
    logoPosition: 'right',
    clientDetailsPosition: 'left',
    amountPosition: 'right',
    zoomLevel: 1.0
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            if (window.electron) {
                try {
                    const loadedClients = await window.electron.getClients();
                    const loadedInvoices = await window.electron.getInvoices();
                    const loadedSettings = await window.electron.getSettings();

                    setClients(loadedClients || []);
                    setInvoices(loadedInvoices || []);
                    if (loadedSettings) {
                        // Merge with default settings to ensure new fields are present if added later
                        setSettings({ ...defaultSettings, ...loadedSettings });
                    }
                } catch (error) {
                    console.error("Failed to load data from electron:", error);
                }
            }
            setIsLoaded(true);
        };
        fetchData();
    }, []);

    // Theme & Zoom effect
    useEffect(() => {
        if (isLoaded) {
            document.documentElement.setAttribute('data-theme', settings.theme);
            if (window.electron && settings.zoomLevel) {
                window.electron.setZoom(settings.zoomLevel);
            }
        }
    }, [settings, isLoaded]);

    const updateSettings = async (newSettings: Settings) => {
        setSettings(newSettings);
        if (window.electron) {
            await window.electron.saveSettings(newSettings);
        }
    };

    const addClient = async (clientData: Omit<Client, 'id'>) => {
        const newClient = { ...clientData, id: Math.random().toString(36).substr(2, 9) };
        // Optimistic update
        setClients([...clients, newClient]);
        if (window.electron) {
            await window.electron.addClient(newClient);
        }
    };

    const updateClient = async (client: Client) => {
        setClients(clients.map(c => c.id === client.id ? client : c));
        if (window.electron) {
            await window.electron.updateClient(client);
        }
    };

    const addInvoice = async (invoiceData: Omit<Invoice, 'id'> & { id?: string }) => {
        const newInvoice = { ...invoiceData, id: invoiceData.id || `INV-${Math.floor(Math.random() * 10000)}` };
        setInvoices([...invoices, newInvoice]);
        if (window.electron) {
            await window.electron.addInvoice(newInvoice);
        }
    };

    const updateInvoice = async (invoice: Invoice) => {
        setInvoices(invoices.map(i => i.id === invoice.id ? invoice : i));
        if (window.electron) {
            await window.electron.updateInvoice(invoice);
        }
    };

    const deleteClient = async (id: string) => {
        setClients(clients.filter(c => c.id !== id));
        if (window.electron) {
            await window.electron.deleteClient(id);
        }
    };

    const deleteInvoice = async (id: string) => {
        setInvoices(invoices.filter(i => i.id !== id));
        if (window.electron) {
            await window.electron.deleteInvoice(id);
        }
    }

    const resetApp = async () => {
        if (window.electron) {
            await window.electron.resetApp();
        }
        setClients([]);
        setInvoices([]);
        setSettings(defaultSettings);
        // App.tsx will detect default settings and redirect to Onboarding
    };

    return (
        <DataContext.Provider value={{ clients, invoices, settings, addClient, updateClient, addInvoice, updateInvoice, deleteClient, deleteInvoice, updateSettings, isLoaded, resetApp }}>
            {children}
        </DataContext.Provider>
    );
};
