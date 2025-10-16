// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const hfResponse = await fetch(process.env.HUGGINGFACE_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await hfResponse.json();
    const botMessage = data?.generated_text || "Maaf, saya tidak mengerti pertanyaan Anda.";

    await supabaseAdmin.from("projects").insert({
      title: "Chat AI Log",
      description: message,
      file_url: "#",
      image_url: null,
      tags: ["chatbot"],
    });

    return NextResponse.json({ reply: botMessage });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
