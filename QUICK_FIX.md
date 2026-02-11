# Quick Fix for Network Error

## Immediate Steps:

### 1. **Set Environment Variables in Vercel**

Go to: https://vercel.com/oms-projects-727a6fd1/loanpathfinder/settings/environment-variables

**Add these 3 variables:**

```
MONGO_URI = mongodb+srv://omkumarsingh_db_user:7z4SnnL794F1eCb9@loanpfv2.z0o3cvy.mongodb.net/loanpathfinder
JWT_SECRET = loanpathfinder_super_secret_key_change_in_production
NODE_ENV = production
```

### 2. **Commit and Push Changes**

```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

### 3. **Redeploy**

```bash
vercel --prod
```

Or let Vercel auto-deploy from GitHub.

### 4. **Test**

1. **Test API**: Visit `https://loanpathfinder.vercel.app/api/health`
   - Should return JSON with `success: true`

2. **Test Frontend**: Visit `https://loanpathfinder.vercel.app`
   - Try registering a new user
   - Check browser console (F12) for errors

### 5. **Seed Database** (One-time)

Run locally to populate loan products:

```bash
cd server
npm run seed
```

This will add loan products to your MongoDB Atlas database.

---

## If Still Getting Errors:

1. **Check Vercel Logs**:
   ```bash
   vercel logs
   ```

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look at Network tab
   - See which requests are failing

3. **Verify Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure all 3 are set
   - Redeploy after adding/changing

---

## Common Issues:

- **"Network Error"** → Usually means API isn't responding (check env vars)
- **"CORS Error"** → Already handled, but check if API is accessible
- **"404 on /api/health"** → API routing issue (check vercel.json)
- **"MongoDB connection error"** → Check MONGO_URI is correct
