export type CollectionItem = {
  id: string;
  name: string;
  note: string;
  owned: boolean;
  addedAt: string;
};

function storageKey(slug: string): string {
  return `collection.${slug}`;
}

export function loadCollection(slug: string): CollectionItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    return raw ? (JSON.parse(raw) as CollectionItem[]) : [];
  } catch {
    return [];
  }
}

function save(slug: string, items: CollectionItem[]) {
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(items));
  } catch {
    // Private windows can refuse storage; the list still works for this session.
  }
}

export function addItem(
  slug: string,
  input: { name: string; note: string; owned: boolean }
): CollectionItem[] {
  const items = [
    ...loadCollection(slug),
    {
      id: crypto.randomUUID(),
      name: input.name,
      note: input.note,
      owned: input.owned,
      addedAt: new Date().toISOString(),
    },
  ];
  save(slug, items);
  return items;
}

export function toggleOwned(slug: string, id: string): CollectionItem[] {
  const items = loadCollection(slug).map((item) =>
    item.id === id ? { ...item, owned: !item.owned } : item
  );
  save(slug, items);
  return items;
}

export function removeItem(slug: string, id: string): CollectionItem[] {
  const items = loadCollection(slug).filter((item) => item.id !== id);
  save(slug, items);
  return items;
}
