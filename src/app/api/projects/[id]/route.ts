// app/api/projects/[id]/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

// GET untuk mengambil detail project (bukan download)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Cek apakah ini request untuk download (ada query parameter)
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // Jika action=download, lakukan download
  if (action === "download") {
    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select("file_url, download_count")
      .eq("id", id)
      .single();

    if (error || !project?.file_url)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Increment download count
    await supabaseAdmin
      .from("projects")
      .update({ download_count: (project.download_count ?? 0) + 1 })
      .eq("id", id);

    // Redirect ke file URL
    return NextResponse.redirect(project.file_url);
  }

  // Default: Return project details sebagai JSON
  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  return NextResponse.json(project);
}