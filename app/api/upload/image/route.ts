import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/superbase/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const body = await req.json();
    const { base64Data, name, type } = body;

    if (!base64Data || !name || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert base64 to Buffer
    const buffer = Buffer.from(base64Data, "base64");

    const filePath = `${Date.now()}-${name}`;
    const { data, error } = await supabase.storage
      .from("grooming-photos") // replace with your bucket
      .upload(filePath, buffer, {
        contentType: type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase
      .storage
      .from("grooming-photos")
      .getPublicUrl(filePath);

    return NextResponse.json({ message: "Upload successful", path: filePath, url: publicUrlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: "Upload failed", details: err.message }, { status: 500 });
  }
}
