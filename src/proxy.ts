import { NextResponse, type NextRequest } from "next/server";

/**
 * Lock for the CMS draft-preview server (CMS_PREVIEW=1; the static export ignores proxies,
 * and `npm run dev` passes straight through). It shows unpublished drafts, so it renders only for the CMS
 * editor: the editor's first request carries ?cms_token=<expiry>.<hex HMAC-SHA256 of the
 * expiry keyed with CMS_PREVIEW_KEY> (issued by the CMS, POST /api/preview-token), which is
 * kept as a cookie for the in-frame navigation that follows. Everyone else gets a 401.
 */
const COOKIE = "cms_preview";
const enc = new TextEncoder();

async function expiry(token: string | undefined): Promise<number | null> {
  const key = process.env.CMS_PREVIEW_KEY;
  const [exp, sig] = token?.split(".") ?? [];
  if (!key || !exp || !/^[0-9a-f]{64}$/.test(sig ?? "") || Number(exp) * 1000 <= Date.now()) return null;
  const hmac = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const bytes = Uint8Array.from(sig.match(/../g)!, (h) => parseInt(h, 16));
  return (await crypto.subtle.verify("HMAC", hmac, bytes, enc.encode(exp))) ? Number(exp) : null;
}

export async function proxy(req: NextRequest) {
  if (process.env.CMS_PREVIEW !== "1") return NextResponse.next();
  const fromUrl = req.nextUrl.searchParams.get("cms_token");
  const exp = await expiry(fromUrl ?? req.cookies.get(COOKIE)?.value);

  let res: NextResponse;
  if (exp === null) {
    res = new NextResponse("Preview only: open this page from the Redragon CMS editor.", { status: 401 });
  } else if (fromUrl) {
    // Keep the pass in a cookie and drop it from the address
    const url = req.nextUrl.clone();
    url.searchParams.delete("cms_token");
    res = NextResponse.redirect(url);
    // The page lives in the CMS's iframe (another site): a partitioned SameSite=None cookie is the one browsers keep there
    res.cookies.set(COOKIE, fromUrl, { httpOnly: true, secure: true, sameSite: "none", partitioned: true, path: "/", expires: new Date(exp * 1000) });
  } else {
    res = NextResponse.next();
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Content-Security-Policy", `frame-ancestors ${process.env.CMS_ADMIN_ORIGIN ?? "http://localhost:5174"}`);
  return res;
}

export const config = {
  // Public files (site images, pre-built WebP, fonts, Next's static chunks) don't need the pass
  matcher: ["/((?!_next/static|_next/image|_img/|images/|brand/|icons/|favicon).*)"],
};
