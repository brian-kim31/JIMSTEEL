import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/** Called by Django whenever content is saved in the admin, so changes appear without a rebuild. */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag("content", "max");
  return NextResponse.json({ ok: true });
}
