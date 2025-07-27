// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = await req.json();

    const {
      user_id,
      dog_id,
      booking_details, // Should be a JS object
      booking_date,
      booking_slot_time,
      ritual_type,
      discount_code,
      special_requests,
      total_price,
    } = body;

    if (
      !user_id ||
      !dog_id ||
      !booking_details ||
      !booking_date ||
      !booking_slot_time ||
      total_price === undefined
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert the booking
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          user_id,
          dog_id,
          booking_details,
          booking_date,
          booking_slot_time,
          ritual_type,
          discount_code,
          special_requests,
          total_price,
        },
      ])
      .select()
      .single();

    if (bookingError) {
      console.error("Insert error:", bookingError);
      return NextResponse.json(
        { error: "Failed to insert booking", details: bookingError.message },
        { status: 500 }
      );
    }

    // Get user info
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("firstname, email")
      .eq("id", user_id)
      .single();

    if (userError) {
      console.error("User fetch error:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user details", details: userError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Booking created",
        booking: bookingData,
        user: userData, // includes name and email
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
