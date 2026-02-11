# Deployment Guide

## Important Notes

**GitHub Pages** can only host **static frontend files**. It **cannot** run Node.js backends. You need to deploy the backend separately.

**Vercel** can host both frontend and backend, but they need to be configured correctly.

---

## Option 1: Deploy Frontend to GitHub Pages + Backend to Railway/Render

### Frontend (GitHub Pages)

1. **Update `client/vite.config.js`** - Already done (base path configured)

2. **Set GitHub Pages base path**:
   - If your repo is `username/loanpathfinder`, base path is `/loanpathfinder/`
   - Update `client/vite.config.js`:
   ```js
   base: '/loanpathfinder/',
   ```

3. **Build and deploy**:
   ```bash
   cd client
   npm run build
   ```
   - Push `client/dist` folder to `gh-pages` branch
   - Or use GitHub Actions (see below)

4. **Set API URL**:
   - In GitHub repo Settings → Secrets → Add `VITE_API_URL` = your backend URL (e.g., `https://your-backend.railway.app/api`)

### Backend (Railway / Render / Heroku)

**Railway:**
1. Connect your GitHub repo
2. Select `server` folder
3. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT` (auto-set by Railway)
4. Deploy

**Render:**
1. New Web Service
2. Connect repo, select `server` folder
3. Build: `npm install`
4. Start: `npm start`
5. Add env vars

---

## Option 2: Deploy Both to Vercel (Recommended)

### Method A: Monorepo (Single Vercel Project)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy from root**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret for JWT signing
   - `NODE_ENV=production`
   - `VITE_API_URL` - Set to `https://your-project.vercel.app/api` (replace with your actual Vercel URL)

4. **Important**: After first deploy, update `VITE_API_URL` in Vercel dashboard to match your deployment URL

5. **Redeploy** after setting environment variables:
   ```bash
   vercel --prod
   ```

### Method B: Separate Projects (Frontend + Backend)

**Backend:**
1. In Vercel, create new project
2. Root directory: `server`
3. Build: (leave empty)
4. Output: (leave empty)
5. Install: `npm install`
6. Start: `node server.js`
7. Add env vars

**Frontend:**
1. Create new Vercel project
2. Root directory: `client`
3. Build: `npm run build`
4. Output: `dist`
5. Framework: Vite
6. Add env var: `VITE_API_URL` = your backend Vercel URL

---

## Option 3: Frontend to Vercel + Backend to Railway/Render

1. Deploy backend to Railway/Render (see Option 1)
2. Deploy frontend to Vercel:
   - Root: `client`
   - Build: `npm run build`
   - Output: `dist`
   - Env: `VITE_API_URL` = your backend URL

---

## Environment Variables Checklist

### Backend (Railway/Render/Vercel):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `NODE_ENV` - `production`
- `PORT` - Usually auto-set by platform

### Frontend (Vercel/GitHub Pages):
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.railway.app/api`)

---

## Common Issues

1. **CORS errors**: Ensure backend has `cors()` enabled (already done)
2. **API 404**: Check `VITE_API_URL` is set correctly
3. **Build fails**: Ensure Node version >= 18
4. **Routes not working**: For GitHub Pages, ensure `base` path matches repo name

---

## Quick Deploy Commands

**Vercel (from root):**
```bash
vercel --prod
```

**Build frontend:**
```bash
cd client && npm run build
```

**Test production build locally:**
```bash
cd client && npm run preview
```
