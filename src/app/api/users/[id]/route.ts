import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";




export async function GET(req: Request, {params}: {params: {id: string}}) {
    const {id} = params;
    const { data, error} = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

    if (error) {
        return NextResponse.json({
            error: error.message
        }, {status: 500})
    }

    if (!data) {
        return NextResponse.json({
            error: "User not found"
        }, {status: 404});
    }

    return NextResponse.json(data);
}

export async function PATCH(req: Request, {params}: {params: {id: string}}) {
    const {id} = params;
    const body = await req.json();
    const {data, error} = await supabase
    .from("users")
    .update({
      name: body.name,
      role: body.role,
      avatar_url: body.avatar_url,
    })
    .eq("id", id)
    .select()
    .single();

    if (error) {
        return NextResponse.json({
            error: error.message
        }, {status: 500});
    }

    return NextResponse.json(data);
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const { id } = params;
  
    const { error } = await supabase.from("users").delete().eq("id", id);
  
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
    return NextResponse.json({ message: "User deleted successfully" });
  }

