"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";
import { FullScreenPlayer } from "@/components/FullScreenPlayer";
import { HomeContent } from "./HomeContent";

export default function HomePage() {
  return (
    <div className="flex h-screen w-full bg-background text-white overflow-hidden font-sans selection:bg-primary selection:text-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth custom-scrollbar bg-gradient-to-b from-[#050505] to-black">
        <HomeContent />
        <Player />
        <FullScreenPlayer />
      </main>
    </div>
  );
}
