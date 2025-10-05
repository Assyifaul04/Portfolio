import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Generate kode unik untuk delete akun
export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate random code
  const deleteCode =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Simpan kode ke user (optional: bisa pakai field temporary)
  // Atau return langsung untuk dicopy user

  return NextResponse.json({
    deleteCode,
    message: "Copy kode ini untuk menghapus akun",
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  const { deleteCode, providedCode } = await req.json();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (deleteCode !== providedCode) {
    return NextResponse.json(
      {
        error: "Kode tidak valid",
      },
      { status: 400 }
    );
  }

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 }
    );
  }

  const { error } = await supabase.from("users").delete().eq("id", user.id);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Akun berhasil dihapus",
  });
}
