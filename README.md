# Daily Volume Spikes — NIFTY 50

A simple, automated, open-access page that highlights **NIFTY 50 stocks with unusual trading volume**, updated daily after market close.

This project is intentionally minimal and informational.

---

## What this does

- Scans a fixed universe (NIFTY 50)
- Calculates **today’s volume ÷ 20-day average volume**
- Ranks stocks by volume spike
- Generates a static `index.html`
- Updates automatically via **GitHub Actions** every trading day

No predictions.  
No recommendations.  
No guarantees.

---

## Automation (IMPORTANT)

- **GitHub Actions owns `index.html`**
- `index.html` is auto-generated and auto-committed
- **Never edit or commit `index.html` manually**

Scheduled run:
- **3:35 PM IST (5 minutes after NSE market close)**
- Monday to Friday

---

## Files you are allowed to edit

You may safely edit and commit:
- `volume_scan.js` → core logic
- `symbols.json` → stock universe
- `.github/workflows/daily-update.yml` → automation
- `README.md`

You must **NOT** commit:
- `index.html`
- `node_modules/`
- local scripts (`run_volume.bat`)

---

## Safe git workflow (memorize this)

When you change `volume_scan.js`:

```bash
git status
git add volume_scan.js
git commit -m "Describe change briefly"
git pull --rebase origin main
git push
