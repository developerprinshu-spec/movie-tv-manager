# Movie & TV Show Manager

A full-stack web application for managing your favorite movies and TV shows with detailed information. Built with React, TypeScript, Node.js, Express, and MySQL.

## Features

### Core Features
- ✅ **Add New Entry**: Create entries for movies and TV shows with comprehensive details
- ✅ **View Entries**: Display all entries in a responsive table with infinite scrolling
- ✅ **Edit Entries**: Update any detail of existing entries
- ✅ **Delete Entries**: Remove entries with confirmation prompts
- ✅ **Search & Filter**: Search by title and filter by type (Movie/TV Show)
- ✅ **Infinite Scrolling**: Load more entries as you scroll down

### Entry Details
Each entry captures:
- **Title** (required)
- **Type** (Movie/TV Show) (required)
- **Director** (required)
- **Budget** (optional)
- **Location** (optional)
- **Duration** in minutes (optional)
- **Year/Time Range** (optional)
- **Description** (optional)
- **Rating** 0-10 (optional)
- **Genre** (optional)
- **Status** (completed/ongoing/cancelled) (optional)

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Shadcn UI** for beautiful, accessible components
- **React Query** for data fetching and caching
- **React Hook Form** for form management
- **React Intersection Observer** for infinite scrolling

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **MySQL** as the database
- **Zod** for schema validation
- **CORS** and **Helmet** for security

## Project Structure

```
movie-tv-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── db/             # Database schema and connection
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── validation/     # Zod schemas
│   │   └── index.ts        # Server entry point
│   ├── drizzle/            # Database migrations
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── lib/            # Utility functions
│   │   └── main.tsx        # App entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd movie-tv-manager
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install:all
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE movie_tv_manager;
```

#### Configure Environment Variables
Copy the example environment file:
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your MySQL credentials:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=movie_tv_manager
NODE_ENV=development
```

#### Run Database Migrations
```bash
cd backend
npm run db:generate
npm run db:migrate
```

#### Seed Sample Data (Optional)
```bash
cd backend
npm run db:seed
```

This will populate your database with sample movies and TV shows for testing.

### 4. Start the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

#### Or Start Individually

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/health

## API Endpoints

### Movies & TV Shows
- `GET /api/movies-shows` - Get all entries (with pagination and search)
- `GET /api/movies-shows/:id` - Get single entry by ID
- `POST /api/movies-shows` - Create new entry
- `PUT /api/movies-shows/:id` - Update entry
- `DELETE /api/movies-shows/:id` - Delete entry

### Query Parameters (GET /api/movies-shows)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by title
- `type` - Filter by type (Movie or TV Show)

### Example API Response
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": 1,
        "title": "Inception",
        "type": "Movie",
        "director": "Christopher Nolan",
        "budget": "160000000.00",
        "location": "LA, Paris",
        "duration": 148,
        "year": 2010,
        "timeRange": null,
        "description": "A mind-bending thriller...",
        "rating": 8.8,
        "genre": "Sci-Fi",
        "status": "completed",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

## Database Schema

### movies_and_shows Table
```sql
CREATE TABLE movies_and_shows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  director VARCHAR(255) NOT NULL,
  budget DECIMAL(15,2),
  location VARCHAR(255),
  duration INT,
  year INT,
  time_range VARCHAR(50),
  description TEXT,
  rating DECIMAL(3,1),
  genre VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Development

### Available Scripts

#### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:backend` - Start only backend
- `npm run dev:frontend` - Start only frontend
- `npm run build` - Build frontend for production
- `npm run install:all` - Install dependencies for all packages

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Management
The project uses Drizzle ORM with MySQL. You can:

1. **View your data**: Run `npm run db:studio` in the backend directory
2. **Generate migrations**: After schema changes, run `npm run db:generate`
3. **Apply migrations**: Run `npm run db:migrate`

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API base URL in production

### Backend (Railway/Render/Heroku)
1. Set up environment variables
2. Deploy the backend code
3. Run database migrations
4. Update CORS settings for production domain

## Features in Detail

### Infinite Scrolling
The table implements infinite scrolling using React Intersection Observer. As users scroll near the bottom, more entries are automatically loaded.

### Search and Filtering
- **Search**: Real-time search by title with debouncing
- **Filter**: Filter by Movie or TV Show type
- **Clear**: One-click clear all filters

### Form Validation
- Client-side validation using React Hook Form
- Server-side validation using Zod schemas
- Real-time error display

### Responsive Design
- Mobile-first approach
- Responsive table with horizontal scroll on small screens
- Touch-friendly interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
