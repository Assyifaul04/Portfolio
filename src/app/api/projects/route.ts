import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// GET all projects
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

// POST create project
export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const tags = (formData.get("tags")?.toString() || "")
    .split(",")
    .map((t) => t.trim());

  const type = (formData.get("type")?.toString() || "")
    .split(",")
    .map((t) => t.trim());

  const language = (formData.get("language")?.toString() || "")
    .split(",")
    .map((l) => l.trim());

  const sort = formData.get("sort")?.toString() || "Last updated";

  // Pastikan folder storage ada
  const storagePath = path.join(process.cwd(), "public", "storage");
  if (!fs.existsSync(storagePath))
    fs.mkdirSync(storagePath, { recursive: true });

  // Upload file
  let file_url = "";
  const file = formData.get("file") as File;
  if (file) {
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(storagePath, fileName);
    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
    file_url = `/storage/${fileName}`;
  }

  // Upload image
  let image_url = "";
  const image = formData.get("image") as File;
  if (image) {
    const imageName = `${uuidv4()}-${image.name}`;
    const imagePath = path.join(storagePath, imageName);
    fs.writeFileSync(imagePath, Buffer.from(await image.arrayBuffer()));
    image_url = `/storage/${imageName}`;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        title,
        description,
        tags,
        file_url,
        image_url,
        admin_id: session.user.id,
        type,
        language,
        sort,
      },
    ])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0], { status: 201 });
}

// PATCH update project metadata
export async function PATCH(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, description, file_url, image_url, tags, type, language, sort } =
    await req.json();

  const { data, error } = await supabase
    .from("projects")
    .update({ title, description, file_url, image_url, tags, type, language, sort })
    .eq("id", id)
    .eq("admin_id", session.user.id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0]);
}

// DELETE project + files
export async function DELETE(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || session.user.role !== "admin" || !session.user.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "Project ID required" }, { status: 400 });

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("admin_id", session.user.id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Hapus file fisik
  if (data[0]?.file_url)
    fs.existsSync(path.join(process.cwd(), "public", data[0].file_url.replace("/storage/", "storage/"))) &&
      fs.unlinkSync(path.join(process.cwd(), "public", data[0].file_url.replace("/storage/", "storage/")));

  if (data[0]?.image_url)
    fs.existsSync(path.join(process.cwd(), "public", data[0].image_url.replace("/storage/", "storage/"))) &&
      fs.unlinkSync(path.join(process.cwd(), "public", data[0].image_url.replace("/storage/", "storage/")));

  return NextResponse.json({ message: "Project deleted", project: data[0] });
}
