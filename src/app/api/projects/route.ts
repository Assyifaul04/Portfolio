import { authOptions } from "@/lib/authOptions";
import { createAuthenticatedSupabaseClient, supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// ========================
// GET: Ambil semua project
// ========================
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ========================
// POST: Tambah project baru
// ========================
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAuth = createAuthenticatedSupabaseClient(session);
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const tags = (formData.get("tags")?.toString() || "").split(",").map(t => t.trim());
    const type = (formData.get("type")?.toString() || "").split(",").map(t => t.trim());
    const language = (formData.get("language")?.toString() || "").split(",").map(l => l.trim());
    const sort = formData.get("sort")?.toString() || "Last updated";

    let file_url = "", image_url = "";

    // Upload file utama
    const file = formData.get("file") as any;
    if (file) {
      const fileName = `${uuidv4()}-${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error } = await supabaseAuth.storage
        .from("project-files")
        .upload(fileName, buffer, { contentType: file.type });
      if (error) throw new Error(`File upload failed: ${error.message}`);
      file_url = supabaseAuth.storage.from("project-files").getPublicUrl(fileName).data.publicUrl;
    }

    // Upload gambar preview
    const image = formData.get("image") as any;
    if (image) {
      const imageName = `${uuidv4()}-${image.name}`;
      const buffer = Buffer.from(await image.arrayBuffer());
      const { error } = await supabaseAuth.storage
        .from("project-files")
        .upload(imageName, buffer, { contentType: image.type });
      if (error) throw new Error(`Image upload failed: ${error.message}`);
      image_url = supabaseAuth.storage.from("project-files").getPublicUrl(imageName).data.publicUrl;
    }

    // Insert ke tabel projects
    const { data, error } = await supabaseAuth
      .from("projects")
      .insert([{
        title,
        description,
        tags,
        type,
        language,
        sort,
        file_url,
        image_url,
        admin_id: session.user.id,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ========================
// PATCH: Update project
// ========================
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAuth = createAuthenticatedSupabaseClient(session);
    const formData = await req.formData();
    const id = formData.get("id")?.toString();
    if (!id) return NextResponse.json({ error: "Project ID is required" }, { status: 400 });

    const updatePayload: Record<string, any> = {};
    const fields = ["title", "description", "tags", "type", "language", "sort"];

    for (const field of fields) {
      const value = formData.get(field)?.toString();
      if (value) {
        updatePayload[field] =
          field === "tags" || field === "type" || field === "language"
            ? value.split(",").map((v) => v.trim())
            : value;
      }
    }

    // Update file baru jika ada
    const newFile = formData.get("file") as any;
    if (newFile) {
      const fileName = `${uuidv4()}-${newFile.name}`;
      const buffer = Buffer.from(await newFile.arrayBuffer());
      const { error } = await supabaseAuth.storage.from("project-files").upload(fileName, buffer, { contentType: newFile.type });
      if (error) throw new Error(`File upload failed: ${error.message}`);
      updatePayload.file_url = supabaseAuth.storage.from("project-files").getPublicUrl(fileName).data.publicUrl;
    }

    // Update image baru jika ada
    const newImage = formData.get("image") as any;
    if (newImage) {
      const imageName = `${uuidv4()}-${newImage.name}`;
      const buffer = Buffer.from(await newImage.arrayBuffer());
      const { error } = await supabaseAuth.storage.from("project-files").upload(imageName, buffer, { contentType: newImage.type });
      if (error) throw new Error(`Image upload failed: ${error.message}`);
      updatePayload.image_url = supabaseAuth.storage.from("project-files").getPublicUrl(imageName).data.publicUrl;
    }

    const { data, error } = await supabaseAuth
      .from("projects")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ========================
// DELETE: Hapus project
// ========================
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAuth = createAuthenticatedSupabaseClient(session);
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    // Ambil file & image agar bisa dihapus dari storage
    const { data: projectData, error: fetchError } = await supabaseAuth
      .from("projects")
      .select("file_url, image_url")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error("Project not found");

    // Hapus record dari DB
    const { error: deleteError } = await supabaseAuth.from("projects").delete().eq("id", id);
    if (deleteError) throw deleteError;

    // Hapus file & image dari storage
    if (projectData.file_url) {
      const fileName = projectData.file_url.split("/").pop()!;
      await supabaseAuth.storage.from("project-files").remove([fileName]);
    }
    if (projectData.image_url) {
      const imageName = projectData.image_url.split("/").pop()!;
      await supabaseAuth.storage.from("project-files").remove([imageName]);
    }

    return NextResponse.json({ message: "Project deleted successfully" });

  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
