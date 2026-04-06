import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

  // Forward Set-Cookie headers from the API response
  const setCookies = apiRes.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    res.headers.append("Set-Cookie", cookie);
  }

  // Also set a lightweight session marker on the builder domain
  // so middleware can detect authenticated state
  res.cookies.set("session", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 min — matches access token
  });

  return res;
}
