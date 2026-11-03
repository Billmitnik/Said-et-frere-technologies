import { UUID_PATTERN } from "@/lib/server/admin/products";
import { getPrisma } from "@/lib/server/prisma";

// A photo id is never reused (a new upload gets a new id), so browsers and Netlify's CDN
// may keep each photo for a year; the database is read only on the first request.
const IMMUTABLE = "public, max-age=31536000, immutable";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return new Response("Not found", { status: 404 });

  const photo = await getPrisma().productImage.findUnique({
    where: { id },
    select: { contentType: true, data: true },
  });
  if (!photo) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(photo.data), {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": IMMUTABLE,
      "Netlify-CDN-Cache-Control": `${IMMUTABLE}, durable`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
