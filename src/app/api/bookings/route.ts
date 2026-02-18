import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { bookings, instructors } from "@/db/schema";
import { eq, and, or, gte, lte } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured. Please set DATABASE_URL." },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const {
      instructorId,
      clientName,
      clientPhone,
      clientEmail,
      notes,
      startTime,
      endTime,
    } = body;

    // Validate input
    if (
      !instructorId ||
      !clientName ||
      !clientPhone ||
      !clientEmail ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        { error: "Visi laukai yra privalomi" },
        { status: 400 }
      );
    }

    // Verify instructor exists and has active subscription
    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.id, instructorId))
      .limit(1);

    if (!instructor) {
      return NextResponse.json(
        { error: "Instruktorius nerastas" },
        { status: 404 }
      );
    }

    if (instructor.subscriptionStatus === "inactive") {
      return NextResponse.json(
        { error: "Instruktorius neturi aktyvios prenumeratos" },
        { status: 403 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if time slot is already booked
    const conflictingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.instructorId, instructorId),
          or(
            and(gte(bookings.startTime, start), lte(bookings.startTime, end)),
            and(gte(bookings.endTime, start), lte(bookings.endTime, end)),
            and(lte(bookings.startTime, start), gte(bookings.endTime, end))
          )
        )
      );

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: "Šis laikas jau užimtas" },
        { status: 409 }
      );
    }

    // Create booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        instructorId,
        clientName,
        clientPhone,
        clientEmail,
        notes: notes || null,
        startTime: start,
        endTime: end,
        status: "pending",
      })
      .returning();

    // TODO: Send email notification to instructor and client

    return NextResponse.json({
      success: true,
      booking: {
        id: newBooking.id,
        startTime: newBooking.startTime.toISOString(),
        endTime: newBooking.endTime.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Įvyko klaida kuriant rezervaciją" },
      { status: 500 }
    );
  }
}
