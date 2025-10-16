import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Ambil 5 project terbaru dari Supabase
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("title, description")
      .order("created_at", { ascending: false })
      .limit(5);

    // Tambahkan konteks untuk AI
    let contextText = "";
    if (projects && projects.length > 0) {
      contextText = "\nBerikut beberapa project yang tersedia:\n";
      contextText += projects.map((p: any) => `- ${p.title}: ${p.description || "-"}`).join("\n");
    }

    // Request ke Hugging Face
    const hfResponse = await fetch(process.env.HUGGINGFACE_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message + contextText,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
        },
      }),
    });

    const data = await hfResponse.json();

    // Ambil jawaban AI
    let botMessage = "";
    if (Array.isArray(data)) {
      botMessage = data[0]?.generated_text || "Maaf, saya tidak mengerti pertanyaan Anda.";
    } else if (data.generated_text) {
      botMessage = data.generated_text;
    } else {
      botMessage = "Maaf, saya tidak mengerti pertanyaan Anda.";
    }

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
