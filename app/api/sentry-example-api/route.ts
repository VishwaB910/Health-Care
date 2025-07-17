import { NextResponse } from "next/server";
import { getPatientAppointments } from "@/lib/actions/appointment.actions"; // Replace with your actual data fetching function

export const dynamic = "force-dynamic";

// API route to retrieve past appointment history for a specific user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch patient appointments from your data source
    const appointments = await getPatientAppointments(userId);

    if (appointments.length === 0) {
      return NextResponse.json({ message: "No appointments found" });
    }

    // Return the appointments data
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error retrieving patient appointments:", error);
    return NextResponse.json(
      { error: "Failed to retrieve patient appointments" },
      { status: 500 }
    );
  }
}
