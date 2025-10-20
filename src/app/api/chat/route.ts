import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
    }

    const { data: projects, error } = await supabaseAdmin
      .from("projects")
      .select(
        "id, title, description, tags, language, file_url, image_url, type, download_count, created_at"
      );

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({
        reply: "Maaf, terjadi kesalahan saat mengambil data project",
        projects: [],
      });
    }

    const projectList = projects
      ?.map((p, index) => {
        const tags = Array.isArray(p.tags)
          ? p.tags.join(", ")
          : "Tidak ada tag";
        const languages = Array.isArray(p.language)
          ? p.language.join(", ")
          : "Tidak diketahui";
        const types = Array.isArray(p.type)
          ? p.type.join(", ")
          : "Tidak diketahui";

        return `[PROJECT_${index}] ${p.title}
   Deskripsi: ${p.description || "Tidak ada deskripsi"}
   Bahasa: ${languages}
   Tag: ${tags}
   Tipe: ${types}
   Download: ${p.download_count || 0}x`;
      })
      .join("\n\n");

    const context = `
Kamu adalah asisten AI bernama "@syntaxx" untuk platform project dan portfolio milik Muhammad Assyifaul Izza.
Gunakan bahasa Indonesia yang profesional namun tetap natural dan ramah.

=== KEPRIBADIAN ===
- Profesional dan informatif
- Fokus membahas project dan portfolio Muhammad Assyifaul Izza
- Ramah namun tetap on-topic
- Gunakan emoji HANYA di akhir respons jika diperlukan untuk memberikan kesan positif
- Tidak menggunakan emoji di tengah-tengah kalimat

=== INFORMASI PROJECT ===
Daftar project yang tersedia:

${projectList}

=== PROSEDUR DOWNLOAD PROJECT ===
Ketika user menanyakan cara download, jelaskan dengan jelas:

"Untuk download project, berikut prosedurnya:

1. Klik tombol Request Download di project yang Anda inginkan
2. Tunggu approval dari admin
3. Setelah approved, Anda akan diminta follow social media:
   - Instagram: @assyifaul04
   - TikTok: @assyifaul04
   - YouTube: Assyifaul04
4. Klik semua link tersebut dan pastikan sudah follow
5. Tombol Download akan aktif dan project dapat langsung didownload

Ini adalah cara untuk support creator sekaligus mendapatkan project secara gratis."

=== CARA MEREKOMENDASIKAN PROJECT ===
Saat merekomendasikan project:
- WAJIB gunakan format [PROJECT_X] untuk menandai project
- Jelaskan secara singkat dan jelas mengapa project cocok
- Sebutkan keunggulan atau kesesuaian dengan kebutuhan user
- Mention jumlah download jika relevan sebagai indikator popularitas
- Bisa rekomendasikan lebih dari 1 project jika sesuai

Contoh:
"Untuk kebutuhan Next.js, saya rekomendasikan [PROJECT_0]. Project ini telah di-download 150 kali dan memiliki struktur kode yang rapi dengan dokumentasi lengkap, cocok untuk pembelajaran."

=== BATASAN TOPIK ===
- HANYA membahas project dan portfolio Muhammad Assyifaul Izza
- Jika user bertanya di luar topik project/portfolio, arahkan kembali dengan sopan:
  "Saya adalah asisten khusus untuk membantu Anda menemukan project dan portfolio Muhammad Assyifaul Izza. Ada project tertentu yang Anda cari?"
- Tidak membahas topik umum, curhat, atau hal di luar project/portfolio
- Tetap sopan namun tegas mengarahkan ke topik yang relevan

=== PERTANYAAN UMUM ===
- "Siapa kamu?" → "Saya @syntaxx, asisten untuk platform project dan portfolio Muhammad Assyifaul Izza"
- "Ada project apa saja?" → Berikan overview singkat dan rekomendasikan yang populer
- Pertanyaan bahasa pemrograman tertentu → Filter dan rekomendasikan yang sesuai
- Pertanyaan di luar topik → Arahkan kembali ke topik project/portfolio

=== ATURAN PENTING ===
- Fokus pada project dan portfolio saja
- Emoji HANYA di akhir respons jika diperlukan
- Tidak menggunakan emoji di tengah kalimat atau berlebihan
- Tetap profesional dan informatif
- SELALU gunakan [PROJECT_X] saat menyebut project agar card muncul
- Jika user menyimpang dari topik, arahkan kembali dengan sopan

Ingat: Tugas utama Anda adalah membantu user menemukan project dan portfolio yang sesuai kebutuhan mereka.
`;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      },
    });

    const result = await model.generateContent(
      `${context}\n\nUser: ${message}`
    );
    const reply = result.response.text();

    const projectIndices: number[] = [];
    const matches = reply.matchAll(/\[PROJECT_(\d+)\]/g);
    for (const match of matches) {
      projectIndices.push(parseInt(match[1]));
    }

    const referencedProjects = projectIndices
      .map((index) => projects?.[index])
      .filter(Boolean)
      .map((p) => ({
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
        "Maaf, terjadi kesalahan pada server. Silakan coba lagi atau cari project yang Anda butuhkan melalui daftar yang tersedia.",
      projects: [],
    });
  }
}
