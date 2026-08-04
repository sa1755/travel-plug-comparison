import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TravelPlug",
    short_name: "TravelPlug",
    description: "Clear international plug, power, and device guidance.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFD",
    theme_color: "#1A73E8",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
