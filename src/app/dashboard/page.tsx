import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { instructors, bookings } from "@/db/schema";
import { eq, gte, lte, and } from "drizzle-orm";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "instructor") {
    redirect("/prisijungimas");
  }

  // Get instructor data
  const [instructor] = await db
    .select()
    .from(instructors)
    .where(eq(instructors.id, session.userId))
    .limit(1);

  if (!instructor) {
    redirect("/prisijungimas");
  }

  // Get bookings for the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const instructorBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.instructorId, instructor.id),
        gte(bookings.startTime, startOfMonth),
        lte(bookings.startTime, endOfMonth)
      )
    )
    .orderBy(bookings.startTime);

  return (
    <DashboardClient
      instructor={{
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        slug: instructor.slug,
        subscriptionStatus: instructor.subscriptionStatus,
        trialEndsAt: instructor.trialEndsAt?.toISOString() || null,
      }}
      bookings={instructorBookings.map((b) => ({
        id: b.id,
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        clientEmail: b.clientEmail,
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
        status: b.status,
        notes: b.notes,
      }))}
    />
  );
}
