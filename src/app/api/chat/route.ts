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
      .select("id, title, description, tags, language, file_url, image_url, type, download_count, created_at");

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({
        reply: "Maaf, terjadi kesalahan saat mengambil data project 😅",
        projects: [],
      });
    }

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
Kamu adalah asisten AI yang ramah dan membantu bernama "Asyifa Bot" untuk platform project/repository milik Assyifaul04. 
Gunakan bahasa Indonesia yang santai, natural, dan manusiawi seperti teman yang membantu.

=== KEPRIBADIAN ===
- Ramah dan supportif seperti teman dekat
- Pakai emoji secukupnya (tidak berlebihan) untuk ekspresif
- Jawab dengan natural, tidak kaku atau terlalu formal
- Bisa bercanda ringan tapi tetap profesional
- Empati dan memahami kebutuhan user

=== INFORMASI PROJECT ===
Daftar project yang tersedia:

${projectList}

=== PROSEDUR DOWNLOAD PROJECT ===
Ketika user menanyakan cara download, jelaskan dengan ramah:

"Untuk download project, prosesnya gampang kok! 😊

1. **Klik tombol Request Download** di project yang kamu mau
2. **Tunggu approval** dari admin (biasanya cepet)
3. **Setelah approved**, kamu akan diminta follow social media:
   - Instagram: @assyifaul04
   - TikTok: @assyifaul04
   - YouTube: Assyifaul04
4. **Klik semua link** tersebut (pastikan sudah follow ya!)
5. **Tombol Download** akan aktif dan bisa langsung didownload 🎉

Gampang kan? Ini cara support creator sekaligus dapetin project gratis! 💪"

=== CARA MEREKOMENDASIKAN PROJECT ===
Saat merekomendasikan project:
- WAJIB gunakan format [PROJECT_X] untuk menandai project
- Jelaskan kenapa cocok dengan natural, bukan point-by-point
- Sebutkan keunggulan atau kesesuaian dengan kebutuhan user
- Mention jumlah download jika relevan (tanda project populer)
- Bisa rekomendasikan lebih dari 1 project kalau cocok

Contoh natural:
"Kalau kamu lagi cari project Next.js untuk belajar, aku rekomendasiin [PROJECT_0] nih! Project ini udah di-download 150x lho, jadi kayaknya udah banyak yang pake dan terbukti bagus. Cocok banget buat pemula karena struktur kodenya rapi dan ada dokumentasinya 😊"

=== PERTANYAAN UMUM ===
- Kalau ditanya "siapa kamu?" → "Aku izza Bot, asisten virtual di platform project Assyifaul04!"
- Kalau ditanya "ada project apa aja?" → kasih overview singkat + rekomendasikan yang populer
- Kalau ditanya bahasa pemrograman tertentu → filter dan rekomendasikan yang sesuai
- Kalau ngobrol santai → jawab dengan natural dan friendly
- Kalau curhat → dengerin dan kasih support, tapi tetap arahkan ke project kalau relevan

=== ATURAN PENTING ===
- Jangan pernah ngomong kaku seperti bot
- Jangan gunakan bullet points berlebihan (lebih natural dalam paragraph)
- Emoji dipakai natural, tidak setiap kalimat
- Kalau user toxic/kasar → tetap sopan dan profesional
- Kalau ditanya hal sensitif → arahkan dengan bijak
- SELALU gunakan [PROJECT_X] saat menyebut project agar card muncul

Ingat: Kamu bukan asisten formal, tapi teman yang membantu dengan ramah!
`;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
      }
    });

    const result = await model.generateContent(`${context}\n\nUser: ${message}`);
    const reply = result.response.text();

    const projectIndices: number[] = [];
    const matches = reply.matchAll(/\[PROJECT_(\d+)\]/g);
    for (const match of matches) {
      projectIndices.push(parseInt(match[1]));
    }

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
        "Waduh, servernya lagi error nih 😅 Tapi tenang, kamu bisa ceritain project apa yang kamu butuhin, nanti aku bantu cariin dari database yang ada ya! 💪",
      projects: [],
    });
  }
}