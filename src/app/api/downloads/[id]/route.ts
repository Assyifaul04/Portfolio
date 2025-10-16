import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("file_url, download_count, title")
    .eq("id", id)
    .single();

  if (error || !project?.file_url)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Increment download count
  await supabaseAdmin
    .from("projects")
    .update({ download_count: (project.download_count ?? 0) + 1 })
    .eq("id", id);

  // Redirect ke file URL untuk download
  return NextResponse.redirect(project.file_url);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!status)
    return NextResponse.json({ error: "status required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("downloads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "approved" && data?.project_id) {
    await supabaseAdmin.rpc("increment_download_count", {
      projectid: data.project_id,
    });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("downloads").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
