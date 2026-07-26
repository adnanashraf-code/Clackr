import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.redirect("https://clackr-plum.vercel.app/og.png", 302);
}
