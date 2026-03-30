# Church Health Centre - Patient Booking System

## Overview
A patient appointment booking system for a single church health centre. Patients register and book appointments online; staff review and approve bookings.

## Features

### Patient Flow
1. Register with full details (name, phone, email, date of birth, gender, address)
2. Book appointment by selecting available date & time slot
3. Receive confirmation reference number
4. Wait for staff approval

### Staff Flow
1. Login to dashboard
2. View all pending bookings
3. Approve or reject bookings
4. Approved bookings show as confirmed

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend/API: Vercel Serverless Functions
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth (staff only)

## Data Model

### patients table
- id (uuid, primary key)
- full_name (text, required)
- phone (text, required)
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

## Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Works on phones, tablets, and desktops

## Deployment
- Vercel (both frontend and API routes)
- Environment variables for Supabase credentials
