import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();

    // Validate request
    if (!id || !updates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get student document
    const studentRef = adminDb.collection("students").doc(id);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check authorization
    try {
      const authHeader = request.headers.get("authorization");

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Check if this is the student's own record
        const studentData = studentDoc.data();
        if (studentData?.uid !== decodedToken.uid) {
          return NextResponse.json(
            { error: "Unauthorized to update this profile" },
            { status: 403 }
          );
        }
      } else {
        // For development
        // In production, always verify auth
        if (process.env.NODE_ENV === "production") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }
    } catch (authError) {
      console.error("Auth validation error:", authError);
      // Continue in development, fail in production
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Authentication error" },
          { status: 401 }
        );
      }
    }

    // Check if student can edit their profile
    const studentData = studentDoc.data();
    if (studentData?.canEdit === false) {
      return NextResponse.json(
        {
          error:
            "Cannot edit profile while featured as Personality of the Week",
        },
        { status: 403 }
      );
    }

    // Sanitize updates - remove fields that shouldn't be updatable
    const {
      id: updateId,
      uid,
      createdAt,
      featured,
      canEdit,
      ...validUpdates
    } = updates;

    // Update the document
    await studentRef.update(validUpdates);

    // Get the updated document
    const updatedDoc = await studentRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedData,
    });
  } catch (error: any) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: error.message || "Error updating student" },
      { status: 500 }
    );
  }
}
