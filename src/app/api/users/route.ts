import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.email) {
        return NextResponse.json([], { status: 401 });
    }

    const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", {ascending: false})

    if (error) {
        return NextResponse.json({
            error: error.message
        }, {status: 401});
    }
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { data, error } = await supabase
    .from("users")
    .insert({
        email: body.email,
        name: body.name,
        role: body.role ?? "user",
        avatar_url: body.avatar_url ?? null,
    })
    .select()
    .single();

    if (error) {
        return NextResponse.json({
            error: error.message
        }, {status: 500});
    }

    return NextResponse.json(data);
}

