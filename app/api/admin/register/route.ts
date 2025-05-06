import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { email, password, accessCode } = await request.json();

    // Validate inputs
    if (!email || !password || !accessCode) {
      return NextResponse.json(
        { error: "Email, password, and access code are required" },
        { status: 400 }
      );
    }

    // Verify access code - CORRECTED to match your exact database structure
    const accessCodeDoc = await adminDb
      .collection("admins")
      .doc("acess_code") // This is the document ID (with typo)
      .get();

    if (!accessCodeDoc.exists) {
      return NextResponse.json(
        { error: "Access code verification failed" },
        { status: 403 }
      );
    }

    const validAccessCode = accessCodeDoc.data()?.admin_access; // Changed field name to admin_access

    if (accessCode !== validAccessCode) {
      return NextResponse.json(
        { error: "Invalid access code" },
        { status: 403 }
      );
    }

    // Create admin user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
    });

    // Set custom claims to identify as admin
    await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

    // Add user to admins collection
    await adminDb.collection("admins").doc(userRecord.uid).set({
      email: email,
      createdAt: new Date(),
      role: "admin",
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: "Admin registered successfully",
      uid: userRecord.uid,
    });
  } catch (error: any) {
    console.error("Error registering admin:", error);

    // Handle Firebase Auth specific errors
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: error.message || "Error registering admin",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
