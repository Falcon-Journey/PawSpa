import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = await req.json();
    const { bookingId, newBookingDate } = body;

    if (!bookingId || !newBookingDate) {
      return NextResponse.json({ error: "Missing bookingId or newBookingDate" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ booking_date: newBookingDate })
      .eq("id", bookingId)
      .select();

    if (error) {
      return NextResponse.json({ error: "Failed to reschedule booking", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Booking rescheduled", updatedBooking: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
