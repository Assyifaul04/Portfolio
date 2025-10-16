import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
    }

    // Ambil data project dari Supabase dengan semua kolom yang relevan
    const { data: projects, error } = await supabaseAdmin
      .from("projects")
      .select("id, title, description, tags, language, file_url, image_url, type, download_count, created_at");

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({
        reply: "Maaf, terjadi kesalahan saat mengambil data project 😅",
        projects: [],
      });
    }

    // Format data project untuk context AI
    const projectList = projects
      ?.map((p, index) => {
        const tags = Array.isArray(p.tags) ? p.tags.join(", ") : "Tidak ada tag";
        const languages = Array.isArray(p.language) ? p.language.join(", ") : "Tidak diketahui";
        const types = Array.isArray(p.type) ? p.type.join(", ") : "Tidak diketahui";
        
        return `[PROJECT_${index}] ${p.title}
   Deskripsi: ${p.description || "Tidak ada deskripsi"}
   Bahasa: ${languages}
   Tag: ${tags}
   Tipe: ${types}
   Download: ${p.download_count || 0}x`;
      })
      .join("\n\n");

    const context = `
Kamu adalah asisten AI yang ramah dan membantu untuk platform project/repository. Gunakan bahasa Indonesia santai tapi sopan.

Jika user bertanya tentang project, kamu bisa merekomendasikan dari daftar berikut:

${projectList}

PENTING: Saat merekomendasikan project, gunakan format [PROJECT_X] di dalam respons kamu untuk menandai project mana yang kamu rekomendasikan.
Contoh: "Saya rekomendasikan [PROJECT_0] karena cocok untuk pemula"

Saat merekomendasikan project:
- Sesuaikan dengan kebutuhan user (bahasa pemrograman, tipe project, dll)
- Jelaskan mengapa project tersebut cocok
- Gunakan marker [PROJECT_X] agar sistem bisa menampilkan gambar dan detail project
- Bisa sebutkan jumlah download sebagai indikator popularitas

Jika user menanyakan hal lain di luar project, jawab dengan ramah dan informatif tanpa menggunakan marker [PROJECT_X].
`;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`${context}\n\nUser: ${message}`);
    const reply = result.response.text();

    // Extract project indices dari respons AI
    const projectIndices: number[] = [];
    const matches = reply.matchAll(/\[PROJECT_(\d+)\]/g);
    for (const match of matches) {
      projectIndices.push(parseInt(match[1]));
    }

    // Ambil data project yang direferensikan
    const referencedProjects = projectIndices
      .map(index => projects?.[index])
      .filter(Boolean)
      .map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image_url: p.image_url,
        file_url: p.file_url,
        language: p.language,
        tags: p.tags,
        download_count: p.download_count,
      }));

    return NextResponse.json({ 
      reply,
      projects: referencedProjects,
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({
      reply:
        "Maaf, server AI gagal merespons 😅. Kamu bisa ceritakan project seperti apa yang diinginkan, nanti saya bantu rekomendasikan dari database!",
      projects: [],
    });
  }
}