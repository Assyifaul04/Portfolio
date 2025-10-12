import { supabaseAdmin } from "@/lib/supabaseAdmin"; // Gunakan supabase admin key
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Ambil project
  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Update download count
  await supabaseAdmin
    .from("projects")
    .update({ download_count: (project.download_count ?? 0) + 1 })
    .eq("id", id);

  if (!project.file_url) return NextResponse.json({ error: "File URL missing" }, { status: 404 });

  // Ambil nama file dari URL
  const fileName = project.file_url.split("/").pop()!;
  
  // Ambil file dari Supabase Storage
  const { data: fileData, error: storageError } = await supabaseAdmin
    .storage
    .from("project-files")
    .download(fileName);

  if (storageError || !fileData) return NextResponse.json({ error: "File not found in storage" }, { status: 404 });

  const buffer = Buffer.from(await fileData.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}
