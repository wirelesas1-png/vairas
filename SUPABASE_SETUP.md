# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: Vairavimo Rezervacijos
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to your users
4. Click "Create new project"

## 2. Get Your Credentials

Once your project is created:

### A. Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### B. Get Database Connection String
1. Go to **Settings** → **Database**
2. Scroll to **Connection string**
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password from step 1

## 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Database Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres

# JWT Secret (generate a random string)
JWT_SECRET=your-random-secret-key-here
```

## 4. Run Database Migrations

After setting up your `.env.local` file:

```bash
# Generate new migrations for PostgreSQL
bun db:generate

# Run migrations to create tables in Supabase
bun db:migrate
```

## 5. Verify Setup

1. Go to Supabase Dashboard → **Table Editor**
2. You should see these tables:
   - instructors
   - bookings
   - working_hours
   - breaks
   - blocked_dates
   - lesson_settings
   - admins

## 6. Test the Application

```bash
# Start the development server
bun dev
```

Visit:
- `http://localhost:3000` - Home page
- `http://localhost:3000/registracija` - Register as instructor
- `http://localhost:3000/prisijungimas` - Login

## Troubleshooting

### Connection Issues
- Verify your DATABASE_URL is correct
- Check that your database password doesn't contain special characters that need URL encoding
- Ensure your IP is allowed in Supabase (Settings → Database → Connection pooling)

### Migration Errors
- Delete `src/db/migrations/` folder and run `bun db:generate` again
- Make sure DATABASE_URL is set before running migrations

### Authentication Issues
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
- Check browser console for errors

## Next Steps

Once Supabase is connected:
1. Register your first instructor account
2. Test the booking flow
3. Configure Stripe for payments
4. Set up email notifications
