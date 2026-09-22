import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
      { protocol: "https", hostname: "static.tvmaze.com" },
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "www.themoviedb.org" },
    ],
  },
};

export default nextConfig;
