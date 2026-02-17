import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Instructors (paid users)
export const instructors = sqliteTable("instructors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // For unique URL: /instruktorius/vardas-pavarde
  phone: text("phone"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  
  // Subscription
  subscriptionStatus: text("subscription_status").notNull().default("trial"), // trial, active, inactive
  trialEndsAt: integer("trial_ends_at", { mode: "timestamp" }),
  subscriptionEndsAt: integer("subscription_ends_at", { mode: "timestamp" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Password reset
  resetToken: text("reset_token"),
  resetTokenExpiresAt: integer("reset_token_expires_at", { mode: "timestamp" }),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Working hours configuration
export const workingHours = sqliteTable("working_hours", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text("start_time").notNull(), // Format: "08:00"
  endTime: text("end_time").notNull(), // Format: "18:00"
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// Break times
export const breaks = sqliteTable("breaks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

// Blocked dates (vacations, etc.)
export const blockedDates = sqliteTable("blocked_dates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  reason: text("reason"),
});

// Lesson duration settings
export const lessonSettings = sqliteTable("lesson_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }).unique(),
  durationMinutes: integer("duration_minutes").notNull().default(60), // 60 or 90 minutes
});

// Bookings
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instructorId: integer("instructor_id").notNull().references(() => instructors.id, { onDelete: "cascade" }),
  
  // Client info
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientEmail: text("client_email").notNull(),
  
  // Booking details
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  
  // Notes
  notes: text("notes"),
  cancellationReason: text("cancellation_reason"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Admin users (platform owners)
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
