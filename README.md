# Smartmind — Enquiry Website + Google Sheets Setup

This package gives you a full website (`index.html`, `style.css`, `script.js`)
where every "Send enquiry" click:

1. Shows an **instant on-page confirmation message** — no page reload, no popup.
2. **Saves the enquiry as a new row in a Google Sheet**, so you keep a running record.
3. Optionally **emails you a notification** the moment a new enquiry comes in.

No paid service is required — it runs entirely on Google's free Apps Script.

---

## 1. Placeholders to replace before going live

Search each file for these and swap in your real details:

| Placeholder | Where | Replace with |
|---|---|---|
| `+91 98000 00000` | `index.html` (header, hero, footer, WhatsApp links) | Your real phone/WhatsApp number |
| `hello@smartmindtuitions.in` | `index.html`, `Code.gs` | Your real email |
| `Bengaluru, Karnataka` | `index.html` footer | Your city/area |
| Testimonials, stats (`4,000+` etc.) | `index.html` | Your real numbers — don't publish invented figures |
| `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` | `script.js` | The Web App URL from Step 3 below |

The photo/illustration areas use hand-built SVG graphics (no external image
files), so the site works offline and never has broken image links. Swap the
`<svg>...</svg>` blocks in `index.html` for real `<img>` tags any time you have
your own photos.

---

## 2. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet.
2. Name it something like **"Smartmind Enquiries"**.
3. Leave it empty — the script creates the header row automatically.

---

## 3. Add the Apps Script and deploy it as a Web App

1. In the Sheet, click **Extensions → Apps Script**.
2. Delete any starter code in the editor, then paste in the entire contents of **`Code.gs`** from this package.
3. Near the top, set `NOTIFY_EMAIL` to the email that should get a notification for every enquiry (or leave it as `""` to skip emails).
4. Click **Save** (the disk icon), then **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set:
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
7. Click **Deploy**. The first time, Google will ask you to authorize the script — click through **Advanced → Go to (project name)** if it shows an "unverified app" warning (this is normal for your own script).
8. Copy the **Web app URL** it gives you (ends in `/exec`).

---

## 4. Connect the website to the script

1. Open `script.js`.
2. Find this line near the top:
   ```js
   const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the placeholder with the URL you copied in Step 3.8, e.g.:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Save the file.

That's it — every submission now appends a row to your **Enquiries** sheet
with a timestamp, and (if `NOTIFY_EMAIL` is set) emails you a summary.

---

## 5. Test it

1. Open `index.html` in a browser (double-click it, or host the three files together).
2. Fill in the enquiry form and click **Send enquiry**.
3. You should see a green confirmation message on the page.
4. Check your Google Sheet — a new row should appear within a second or two.

If you see an error message instead:
- Double-check the `SCRIPT_URL` was pasted correctly (no extra spaces, ends in `/exec`).
- Make sure the deployment's access is set to **Anyone**, not "Only myself".
- Re-deploy (**Deploy → Manage deployments → Edit → New version**) after any change to `Code.gs`.

---

## 6. Hosting the site

Any static host works, since this is plain HTML/CSS/JS:
- **GitHub Pages** (free) — push these files to a repo and enable Pages.
- **Netlify / Vercel** (free tier) — drag-and-drop the folder.
- Your own domain via any standard web host — just upload the three files.

Keep `index.html`, `style.css` and `script.js` in the same folder; they
reference each other by relative path.

---

## 7. Optional next steps

- **Auto-reply to the parent:** add a second `MailApp.sendEmail()` call in
  `Code.gs` addressed to `data.email` (only when an email was actually given).
- **WhatsApp Business API:** the current WhatsApp button just opens a
  pre-filled chat (`wa.me` link) — no API/cost involved. A fully automated
  WhatsApp auto-reply needs the paid WhatsApp Business Platform, which is a
  separate integration.
- **Spam protection:** a hidden honeypot field is already built in. For
  heavier spam, add Google reCAPTCHA v3 and verify the token inside `doPost`.
