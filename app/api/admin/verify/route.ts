import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check if user exists in admins collection with admin role
    const adminDoc = await adminDb.collection("admins").doc(uid).get();

    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: "User not found in admin collection" },
        { status: 403 }
      );
    }

    const adminData = adminDoc.data();

    if (adminData?.role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient privileges. Admin role required." },
        { status: 403 }
      );
    }

    // Return success with admin info
    return NextResponse.json({
      success: true,
      admin: {
        uid: uid,
        email: decodedToken.email,
        role: adminData.role,
      },
    });
  } catch (error: any) {
    console.error("Admin verification error:", error);

    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { error: "Token expired. Please login again." },
        { status: 401 }
      );
    }

    if (error.code === "auth/argument-error") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
