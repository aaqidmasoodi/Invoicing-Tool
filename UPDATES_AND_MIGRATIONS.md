# Handling Updates

## 1. Database Schema Updates
Since the database (`invoicetool.db`) lives on the user's computer and persists between installations, you cannot simply "replace" it. You must **migrate** it.

**How we do it:**
In `electron/main.cjs`, inside `initDb()`, we write code that runs every time the app starts:
1.  Check if the table exists.
2.  Check if specific columns exist (using `PRAGMA table_info`).
3.  If a column is missing, run `ALTER TABLE ... ADD COLUMN ...`.

**Example for future changes:**
If you want to add a `phone` column to clients later, you would add this to `main.cjs`:
```javascript
db.all("PRAGMA table_info(clients)", (err, columns) => {
    const hasPhone = columns.some(col => col.name === 'phone');
    if (!hasPhone) {
        db.run("ALTER TABLE clients ADD COLUMN phone TEXT");
    }
});
```
This ensures that when a user installs v1.1.0, their v1.0.0 database is automatically upgraded without losing data.

## 2. Delivering App Updates
**Automatic Updates (Implemented):**
The app is now configured with `electron-updater`.
1.  App checks GitHub Releases on startup (when packaged).
2.  If a new version is found, it downloads in the background.
3.  On macOS without code signing, this might still require manual permission, but the mechanism is in place.

**Manual Updates:**
If auto-update fails (e.g., due to permissions), users can always download the latest installer from GitHub Releases and install over the existing app.
