import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { createAuthenticatedSupabaseClient } from "@/lib/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";

// ========================
// GET: Ambil semua project
// ========================
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
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAuthenticatedSupabaseClient(session);
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const tags = (formData.get("tags")?.toString() || "").split(",").map(t => t.trim());
    const type = (formData.get("type")?.toString() || "").split(",").map(t => t.trim());
    const language = (formData.get("language")?.toString() || "").split(",").map(l => l.trim());
    const sort = formData.get("sort")?.toString() || "Last updated";

    let file_url = "", image_url = "";

    // Upload file utama
    const file = formData.get("file") as File | null;
    if (file) {
      const fileName = `${uuidv4()}-${file.name}`;
      const { error } = await supabase.storage.from("project-files").upload(fileName, file);
      if (error) throw new Error(`File upload failed: ${error.message}`);
      file_url = supabase.storage.from("project-files").getPublicUrl(fileName).data.publicUrl;
    }

    // Upload gambar preview
    const image = formData.get("image") as File | null;
    if (image) {
      const imageName = `${uuidv4()}-${image.name}`;
      const { error } = await supabase.storage.from("project-files").upload(imageName, image);
      if (error) throw new Error(`Image upload failed: ${error.message}`);
      image_url = supabase.storage.from("project-files").getPublicUrl(imageName).data.publicUrl;
    }

    // Insert ke tabel projects
    const { data, error } = await supabase
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
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAuthenticatedSupabaseClient(session);
    const formData = await req.formData();
    const id = formData.get("id")?.toString();
    if (!id) return NextResponse.json({ error: "Project ID is required" }, { status: 400 });

    const updatePayload: Record<string, any> = {};
    const fields = ["title", "description", "tags", "type", "language", "sort"];

    for (const field of fields) {
      const value = formData.get(field)?.toString();
      if (value) updatePayload[field] = field === "tags" || field === "type" || field === "language"
        ? value.split(",").map((v) => v.trim())
        : value;
    }

    const newFile = formData.get("file") as File | null;
    if (newFile) {
      const fileName = `${uuidv4()}-${newFile.name}`;
      const { error } = await supabase.storage.from("project-files").upload(fileName, newFile);
      if (error) throw new Error(`File upload failed: ${error.message}`);
      updatePayload.file_url = supabase.storage.from("project-files").getPublicUrl(fileName).data.publicUrl;
    }

    const newImage = formData.get("image") as File | null;
    if (newImage) {
      const imageName = `${uuidv4()}-${newImage.name}`;
      const { error } = await supabase.storage.from("project-files").upload(imageName, newImage);
      if (error) throw new Error(`Image upload failed: ${error.message}`);
      updatePayload.image_url = supabase.storage.from("project-files").getPublicUrl(imageName).data.publicUrl;
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

// ========================
// DELETE: Hapus project
// ========================
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAuthenticatedSupabaseClient(session);
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    const { data: projectData, error: fetchError } = await supabase
      .from("projects")
      .select("file_url, image_url")
      .eq("id", id)
      .single();

    if (fetchError) throw new Error("Project not found to delete");

    // Hapus record dari DB
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id);
    if (deleteError) throw deleteError;

    // Hapus file dari storage
    if (projectData.file_url) {
      const fileName = projectData.file_url.split("/").pop()!;
      await supabase.storage.from("project-files").remove([fileName]);
    }
    if (projectData.image_url) {
      const imageName = projectData.image_url.split("/").pop()!;
      await supabase.storage.from("project-files").remove([imageName]);
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
