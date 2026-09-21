"use client";

import { useState } from "react";
import { displayName } from "@/lib/pokemon";

type Story = { text: string; versions: string[] };

export default function DexStories({ stories }: { stories: Story[] }) {
  const [expanded, setExpanded] = useState(false);

  if (stories.length === 0) {
    return <p className="text-sm text-muted">No Pokédex entries recorded.</p>;
  }

  const shown = expanded ? stories : stories.slice(0, 3);

  return (
    <div className="flex flex-col gap-3">
      {shown.map((story) => (
        <figure
          key={story.text}
          className="rounded-2xl border-l-4 border-accent bg-surface-soft p-4"
        >
          <blockquote className="text-sm leading-relaxed">
            “{story.text}”
          </blockquote>
          <figcaption className="mt-2 flex flex-wrap gap-1">
            {story.versions.map((version) => (
              <span
                key={version}
                className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted"
              >
                Pokémon {displayName(version)}
              </span>
            ))}
          </figcaption>
        </figure>
      ))}

      {stories.length > 3 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="self-start text-xs font-medium text-accent hover:underline"
        >
          {expanded
            ? "Show fewer entries"
            : `Read ${stories.length - 3} more entries`}
        </button>
      )}
    </div>
  );
}
