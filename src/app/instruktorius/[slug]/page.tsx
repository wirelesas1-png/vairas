import { notFound } from "next/navigation";
import { db } from "@/db";
import { instructors, workingHours, lessonSettings, bookings, blockedDates } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import BookingClient from "./BookingClient";

export default async function InstructorBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Get instructor by slug
  const [instructor] = await db
    .select()
    .from(instructors)
    .where(eq(instructors.slug, slug))
    .limit(1);

  if (!instructor) {
    notFound();
  }

  // Check if subscription is active
  if (instructor.subscriptionStatus === "inactive") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Rezervacijos laikinai neprieinamos
          </h1>
          <p className="text-gray-600">
            Šis instruktorius šiuo metu neturi aktyvios prenumeratos.
          </p>
        </div>
      </div>
    );
  }

  // Get lesson settings
  const [settings] = await db
    .select()
    .from(lessonSettings)
    .where(eq(lessonSettings.instructorId, instructor.id))
    .limit(1);

  // Get working hours
  const instructorWorkingHours = await db
    .select()
    .from(workingHours)
    .where(eq(workingHours.instructorId, instructor.id));

  // Get blocked dates for the next 3 months
  const now = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  const instructorBlockedDates = await db
    .select()
    .from(blockedDates)
    .where(
      and(
        eq(blockedDates.instructorId, instructor.id),
        lte(blockedDates.startDate, threeMonthsLater)
      )
    );

  // Get existing bookings for the next 3 months
  const existingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.instructorId, instructor.id),
        gte(bookings.startTime, now),
        lte(bookings.startTime, threeMonthsLater)
      )
    );

  return (
    <BookingClient
      instructor={{
        id: instructor.id,
        name: instructor.name,
        bio: instructor.bio,
        profileImage: instructor.profileImage,
        phone: instructor.phone,
      }}
      lessonDuration={settings?.durationMinutes || 60}
      workingHours={instructorWorkingHours.map((wh) => ({
        dayOfWeek: wh.dayOfWeek,
        startTime: wh.startTime,
        endTime: wh.endTime,
        isActive: wh.isActive,
      }))}
      blockedDates={instructorBlockedDates.map((bd) => ({
        startDate: bd.startDate.toISOString(),
        endDate: bd.endDate.toISOString(),
      }))}
      existingBookings={existingBookings
        .filter((b) => b.status !== "cancelled")
        .map((b) => ({
          startTime: b.startTime.toISOString(),
          endTime: b.endTime.toISOString(),
        }))}
    />
  );
}
