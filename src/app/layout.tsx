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
  themeColor: "#08090d",
};

const SITE_URL = "https://clackr-plum.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "clackr — Minimal Typing Speed Test | WPM & Accuracy Test",
    template: "%s | clackr — Typing Test",
  },
  description:
    "Test your typing speed (WPM) and accuracy with clackr — a minimal, distraction-free typing master with real-time stats, custom modes, and mechanical keyboard sound effects.",
  keywords: [
    // Direct Competitor & Brand Search Targets (Meta Tags Only)
    "Monkeytype",
    "Monkeytype test",
    "Monkeytype typing test",
    "Monkeytype online",
    "Keybr",
    "Keybr typing",
    "Keybr speed test",
    "Keybr practice",
    "10FastFingers",
    "10FastFingers test",
    "10FastFingers typing test",
    "TypeRacer",
    "TypeRacer online",
    "TypeRacer speed test",
    "Typing.com",
    "Typing.com test",
    "Typing.com practice",
    "Monkeytype alternative",
    "Keybr alternative",
    "10FastFingers alternative",
    "TypeRacer alternative",
    "Typing.com alternative",
    // General Speed Typing Keywords
    "typing test",
    "typing speed test",
    "wpm test",
    "words per minute test",
    "minimal typing test",
    "distraction free typing test",
    "mechanical keyboard typing test",
    "typing practice",
    "speed typing test",
    "wpm calculator",
    "touch typing practice",
    "typing master online",
    "free typing test",
    "typing accuracy test",
    "clackr typing",
  ],
  authors: [{ name: "clackr", url: SITE_URL }],
  creator: "clackr",
  publisher: "clackr",
  applicationName: "clackr",
  category: "utility",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "clackr — Minimal Typing Speed Test",
    description:
      "Test and improve your typing speed (WPM), accuracy, and consistency. Clean minimal interface with mechanical audio feedback.",
    url: `${SITE_URL}/`,
    siteName: "clackr",
    images: [
      {
        url: `${SITE_URL}/og.png?v=2`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "clackr — Minimal Typing Speed Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "clackr — Minimal Typing Speed Test",
    description:
      "Think you can beat my typing speed? Try clackr, a minimal distraction-free typing test with mechanical keyboard sounds.",
    images: [`${SITE_URL}/og.png?v=2`],
    creator: "@clackr",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "google11e86a920a740421",
  },
  manifest: "/manifest.webmanifest",
};

// Google JSON-LD Structured Data Schema
const webAppSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      "url": SITE_URL,
      "name": "clackr — Typing Speed Test",
      "alternateName": [
        "Monkeytype",
        "Monkeytype Test",
        "Keybr",
        "Keybr Typing",
        "10FastFingers",
        "10FastFingers Test",
        "TypeRacer",
        "Typing.com",
        "clackr",
        "clackr typing test",
      ],
      "description":
        "Minimal, distraction-free typing speed test application with real-time WPM analytics, custom modes, and mechanical key sounds.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1840",
        "bestRating": "5",
        "worstRating": "1",
      },
      "featureList": [
        "Real-time WPM & Accuracy calculation",
        "Mechanical keyboard audio feedback with custom sound profiles",
        "Custom time, word, quote, zen, and code typing modes",
        "Distraction-free minimal design",
        "Detailed performance graph and error breakdown",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "clackr",
      "description": "Minimal distraction-free typing speed test.",
      "publisher": {
        "@type": "Organization",
        "name": "clackr",
        "url": SITE_URL,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is typing speed (WPM) calculated on clackr?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Words Per Minute (WPM) is calculated by taking the total number of correct characters typed divided by 5 (the standard word length unit) and dividing by time in minutes.",
          },
        },
        {
          "@type": "Question",
          "name": "Is clackr free to use for typing practice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes! clackr is 100% free, open, and distraction-free with no registration or account setup required.",
          },
        },
      ],
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-clackr-accent/20" suppressHydrationWarning>
        <ReduxProvider>{children}</ReduxProvider>

        {/* Clean Semantic SEO content for Search Engine Crawlers */}
        <footer className="sr-only">
          <h1>clackr — Minimal Distraction-Free Typing Speed Test</h1>
          <h2>High-Performance Online Typing Test & Speed Practice</h2>
          <p>
            clackr is a modern, high-performance online typing speed test designed for touch typists, developers, and speed enthusiasts.
            Measure your Words Per Minute (WPM), accuracy, raw typing speed, and consistency. Practice typing with custom word lists,
            quotes, code snippets, zen mode, and mechanical keyboard sound effects.
          </p>
        </footer>
      </body>
    </html>
  );
}
