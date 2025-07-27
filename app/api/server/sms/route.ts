// app/api/send-sms/route.ts

import { NextResponse } from "next/server";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Log environment (you can remove this after testing)
console.log("AWS REGION:", process.env.AWS_REGION);

const sns = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    console.log("Received POST request to /api/send-sms");

    const { phone, message } = await req.json();
    console.log("Parsed body:", { phone, message });

    if (!phone || !message) {
      console.warn("Missing phone or message in request body.");
      return NextResponse.json({ error: "Missing phone or message" }, { status: 400 });
    }

    const command = new PublishCommand({
      Message: message,
      PhoneNumber: phone,
    });

    console.log("Sending SMS via AWS SNS...");
    const result = await sns.send(command);
    console.log("SNS Response:", result);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("SMS Send Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to send SMS" }, { status: 500 });
  }
}
