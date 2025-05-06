import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const uid = params.uid;

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate the request auth
    try {
      const authHeader = request.headers.get("authorization");

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Only allow access to your own profile
        if (decodedToken.uid !== uid) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
      }
    } catch (authError) {
      console.error("Auth validation error:", authError);
      // Continue without auth for now
    }

    // Find the student by UID
    const studentsRef = adminDb.collection("students");
    const snapshot = await studentsRef.where("uid", "==", uid).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Return the first (and should be only) student with this UID
    const studentData = snapshot.docs[0].data();

    return NextResponse.json({
      id: snapshot.docs[0].id,
      ...studentData,
    });
  } catch (error: any) {
    console.error("Error fetching student by user ID:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching student data" },
      { status: 500 }
    );
  }
}
