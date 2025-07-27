import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = await req.json();

    const {
      firstname,
      last_name,
      phone_country_code,
      email,
      phone,
      password,
      dogs,
    }: {
      firstname: string;
      last_name: string;
      phone_country_code: string;
      email: string;
      phone: string;
      password: string;
      dogs: {
        name: string;
        breed: string;
        weight: number;
        dob: string; // ISO date
        groomingBehaviour: string[];  // already a string array
        other?: string;
      }[];
    } = body;

    // 1. Insert user
    const { data: userInsert, error: userError } = await supabase
      .from("users")
      .insert({
        firstname,
        last_name,
        email,
        phone_country_code,
        phone_number: phone,
        password,
      })
      .select("id")
      .single();

    if (userError) {
      console.error("User insert error:", userError.message);
      return NextResponse.json({ error: "Failed to insert user" }, { status: 500 });
    }

    const userId = userInsert.id;

    // 2. Prepare dog entries with grooming_behaviour as string[]
    const dogEntries = dogs.map((dog) => ({
      user_id: userId,
      name: dog.name,
      breed: dog.breed,
      weight_kg: dog.weight,
      date_of_birth: dog.dob,
      grooming_behavior: dog.groomingBehaviour ?? [], // string[] stored in text[] column
      other_behavior_notes: dog.other || null,
    }));

    // 3. Insert dogs
    const { error: dogsError } = await supabase.from("dogs").insert(dogEntries);

    if (dogsError) {
      console.error("Dogs insert error:", dogsError.message);
      return NextResponse.json({ error: "Failed to insert dogs" }, { status: 500 });
    }

    return NextResponse.json({ message: "User and dogs saved successfully", userId });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed", details: error.message }, { status: 500 });
  }
}
