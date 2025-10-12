import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select("file_url, download_count")
    .eq("id", id)
    .single();

  if (error || !project?.file_url) 
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Update download count
  await supabase
    .from("projects")
    .update({ download_count: (project.download_count ?? 0) + 1 })
    .eq("id", id);

  // Redirect langsung ke file publik di Supabase Storage
  return NextResponse.redirect(project.file_url);
}
