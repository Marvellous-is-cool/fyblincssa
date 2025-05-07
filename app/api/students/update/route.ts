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
      console.log("Auth header present:", !!authHeader);

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];

        try {
          // Add logging for token debugging
          console.log(
            "Attempting to verify token:",
            token.substring(0, 10) + "..."
          );

          const decodedToken = await adminAuth.verifyIdToken(token);
          console.log("Token verified, user ID:", decodedToken.uid);

          // Check if this is the student's own record
          const studentData = studentDoc.data();
          if (studentData?.uid !== decodedToken.uid) {
            console.log("Authorization failed: UID mismatch", {
              tokenUid: decodedToken.uid,
              studentUid: studentData?.uid,
            });
            return NextResponse.json(
              { error: "Unauthorized to update this profile" },
              { status: 403 }
            );
          }

          console.log("Authorization successful");
        } catch (tokenError: unknown) {
          console.error("Token verification failed:", tokenError);
          return NextResponse.json(
            {
              error: "Invalid authentication token",
              details:
                process.env.NODE_ENV === "development"
                  ? tokenError instanceof Error
                    ? tokenError.message
                    : String(tokenError)
                  : undefined,
            },
            { status: 401 }
          );
        }
      } else {
        // For development
        // In production, always verify auth
        if (process.env.NODE_ENV === "production") {
          console.log("No valid auth header in production mode");
          return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
          );
        } else {
          console.log("Skipping authentication in development mode");
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

    // Filter out fields that shouldn't be updatable by students
    const sanitizedUpdates = { ...updates };
    const restrictedFields = [
      "featured",
      "canEdit",
      "uid",
      "matricNumber",
      "createdAt",
      "level",
    ];

    restrictedFields.forEach((field) => {
      if (field in sanitizedUpdates) {
        delete sanitizedUpdates[field];
      }
    });

    // Update student profile
    await studentRef.update(sanitizedUpdates);

    return NextResponse.json({
      success: true,
      message: "Student profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      {
        error: error.message || "Error updating student profile",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
