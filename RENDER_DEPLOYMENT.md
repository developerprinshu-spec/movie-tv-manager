# Deploy to Render (Free Alternative to Railway)

Render offers a free tier for backend deployment without requiring payment information upfront.

## Prerequisites
- GitHub repository with your code pushed
- Render account (https://render.com)
- Your Clever Cloud MySQL database URL

---

## Step 1: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with your **GitHub account** (recommended)
4. Verify your email

---

## Step 2: Deploy Backend

### 2.1 Create New Web Service

1. From Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: `movie-tv-manager`
5. Click **"Connect"**

### 2.2 Configure Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `movie-tv-manager-backend` (or your choice)
- **Region**: `Oregon (US West)` or closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy Settings:**
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```

**Plan:**
- Select **"Free"** plan
  - ⚠️ Note: Free tier has limitations:
    - Spins down after 15 minutes of inactivity
    - Takes ~30 seconds to spin back up on first request
    - 750 hours/month (sufficient for hobby projects)

### 2.3 Add Environment Variables

Scroll down to **"Environment Variables"** section and add:

1. **NODE_ENV**
   - Value: `production`

2. **PORT**
   - Value: `3001`

3. **DATABASE_URL**
   - Value: Your Clever Cloud MySQL URL
   - ```
     mysql://ukedvrroz7sdyq0q:pQ1RB0P6w23HuMuXfIwb@bm7ibyhsp2hyaavwdzmm-mysql.services.clever-cloud.com:3306/bm7ibyhsp2hyaavwdzmm
     ```

### 2.4 Advanced Settings (Optional)

- **Health Check Path**: `/health`
- **Auto-Deploy**: `Yes` (deploys automatically on git push)

### 2.5 Create Web Service

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll see: **"Your service is live 🎉"**

### 2.6 Get Your Backend URL

After deployment:
- Your backend URL will be: `https://movie-tv-manager-backend.onrender.com`
- Or whatever name you chose: `https://YOUR-SERVICE-NAME.onrender.com`

**Save this URL - you'll need it for frontend deployment!**

### 2.7 Test Backend

Visit: `https://YOUR-SERVICE-NAME.onrender.com/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Step 3: Update CORS for Production

### 3.1 Update Backend Code (if needed)

The backend is already configured to accept your frontend domains. Once you have your Vercel URL, you may need to update CORS.

For now, the CORS is configured to accept all origins in development. After deploying frontend, you can update it.

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with your **GitHub account**

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your `movie-tv-manager` repository
3. Click **"Import"**

### 4.3 Configure Project

**Framework Preset**: Vite (should auto-detect)

**Build and Output Settings:**
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4.4 Environment Variables

Click **"Environment Variables"** and add:

**Variable Name**: `VITE_API_URL`
**Value**: Your Render backend URL (without `/api` at the end)
```
https://movie-tv-manager-backend.onrender.com
```

**For all environments**: Production, Preview, and Development

### 4.5 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (1-3 minutes)
3. Vercel will give you a URL like: `https://movie-tv-manager.vercel.app`

**Save this URL!**

---

## Step 5: Update CORS Configuration

Now that you have both URLs, update the backend CORS:

### 5.1 Update via Render Dashboard

1. Go to your Render backend service
2. Click **"Environment"** in the left sidebar
3. Add a new environment variable:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: Your Vercel URL
   - ```
     https://movie-tv-manager.vercel.app
     ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

### Alternative: Update Code

If you prefer to update the code, edit `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://movie-tv-manager.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

Then commit and push - Render will auto-deploy.

---

## Step 6: Test Your Deployed Application

### 6.1 Test Backend Endpoints

Test in browser or with curl:

```bash
# Health check
curl https://YOUR-BACKEND.onrender.com/health

# Get movies (should return data)
curl https://YOUR-BACKEND.onrender.com/api/movies-shows
```

### 6.2 Test Frontend

1. Visit your Vercel URL: `https://movie-tv-manager.vercel.app`
2. Open browser console (F12)
3. Check for any errors

### 6.3 Test Full CRUD Operations

1. ✅ **Create**: Add a new movie/TV show
2. ✅ **Read**: View the table with entries
3. ✅ **Update**: Edit an existing entry
4. ✅ **Delete**: Delete an entry
5. ✅ **Search**: Test search functionality
6. ✅ **Filter**: Test filter by Movie/TV Show
7. ✅ **Infinite Scroll**: Scroll down to load more

---

## Important Notes About Render Free Tier

### Cold Starts
- Free tier services **spin down after 15 minutes** of inactivity
- First request after inactivity takes **30-50 seconds** to respond
- Subsequent requests are fast

### How to Handle Cold Starts

**Option 1**: Accept the delay (easiest)
- First load takes 30-50 seconds
- Users may see loading spinner
- Free and simple

**Option 2**: Keep service alive (requires external service)
- Use a service like **UptimeRobot** (https://uptimerobot.com)
- Ping your backend every 14 minutes
- Free tier: 50 monitors
- Keeps your service warm

**Option 3**: Upgrade to paid tier ($7/month)
- No cold starts
- Always responsive
- 400 build hours/month

---

## Troubleshooting

### Backend Issues

**Problem**: "Your service is live" but health check fails
```bash
# Check logs in Render dashboard
# Go to: Service → Logs tab
```

**Problem**: Database connection fails
- Verify `DATABASE_URL` is correct
- Check Clever Cloud MySQL is running
- Ensure IP whitelisting allows Render's IPs (usually not needed)

**Problem**: Build fails
```bash
# Check build logs in Render
# Common issues:
# - Missing dependencies in package.json
# - TypeScript errors
# - Wrong build command
```

### Frontend Issues

**Problem**: Frontend loads but API calls fail (CORS)
- Check browser console for CORS errors
- Verify `ALLOWED_ORIGINS` includes your Vercel URL
- Ensure `VITE_API_URL` is set correctly in Vercel

**Problem**: 404 on page refresh
- `vercel.json` should already be configured
- If not, add to `frontend/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**Problem**: Environment variable not working
- Ensure variable name starts with `VITE_`
- Redeploy after adding variables
- Check in Vercel dashboard: Settings → Environment Variables

---

## Deployment URLs

After successful deployment:

- **Frontend**: `https://movie-tv-manager.vercel.app`
- **Backend**: `https://movie-tv-manager-backend.onrender.com`
- **API Base**: `https://movie-tv-manager-backend.onrender.com/api`
- **Health Check**: `https://movie-tv-manager-backend.onrender.com/health`

---

## Cost Summary

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| **Render** | Free | $0 | 750 hrs/month, cold starts |
| **Vercel** | Free | $0 | Unlimited deployments |
| **Clever Cloud MySQL** | Current Plan | ~$0-5 | Database hosting |
| **Total** | | **$0/month** | Perfect for portfolio |

---

## Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend health check responds
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS configured for Vercel domain
- [ ] Can create new entries
- [ ] Can edit entries
- [ ] Can delete entries
- [ ] Search works
- [ ] Filter works
- [ ] Infinite scroll works
- [ ] No console errors
- [ ] Mobile responsive

---

## Maintenance & Updates

### To Update Your App:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Render** will auto-deploy backend (if enabled)
4. **Vercel** will auto-deploy frontend (if enabled)

### Monitor Your Services:

- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Deployments
- **Database**: Clever Cloud console

---

## Alternative: Upgrade Options

If you need better performance:

### Render
- **Starter**: $7/month - No cold starts
- **Standard**: $25/month - More resources

### Vercel
- **Pro**: $20/month - More features
- **Enterprise**: Custom pricing

---

## Support & Help

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Create an issue in your repo

---

**Next Step**: Update your README.md with the live deployment URLs! 🚀
