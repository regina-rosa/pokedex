import PokedexBrowser from "@/components/PokedexBrowser";
import { pokemon } from "@/lib/pokemon";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          The original 151
        </h1>
        <p className="mt-1 text-sm text-muted">
          Search, filter by type, and compare base stats across the Kanto
          region.
        </p>
      </div>
      <PokedexBrowser entries={pokemon} />
    </div>
  );
}
