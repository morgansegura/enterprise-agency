import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const apiRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(refreshToken && { Cookie: `refresh_token=${refreshToken}` }),
    },
  });

  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json(data, { status: apiRes.status });
  }

  const res = NextResponse.json(data);

  const setCookies = apiRes.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    res.headers.append("Set-Cookie", cookie);
  }

  // Extend session marker
  res.cookies.set("session", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  return res;
}
