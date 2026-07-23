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
  title: "Clackr — Premium Mechanical Typing rhythm & speed test",
  description: "Improve your typing speed and rhythm with Clackr. Features customizable mechanical switch sounds, compact 75% interactive virtual keyboard, and detailed analytics.",
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
