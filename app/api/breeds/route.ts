import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from("breeds")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: "Failed to fetch breeds" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
