import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const studentsRef = adminDb.collection("students");
    const snapshot = await studentsRef.where("featured", "==", true).get();

    const featuredStudents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(featuredStudents);
  } catch (error: any) {
    console.error("Error fetching featured students:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching featured students" },
      { status: 500 }
    );
  }
}
