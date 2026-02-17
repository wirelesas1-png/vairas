import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { instructors, lessonSettings } from "@/db/schema";
import { hashPassword, generateSlug, setSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Visi laukai yra privalomi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Slaptažodis turi būti bent 8 simbolių" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(instructors)
      .where(eq(instructors.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Šis el. paštas jau užregistruotas" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(name);
    let slugExists = true;
    let counter = 1;

    while (slugExists) {
      const existing = await db
        .select()
        .from(instructors)
        .where(eq(instructors.slug, slug))
        .limit(1);

      if (existing.length === 0) {
        slugExists = false;
      } else {
        slug = `${generateSlug(name)}-${counter}`;
        counter++;
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Calculate trial end date (7 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    // Create instructor
    const [newInstructor] = await db
      .insert(instructors)
      .values({
        name,
        email,
        passwordHash,
        slug,
        subscriptionStatus: "trial",
        trialEndsAt,
      })
      .returning();

    // Create default lesson settings (60 minutes)
    await db.insert(lessonSettings).values({
      instructorId: newInstructor.id,
      durationMinutes: 60,
    });

    // Set session
    await setSession({
      userId: newInstructor.id,
      email: newInstructor.email,
      role: "instructor",
    });

    return NextResponse.json({
      success: true,
      instructor: {
        id: newInstructor.id,
        name: newInstructor.name,
        email: newInstructor.email,
        slug: newInstructor.slug,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Įvyko klaida registruojantis" },
      { status: 500 }
    );
  }
}
