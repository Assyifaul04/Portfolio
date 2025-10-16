import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface ProjectFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  description?: string;
  tags?: string[];
  downloadCount?: number;
  image_url?: string;
  file_url?: string;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
    }

    const { data: projectFiles, error } = await supabaseAdmin
      .from("projects")
      .select("id, name, size, uploadDate, description, tags, downloadCount, image_url, file_url")
      .order("downloadCount", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({
        reply: "Maaf, ada masalah saat mengambil data project 😅",
      });
    }

    // Format data untuk context AI
    const projectList = projectFiles
      ?.map((file: ProjectFile, index: number) => {
        const tags = file.tags?.join(", ") || "Tidak ada tag";
        const size = formatFileSize(file.size);
        const downloads = file.downloadCount || 0;
        
        return `${index + 1}. **${file.name}**
   - Deskripsi: ${file.description || "Tidak ada deskripsi"}
   - Tags: ${tags}
   - Ukuran: ${size}
   - Total Download: ${downloads}x
   - ID: ${file.id}`;
      })
      .join("\n\n");

    const context = `
Kamu adalah asisten AI yang ramah dan membantu untuk platform berbagi project/file.
Gunakan bahasa Indonesia santai tapi sopan dan profesional.

DAFTAR PROJECT YANG TERSEDIA:
${projectList}

INSTRUKSI:
- Jika user bertanya tentang project/file, rekomendasikan dari daftar di atas
- Sebutkan nama project, deskripsi singkat, dan kenapa cocok untuk mereka
- Jika diminta detail, berikan info lengkap termasuk ukuran dan jumlah download
- Jika user bertanya tentang tag/kategori tertentu, filter berdasarkan tags
- Selalu ramah dan helpful
- Jangan buat-buat project yang tidak ada di daftar
`;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_GEMINI!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`${context}\n\nUser: ${message}`);
    const reply = result.response.text();

    // Ambil project IDs yang disebutkan dalam respons (jika ada)
    const mentionedProjects = projectFiles?.filter((file: ProjectFile) => 
      reply.toLowerCase().includes(file.name.toLowerCase())
    );

    return NextResponse.json({ 
      reply,
      suggestedProjects: mentionedProjects?.slice(0, 3) || []
    });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({
      reply: "Maaf, server AI sedang mengalami gangguan 😅. Coba lagi sebentar ya!",
    });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}