import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import {
  CollectionReference,
  Query,
  DocumentData,
} from "firebase-admin/firestore";

export async function GET(request: Request) {
  try {
    // Check for admin authentication (in a production app)
    // This is a basic implementation - you should add proper authentication checks

    // Get query parameters for filtering
    const url = new URL(request.url);
    const featured = url.searchParams.get("featured") === "true";
    const limit = url.searchParams.get("limit")
      ? parseInt(url.searchParams.get("limit") as string)
      : 100;

    // Start with a collection reference
    let studentsQuery: CollectionReference<DocumentData> | Query<DocumentData> =
      adminDb.collection("students");

    // Apply filters if provided
    if (featured) {
      studentsQuery = studentsQuery.where("featured", "==", true);
    }

    // Get limited number of students
    const snapshot = await studentsQuery.limit(limit).get();

    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(students);
  } catch (error: any) {
    console.error("Error fetching students for admin:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching students" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, updates } = data;

    if (!id || !updates) {
      return NextResponse.json(
        { error: "Missing student ID or updates" },
        { status: 400 }
      );
    }

    // Get a reference to the student document
    const studentRef = adminDb.collection("students").doc(id);

    // Update the document
    await studentRef.update(updates);

    // Get the updated document
    const updatedDoc = await studentRef.get();

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
      message: "Student updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: error.message || "Error updating student" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get the student ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing student ID" },
        { status: 400 }
      );
    }

    // Get the student document to check if it exists
    const studentRef = adminDb.collection("students").doc(id);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Delete the student
    await studentRef.delete();

    return NextResponse.json({
      message: "Student deleted successfully",
      id,
    });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: error.message || "Error deleting student" },
      { status: 500 }
    );
  }
}
