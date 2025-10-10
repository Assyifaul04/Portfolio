import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";

// GET: Mengambil semua data proyek
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Membuat proyek baru (dengan upload file ke Supabase Storage)
export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const tags = (formData.get("tags")?.toString() || "").split(",").map((t) => t.trim());
  const type = (formData.get("type")?.toString() || "").split(",").map((t) => t.trim());
  const language = (formData.get("language")?.toString() || "").split(",").map((l) => l.trim());
  const sort = formData.get("sort")?.toString() || "Last updated";

  let file_url = "";
  let image_url = "";

  // Handle upload file ke Supabase Storage
  const file = formData.get("file") as File | null;
  if (file) {
    const fileName = `${uuidv4()}-${file.name}`;
    const { error } = await supabase.storage.from("project-files").upload(fileName, file);
    if (error) return NextResponse.json({ error: `File upload failed: ${error.message}` }, { status: 500 });
    file_url = supabase.storage.from("project-files").getPublicUrl(fileName).data.publicUrl;
  }

  // Handle upload gambar ke Supabase Storage
  const image = formData.get("image") as File | null;
  if (image) {
    const imageName = `${uuidv4()}-${image.name}`;
    const { error } = await supabase.storage.from("project-files").upload(imageName, image);
    if (error) return NextResponse.json({ error: `Image upload failed: ${error.message}` }, { status: 500 });
    image_url = supabase.storage.from("project-files").getPublicUrl(imageName).data.publicUrl;
  }

  // Masukkan data ke database
  const { data, error } = await supabase
    .from("projects")
    .insert([{
      title, description, tags, type, language, sort,
      file_url,
      image_url,
      admin_id: session.user.id,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH: Memperbarui proyek (dengan update file di Supabase Storage)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const id = formData.get("id")?.toString();
  if (!id) return NextResponse.json({ error: "Project ID is required" }, { status: 400 });

  // Ambil data lama untuk referensi file
  const { data: oldData, error: fetchError } = await supabase
    .from("projects").select("file_url, image_url").eq("id", id).single();
  if (fetchError) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const updatePayload: { [key: string]: any } = {
    title: formData.get("title")?.toString(),
    description: formData.get("description")?.toString(),
    tags: (formData.get("tags")?.toString() || "").split(",").map(t => t.trim()),
    type: (formData.get("type")?.toString() || "").split(",").map(t => t.trim()),
    language: (formData.get("language")?.toString() || "").split(",").map(l => l.trim()),
    sort: formData.get("sort")?.toString() || "Last updated",
  };

  // Handle file baru jika ada
  const newFile = formData.get("file") as File | null;
  if (newFile) {
    const fileName = `${uuidv4()}-${newFile.name}`;
    const { error } = await supabase.storage.from("project-files").upload(fileName, newFile);
    if (error) return NextResponse.json({ error: `File update failed: ${error.message}` }, { status: 500 });
    updatePayload.file_url = supabase.storage.from("project-files").getPublicUrl(fileName).data.publicUrl;

    if (oldData.file_url) {
      const oldFileName = oldData.file_url.substring(oldData.file_url.lastIndexOf('/') + 1);
      await supabase.storage.from("project-files").remove([oldFileName]);
    }
  }

  // Handle gambar baru jika ada
  const newImage = formData.get("image") as File | null;
  if (newImage) {
    const imageName = `${uuidv4()}-${newImage.name}`;
    const { error } = await supabase.storage.from("project-files").upload(imageName, newImage);
    if (error) return NextResponse.json({ error: `Image update failed: ${error.message}` }, { status: 500 });
    updatePayload.image_url = supabase.storage.from("project-files").getPublicUrl(imageName).data.publicUrl;

    if (oldData.image_url) {
      const oldImageName = oldData.image_url.substring(oldData.image_url.lastIndexOf('/') + 1);
      await supabase.storage.from("project-files").remove([oldImageName]);
    }
  }

  // Update data di database
  const { data, error } = await supabase
    .from("projects").update(updatePayload).eq("id", id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE: Menghapus proyek (termasuk file dari Supabase Storage)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

  // Ambil data URL file sebelum dihapus
  const { data: projectData, error: fetchError } = await supabase
    .from("projects").select("file_url, image_url").eq("id", id).single();
  if (fetchError) return NextResponse.json({ error: "Project not found to delete" }, { status: 404 });

  // Hapus record dari database
  const { error: deleteError } = await supabase.from("projects").delete().eq("id", id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  // Hapus file dari Supabase Storage
  if (projectData.file_url) {
    const fileName = projectData.file_url.substring(projectData.file_url.lastIndexOf('/') + 1);
    await supabase.storage.from("project-files").remove([fileName]);
  }

  if (projectData.image_url) {
    const imageName = projectData.image_url.substring(projectData.image_url.lastIndexOf('/') + 1);
    await supabase.storage.from("project-files").remove([imageName]);
  }

  return NextResponse.json({ message: "Project deleted successfully" });
}