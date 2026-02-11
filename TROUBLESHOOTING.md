# Network Error Troubleshooting

## Common Causes & Fixes

### 1. **Environment Variables Not Set**

**Problem**: Backend can't connect to MongoDB or missing JWT_SECRET.

**Fix**: 
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any secure random string (min 32 chars)
   - `NODE_ENV` = `production`
3. **Redeploy** after adding variables:
   ```bash
   vercel --prod
   ```

### 2. **API Routes Not Working**

**Check**: Visit `https://loanpathfinder.vercel.app/api/health`
- If you see JSON response → API is working
- If 404/500 → API routing issue

**Fix**: The `api/index.js` file should handle all `/api/*` routes.

### 3. **CORS Issues**

**Check**: Open browser console → Look for CORS errors.

**Fix**: Already handled in `server/app.js` with `cors()`, but ensure:
- Frontend uses relative URL `/api` (already fixed)
- Backend allows your Vercel domain

### 4. **Database Not Seeded**

**Problem**: Marketplace shows no loans.

**Fix**: Run seed script locally (it will populate your MongoDB Atlas):
```bash
cd server
npm run seed
```

### 5. **Frontend Build Issues**

**Check**: Build logs in Vercel dashboard.

**Fix**: Ensure `client/package.json` has correct build script.

---

## Quick Fix Steps

1. **Set Environment Variables** in Vercel:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

2. **Redeploy**:
   ```bash
   vercel --prod
   ```

3. **Test API**:
   - Visit: `https://loanpathfinder.vercel.app/api/health`
   - Should return: `{"success":true,...}`

4. **Test Frontend**:
   - Visit: `https://loanpathfinder.vercel.app`
   - Try registering/login

5. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for network errors
   - Check if API calls are going to `/api/...`

---

## Debug Commands

```bash
# Check Vercel logs
vercel logs

# Inspect deployment
vercel inspect

# Redeploy
vercel --prod
```
