import spongebobData from "@/data/spongebob.json";
import disneyData from "@/data/disney.json";
import ghibliData from "@/data/ghibli.json";

export type SpongebobEpisode = {
  id: number;
  season: number;
  number: number;
  name: string;
  airdate: string | null;
  runtime: number | null;
  rating: number | null;
  summary: string;
  image: string | null;
};

export type SpongebobShow = {
  title: string;
  premiered: string;
  status: string;
  genres: string[];
  rating: number | null;
  network: string | null;
  image: string | null;
  characters: { name: string; actor: string; image: string | null }[];
  episodes: SpongebobEpisode[];
};

export type DisneyCharacter = {
  id: number;
  name: string;
  image: string;
  films: string[];
  tvShows: string[];
  allies: string[];
  enemies: string[];
};

export type GhibliFilm = {
  id: string;
  title: string;
  originalTitle: string;
  romanised: string;
  description: string;
  director: string;
  producer: string;
  releaseDate: string;
  runningTime: string;
  score: string;
  image: string;
  banner: string;
  characters: { name: string; gender: string; age: string }[];
};

export const spongebob = spongebobData as SpongebobShow;
export const disney = disneyData as DisneyCharacter[];
export const ghibli = ghibliData as GhibliFilm[];

export type CategoryMeta = {
  slug: string;
  name: string;
  motif: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  count: string;
  source: { name: string; url: string };
};

export const categoryList: CategoryMeta[] = [
  {
    slug: "spongebob",
    name: "SpongeBob SquarePants",
    motif: "🧽",
    tagline: "Every episode since 1999, season by season",
    accent: "#e0a900",
    accentSoft: "#fff3cc",
    count: `${spongebob.episodes.length} episodes`,
    source: { name: "TVmaze", url: "https://www.tvmaze.com" },
  },
  {
    slug: "disney",
    name: "Disney",
    motif: "🏰",
    tagline: "Characters and the films they appear in",
    accent: "#4f6fd6",
    accentSoft: "#e2e9ff",
    count: `${disney.length} characters`,
    source: { name: "Disney API", url: "https://disneyapi.dev" },
  },
  {
    slug: "ghibli",
    name: "Studio Ghibli",
    motif: "🌿",
    tagline: "Every feature film, in order",
    accent: "#3f8f7a",
    accentSoft: "#dff2ec",
    count: `${ghibli.length} films`,
    source: { name: "Studio Ghibli API", url: "https://ghibliapi.vercel.app" },
  },
];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return categoryList.find((c) => c.slug === slug);
}
