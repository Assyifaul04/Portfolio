// app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { createAuthenticatedSupabaseClient } from "@/lib/supabaseAdmin"; // ✅ IMPORT HELPER BARU
import { createClient } from "@supabase/supabase-js"; // Import standar untuk GET publik

// GET: Mengambil semua data proyek (bisa pakai klien anonim biasa jika data publik)
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

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

// POST: Membuat proyek baru
export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ BUAT KLIEN SUPABASE YANG TERAUTENTIKASI DENGAN SESI PENGGUNA
  const supabase = createAuthenticatedSupabaseClient(session);

  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const tags = (formData.get("tags")?.toString() || "").split(",").map((t) => t.trim());
    const type = (formData.get("type")?.toString() || "").split(",").map((t) => t.trim());
    const language = (formData.get("language")?.toString() || "").split(",").map((l) => l.trim());
    const sort = formData.get("sort")?.toString() || "Last updated";

    let file_url = "";
    let image_url = "";

    // Handle upload file
    const file = formData.get("file") as File | null;
    if (file) {
      const fileName = `${uuidv4()}-${file.name}`;
      const { error } = await supabase.storage.from("project-files").upload(fileName, file);
      if (error) throw new Error(`File upload failed: ${error.message}`);
      file_url = supabase.storage.from("project-files").getPublicUrl(fileName).data.publicUrl;
    }

    // Handle upload gambar
    const image = formData.get("image") as File | null;
    if (image) {
      const imageName = `${uuidv4()}-${image.name}`;
      const { error } = await supabase.storage.from("project-files").upload(imageName, image);
      if (error) throw new Error(`Image upload failed: ${error.message}`);
      image_url = supabase.storage.from("project-files").getPublicUrl(imageName).data.publicUrl;
    }

    // Masukkan data ke database
    const { data, error } = await supabase
      .from("projects")
      .insert([{ title, description, tags, type, language, sort, file_url, image_url, admin_id: session.user.id }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Memperbarui proyek
export async function PATCH(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ BUAT KLIEN TERAUTENTIKASI
  const supabase = createAuthenticatedSupabaseClient(session);

  try {
    const formData = await req.formData();
    const id = formData.get("id")?.toString();
    if (!id) return NextResponse.json({ error: "Project ID is required" }, { status: 400 });

    const { data: oldData, error: fetchError } = await supabase.from("projects").select("file_url, image_url").eq("id", id).single();
    if (fetchError) throw new Error("Project not found");

    const updatePayload: { [key: string]: any } = { /* ... payload Anda ... */ };
    // ... isi updatePayload seperti kode Anda sebelumnya ...

    // Handle file baru
    const newFile = formData.get("file") as File | null;
    if (newFile) {
        // ... Logika upload file & hapus file lama Anda ...
    }

    // Handle gambar baru
    const newImage = formData.get("image") as File | null;
    if (newImage) {
        // ... Logika upload gambar & hapus gambar lama Anda ...
    }

    const { data, error } = await supabase.from("projects").update(updatePayload).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Menghapus proyek
export async function DELETE(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ BUAT KLIEN TERAUTENTIKASI
  const supabase = createAuthenticatedSupabaseClient(session);

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    const { data: projectData, error: fetchError } = await supabase.from("projects").select("file_url, image_url").eq("id", id).single();
    if (fetchError) throw new Error("Project not found to delete");

    // Hapus dari database dulu
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id);
    if (deleteError) throw deleteError;

    // Hapus file dari storage jika berhasil
    if (projectData.file_url) {
      const fileName = projectData.file_url.substring(projectData.file_url.lastIndexOf('/') + 1);
      await supabase.storage.from("project-files").remove([fileName]);
    }
    if (projectData.image_url) {
      const imageName = projectData.image_url.substring(projectData.image_url.lastIndexOf('/') + 1);
      await supabase.storage.from("project-files").remove([imageName]);
    }

    return NextResponse.json({ message: "Project deleted successfully" });

  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}