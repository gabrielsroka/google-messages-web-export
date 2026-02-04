# google-messages-web-export

Export chat conversations from **https://messages.google.com/web**
directly from the browser Developer Tools console.

This script allows you to extract a full conversation as **plain text**
or **structured JSON** without installing browser extensions or
modifying the page.

------------------------------------------------------------------------

## Features

-   Export conversations as readable plain text
-   Export conversations as structured JSON
-   No browser extensions required
-   No external dependencies
-   Does **not** modify the live DOM
-   Designed for manual use in DevTools

------------------------------------------------------------------------

## Usage

### 1. Open Google Messages Web

Go to:\
https://messages.google.com/web

Open the conversation you want to export.

------------------------------------------------------------------------

### 2. Open DevTools

- **Chrome / Edge:** `F12` or `Ctrl+Shift+I`
- **Firefox:** `F12` or `Ctrl+Shift+K` (Console) / `Ctrl+Shift+I` (DevTools)
- Switch to the **Console** tab

------------------------------------------------------------------------

### 3. Paste the script

Copy the contents of `exportConversation.js` into the console and press
**Enter**.

------------------------------------------------------------------------

### 4. Export the conversation

#### Export as text

``` js
exportConversation();
```

#### Export as JSON

``` js
exportConversation({ returnJson: true });
```

------------------------------------------------------------------------

## Copy to Clipboard (Chrome / Edge / Firefox)

Chrome DevTools provides a built-in `copy()` helper.

### Copy text

``` js
copy(exportConversation());
```

### Copy JSON

``` js
copy(JSON.stringify(exportConversation({ returnJson: true }), null, 2));
```

------------------------------------------------------------------------

## Output Format

### Text output

    [Tuesday, 20 Jan, 12:05] Me:
    Hello!

    [Tuesday, 20 Jan, 12:06] John Doe:
    Hi!

### JSON output

``` json
[
  {
    "date": "Tuesday, 20 Jan",
    "time": "12:05",
    "name": "Me",
    "text": "Hello!"
  },
  {
    "date": "Tuesday, 20 Jan",
    "time": "12:06",
    "name": "John Doe",
    "text": "Hi!"
  }
]
```

------------------------------------------------------------------------

## Notes

-   The script relies on the current DOM structure of Google Messages
    Web\
    (custom elements like `mws-message-wrapper`,
    `mws-tombstone-message-wrapper`).
-   Link previews (`mws-link-preview-decorator`) are automatically
    excluded.
-   Timestamps are reconstructed based on tombstones and message-level
    timestamps.
-   If a date or time is not available, the corresponding field is left
    empty.

------------------------------------------------------------------------

## Disclaimer

This project is **not affiliated with or endorsed by Google**.\
Google Messages and related names are trademarks of Google LLC.

------------------------------------------------------------------------

## License

MIT License
