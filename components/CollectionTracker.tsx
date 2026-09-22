"use client";

import { useEffect, useState } from "react";
import {
  addItem,
  loadCollection,
  removeItem,
  toggleOwned,
  type CollectionItem,
} from "@/lib/collection";

export default function CollectionTracker({
  slug,
  label,
  placeholder,
}: {
  slug: string;
  label: string;
  placeholder: string;
}) {
  const [items, setItems] = useState<CollectionItem[] | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [owned, setOwned] = useState(true);
  const [filter, setFilter] = useState<"all" | "owned" | "wishlist">("all");

  useEffect(() => {
    setItems(loadCollection(slug));
  }, [slug]);

  if (items === null) {
    return (
      <div className="animate-pulse rounded-3xl border border-line bg-surface p-6">
        <div className="h-4 w-40 rounded bg-foreground/10" />
      </div>
    );
  }

  const ownedCount = items.filter((i) => i.owned).length;
  const shown = items.filter((item) =>
    filter === "all" ? true : filter === "owned" ? item.owned : !item.owned
  );

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setItems(addItem(slug, { name: name.trim(), note: note.trim(), owned }));
    setName("");
    setNote("");
  }

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">My {label}</h2>
        <p className="text-xs text-muted">
          {ownedCount} owned · {items.length - ownedCount} on the wishlist
        </p>
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          className="rounded-xl border border-line bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-[var(--cat-accent)]"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (year, where you found it, condition...)"
            className="flex-1 rounded-xl border border-line bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-[var(--cat-accent)]"
          />
          <div className="flex items-center gap-1 rounded-xl border border-line bg-surface-soft p-1">
            <button
              type="button"
              onClick={() => setOwned(true)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                owned ? "bg-[var(--cat-accent)] text-white" : "text-muted"
              }`}
            >
              Owned
            </button>
            <button
              type="button"
              onClick={() => setOwned(false)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                owned ? "text-muted" : "bg-[var(--cat-accent)] text-white"
              }`}
            >
              Wishlist
            </button>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[var(--cat-accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Add
          </button>
        </div>
      </form>

      {items.length > 0 && (
        <>
          <div className="mt-5 flex gap-1">
            {(["all", "owned", "wishlist"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                  filter === option
                    ? "bg-[var(--cat-accent)] text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            {shown.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-2xl border border-line bg-surface-soft p-3"
              >
                <button
                  onClick={() => setItems(toggleOwned(slug, item.id))}
                  aria-label={item.owned ? "Move to wishlist" : "Mark as owned"}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                    item.owned
                      ? "border-transparent bg-[var(--cat-accent)] text-white"
                      : "border-line text-transparent"
                  }`}
                >
                  ✓
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.note && (
                    <p className="mt-0.5 text-xs text-muted">{item.note}</p>
                  )}
                  {!item.owned && (
                    <span className="mt-1 inline-block rounded-full bg-surface px-2 py-0.5 text-[10px] text-muted">
                      wishlist
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setItems(removeItem(slug, item.id))}
                  className="text-xs text-muted hover:text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {items.length === 0 && (
        <p className="mt-5 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
          Nothing logged yet. Add your first piece above — it saves in this
          browser only.
        </p>
      )}
    </section>
  );
}
