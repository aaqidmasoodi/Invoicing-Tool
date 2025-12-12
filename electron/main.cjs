const { app, BrowserWindow, ipcMain, protocol, dialog } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const isDev = !app.isPackaged;
const dbPath = isDev ? 'invoicetool.db' : path.join(app.getPath('userData'), 'invoicetool.db');

// Register custom protocol privileges
protocol.registerSchemesAsPrivileged([
    { scheme: 'media', privileges: { secure: true, supportFetchAPI: true, standard: true, bypassCSP: true } }
]);

// Initialize DB
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database at', dbPath);
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Clients Table
        db.run(`CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      address TEXT,
      status TEXT
    )`);

        // Invoices Table
        db.run(`CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      clientId TEXT,
      clientName TEXT,
      date TEXT,
      dueDate TEXT,
      items TEXT,
      status TEXT,
      total REAL,
      taxLabel TEXT,
      taxRate REAL
    )`, (err) => {
            if (!err) {
                // Migration: Check columns and add if missing
                db.all("PRAGMA table_info(invoices)", (pragmaErr, columns) => {
                    if (!pragmaErr && columns) {
                        const hasTaxLabel = columns.some(col => col.name === 'taxLabel');
                        const hasTaxRate = columns.some(col => col.name === 'taxRate');

                        if (!hasTaxLabel) {
                            db.run("ALTER TABLE invoices ADD COLUMN taxLabel TEXT", (e) => {
                                if (e) console.error("Error adding taxLabel:", e);
                                else console.log("Migrated database: Added taxLabel column");
                            });
                        }
                        if (!hasTaxRate) {
                            db.run("ALTER TABLE invoices ADD COLUMN taxRate REAL", (e) => {
                                if (e) console.error("Error adding taxRate:", e);
                                else console.log("Migrated database: Added taxRate column");
                            });
                        }
                    }
                });
            }
        });

        // Settings Table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )`);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true // Keep true for security
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    // Register protocol to serve files from userData/uploads
    protocol.registerFileProtocol('media', (request, callback) => {
        try {
            const url = request.url.replace(/^media:\/\//, '');
            const decodedUrl = decodeURIComponent(url);
            const uploadsDir = path.join(app.getPath('userData'), 'uploads');
            // Prevent directory traversal and ensure we just get the filename
            const fileName = path.basename(decodedUrl);
            const filePath = path.join(uploadsDir, fileName);
            callback({ path: filePath });
        } catch (error) {
            console.error('Media protocol error:', error);
            // Return a safe error code or let it fail naturally
        }
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers

// --- Clients ---
ipcMain.handle('get-clients', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM clients', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
});

ipcMain.handle('add-client', async (event, client) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO clients (id, name, email, address, status) VALUES (?, ?, ?, ?, ?)');
        stmt.run(client.id, client.name, client.email, client.address, client.status, function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
        stmt.finalize();
    });
});

ipcMain.handle('update-client', async (event, client) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('UPDATE clients SET name = ?, email = ?, address = ?, status = ? WHERE id = ?');
        stmt.run(client.name, client.email, client.address, client.status, client.id, function (err) {
            if (err) reject(err);
            else resolve();
        });
        stmt.finalize();
    });
});

ipcMain.handle('delete-client', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM clients WHERE id = ?', id, function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
});

// --- Invoices ---
ipcMain.handle('get-invoices', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM invoices', (err, rows) => {
            if (err) reject(err);
            else {
                // Parse items JSON
                const invoices = rows.map(row => ({
                    ...row,
                    items: JSON.parse(row.items)
                }));
                resolve(invoices);
            }
        });
    });
});

ipcMain.handle('add-invoice', async (event, invoice) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO invoices (id, clientId, clientName, date, dueDate, items, status, total, taxLabel, taxRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        const itemsJson = JSON.stringify(invoice.items);
        stmt.run(invoice.id, invoice.clientId, invoice.clientName, invoice.date, invoice.dueDate, itemsJson, invoice.status, invoice.total, invoice.taxLabel, invoice.taxRate, function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
        stmt.finalize();
    });
});
ipcMain.handle('update-invoice', async (event, invoice) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('UPDATE invoices SET clientId = ?, clientName = ?, date = ?, dueDate = ?, items = ?, status = ?, total = ?, taxLabel = ?, taxRate = ? WHERE id = ?');
        const itemsJson = JSON.stringify(invoice.items);
        stmt.run(invoice.clientId, invoice.clientName, invoice.date, invoice.dueDate, itemsJson, invoice.status, invoice.total, invoice.taxLabel, invoice.taxRate, invoice.id, function (err) {
            if (err) reject(err);
            else resolve();
        });
        stmt.finalize();
    });
});

ipcMain.handle('delete-invoice', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM invoices WHERE id = ?', id, function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
});

// --- Settings ---
ipcMain.handle('get-settings', async () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT value FROM settings WHERE key = ?', 'app_settings', (err, row) => {
            if (err) reject(err);
            else resolve(row ? JSON.parse(row.value) : null);
        });
    });
});

ipcMain.handle('save-settings', async (event, settings) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
        const settingsJson = JSON.stringify(settings);
        stmt.run('app_settings', settingsJson, function (err) {
            if (err) reject(err);
            else resolve();
        });
        stmt.finalize();
    });
});
// --- Assets ---

ipcMain.handle('save-logo', async (event, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const fileName = path.basename(filePath);
            const uploadsDir = path.join(app.getPath('userData'), 'uploads');

            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            const destPath = path.join(uploadsDir, `${Date.now()}_${fileName}`);
            fs.copyFile(filePath, destPath, (err) => {
                if (err) reject(err);
                else {
                    // Return media:// URL instead of file://
                    const mediaUrl = `media://${path.basename(destPath)}`;
                    resolve(mediaUrl);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
});

ipcMain.handle('generate-pdf', async (event, htmlContent) => {
    return new Promise(async (resolve, reject) => {
        let printWindow = new BrowserWindow({ show: false, width: 800, height: 1000 });

        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    /* Basic Reset & Print Styles */
                    body { margin: 0; padding: 0; font-family: sans-serif; -webkit-print-color-adjust: exact; }
                    /* Inject global CSS variables if needed, or assume inline styles handle it */
                    :root {
                        --color-primary: #000; /* Fallback */
                        --font-primary: 'DM Sans', sans-serif;
                    }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        try {
            await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`);

            const pdfData = await printWindow.webContents.printToPDF({
                printBackground: true,
                pageSize: 'A4',
                margins: { top: 0, bottom: 0, left: 0, right: 0 } // handled by css padding
            });

            const { filePath } = await dialog.showSaveDialog({
                title: 'Save Invoice',
                defaultPath: 'invoice.pdf',
                filters: [{ name: 'PDF', extensions: ['pdf'] }]
            });

            if (filePath) {
                fs.writeFileSync(filePath, pdfData);
                resolve(filePath);
            } else {
                resolve(null); // Canceled
            }
        } catch (error) {
            reject(error);
        } finally {
            if (printWindow) printWindow.close();
        }
    });
});

ipcMain.handle('reset-app', async () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('DELETE FROM clients');
            db.run('DELETE FROM invoices');
            db.run('DELETE FROM settings', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
});
