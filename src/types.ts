export interface Client {
    id: string;
    name: string;
    email: string;
    address: string;
    status: 'active' | 'inactive';
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export interface Settings {
    businessName: string;
    businessAddress: string;
    logoUrl: string;
    theme: 'light' | 'dark';
    // V3 Customization
    logoPosition: 'left' | 'right' | 'center';
    clientDetailsPosition: 'left' | 'right';
    amountPosition: 'left' | 'right';
    // Tax
    taxLabel?: string; // e.g. "VAT", "GST"
    taxRate?: number; // percentage
    zoomLevel?: number;
}

export interface Invoice {
    id: string;
    clientId: string;
    clientName: string; // Denormalized for ease
    date: string; // ISO date
    dueDate: string;
    items: InvoiceItem[];
    status: 'draft' | 'created' | 'sent' | 'paid' | 'overdue';
    total: number;
    taxLabel?: string;
    taxRate?: number;
}
