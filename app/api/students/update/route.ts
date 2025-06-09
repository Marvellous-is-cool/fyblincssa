import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { ensureHttps } from "@/utils/cloudinaryConfig";

export async function PUT(request: Request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    let authenticatedUserId = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        authenticatedUserId = decodedToken.uid;
        console.log("Authenticated user:", authenticatedUserId);
      } catch (authError) {
        console.error("Authentication error:", authError);
        return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
      }
    } else {
      // In production, authentication is required
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    }

    const { id, updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // If authenticated, verify user can update this profile
    if (authenticatedUserId) {
      const studentDoc = await adminDb.collection("students").doc(id).get();
      if (studentDoc.exists) {
        const studentData = studentDoc.data();
        // Only allow users to update their own profile
        if (studentData?.uid !== authenticatedUserId) {
          return NextResponse.json({ error: "Unauthorized to update this profile" }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
    }

    // Ensure photoURL is HTTPS if it exists
    if (updates.photoURL) {
      updates.photoURL = ensureHttps(updates.photoURL);
    }

    // Clean up undefined values
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    // Use admin SDK to update the document
    const studentRef = adminDb.collection("students").doc(id);
    await studentRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Get the updated document
    const updatedDoc = await studentRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      message: "Profile updated successfully",
      data: { id, ...updatedData },
    });
  } catch (error: any) {
    console.error("Update error:", error);
    
    // Handle specific Firebase errors
    if (error.code === 'not-found') {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    
    if (error.code === 'permission-denied') {
      return NextResponse.json({ error: "Insufficient permissions to update profile" }, { status: 403 });
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to update profile",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
