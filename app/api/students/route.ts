import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { ensureHttps } from "@/utils/cloudinaryConfig";

export async function GET() {
  try {
    const studentsRef = adminDb.collection("students");
    const snapshot = await studentsRef.get();

    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      photoURL: doc.data().photoURL ? ensureHttps(doc.data().photoURL) : null,
    }));

    return NextResponse.json(students);
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching students" },
      { status: 500 }
    );
  }
}
