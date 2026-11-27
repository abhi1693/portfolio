import type { MetadataRoute } from "next";
import { origin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/gadgets"].map(path => ({ url: new URL(path, origin).href }));
}
