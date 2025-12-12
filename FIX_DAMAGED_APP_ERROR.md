# Fixing "App is Damaged" Error

This error occurs because the application is not "signed" with an Apple Developer Certificate (which costs $99/year). macOS Gatekeeper flags it as potentially unsafe because it was downloaded from the internet.

## The Fix

You need to remove the "Quarantine" attribute that macOS assigns to downloaded files.

1.  Move the app to your **Applications** folder.
2.  Open your Terminal (`Cmd+Space`, type "Terminal").
3.  Run the following command exactly:

```bash
xattr -cr /Applications/Invoice\ Tool.app
```

*(Note: If you named it something else or kept it in Downloads, change the path accordingly. The easy way is to type `xattr -cr ` (with a space at the end) and then drag and drop the app icon from Finder into the Terminal window).*

4.  Press Enter.
5.  Launch the app again. It should open normally.
