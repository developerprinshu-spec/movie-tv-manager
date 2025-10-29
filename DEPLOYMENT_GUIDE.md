# Deployment Guide

This guide will walk you through deploying the Movie & TV Show Manager application.

## Prerequisites

- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- GitHub repository with your code

---

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with your GitHub account

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `movie-tv-manager` repository
4. Railway will detect it as a Node.js project

### 1.3 Configure Root Directory
1. In Railway dashboard, go to your project
2. Click on the service
3. Go to "Settings" tab
4. Under "Root Directory", enter: `backend`
5. Click "Save"

### 1.4 Configure Environment Variables
1. Go to "Variables" tab
2. Add the following environment variables:

```
PORT=3001
NODE_ENV=production
DATABASE_URL=your_existing_clever_cloud_mysql_url
```

**Important:** Use your existing Clever Cloud MySQL database URL:
```
mysql://ukedvrroz7sdyq0q:pQ1RB0P6w23HuMuXfIwb@bm7ibyhsp2hyaavwdzmm-mysql.services.clever-cloud.com:3306/bm7ibyhsp2hyaavwdzmm
```

### 1.5 Configure Build & Start Commands
1. Go to "Settings" tab
2. Set these commands:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 1.6 Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete (check "Deployments" tab)
3. Once deployed, click "Generate Domain" to get your backend URL
4. Save this URL - you'll need it for frontend deployment

**Your backend URL will look like:** `https://your-app.railway.app`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with your GitHub account

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Import your `movie-tv-manager` repository
3. Vercel will detect it as a Vite project

### 2.3 Configure Build Settings
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 2.4 Configure Environment Variables
1. Click "Environment Variables"
2. Add the following:

```
VITE_API_URL=https://your-backend-url.railway.app
```

**Important:** Replace with your actual Railway backend URL from Step 1.6

### 2.5 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Vercel will provide you with a deployment URL

**Your frontend URL will look like:** `https://your-app.vercel.app`

---

## Step 3: Update CORS Configuration

After deploying, you need to update your backend to allow requests from your Vercel frontend.

### 3.1 Update Backend Code

Go to your Railway project:
1. Click on "Variables" tab
2. Add a new variable:

```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**OR** manually update `backend/src/index.ts` CORS configuration and redeploy:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-app.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

### 3.2 Redeploy Backend
1. Railway will automatically redeploy after variable change
2. Or trigger manual redeploy from Railway dashboard

---

## Step 4: Update Frontend API Configuration

### 4.1 Update Vite Config (if needed)

If your API calls are failing, update `frontend/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Remove or update proxy for production
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### 4.2 Update API Service (if needed)

Ensure `frontend/src/services/api.ts` uses the correct base URL:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## Step 5: Test Deployment

### 5.1 Test Backend
Visit: `https://your-backend.railway.app/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Try adding a new movie/TV show
3. Test edit functionality
4. Test delete functionality
5. Test search and filter

---

## Deployment URLs

After successful deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`
- **Database**: `https://console.clever-cloud.com` (already deployed)

---

## Troubleshooting

### Backend Issues

**Problem**: Backend fails to start
- Check Railway logs in "Deployments" tab
- Verify DATABASE_URL is correct
- Ensure NODE_ENV is set to "production"

**Problem**: Database connection fails
- Verify Clever Cloud MySQL is running
- Check DATABASE_URL format
- Ensure database credentials are correct

### Frontend Issues

**Problem**: API requests fail (CORS errors)
- Check CORS configuration in backend
- Verify VITE_API_URL environment variable
- Check browser console for specific errors

**Problem**: 404 errors on refresh
- Add `vercel.json` to frontend directory:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Database Issues

**Problem**: Database tables don't exist
- Run migrations manually on Railway:
  ```bash
  npm run db:migrate
  ```

---

## Post-Deployment Checklist

- [ ] Backend health check responds correctly
- [ ] Frontend loads without errors
- [ ] Can create new entries
- [ ] Can edit existing entries
- [ ] Can delete entries
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Infinite scroll works
- [ ] No CORS errors in console
- [ ] Mobile responsive design works

---

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database Credentials**: Use environment variables only
3. **Rate Limiting**: Already configured in backend
4. **CORS**: Restrict to your Vercel domain only
5. **Helmet**: Security headers already configured

---

## Maintenance

### Updating the Application

1. Make changes to your code
2. Commit and push to GitHub
3. Railway and Vercel will auto-deploy (if enabled)
4. Or manually trigger redeployment from dashboards

### Monitoring

- **Railway**: Monitor logs and metrics in dashboard
- **Vercel**: View analytics and deployment logs
- **Database**: Monitor via Clever Cloud console

---

## Cost Estimation

- **Railway**: Free tier includes $5 credit/month (sufficient for small apps)
- **Vercel**: Free tier includes unlimited deployments
- **Clever Cloud MySQL**: Currently using free/paid tier (already set up)

**Total estimated cost**: $0-5/month for hobby projects

---

## Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Check Vercel deployment logs for frontend errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Deployment Status**:
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] CORS configured
- [ ] Environment variables set
- [ ] Application tested and working

**Next Step**: Update your README.md with the live deployment URLs!
