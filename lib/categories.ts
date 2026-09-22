export type Category = {
  slug: string;
  name: string;
  motif: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  /** Neutral background facts, written for this site. */
  about: string[];
  facts: { label: string; value: string }[];
  /** What the collection tracker on this page is for. */
  collectionLabel: string;
  placeholder: string;
};

export const categories: Category[] = [
  {
    slug: "sylvanian",
    name: "Sylvanian Families",
    motif: "🏡",
    tagline: "Tiny woodland families and very small furniture",
    accent: "#5ba672",
    accentSoft: "#e4f3e8",
    about: [
      "A toy line of small animal figures that live in detailed dolls' houses, made by the Japanese company Epoch and first released in 1985. In North America the same range is sold as Calico Critters.",
      "Each figure belongs to a family — rabbits, bears, hedgehogs, cats and many more — and the sets are built around ordinary domestic life: kitchens, nurseries, bakeries, school rooms. The appeal is largely in the miniatures themselves, which are unusually detailed for their size.",
      "Because the line has run for decades, older families and discontinued sets are actively collected, and regional exclusives make some pieces much harder to find than others.",
    ],
    facts: [
      { label: "First released", value: "1985" },
      { label: "Made by", value: "Epoch Co. (Japan)" },
      { label: "Also known as", value: "Calico Critters" },
      { label: "Typical scale", value: "About 1:12" },
    ],
    collectionLabel: "figures & sets",
    placeholder: "e.g. Chocolate Rabbit family, Red Roof Country Home",
  },
  {
    slug: "barbie",
    name: "Barbie",
    motif: "👗",
    tagline: "Sixty-something years of dolls, outfits and careers",
    accent: "#e8388f",
    accentSoft: "#ffe2ef",
    about: [
      "A fashion doll introduced by the American company Mattel in 1959. It was developed by Ruth Handler, who wanted a doll that let children imagine an adult life rather than only play at parenting.",
      "The doll has been released in an enormous number of variations over the decades, including a long run of career versions — astronaut, doctor, pilot, president among many others — which is part of why it is so widely collected.",
      "Collectors tend to organise around eras, particular designers, or specific lines, and condition matters a great deal: original boxes, accessories and unaltered hair can change a doll's value dramatically.",
    ],
    facts: [
      { label: "First released", value: "1959" },
      { label: "Made by", value: "Mattel (United States)" },
      { label: "Created by", value: "Ruth Handler" },
      { label: "Standard height", value: "About 29 cm" },
    ],
    collectionLabel: "dolls & outfits",
    placeholder: "e.g. 1990s Fashion Avenue outfit, Day-to-Night doll",
  },
  {
    slug: "chiikawa",
    name: "Chiikawa",
    motif: "🍡",
    tagline: "Small round creatures having a mildly difficult time",
    accent: "#e4a93c",
    accentSoft: "#fdf0d8",
    about: [
      "A Japanese character series by the illustrator Nagano, which began as short comics posted online around 2020 and later grew into an anime, a huge merchandise range, and themed cafés.",
      "The humour is gentle and slightly absurd: the characters work odd jobs, worry about small things, get slightly overwhelmed, and comfort each other. Very little actually happens, which is rather the point.",
      "Merchandise is released in frequent small waves, often as blind-box figures or capsule toys, so collecting tends to mean chasing specific waves rather than a fixed catalogue.",
    ],
    facts: [
      { label: "Started", value: "Around 2020" },
      { label: "Created by", value: "Nagano" },
      { label: "Origin", value: "Japan" },
      { label: "Common formats", value: "Plush, blind-box figures, capsule toys" },
    ],
    collectionLabel: "plushies & figures",
    placeholder: "e.g. capsule toy wave 3, keychain plush",
  },
  {
    slug: "hamtaro",
    name: "Hamtaro",
    motif: "🌻",
    tagline: "A hamster, his friends, and a great many sunflower seeds",
    accent: "#e07a3c",
    accentSoft: "#ffeade",
    about: [
      "A Japanese franchise created by Ritsuko Kawai, which began as children's picture books in 1997 and became widely known through the anime that started in 2000.",
      "The stories follow a pet hamster who slips out of his cage to meet a group of other hamsters, and most episodes are built around a small problem solved by the group together.",
      "The franchise ran across manga, anime, video games and a large toy range, so collections often mix media — books and cartridges alongside plush and figures.",
    ],
    facts: [
      { label: "Books began", value: "1997" },
      { label: "Anime began", value: "2000" },
      { label: "Created by", value: "Ritsuko Kawai" },
      { label: "Origin", value: "Japan" },
    ],
    collectionLabel: "plush, games & books",
    placeholder: "e.g. Game Boy Advance game, plush from 2001",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
