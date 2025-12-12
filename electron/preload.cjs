const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Clients
    getClients: () => ipcRenderer.invoke('get-clients'),
    addClient: (client) => ipcRenderer.invoke('add-client', client),
    deleteClient: (id) => ipcRenderer.invoke('delete-client', id),

    // Invoices
    getInvoices: () => ipcRenderer.invoke('get-invoices'),
    addInvoice: (invoice) => ipcRenderer.invoke('add-invoice', invoice),
    updateInvoice: (invoice) => ipcRenderer.invoke('update-invoice', invoice),
    deleteInvoice: (id) => ipcRenderer.invoke('delete-invoice', id),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

    // Assets
    saveLogo: (filePath) => ipcRenderer.invoke('save-logo', filePath),
    setZoom: (factor) => ipcRenderer.invoke('set-zoom', factor),
    getVersion: () => ipcRenderer.invoke('get-version'),
    // Helper to get path (needed because file.path might be shielded)
    getPathForFile: (file) => webUtils.getPathForFile(file),

    // System
    resetApp: () => ipcRenderer.invoke('reset-app'),
    generatePdf: (html) => ipcRenderer.invoke('generate-pdf', html)
});
