import type { Metadata } from "next";

export const origin = "https://abhimanyu-saharan.com";
export const owner = "Abhimanyu Saharan";

export function pageMetadata(path: string, title: string, description: string, image: string): Metadata {
  const url = new URL(path, origin).href;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      type: path === "/" ? "profile" : "website",
      siteName: owner, url, title, description,
      images: [{ url: origin + image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image", creator: "@abhi16_93", title, description,
      images: [{ url: origin + image, alt: title }],
    },
  };
}
