import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = "https://clackr-plum.vercel.app";

/**
 * Static metadata for the /share route.
 * Always uses og.png as the social card image.
 * Twitter/social crawlers see this metadata, human visitors get redirected to homepage.
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

function isCrawlerBot(userAgent: string): boolean {
  const botPatterns = [
    "Twitterbot",
    "facebookexternalhit",
    "LinkedInBot",
    "Slackbot",
    "TelegramBot",
    "WhatsApp",
    "Discordbot",
    "Googlebot",
    "bingbot",
    "Applebot",
  ];
  return botPatterns.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

export default async function SharePage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  // Bots get a minimal page — the OG meta tags in metadata above are the important part
  if (isCrawlerBot(userAgent)) {
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
          <h1>clackr — Typing Speed Test</h1>
          <p>A minimal distraction-free typing test.</p>
          <a href={BASE_URL} style={{ color: "#6C93D9" }}>
            Try clackr
          </a>
        </div>
      </main>
    );
  }

  // Human visitors get redirected to the main app
  redirect("/");
}
