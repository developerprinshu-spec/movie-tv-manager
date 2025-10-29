# Database Setup Checklist

## Step 1: Create Environment File
- [ ] Create file: `backend/.env`
- [ ] Add `PORT=3001`

## Step 2: Add Database Connection
- [ ] Get connection string from your database provider (Clever Cloud/Railway/PlanetScale)
- [ ] Add `DATABASE_URL=your_connection_string` to `.env` file

Example format:
```env
DATABASE_URL=mysql://username:password@host:port/database
```

## Step 3: Run Database Migration
```bash
cd backend
npm run db:migrate
```
- [ ] Migration completed successfully

## Step 4: Add Sample Data (Optional)
```bash
npm run db:seed
```
- [ ] Sample data added

## Step 5: Start Backend
```bash
npm run dev
```
- [ ] Backend running on http://localhost:3001

## Step 6: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
- [ ] Frontend running on http://localhost:3000

## Success!
- [ ] Application is running
- [ ] Can add movies/TV shows
- [ ] Database is connected

## Common Issues:
- **Connection error**: Check your DATABASE_URL in .env
- **Migration error**: Make sure database exists and credentials are correct
- **Port already in use**: Change PORT in .env
