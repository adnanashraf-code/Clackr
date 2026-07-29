import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.redirect("https://clackr-plum.vercel.app/og.png?v=2", {
    status: 302,
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
