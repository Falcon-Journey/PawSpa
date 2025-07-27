// app/api/price_rules/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = await req.json();
    const { dogType, coatType, lastGroomingPeriod } = body;

    if (!dogType || !coatType || !lastGroomingPeriod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("price_rules")
      .select("price")
      .filter("dog_type", "cs", `{${dogType}}`)
      .filter("coat_type", "cs", `{${coatType}}`)
      .filter("last_grooming_period", "cs", `{${lastGroomingPeriod}}`)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "No matching price rule found" }, { status: 404 });
    }

    return NextResponse.json({ price: data.price }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Price lookup failed", details: err.message }, { status: 500 });
  }
}
