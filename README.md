# 489-Homework — CptS 489 Web Development

Each assignment builds on the last, progressively adding a backend, a database layer, and finally a React frontend to the same petition app.

---

## Homework-1 — Static HTML

A single static HTML page for the petition. No CSS, no JavaScript, no server.

**Run:** Open `Homework-1/Petition.html` directly in a browser.

---

## Homework-2 — CSS + Client-Side JavaScript

Adds full styling and client-side interactivity to the petition page:
- `Petition2.css` — layout, form styles, conditional section visibility, Bootstrap modal overrides
- `Petition2.js` — form validation, conditional field show/hide based on signer type, Bootstrap modal population
- Signatures are stored in memory in the browser (lost on refresh)

**Run:** Open `Homework-2/Petition2.html` directly in a browser.

---

## Homework-3 — Express + EJS (Server-Side Rendering)

Moves the petition to an Express server that renders pages server-side with EJS templates:
- Signatures stored in an in-memory array on the server (persists across requests, resets on restart)
- Server-side form validation with error messages and form pre-fill on failure
- Post-Redirect-Get pattern prevents duplicate submissions on refresh

**Run:**
```bash
cd Homework-3
node server.js
```
Then open `http://localhost:3000` in a browser.

---

## Homework-4 — Express JSON API + CORS

Extends the Homework-3 server with JSON API endpoints so the React frontend can communicate with it:
- `GET /api/signatures` — returns the full signatures array as JSON
- `POST /api/signatures` — validates and adds a new signature, returns the new object or a 400 error
- CORS enabled for `http://localhost:3000` (the React dev server)
- The original EJS server-side rendered route (`GET /`) still works at the same address

**Run:**
```bash
cd Homework-4
node server.js
```
Server runs on `http://localhost:4000`.

---

## homework-4-react — React Frontend (Vite)

A Vite + React SPA that replaces the EJS-rendered frontend while reusing the Homework-4 Express backend as its API:
- `App.jsx` — fetches signatures on mount via `useEffect`, manages `signatures` array and `selectedSig` state
- `PetitionForm.jsx` — fully controlled form, POSTs to `http://localhost:4000/api/signatures`, resets on success
- `SignaturesTable.jsx` — renders the signatures table, row click opens the detail modal
- `SignatureModal.jsx` — Bootstrap modal showing full signature details, React-controlled visibility
- `Petition2.css` — same stylesheet as Homework-2 so the layout matches the original page

**Requires the Homework-4 backend to be running first.**

**Run:**
```bash
# Terminal 1 — start the API server
cd Homework-4
node server.js

# Terminal 2 — start the React dev server
cd homework-4-react
npm install   # first time only
npm run dev
```
Then open `http://localhost:3000` in a browser.
