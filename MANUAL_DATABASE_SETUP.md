# Rankinė Duomenų Bazės Konfigūracija

## Problema

Automatinė migracija nepavyksta dėl autentifikacijos problemų su Supabase. Greičiausias sprendimas - sukurti lenteles rankiniu būdu.

## Sprendimas: SQL Editor

### 1. Atidarykite Supabase SQL Editor

1. Eikite į: https://supabase.com/dashboard/project/uusenrzptbydyvxczezn
2. Kairėje pusėje paspauskite **SQL Editor**
3. Paspauskite **New query**

### 2. Nukopijuokite ir Įklijuokite Šį SQL Kodą

```sql
-- Sukurti admins lentelę
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);

-- Sukurti instructors lentelę
CREATE TABLE "instructors" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"phone" text,
	"bio" text,
	"profile_image" text,
	"subscription_status" text DEFAULT 'trial' NOT NULL,
	"trial_ends_at" timestamp,
	"subscription_ends_at" timestamp,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"reset_token" text,
	"reset_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instructors_email_unique" UNIQUE("email"),
	CONSTRAINT "instructors_slug_unique" UNIQUE("slug")
);

-- Sukurti bookings lentelę
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"client_name" text NOT NULL,
	"client_phone" text NOT NULL,
	"client_email" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Sukurti working_hours lentelę
CREATE TABLE "working_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);

-- Sukurti breaks lentelę
CREATE TABLE "breaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL
);

-- Sukurti blocked_dates lentelę
CREATE TABLE "blocked_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"reason" text
);

-- Sukurti lesson_settings lentelę
CREATE TABLE "lesson_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	CONSTRAINT "lesson_settings_instructor_id_unique" UNIQUE("instructor_id")
);

-- Pridėti foreign key constraints
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_instructor_id_instructors_id_fk" 
  FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_instructor_id_instructors_id_fk" 
  FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "breaks" ADD CONSTRAINT "breaks_instructor_id_instructors_id_fk" 
  FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "lesson_settings" ADD CONSTRAINT "lesson_settings_instructor_id_instructors_id_fk" 
  FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_instructor_id_instructors_id_fk" 
  FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
```

### 3. Paleiskite SQL

- Paspauskite **Run** mygtuką (arba `Ctrl+Enter`)
- Turėtumėte matyti pranešimą: "Success. No rows returned"

### 4. Patikrinkite Lenteles

1. Kairėje pusėje paspauskite **Table Editor**
2. Turėtumėte matyti 7 naujas lenteles:
   - ✅ `admins`
   - ✅ `instructors`
   - ✅ `bookings`
   - ✅ `working_hours`
   - ✅ `breaks`
   - ✅ `blocked_dates`
   - ✅ `lesson_settings`

## Po Lentelių Sukūrimo

Sistema bus paruošta naudoti! Galėsite:

1. **Registruotis**: http://localhost:3000/registracija
2. **Prisijungti**: http://localhost:3000/prisijungimas
3. **Matyti Dashboard**: http://localhost:3000/dashboard
4. **Testuoti Rezervacijas**: http://localhost:3000/instruktorius/[jūsų-slug]

## Jei Kyla Problemų

Jei lentelės jau egzistuoja, pirmiausia jas ištrinkite:

```sql
DROP TABLE IF EXISTS "blocked_dates" CASCADE;
DROP TABLE IF EXISTS "bookings" CASCADE;
DROP TABLE IF EXISTS "breaks" CASCADE;
DROP TABLE IF EXISTS "lesson_settings" CASCADE;
DROP TABLE IF EXISTS "working_hours" CASCADE;
DROP TABLE IF EXISTS "instructors" CASCADE;
DROP TABLE IF EXISTS "admins" CASCADE;
```

Tada paleiskite CREATE TABLE komandas iš naujo.
