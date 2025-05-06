import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { studentId, unfeaturedIds } = data;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // First, unfeature any currently featured students
    if (unfeaturedIds && unfeaturedIds.length > 0) {
      const batch = adminDb.batch();

      for (const id of unfeaturedIds) {
        const studentRef = adminDb.collection("students").doc(id);
        batch.update(studentRef, { featured: false });
      }

      await batch.commit();
    }

    // Then, feature the selected student
    const studentRef = adminDb.collection("students").doc(studentId);
    await studentRef.update({ featured: true });

    return NextResponse.json({
      success: true,
      message: "Student featured successfully",
    });
  } catch (error: any) {
    console.error("Error featuring student:", error);
    return NextResponse.json(
      {
        error: error.message || "Error featuring student",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
