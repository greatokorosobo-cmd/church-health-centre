# Church Health Centre - Patient Booking System

## Overview
A patient appointment booking system for a single church health centre. Patients register and book appointments online; staff review and approve bookings.

## Features

### Patient Flow
1. Register with full details (name, phone, email, date of birth, gender, address)
2. Book appointment by selecting available date & time slot
3. Receive confirmation reference number
4. Wait for staff approval
5. Check booking status with reference number

### Staff Flow
1. Login to dashboard (Supabase Auth)
2. View all bookings filtered by status
3. Approve or reject bookings
4. Logout

## Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Router DOM
- Client: `src/lib/api.js` - all calls go to API routes

### Backend (Vercel Serverless Functions)
- API routes in `/api` directory
- All Supabase calls happen server-side
- Service Role Key NEVER exposed to browser

### Database
- Supabase (PostgreSQL)
- Service Role Key for server-side operations
- Anon Key NOT used (all access via API routes)

## API Routes

### Public Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/patients/register` | POST | Register new patient with validation |
| `/api/patients/search` | GET | Find patient by phone number |
| `/api/appointments/book` | POST | Book appointment with double-booking protection |
| `/api/appointments/slots` | GET | Get available time slots for a date |
| `/api/appointments/status` | GET | Check appointment status by reference |

### Protected Routes (require staff auth token)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/appointments/list` | GET | List all appointments with filters |
| `/api/appointments/update` | PATCH | Approve or reject appointment |
| `/api/auth/login` | POST | Staff login with Supabase Auth |
| `/api/auth/logout` | POST | Staff logout |
| `/api/auth/session` | GET | Verify current session token |

## Data Model

### patients table
- id (uuid, primary key)
- full_name (text, required)
- phone (text, required, unique)
- email (text, required)
- date_of_birth (date, required)
- gender (text, required)
- address (text, required)
- created_at (timestamp)

### appointments table
- id (uuid, primary key)
- patient_id (uuid, foreign key → patients)
- appointment_date (date, required)
- appointment_time (text, required)
- status (text: 'pending', 'approved', 'rejected')
- notes (text)
- reference_number (text, unique)
- created_at (timestamp)
- updated_at (timestamp)

## Time Slots
- Available times: 9:00 AM - 5:00 PM
- Slot duration: 30 minutes
- No double-booking (unique date+time constraint)
- Rejected appointments don't block slots

## Security

### What was fixed (static → full-stack)
1. **No more Supabase keys in browser** - Service Role Key only on server
2. **Server-side validation** - All inputs validated before DB operations
3. **Real authentication** - Staff login uses Supabase Auth (not localStorage)
4. **Auth-protected routes** - Dashboard/appointments require valid token
5. **Double-booking prevention** - Race condition handled server-side

### Environment Variables (Vercel)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key (for auth only)
SUPABASE_SERVICE_ROLE_KEY=your-service-key (server-side only!)
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Local Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in values.
