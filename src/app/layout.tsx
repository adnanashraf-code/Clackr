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
    title: "clackr — Typing Speed Test",
    description: "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test.",
    images: ["https://clackr-plum.vercel.app/og.png"],
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
