# Contributing Guidelines

This repository is automated.  
Please read this before making **any** changes.

---

## Core rule (non-negotiable)

**GitHub Actions owns `index.html`.**

- `index.html` is auto-generated
- `index.html` is auto-committed by the bot
- **Do NOT manually edit or commit `index.html`**

If you break this rule, you will create merge conflicts.

---

## Files you are allowed to change

You may edit and commit:

- `volume_scan.js` — core logic & UI template
- `symbols.json` — stock universe
- `.github/workflows/*.yml` — automation
- `README.md`
- `CONTRIBUTING.md`

You must NOT commit:

- `index.html`
- `node_modules/`
- local scripts (e.g. `run_volume.bat`)

---

## Local testing workflow (correct way)

It is OK to generate `index.html` locally for testing.

After testing, **discard it** before committing.

```bash
git restore index.html
