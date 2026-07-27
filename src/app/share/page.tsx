import type { Metadata } from "next";
import ShareClient from "./ShareClient";

const BASE_URL = "https://clackr-plum.vercel.app";

/**
 * Static metadata for the /share route.
 * Always uses og.png as the social card image.
 * No redirect for bots — guarantees OG meta tags are served cleanly.
 */
export const metadata: Metadata = {
  title: "clackr — Typing Speed Test",
  description:
    "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "clackr — Typing Speed Test",
    description:
      "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
    url: `${BASE_URL}/share`,
    siteName: "clackr",
    images: [
      {
        url: `${BASE_URL}/og.png?v=2`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "clackr — Typing Speed Test",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "clackr — Typing Speed Test",
    description:
      "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
    images: [`${BASE_URL}/og.png?v=2`],
  },
};

export default function SharePage() {
  return <ShareClient />;
}
