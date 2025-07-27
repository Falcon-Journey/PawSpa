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

    const { data: dogs, error } = await supabase
      .from("dogs")
      .select("id, name, breed, weight_kg, date_of_birth, grooming_behavior, other_behavior_notes")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch dogs", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ dogs }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
  }
}
