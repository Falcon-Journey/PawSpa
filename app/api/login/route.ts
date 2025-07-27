// app/api/login/login.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", userId: user.id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Login failed", details: err.message }, { status: 500 });
  }
}
