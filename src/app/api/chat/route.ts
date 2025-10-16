import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
    }

    // Ambil data project dari Supabase
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("title, description, tags, language, file_url");

    const context = `
Kamu adalah asisten AI yang ramah dan membantu. Gunakan bahasa Indonesia santai tapi sopan.
Jika user bertanya soal project, rekomendasikan dari daftar berikut:

${projects
  ?.map(
    (p) =>
      `• ${p.title} — ${p.description || "Tidak ada deskripsi"} (Bahasa: ${
        p.language?.join(", ") || "Tidak diketahui"
      })`
  )
  .join("\n")}
`;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`${context}\n\nUser: ${message}`);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat Error:", error);
    // fallback jika API gagal
    return NextResponse.json({
      reply:
        "Maaf, server AI gagal merespons 😅. Kamu bisa ceritakan project seperti apa yang diinginkan, nanti saya bantu rekomendasikan dari database!",
    });
  }
}
