CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `blocked_dates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instructor_id` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`reason` text,
	FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instructor_id` integer NOT NULL,
	`client_name` text NOT NULL,
	`client_phone` text NOT NULL,
	`client_email` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`cancellation_reason` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `breaks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instructor_id` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `instructors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`phone` text,
	`bio` text,
	`profile_image` text,
	`subscription_status` text DEFAULT 'trial' NOT NULL,
	`trial_ends_at` integer,
	`subscription_ends_at` integer,
	`stripe_customer_id` text,
	`stripe_subscription_id` text,
	`reset_token` text,
	`reset_token_expires_at` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `instructors_email_unique` ON `instructors` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `instructors_slug_unique` ON `instructors` (`slug`);--> statement-breakpoint
CREATE TABLE `lesson_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instructor_id` integer NOT NULL,
	`duration_minutes` integer DEFAULT 60 NOT NULL,
	FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lesson_settings_instructor_id_unique` ON `lesson_settings` (`instructor_id`);--> statement-breakpoint
CREATE TABLE `working_hours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instructor_id` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`instructor_id`) REFERENCES `instructors`(`id`) ON UPDATE no action ON DELETE cascade
);
