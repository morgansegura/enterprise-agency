import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  const apiRes = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: {
      ...(accessToken && { Cookie: `access_token=${accessToken}` }),
    },
  });

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
