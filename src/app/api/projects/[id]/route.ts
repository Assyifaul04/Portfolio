import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const agree = req.nextUrl.searchParams.get("agree") || "true";

  try {
    const res = await fetch(`${API_URL}/download?file=${id}&agree=${agree}`);
    if (!res.ok) throw new Error(await res.text());

    const blob = await res.arrayBuffer();
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${id}"`,
        "Content-Type": "application/zip",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
