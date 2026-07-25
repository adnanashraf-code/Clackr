import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "clackr — Typing Speed Test",
  description: "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
  metadataBase: new URL("https://clackr-plum.vercel.app"),
  openGraph: {
    title: "clackr — Typing Speed Test",
    description: "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
    url: "https://clackr-plum.vercel.app/",
    siteName: "clackr",
    images: [
      {
        url: "https://clackr-plum.vercel.app/og.png",
        secureUrl: "https://clackr-plum.vercel.app/og.png",
        type: "image/png",
        width: 1200,
        height: 630,
        alt: "clackr — Typing Speed Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@clackr",
    creator: "@clackr",
    title: "clackr — Typing Speed Test",
    description: "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
    images: ["https://clackr-plum.vercel.app/og.png"],
  },
  other: {
    "twitter:image:src": "https://clackr-plum.vercel.app/og.png",
    "twitter:domain": "clackr-plum.vercel.app",
  },
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('clackr-settings');
      if (saved) {
        var state = JSON.parse(saved);
        if (state && state.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
          return;
        }
      }
      document.documentElement.setAttribute('data-theme', 'midnight');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <head>
        <meta property="og:title" content="clackr — Typing Speed Test" />
        <meta property="og:description" content="Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test." />
        <meta property="og:url" content="https://clackr-plum.vercel.app/" />
        <meta property="og:site_name" content="clackr" />
        <meta property="og:image" content="https://clackr-plum.vercel.app/og.png" />
        <meta property="og:image:secure_url" content="https://clackr-plum.vercel.app/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@clackr" />
        <meta name="twitter:creator" content="@clackr" />
        <meta name="twitter:title" content="clackr — Typing Speed Test" />
        <meta name="twitter:description" content="Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test." />
        <meta name="twitter:image" content="https://clackr-plum.vercel.app/og.png" />
        <meta name="twitter:image:src" content="https://clackr-plum.vercel.app/og.png" />
        <meta name="twitter:domain" content="clackr-plum.vercel.app" />
        <link rel="canonical" href="https://clackr-plum.vercel.app/" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-clackr-accent/20" suppressHydrationWarning>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
