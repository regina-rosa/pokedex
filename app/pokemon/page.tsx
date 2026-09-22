import Link from "next/link";
import PokedexBrowser from "@/components/PokedexBrowser";
import { summaries } from "@/lib/pokemon";

export const metadata = {
  title: "Pokédex — Collection",
  description: "Search every Pokémon by type, region, stats and more.",
};

export default function PokemonIndex() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← All categories
      </Link>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Every Pokémon, all nine regions
        </h1>
        <p className="mt-1 text-sm text-muted">
          Search all {summaries.length} Pokémon — filter by type or region,
          save favorites, and peek at their shiny forms.
        </p>
      </div>
      <PokedexBrowser entries={summaries} />
    </div>
  );
}
