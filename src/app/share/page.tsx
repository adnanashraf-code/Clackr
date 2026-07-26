import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = "https://clackr-plum.vercel.app";

interface SharePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const params = await searchParams;
  const wpm = params.wpm || "0";
  const acc = params.acc || "0";
  const raw = params.raw || "0";
  const con = params.con || "0";
  const mode = params.mode || "time";
  const dur = params.dur || "30";
  const time = params.time || dur;
  const fixes = params.fixes || "0";

  const testLabel = mode === "time" ? `${dur}s` : `${dur} words`;
  const title = `${wpm} WPM · ${acc}% Accuracy — clackr`;
  const description = `I just scored ${wpm} WPM with ${acc}% accuracy on a ${testLabel} typing test. Think you can beat me?`;

  const ogImageUrl = `${BASE_URL}/og.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/share`,
      siteName: "clackr",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `clackr result: ${wpm} WPM`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

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

export default async function SharePage({ searchParams }: SharePageProps) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  if (isCrawlerBot(userAgent)) {
    const params = await searchParams;
    const wpm = params.wpm || "0";
    const acc = params.acc || "0";

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
          <h1>{wpm} WPM · {acc}% Accuracy</h1>
          <p>clackr — Typing Speed Test</p>
          <a href={BASE_URL} style={{ color: "#6C93D9" }}>
            Try clackr
          </a>
        </div>
      </main>
    );
  }

  redirect("/");
}
