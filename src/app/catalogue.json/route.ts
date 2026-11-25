import { getContent } from "@/lib/cms";

/** Every product and category for Compare and the Firmware & Software Finder, as one static file (see src/lib/catalogue.ts). */
export const dynamic = "force-static";

export async function GET() {
  // API: dynamic data – catalogue
  return Response.json((await getContent()).catalogue);
}
