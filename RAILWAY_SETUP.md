# Railway Database Setup Guide

## Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app/)
2. Click **"Start a New Project"**
3. Sign up with GitHub
4. Authorize Railway to access your repositories

## Step 2: Create MySQL Database
1. Click **"New Project"**
2. Select **"Provision MySQL"**
3. Wait for the database to be created (takes 1-2 minutes)
4. Click on the MySQL service

## Step 3: Get Connection Details
1. Go to the **"Variables"** tab
2. Copy these values:
   - `MYSQL_HOST`
   - `MYSQL_PORT` 
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

## Step 4: Create Environment File
Create `backend/.env` with these values:

```env
PORT=3001
DB_HOST=your_mysql_host_from_railway
DB_PORT=3306
DB_USER=your_mysql_user_from_railway
DB_PASSWORD=your_mysql_password_from_railway
DB_NAME=your_mysql_database_from_railway
DB_SSL=false
NODE_ENV=development
```

## Step 5: Run Setup Commands
```bash
npm run install:all
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Step 6: Start Application
```bash
npm run dev
```

Railway gives you:
- ✅ Free MySQL database
- ✅ 500 hours of usage per month
- ✅ 1GB storage
- ✅ No credit card required
- ✅ Easy setup
