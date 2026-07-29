import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "clackr — Minimal Typing Speed Test",
    short_name: "clackr",
    description:
      "Minimal, distraction-free typing speed test with mechanical keyboard audio feedback, real-time WPM calculation, and accuracy analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#6C93D9",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
