import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
    }

    // Ambil project dari Supabase
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("title, description, tags, language, file_url");

    // Siapkan konteks
    const context = `
Kamu adalah asisten AI ramah. Tugasmu:
1. Jawablah secara manusiawi, hangat, dan natural dalam bahasa Indonesia.
2. Jika user menanyakan project yang cocok, gunakan data di bawah ini.
3. Jangan jawab terlalu formal.

Daftar project di database:
${projects
  ?.map(
    (p) =>
      `• ${p.title} — ${p.description || "Tidak ada deskripsi"} (Bahasa: ${
        p.language?.join(", ") || "Tidak diketahui"
      })`
  )
  .join("\n")}
`;

    // Hubungkan ke Gemini
    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`${context}\n\nUser: ${message}`);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat Error:", error);
    // fallback jika error
    return NextResponse.json({
      reply:
        "Maaf, saya tidak bisa menghubungi server AI sekarang. Tapi kamu bisa ceritakan project seperti apa yang kamu inginkan, nanti saya bantu rekomendasikan dari database!",
    });
  }
}
