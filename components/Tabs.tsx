"use client";

import { useState, type ReactNode } from "react";
import { playSound } from "@/lib/sound";

export type Tab = {
  id: string;
  label: string;
  icon: string;
  content: ReactNode;
};

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-1.5 overflow-x-auto rounded-full border border-line bg-surface p-1.5 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActive(tab.id);
              playSound("tab");
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all ${
              active === tab.id
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:bg-surface-soft hover:text-foreground"
            }`}
          >
            <span aria-hidden>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} hidden={tab.id !== active}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
