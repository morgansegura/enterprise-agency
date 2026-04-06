import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Proxy login through the builder's own domain so cookies
 * are set on the same origin the middleware can read.
 */
export async function POST(request: Request) {
  const body = await request.json();

  const apiRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json(data, { status: apiRes.status });
  }

  const res = NextResponse.json(data);

  // Parse API cookies and re-set them on the builder's domain
  const setCookies = apiRes.headers.getSetCookie?.() ?? [];
  for (const raw of setCookies) {
    const [nameValue] = raw.split(";");
    const [name, ...valueParts] = nameValue.split("=");
    const value = valueParts.join("=");

    const maxAge = name.trim() === "refresh_token"
      ? 7 * 24 * 60 * 60
      : 15 * 60;

    res.cookies.set(name.trim(), value, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  // Session marker for middleware
  res.cookies.set("session", "1", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}
