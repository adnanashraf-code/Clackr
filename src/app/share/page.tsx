import type { Metadata } from "next";
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

  const ogImageUrl = `${BASE_URL}/api/og?wpm=${wpm}&acc=${acc}&raw=${raw}&con=${con}&mode=${mode}&dur=${dur}&time=${time}&fixes=${fixes}`;

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

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;
  // If someone opens this URL in a browser (not a bot), redirect to homepage
  const queryString = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  // Redirect human visitors to the main app
  redirect(`/${queryString ? `?${queryString}` : ""}`);
}
