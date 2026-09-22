import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import SoundToggle from "@/components/SoundToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My little collections",
  description:
    "A shelf for the things I like — Pokémon, Sylvanian Families, Barbie, Chiikawa and Hamtaro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
            <Link href="/" className="group flex items-center gap-3">
              <span
                aria-hidden
                className="relative h-6 w-6 rounded-full border-2 border-foreground bg-accent shadow-[0_0_16px_rgba(255,95,162,0.6)] transition-transform group-hover:rotate-180 before:absolute before:inset-x-0 before:top-1/2 before:h-[2px] before:-translate-y-1/2 before:bg-foreground after:absolute after:left-1/2 after:top-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-2 after:border-foreground after:bg-surface"
              />
              <span className="text-lg font-semibold tracking-tight">
                My collections
              </span>
            </Link>
            <span className="ml-auto">
              <SoundToggle />
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-line/70 px-6 py-6 text-center text-xs text-muted">
          Data from PokeAPI · Pokémon is a trademark of Nintendo / Game Freak
        </footer>
      </body>
    </html>
  );
}
