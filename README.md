# 🌸 Pokédex

**👉 Live site: [regina-pokedex.netlify.app](https://regina-pokedex.netlify.app)**

A complete Pokédex covering all **1,025 Pokémon** across every generation, from
Kanto to Paldea. Built with Next.js and deployed on Netlify.

## What it does

**Browse & search**

- Search by name or Pokédex number
- Filter by any combination of types and regions (Gen 1–9)
- Sort by number, name, or base stat total
- ✨ Shiny toggle to see every Pokémon's alternate colouring
- ❤️ Save favourites (kept in your browser)
- 🎲 Surprise me — jump to a random Pokémon

**On each Pokémon's page**

| Tab | What's inside |
| --- | --- |
| 📖 Stories | Auto-generated fun facts, fan legends, and each game's Pokédex entry |
| ⚔️ Matchups | Full type effectiveness chart, including 4× weaknesses and immunities |
| 🧠 Strategy | Recommended nature with reasoning, plus teammates that cover its weaknesses |
| ✨ Moves | Every level-up move with type, power, accuracy, and PP |
| 🧬 Family | Evolution line and egg groups |

Plus official artwork, base stat bars, and a button to play its cry.

## How the content is built

Nothing here is invented:

- **Fun facts** are computed from the dataset itself — stat rankings, typing
  rarity, size percentiles, matchup extremes — so every claim is verifiable.
- **Dex stories** are the real Pokédex entries from each game, grouped by which
  versions share the same text.
- **Legends & rumours** are hand-curated and labelled as *fan theory*,
  *real-world origin*, or *behind the scenes*, so speculation is never presented
  as official canon.
- **Nature recommendations** follow competitive logic: boost the offensive stat
  the Pokémon actually uses, drop the one it never touches, and favour Speed when
  it is fast enough to matter.
- **Duo partners** are scored by how much of the Pokémon's weakness chart a
  teammate resists, weighting 4× weaknesses highest and skipping legendaries and
  unevolved candidates.

## Audio

The background music is an original composition written for this project and
synthesised with the Web Audio API. It is **not** an arrangement of any existing
game music, which stays copyrighted even when re-recorded. Audio is off by
default and only starts when you turn it on.

## Tech

- **Next.js 16** (App Router) with TypeScript and Tailwind CSS 4
- Fully static: all 1,029 pages are prerendered at build time
- Pokémon data is fetched once from [PokeAPI](https://pokeapi.co) into
  `data/*.json`, so the live site never depends on an external API

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To refresh the Pokémon dataset from PokeAPI:

```bash
node scripts/fetch-pokemon.mjs
```

## Deploying

Every push to `main` triggers a GitHub Actions workflow that builds the site and
deploys it to Netlify.

---

Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc.
and GAME FREAK Inc. This is a non-commercial fan project. Data courtesy of
[PokeAPI](https://pokeapi.co).
