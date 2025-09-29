import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/list`);
    if (!res.ok) throw new Error("Gagal fetch data project");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = new FormData();

    body.append("file", formData.get("file") as Blob);
    body.append("tags", (formData.get("tags") as string) || "React,Next.js");
    body.append("description", (formData.get("description") as string) || "No description");

    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body,
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json(); // {id, message, fileUrl}

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


