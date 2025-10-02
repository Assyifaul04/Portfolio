import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";




export async function GET(req: Request, {params}: {params: {id: string}}) {
    const { data, error} = await supabase
    .from("downloads")
    .select("*, projects(*), users(*)")
    .eq("id", params.id)
    .single();

    if (error) {
        return NextResponse.json({
            error: error.message
        }, {status: 500});
    }

    return NextResponse.json(data);
}

export async function PATCH(req: Request, {params}: {params: {id: string}}){
    const body = await req.json();
    const { status } = body;

    if (!status) {
        return NextResponse.json({
            error: "status required"
        }, {status: 400});
    }

    const { data, error} = await supabase
    .from("downloads")
    .update({ status })
    .eq("id", params.id)
    .select()
    .single();

    if (error) {
        return NextResponse.json({
            error: error.message
        }, {status: 500})
    }

    if (status === "approved" && data?.project_id) {
        await supabase.rpc("increment_download_count", { projectid: data.project_id });
    }

    return NextResponse.json(data);
}

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    const { error } = await supabase
    .from("downloads")
    .delete()
    .eq("id", params.id);

    if (error) {
        return NextResponse.json({
            error: error.message
        }, {status: 500});
    }
    return NextResponse.json({success: true});
}