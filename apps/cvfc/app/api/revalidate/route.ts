import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const SECRET =
  process.env.REVALIDATE_SECRET || process.env.PREVIEW_SECRET || "preview-dev";

/**
 * On-demand ISR for this front-end. The CMS (a separate deployment) can't clear
 * this app's cache with its own `revalidatePath`, so on publish it calls here
 * with `?secret=…&path=/slug` and we revalidate the path in *this* runtime.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  if (searchParams.get("secret") !== SECRET) {
    return new NextResponse("Invalid token", { status: 401 });
  }

  const path = searchParams.get("path");
  if (!path || !path.startsWith("/")) {
    return NextResponse.json(
      { revalidated: false, error: "path must start with /" },
      { status: 400 },
    );
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
