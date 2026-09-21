import { displayName, typeColor } from "@/lib/pokemon";

export default function TypeBadge({
  type,
  size = "sm",
}: {
  type: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`rounded-full font-medium text-white ${
        size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"
      }`}
      style={{ backgroundColor: typeColor(type) }}
    >
      {displayName(type)}
    </span>
  );
}
