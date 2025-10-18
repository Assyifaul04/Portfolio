// app/api/projects/[id]/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // Jika user melakukan download
  if (action === "download") {
    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select("file_url, download_count")
      .eq("id", id)
      .single();

    if (error || !project?.file_url)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const newCount = (project.download_count ?? 0) + 1;
    await supabaseAdmin.from("projects").update({ download_count: newCount }).eq("id", id);


    return NextResponse.redirect(project.file_url);
  }

  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  return NextResponse.json(project);
}
