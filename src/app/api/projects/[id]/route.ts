import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  await supabase
    .from("projects")
    .update({ download_count: (project.download_count ?? 0) + 1 })
    .eq("id", id)
    .select();

  const filePath = path.join(process.cwd(), "public", project.file_url);

  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "File not found" }, { status: 404 });

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${path.basename(
        project.file_url
      )}"`,
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
