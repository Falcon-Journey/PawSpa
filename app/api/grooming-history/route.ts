import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: grooming_feedback, error } = await supabase
      .from("grooming_feedback")
      .select(`
        id,
        booking_id,
        photos,
        notes,
        rating,
        created_at,
        user_id,
        dog_id,
        dogs (
          id,
          name,
          breed,
          weight_kg,
          date_of_birth
        ),
        bookings (
          id,
          booking_date,
          ritual_type
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch grooming history", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ grooming_feedback }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
