import { Suspense } from "react";
import PlayerExperience from "@/components/player-experience";
export const metadata = { title: "Player Mode | Mark Gonzalez" };
export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <main className="player-loading">Loading the portfolio player…</main>
      }
    >
      <PlayerExperience />
    </Suspense>
  );
}
