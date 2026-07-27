import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://clackr-plum.vercel.app";

/**
 * Static metadata for the /share route.
 * Always uses og.png as the social card image.
 * No redirect, no bot detection — guarantees meta tags are always served.
 */
export const metadata: Metadata = {
  title: "clackr — Typing Speed Test",
  description:
    "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
  openGraph: {
    title: "clackr — Typing Speed Test",
    description:
      "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
    url: `${BASE_URL}/share`,
    siteName: "clackr",
    images: [
      {
        url: `${BASE_URL}/og.png`,
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
    images: [`${BASE_URL}/og.png`],
  },
};

/**
 * Simple landing page for shared links.
 * No redirect, no bot detection — all visitors (bots AND humans) 
 * get the same HTML with proper OG meta tags.
 */
export default function SharePage() {
  return (
    <main
      style={{
        backgroundColor: "#121214",
        color: "#e8e6e3",
        fontFamily: "monospace",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          clackr
        </h1>
        <p style={{ color: "#8a8a8a", marginBottom: "1.5rem" }}>
          A minimal distraction-free typing test.
        </p>
        <Link
          href="/"
          style={{
            color: "#6C93D9",
            fontSize: "1.1rem",
            textDecoration: "underline",
          }}
        >
          Start typing →
        </Link>
      </div>
    </main>
  );
}
