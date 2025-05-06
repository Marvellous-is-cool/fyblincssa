import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const studentDoc = await adminDb.collection("students").doc(id).get();

    if (!studentDoc.exists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: studentDoc.id,
      ...studentDoc.data(),
    });
  } catch (error: any) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching student" },
      { status: 500 }
    );
  }
}
