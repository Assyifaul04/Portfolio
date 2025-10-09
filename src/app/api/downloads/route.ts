// app/api/downloads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// GET /api/downloads?userId=...
export async function GET(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userId") || session.user.email;

  // Ambil user_id dulu berdasarkan email
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", userEmail)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  const userId = userData.id;

  const { data, error } = await supabase
    .from("downloads")
    .select("*, projects(*), users(*)")
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}


// POST /api/downloads
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { project_id, status } = body;

    if (!project_id) {
      return NextResponse.json({ error: "project_id required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("downloads")
      .insert([
        { user_id: session.user.id, project_id, status: status ?? "pending" },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
