"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, getImageUrl } from "@/app/lib/api";
import { GenericCard } from "@/components/GenericCard";
import { usePlayer } from "@/context/PlayerContext";
import { Play, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";
import { FullScreenPlayer } from "@/components/FullScreenPlayer";

export default function ArtistPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.getArtist(id);
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!data)
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="p-10 text-center text-zinc-500">Artist not found.</div>
      </div>
    );

  const image = getImageUrl(data.image);
  const topSongs = data.topSongs || [];
  const albums = data.topAlbums || [];
  const singles = data.singles || [];

  return (
    <div className="flex h-screen w-full bg-background text-white overflow-hidden font-sans selection:bg-primary selection:text-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth custom-scrollbar bg-gradient-to-b from-[#050505] to-black">
        <div className="pb-32 min-h-screen relative">
          {/* Hero */}
          <div className="h-[400px] relative flex items-center justify-center overflow-hidden mask-gradient-to-b">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 blur-3xl scale-110"
              style={{ backgroundImage: `url(${image})` }}
            ></div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 h-48 rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(211,0,0,0.4)] overflow-hidden"
                initial={{ scale: 0.5, opacity: 0 }}
              >
                <img
                  alt={data.name}
                  className="w-full h-full object-cover"
                  src={image}
                />
              </motion.div>
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-display font-black text-white text-glow flex items-center justify-center gap-4">
                  {data.name}
                  {data.isVerified && (
                    <CheckCircle2
                      className="text-primary"
                      fill="currentColor"
                      size={32}
                      stroke="black"
                    />
                  )}
                </h1>
                <p className="text-zinc-300 mt-2 text-lg capitalize">
                  {data.type || "Artist"} • {data.fanCount || "0"} Fans
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[1600px] mx-auto px-6 md:px-10 space-y-12">
            {/* Top Songs */}
            {topSongs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Top Songs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topSongs.slice(0, 6).map((song: any, idx: number) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => playSong(song)}
                    >
                      <span className="text-lg font-bold text-zinc-600 w-6 text-center group-hover:text-primary">
                        {idx + 1}
                      </span>
                      <img
                        alt=""
                        className="w-12 h-12 rounded-md object-cover"
                        src={getImageUrl(song.image)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white truncate group-hover:text-primary">
                          {song.name}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {song.album}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100">
                        <Play fill="white" size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {albums.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {albums.map((album: any) => (
                    <GenericCard
                      key={album.id}
                      id={album.id}
                      image={album.image}
                      subtitle={album.year || "Album"}
                      title={album.name}
                      type="album"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Singles */}
            {singles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Singles</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {singles.map((single: any) => (
                    <GenericCard
                      key={single.id}
                      id={single.id}
                      image={single.image}
                      subtitle="Single"
                      title={single.name}
                      type="song"
                      onPlay={() => playSong(single)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
        <Player />
        <FullScreenPlayer />
      </main>
    </div>
  );
}
