"use client";

import { useEffect, useState } from "react";
import { isSoundOn, primeSound, setSoundOn } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    primeSound();
    setOn(isSoundOn());
  }, []);

  // Audio can only start from a user gesture, so the music waits for this click.
  function toggle() {
    const next = !on;
    setSoundOn(next);
    setOn(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Turn music off" : "Turn music on"}
      title={on ? "Music on" : "Music off"}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        on
          ? "border-transparent bg-accent text-white"
          : "border-line bg-surface text-muted hover:text-foreground"
      }`}
    >
      <span aria-hidden>{on ? "🎵" : "🔇"}</span>
      <span className="hidden sm:inline">{on ? "Music on" : "Music"}</span>
    </button>
  );
}
