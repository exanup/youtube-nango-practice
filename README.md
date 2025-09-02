# youtube-nango-practice

Practice app for learning [Nango](https://nango.dev) with YouTube.  
Frontend: React + Vite + Tailwind  
Backend: Express + TypeScript + SQLite/MySQL (planned)

---

## Getting Started

### 1. Install dependencies

From the repo root:

    npm install

This installs dependencies for both `web/` and `server/` workspaces.

---

### 2. Configure environment variables

Copy the example file in the backend:

    cp server/.env.example server/.env

Edit `server/.env` and fill in your real values:

    PORT=4000
    NANGO_SECRET_KEY=sk_live_your_secret_here
    NANGO_HOST=https://api.nango.dev

⚠️ **Do not commit `.env` files** — they’re ignored by git.

Right now the frontend (`web/`) doesn’t need an `.env`.

---

### 3. Run the app

From the repo root:

    npm run dev

This will start:

- Frontend (Vite) → <http://localhost:5173>
- Backend (Express) → <http://localhost:4000>

---

### 4. Connect YouTube

Open <http://localhost:5173> and click **Connect YouTube**.  
You’ll see Google’s OAuth consent screen. After authorizing, check the browser console for a `connectionId` from Nango.

---

## Checkpoints

- ✅ Workspace setup (npm workspaces, Prettier, Husky)
- ✅ Frontend scaffold (React + Tailwind)
- ✅ Backend scaffold (Express + TypeScript, `/health`)
- ✅ Nango integration (Connect YouTube button working)

---

## Next Steps (Roadmap)

- [ ] **Fetch YouTube subscriptions**  
       Use the Nango SDK + `connectionId` to call the YouTube Data API’s `subscriptions.list` endpoint.

- [ ] **Store connections**  
       Save each user’s `connectionId` in a database (SQLite or MySQL). This way, the backend remembers which Google account is connected.

- [ ] **Filter feeds by subscriptions**  
       Display a combined YouTube feed, then allow filtering by selected subscriptions in the frontend UI.

- [ ] **Better UX for auth state**  
       Show when a user is already connected, and handle reconnections if a token expires.

- [ ] **Deploy to the cloud**  
       Host backend + frontend (e.g., Railway, Vercel, or Render) and connect with Nango Cloud.
