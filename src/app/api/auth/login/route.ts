import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { instructors, admins } from "@/db/schema";
import { verifyPassword, setSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role = "instructor" } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "El. paštas ir slaptažodis yra privalomi" },
        { status: 400 }
      );
    }

    // Check if user exists based on role
    let user;
    if (role === "admin") {
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.email, email))
        .limit(1);
      user = admin;
    } else {
      const [instructor] = await db
        .select()
        .from(instructors)
        .where(eq(instructors.email, email))
        .limit(1);
      user = instructor;
    }

    if (!user) {
      return NextResponse.json(
        { error: "Neteisingas el. paštas arba slaptažodis" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Neteisingas el. paštas arba slaptažodis" },
        { status: 401 }
      );
    }

    // Set session
    await setSession({
      userId: user.id,
      email: user.email,
      role: role as "instructor" | "admin",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Įvyko klaida prisijungiant" },
      { status: 500 }
    );
  }
}
