"use client";

import React, { useState, useEffect } from "react";
import { Search as SearchIcon, X, Play } from "lucide-react";
import { api, getImageUrl } from "@/app/lib/api";
import { GenericCard } from "@/components/GenericCard";
import { usePlayer } from "@/context/PlayerContext";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";
import { FullScreenPlayer } from "@/components/FullScreenPlayer";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        try {
          const res = await api.searchAll(query);
          setResults(res.data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex h-screen w-full bg-background text-white overflow-hidden font-sans selection:bg-primary selection:text-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth custom-scrollbar bg-gradient-to-b from-[#050505] to-black">
        <div className="p-6 md:p-10 pb-32 max-w-[1600px] mx-auto min-h-screen">
          <div className="sticky top-0 z-30 py-4 mb-8 bg-black/80 backdrop-blur-xl -mx-6 px-6 border-b border-white/5">
            <div className="relative max-w-2xl mx-auto">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                size={22}
              />
              <input
                autoFocus
                className="w-full pl-12 pr-12 py-4 bg-[#1a1a1a] border border-white/5 focus:border-primary/50 focus:bg-[#222] rounded-full text-lg text-white placeholder-zinc-500 outline-none transition-all shadow-lg"
                placeholder="What do you want to listen to?"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  onClick={() => setQuery("")}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && !results && (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg font-medium">
                Search for songs, artists, albums...
              </p>
            </div>
          )}

          {!loading && results && (
            <motion.div
              animate={{ opacity: 1 }}
              className="space-y-12"
              initial={{ opacity: 0 }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Top Result */}
                {results.topQuery &&
                  results.topQuery.results &&
                  results.topQuery.results.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold text-white mb-4">
                        Top Result
                      </h2>
                      <div className="p-6 rounded-3xl bg-[#111] border border-white/5 hover:bg-[#161616] transition-colors flex items-center gap-6 group cursor-pointer">
                        <img
                          alt=""
                          className="w-32 h-32 rounded-full shadow-2xl object-cover group-hover:scale-105 transition-transform"
                          src={getImageUrl(results.topQuery.results[0].image)}
                        />
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">
                            {results.topQuery.results[0].title ||
                              results.topQuery.results[0].name}
                          </h3>
                          <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-zinc-300">
                            {results.topQuery.results[0].type}
                          </span>
                        </div>
                      </div>
                    </section>
                  )}

                {/* Songs */}
                {results.songs &&
                  results.songs.results &&
                  results.songs.results.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold text-white mb-4">
                        Songs
                      </h2>
                      <div className="space-y-2">
                        {results.songs.results.slice(0, 4).map((song: any) => (
                          <div
                            key={song.id}
                            className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl group cursor-pointer transition-colors"
                            onClick={() => playSong(song)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12">
                                <img
                                  alt=""
                                  className="w-full h-full rounded-md object-cover"
                                  src={getImageUrl(song.image)}
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Play
                                    className="text-white"
                                    fill="white"
                                    size={16}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-white group-hover:text-primary transition-colors">
                                  {song.title || song.name}
                                </div>
                                <div className="text-xs text-zinc-400">
                                  {song.primaryArtists || song.singers}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-zinc-500 font-mono">
                              {song.duration
                                ? Math.floor(Number(song.duration) / 60) +
                                  ":" +
                                  (Number(song.duration) % 60)
                                    .toString()
                                    .padStart(2, "0")
                                : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
              </div>

              {/* Albums */}
              {results.albums &&
                results.albums.results &&
                results.albums.results.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4">
                      Albums
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {results.albums.results.slice(0, 5).map((item: any) => (
                        <GenericCard
                          key={item.id}
                          id={item.id}
                          image={item.image}
                          subtitle="Album"
                          title={item.title || item.name}
                          type="album"
                        />
                      ))}
                    </div>
                  </section>
                )}
            </motion.div>
          )}
        </div>
        <Player />
        <FullScreenPlayer />
      </main>
    </div>
  );
}
