import { pgTable, text, integer, timestamp, boolean, serial } from "drizzle-orm/pg-core";

// Instructors (paid users)
export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // For unique URL: /instruktorius/vardas-pavarde
  phone: text("phone"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  
  // Subscription
  subscriptionStatus: text("subscription_status").notNull().default("trial"), // trial, active, inactive
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Password reset
  resetToken: text("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Working hours configuration
export const workingHours = pgTable("working_hours", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text("start_time").notNull(), // Format: "08:00"
  endTime: text("end_time").notNull(), // Format: "18:00"
  isActive: boolean("is_active").notNull().default(true),
});

// Break times
export const breaks = pgTable("breaks", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

// Blocked dates (vacations, etc.)
export const blockedDates = pgTable("blocked_dates", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason"),
});

// Lesson duration settings
export const lessonSettings = pgTable("lesson_settings", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }).unique(),
  durationMinutes: integer("duration_minutes").notNull().default(60), // 60 or 90 minutes
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  
  // Client info
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientEmail: text("client_email").notNull(),
  
  // Booking details
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  
  // Notes
  notes: text("notes"),
  cancellationReason: text("cancellation_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Admin users (platform owners)
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
