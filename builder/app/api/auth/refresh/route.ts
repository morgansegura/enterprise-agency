import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const isProduction = process.env.NODE_ENV === "production";

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

  // Parse API cookies and re-set on builder domain
  const setCookies = apiRes.headers.getSetCookie?.() ?? [];
  for (const raw of setCookies) {
    const [nameValue] = raw.split(";");
    const [name, ...valueParts] = nameValue.split("=");
    const value = valueParts.join("=");

    const maxAge =
      name.trim() === "refresh_token" ? 7 * 24 * 60 * 60 : 15 * 60;

    res.cookies.set(name.trim(), value, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  // Extend session marker
  res.cookies.set("session", "1", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}
