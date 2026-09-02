# Easy Labs Ltd — Website & Brevo Email Backend

This is the production-ready, SEO-optimized website and custom Node.js backend for **Easy Labs Ltd**, featuring automated dual-email dispatch powered by **Brevo (Sendinblue)**.

---

## 🚀 How the Email System Works

When a client submits the consultation form or requests a product demo:

```
                      [ Client Submits Form ]
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ 1. Admin Lead Alert ]       [ 2. Auto-Confirmation ]
      Sent to: info@easylabsltd.com   Sent to: user's email
      Contains full project scope,    Contains branded greeting,
      lead details & 1-click reply   summary, & next steps within 24h
```

---

## ⚙️ Brevo Configuration Setup (3 Steps)

### Step 1: Get your Brevo API Key

1. Log in to your [Brevo Account](https://app.brevo.com/).
2. Navigate to **Account Profile** (top right) ➔ **SMTP & API** ➔ **API Keys** (or go to [https://app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)).
3. Click **Generate a new API key**, name it `Easy Labs Website`, and copy the key (it starts with `xkeysib-...`).

### Step 2: Configure your Sender Email

1. In Brevo, go to **Senders, Domains & Dedicated IPs** ➔ **Senders** ([https://app.brevo.com/senders](https://app.brevo.com/senders)).
2. Make sure your sender email (e.g., `info@easylabsltd.com`) is verified.

### Step 3: Update `.env` File

Open the [`.env`](file:///Users/mac/Apps/Easy%20Labs%20Site/.env) file in the root directory and paste your values:

```env
PORT=3000

# Your Brevo API Key
BREVO_API_KEY=xkeysib-your-actual-api-key-here

# Verified Sender
SENDER_NAME=Easy Labs Ltd
SENDER_EMAIL=info@easylabsltd.com

# Target email to receive incoming lead alerts
ADMIN_EMAIL=info@easylabsltd.com
```

---

## 🏃 Running the Server

To start the server locally:

```bash
npm start
```

Or for development with live auto-reload:

```bash
npm run dev
```

The site and API will be live at:
**`http://localhost:3000`**

---

## 📡 API Endpoints

- **`POST /api/contact`**: Receives form submission `{ name, email, company, interest, message }` and triggers parallel Brevo email dispatches.
- **`GET /api/health`**: Verifies backend health and checks if Brevo credentials are loaded.
