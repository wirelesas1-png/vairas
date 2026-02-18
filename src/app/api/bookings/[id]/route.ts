import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured. Please set DATABASE_URL." },
        { status: 500 }
      );
    }
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bookingId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    // Verify booking belongs to instructor
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { error: "Rezervacija nerasta" },
        { status: 404 }
      );
    }

    if (booking.instructorId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update booking
    await db
      .update(bookings)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Įvyko klaida atnaujinant rezervaciją" },
      { status: 500 }
    );
  }
}
