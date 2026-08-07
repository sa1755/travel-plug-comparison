import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TravelPlug",
    short_name: "TravelPlug",
    description: "Clear international plug, power, and device guidance.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4EFE6",
    theme_color: "#2563EB",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
