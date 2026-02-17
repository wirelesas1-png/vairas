# Supabase Duomenų Bazės Sukūrimas

## Problema

Negalime prisijungti prie Supabase duomenų bazės su dabartiniais credentials. Reikia sukurti lenteles rankiniu būdu.

## Sprendimas: Naudoti Supabase SQL Editor

### 1. Atidarykite Supabase Dashboard

Eikite į: https://supabase.com/dashboard/project/uusenrzptbydyvxczezn

### 2. Atidarykite SQL Editor

Kairėje pusėje paspauskite **SQL Editor**

### 3. Nukopijuokite ir Paleiskite SQL

Nukopijuokite visą SQL kodą iš failo [`src/db/migrations/0000_tense_barracuda.sql`](src/db/migrations/0000_tense_barracuda.sql) ir įklijuokite į SQL Editor.

Arba nukopijuokite šį kodą:

```sql
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);

CREATE TABLE "blocked_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"reason" text
);

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

CREATE TABLE "breaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL
);

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

CREATE TABLE "lesson_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	CONSTRAINT "lesson_settings_instructor_id_unique" UNIQUE("instructor_id")
);

CREATE TABLE "working_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructor_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);

ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "breaks" ADD CONSTRAINT "breaks_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "lesson_settings" ADD CONSTRAINT "lesson_settings_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;
```

### 4. Paleiskite SQL

Paspauskite **Run** arba `Ctrl+Enter`

### 5. Patikrinkite Lenteles

Kairėje pusėje paspauskite **Table Editor** ir turėtumėte matyti 7 naujas lenteles:
- admins
- blocked_dates
- bookings
- breaks
- instructors
- lesson_settings
- working_hours

## Po Sukūrimo

Dabar galite paleisti aplikaciją:

```bash
bun dev
```

Ir eiti į:
- http://localhost:3000/registracija - Registracija
- http://localhost:3000/prisijungimas - Prisijungimas
- http://localhost:3000/dashboard - Dashboard (po prisijungimo)

## Lentelių Struktūra

### instructors
Instruktorių paskyros su prenumeratos informacija

### bookings
Visos rezervacijos su kliento informacija

### working_hours
Instruktoriaus darbo valandos pagal dienas

### breaks
Pertraukų laikai darbo dienomis

### blocked_dates
Atostogos ar užblokuoti laikai

### lesson_settings
Pamokos trukmė (60 ar 90 min)

### admins
Platformos administratoriai
