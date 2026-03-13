# Cal_Sky (Scheduling Platform)

Cal_Sky is a Calendly-style scheduling app built with Next.js, Express, Prisma, and MySQL.

## Tech Stack
- Frontend: Next.js (React), TailwindCSS
- Backend: Node.js, Express
- Database: MySQL (Prisma ORM)

## Core Features
- Event type management (create, edit, delete, list)
- Weekly availability with multiple intervals per day
- Public booking flow with real-time available slots
- Booking confirmation page
- Admin meetings view with cancellation
- Dark mode toggle (default light)

## Project Structure
- `client/` Next.js frontend
- `server/` Express backend
- `prisma/` Prisma schema and migrations

## Environment Variables
Create `server/.env` based on `server/.env.example`.

Required values:
- `DATABASE_URL` MySQL connection string
- `PORT` Backend port (default 4000)
- `CLIENT_ORIGIN` Frontend origin (default http://localhost:3000)

Example:
```
DATABASE_URL="mysql://root:password@localhost:3306/scheduling_app"
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

Optional frontend variable:
- `NEXT_PUBLIC_API_URL` in `client/.env.local` (defaults to http://localhost:4000)

## Install Dependencies
### Backend
```
cd server
npm install
```

### Frontend
```
cd client
npm install
```

## Database Setup
```
cd server
npm run prisma:migrate
```

## Seed Sample Data
```
cd server
npm run prisma:seed
```

## Run Locally
### Backend
```
cd server
npm run dev
```

### Frontend
```
cd client
npm run dev
```

## Local URLs
- `http://localhost:3000/admin/events`
- `http://localhost:3000/admin/availability`
- `http://localhost:3000/admin/meetings`
- `http://localhost:3000/book/30-min-meeting`
- `http://localhost:3000/confirm`
