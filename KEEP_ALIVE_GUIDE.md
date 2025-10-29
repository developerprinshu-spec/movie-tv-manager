# Keep Backend Alive Guide

Render's free tier spins down after 15 minutes of inactivity. Here are multiple solutions to keep your backend responsive.

---

## ⚡ Quick Solutions

### 1. Manual cURL Command

Run this whenever you want to wake up your backend:

```bash
curl https://movie-tv-manager.onrender.com/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🤖 Automated Solutions (Recommended)

### Option 1: UptimeRobot (⭐ Best - 100% Free)

**Why UptimeRobot?**
- ✅ Completely free for up to 50 monitors
- ✅ Pings every 5 minutes
- ✅ Email alerts if service goes down
- ✅ Uptime statistics dashboard
- ✅ No setup or maintenance

**Setup Steps:**

1. **Sign up**: Go to https://uptimerobot.com and create free account

2. **Add New Monitor**:
   - Click **"+ Add New Monitor"**
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: `Movie TV Manager Backend`
   - **URL**: `https://movie-tv-manager.onrender.com/health`
   - **Monitoring Interval**: 5 minutes (default)
   - Click **"Create Monitor"**

3. **Done!** Your backend will now be pinged every 5 minutes

**Benefits:**
- Keeps backend warm 24/7
- Notifies you if it goes down
- Shows uptime percentage
- No code changes needed

---

### Option 2: GitHub Actions (Free with GitHub)

**Already included in your repo!**

The repository includes a GitHub Action (`.github/workflows/keep-alive.yml`) that automatically pings your backend every 14 minutes.

**How it works:**
- Runs automatically on GitHub's servers
- No cost (included in free GitHub tier)
- Pings your health endpoint every 14 minutes
- Logs success/failure in Actions tab

**To verify it's running:**
1. Go to your GitHub repo
2. Click **"Actions"** tab
3. You should see **"Keep Backend Alive"** workflow
4. It runs every 14 minutes automatically

**Manual trigger:**
1. Go to Actions → Keep Backend Alive
2. Click **"Run workflow"**
3. Click **"Run workflow"** button

**Note:** GitHub Actions has usage limits:
- 2,000 minutes/month (free tier)
- This workflow uses ~4 minutes/month (minimal)

---

### Option 3: Cron Job (Mac/Linux)

**For your local machine:**

If you have a computer that's always on, you can set up a cron job.

**Setup:**

1. Open terminal and edit crontab:
```bash
crontab -e
```

2. Add this line:
```bash
# Ping backend every 14 minutes
*/14 * * * * curl -s https://movie-tv-manager.onrender.com/health > /dev/null 2>&1
```

3. Save and exit (`:wq` in vim)

**Verify cron job:**
```bash
crontab -l
```

**Pros:**
- Free
- Reliable if your computer is always on

**Cons:**
- Only works when your computer is running
- Requires local setup

---

### Option 4: Zapier/IFTTT (Alternative)

Both platforms offer webhook automation:

**Zapier:**
1. Create free account
2. Make a "Zap" with Schedule trigger (every 15 minutes)
3. Add Webhooks action to ping your health endpoint

**IFTTT:**
1. Create free account
2. Create applet with Date & Time trigger
3. Add Webhook action to ping your endpoint

**Limitations:**
- Free tier has task limits
- More complex setup than UptimeRobot

---

## 🎯 Recommended Approach

**Best combination:**

1. **Primary**: Use **UptimeRobot** (5-minute intervals)
   - Set it and forget it
   - Get downtime alerts
   - View uptime statistics

2. **Backup**: Keep **GitHub Actions** enabled (14-minute intervals)
   - Already configured in your repo
   - Free backup monitoring
   - No additional setup needed

**With both running:**
- Your backend stays warm 24/7
- Redundant monitoring
- Email alerts if something breaks
- 100% free

---

## 📊 Monitoring Your Backend

### Check Backend Status

**Health Endpoint:**
```bash
curl https://movie-tv-manager.onrender.com/health
```

**Expected Response (Warm):**
- Status: `200 OK`
- Response time: `< 100ms`

**Cold Start Response:**
- Status: `502 Bad Gateway` or timeout (first 30 seconds)
- Then: `200 OK` after warm-up

### View Logs

**Render Dashboard:**
1. Go to https://dashboard.render.com
2. Click your service
3. Click **"Logs"** tab
4. See all requests and responses

**UptimeRobot Dashboard:**
1. Go to https://uptimerobot.com
2. View uptime percentage
3. See response times
4. Check downtime alerts

---

## 🚨 Troubleshooting

### Backend Still Spinning Down

**Possible causes:**
1. Monitor interval > 15 minutes (Render spins down at 15 min)
2. Monitor not actually pinging
3. Monitor pinging wrong endpoint

**Solutions:**
- Verify URL is correct: `https://movie-tv-manager.onrender.com/health`
- Check monitor is active in UptimeRobot/GitHub Actions
- Ensure interval is ≤ 14 minutes

### Too Many Requests

If you're getting rate-limited:
- UptimeRobot: 5-minute interval is fine
- GitHub Actions: 14-minute interval is safe
- Both together: Well within limits (backend allows 1000 req/15min in dev)

### Monitor Showing "Down"

1. Check Render logs for errors
2. Verify backend is actually running
3. Test health endpoint manually with curl
4. Check Render service status

---

## 💰 Cost Comparison

| Solution | Cost | Effort | Reliability |
|----------|------|--------|-------------|
| **UptimeRobot** | FREE | 5 min setup | ⭐⭐⭐⭐⭐ |
| **GitHub Actions** | FREE | Already done | ⭐⭐⭐⭐ |
| **Cron Job** | FREE | 2 min setup | ⭐⭐⭐ (if PC on) |
| **Manual cURL** | FREE | Daily work | ⭐⭐ |
| **Zapier** | Free tier | 10 min setup | ⭐⭐⭐ |

---

## 🎓 Understanding Render Free Tier

**What happens during inactivity:**
- After 15 minutes: Service spins down
- CPU and memory released
- Container stopped

**What happens on first request after spin-down:**
- Takes 30-50 seconds to spin up
- Subsequent requests are fast
- Then runs normally until next 15-min idle period

**How keep-alive solves this:**
- Pings every 5-14 minutes
- Prevents the 15-minute idle timeout
- Service stays warm
- All requests are fast

---

## ✅ Quick Start Recommendation

**Do this now (5 minutes):**

1. **Sign up for UptimeRobot**: https://uptimerobot.com
2. **Add your backend** as a monitor:
   - URL: `https://movie-tv-manager.onrender.com/health`
   - Interval: 5 minutes
3. **Done!** Your backend will stay warm 24/7

**Verify GitHub Actions** (already set up):
1. Go to your repo → Actions tab
2. Confirm "Keep Backend Alive" workflow exists
3. It runs automatically every 14 minutes

---

## 📝 Notes

- UptimeRobot + GitHub Actions = Redundant monitoring
- Both are completely free
- No code changes needed
- Set it once, forget it
- Your app stays fast for users!

---

**Your backend URL:** `https://movie-tv-manager.onrender.com`
**Health endpoint:** `https://movie-tv-manager.onrender.com/health`

**Happy deploying! 🚀**
