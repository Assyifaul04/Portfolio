import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from("follows")
    .select("*, users(*)")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { is_followed } = body;

  if (typeof is_followed !== "boolean") {
    return NextResponse.json(
      { error: "is_followed must be boolean" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("follows")
    .update({ is_followed })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase.from("follows").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
