import { Client, Invoice, Settings } from './types';

export interface IElectronAPI {
    getClients: () => Promise<Client[]>;
    addClient: (client: Client) => Promise<void>;
    updateClient: (client: Client) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;

    getInvoices: () => Promise<Invoice[]>;
    addInvoice: (invoice: any) => Promise<number>;
    updateInvoice: (invoice: any) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;

    getSettings: () => Promise<Settings | null>;
    saveSettings: (settings: Settings) => Promise<void>;
    saveLogo: (filePath: string) => Promise<string>;
    setZoom: (factor: number) => Promise<void>;
    getPathForFile: (file: File) => string;
    resetApp: () => Promise<void>;
    generatePdf: (html: string) => Promise<string | null>;
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}
