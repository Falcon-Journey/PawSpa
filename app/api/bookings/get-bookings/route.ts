import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_date,
        booking_slot_time,
        ritual_type,
        total_price,
        dogs ( name )
      `)
      .eq("user_id", user_id)
      .order("booking_date", { ascending: true });

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch bookings", details: error.message }, { status: 500 });
    }

    const mapped = data.map((booking: any) => ({
      id: booking.id,
      dog: booking.dogs?.name || "Dog",
      service: booking.ritual_type,
      date: booking.booking_date,
      time: booking.booking_slot_time,
      price: booking.total_price,
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
