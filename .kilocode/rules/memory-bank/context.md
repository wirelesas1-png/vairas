# Active Context: Driving Instructor Booking Platform

## Current State

**Project Status**: ✅ Ready for Production (Missing DATABASE_URL)

A SaaS platform for driving instructors to manage bookings with unique public booking pages, calendar management, and subscription system.

## Recently Completed

- [x] Database tables created manually in Supabase (7 tables)
- [x] Database schema with 7 tables (instructors, bookings, working hours, etc.)
- [x] Authentication system (registration, login, JWT sessions)
- [x] Instructor dashboard with calendar view
- [x] Public booking pages with unique URLs (/instruktorius/[slug])
- [x] Booking creation and management
- [x] Real-time availability checking
- [x] Mobile-responsive design
- [x] Fixed Next.js 16 middleware deprecation (renamed to proxy)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/db/schema.ts` | Database tables | ✅ Complete |
| `src/lib/auth.ts` | Authentication utilities | ✅ Complete |
| `src/app/registracija/` | Registration page | ✅ Complete |
| `src/app/prisijungimas/` | Login page | ✅ Complete |
| `src/app/dashboard/` | Instructor dashboard | ✅ Complete |
| `src/app/instruktorius/[slug]/` | Public booking page | ✅ Complete |
| `src/app/api/auth/` | Auth API routes | ✅ Complete |
| `src/app/api/bookings/` | Booking API routes | ✅ Complete |
| `src/middleware.ts` | Route protection | ✅ Complete |

## Current Focus

**Next Steps:**
1. Add Stripe subscription integration (€5/month with 7-day trial)
2. Implement email notifications (booking confirmations)
3. Create admin panel for platform owner
4. Add settings page for instructors (working hours, profile)

## Key Features Implemented

### Authentication
- Registration with automatic slug generation
- Login with JWT sessions
- 7-day trial period on signup
- Role-based access (instructor/admin)

### Instructor Dashboard
- Calendar view (month/week/day)
- Booking list with status (pending/confirmed/cancelled)
- Booking management (cancel, view details)
- Public URL display and copy
- Stats overview

### Public Booking Page
- Unique URL per instructor: `/instruktorius/[slug]`
- Available date selection (next 30 days)
- Time slot selection based on working hours
- Conflict detection (no double bookings)
- Client information form
- Success confirmation

### Database Schema
- **instructors**: User accounts, subscription status, profile
- **bookings**: Reservations with client info and status
- **workingHours**: Instructor availability by day
- **breaks**: Break times during working hours
- **blockedDates**: Vacation/unavailable periods
- **lessonSettings**: Lesson duration (60/90 min)
- **admins**: Platform administrators

## Pending Features

- [ ] Stripe payment integration
- [ ] Email notifications (Resend/Sendgrid)
- [ ] Settings page (working hours, profile, breaks)
- [ ] Admin panel (view all instructors, manage subscriptions)
- [ ] Password reset functionality
- [ ] Booking confirmation by instructor
- [ ] SMS notifications (optional)

## Technical Details

### Tech Stack
- Next.js 16 with App Router
- TypeScript (strict mode)
- Tailwind CSS 4
- Drizzle ORM + Supabase PostgreSQL
- bcryptjs for password hashing
- jose for JWT tokens

### API Routes
- `POST /api/auth/register` - Create instructor account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/[id]` - Update booking status

### Protected Routes
- `/dashboard/*` - Instructor only
- `/admin/*` - Admin only

## Session History

| Date | Changes |
|------|---------|
| 2026-02-17 | Initial database setup with 7 tables |
| 2026-02-17 | Authentication system with registration and login |
| 2026-02-17 | Instructor dashboard with calendar view |
| 2026-02-17 | Public booking page with availability checking |
| 2026-02-18 | Fixed Vercel build failures by making database connection optional (lazy loading) |
| 2026-02-18 | Fixed image loading warning by using next/image component |
| 2026-02-18 | Added external image domains configuration in next.config.ts |
