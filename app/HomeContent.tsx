"use client";

import React, { useEffect, useState } from "react";
import { api, getImageUrl } from "@/app/lib/api";
import { GenericCard } from "@/components/GenericCard";
import { usePlayer } from "@/context/PlayerContext";
import { Play, ChevronRight } from "lucide-react";
import { HomeResponse } from "@/types";
import { motion } from "framer-motion";

const LANGUAGES = [
  { id: "hindi", label: "Hindi" },
  { id: "english", label: "English" },
  { id: "punjabi", label: "Punjabi" },
  { id: "tamil", label: "Tamil" },
  { id: "telugu", label: "Telugu" },
  { id: "marathi", label: "Marathi" },
  { id: "gujarati", label: "Gujarati" },
  { id: "bengali", label: "Bengali" },
  { id: "kannada", label: "Kannada" },
  { id: "bhojpuri", label: "Bhojpuri" },
  { id: "malayalam", label: "Malayalam" },
  { id: "urdu", label: "Urdu" },
  { id: "haryanvi", label: "Haryanvi" },
  { id: "rajasthani", label: "Rajasthani" },
  { id: "odia", label: "Odia" },
  { id: "assamese", label: "Assamese" },
];

export function HomeContent() {
  const [data, setData] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState("hindi");
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.getHome(activeLang);
        setData(res);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeLang]);

  // Flatten helper: check both direct data and nested data property
  const getItems = (source: any): any[] => {
    if (!source) return [];
    if (Array.isArray(source)) return source;
    if (source.data && Array.isArray(source.data)) return source.data;
    return [];
  };

  const renderSection = (
    title: string,
    sourceData: any,
    typeOverride?: string
  ) => {
    const items = getItems(sourceData);
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <section className="mb-16 relative">
        <div className="flex items-end justify-between mb-6 px-2 border-b border-white/5 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              {title}
            </h2>
          </div>
          <button className="text-xs font-bold text-zinc-500 hover:text-primary uppercase tracking-wider flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.slice(0, 12).map((item: any, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GenericCard
                id={item.id}
                image={item.image}
                title={item.name || item.title}
                subtitle={
                  item.subtitle ||
                  item.description ||
                  (item.artists
                    ? item.artists.map((a: any) => a.name).join(", ")
                    : "")
                }
                type={(typeOverride as any) || item.type}
                onPlay={() => {
                  if (item.type === "song") playSong(item);
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  const renderHero = () => {
    if (!data || !data.data) return null;
    const trending = data.data.trending || data.data["trending"];
    const heroItems = getItems(trending);
    if (!heroItems.length) return null;
    const heroItem = heroItems[0];
    const image = getImageUrl(heroItem.image);

    return (
      <div className="relative w-full h-[450px] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-black/50 group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-10 md:p-16 w-full md:w-2/3 flex flex-col items-start gap-6 z-10">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Trending Now
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-black text-white leading-[0.9] text-glow line-clamp-2"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            {heroItem.name || heroItem.title}
          </motion.h1>

          <motion.p
            animate={{ opacity: 1 }}
            className="text-lg text-zinc-300 font-medium max-w-lg line-clamp-2"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            {heroItem.subtitle ||
              heroItem.artists?.map((a: any) => a.name).join(", ")}
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mt-2"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className="px-8 py-4 bg-primary hover:bg-primary-glow text-white rounded-full font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(211,0,0,0.4)] transition-all hover:scale-105 active:scale-95"
              onClick={() => heroItem.type === "song" && playSong(heroItem)}
            >
              <Play fill="currentColor" size={20} />
              Listen Now
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-bold backdrop-blur-md transition-all hover:scale-105">
              Details
            </button>
          </motion.div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <span className="text-zinc-500 font-display animate-pulse">
          Loading Vibes...
        </span>
      </div>
    );
  }

  if (!data || !data.data)
    return <div className="p-10 text-center text-zinc-500">Nothing found.</div>;

  return (
    <div className="p-6 md:p-10 max-w-[1800px] mx-auto pb-32">
      {/* Language Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar mask-linear-fade">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              activeLang === lang.id
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                : "bg-white/5 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
            }`}
            onClick={() => setActiveLang(lang.id)}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {renderHero()}

      <div className="space-y-8">
        {/* Render sections from data object keys if they match structure */}
        {Object.keys(data.data).map((key) => {
          const section = data.data[key];
          // Check if valid section with items
          if (
            section &&
            (section.title || key) &&
            (Array.isArray(section) ||
              (section.data && Array.isArray(section.data)))
          ) {
            // Skip global_config or non-content keys
            if (key === "global_config" || key === "radio") return null;
            return (
              <div key={key}>
                {renderSection(
                  section.title || key.replace(/_/g, " "),
                  section
                )}
              </div>
            );
          }
          // Handle nested modules object if present
          if (key === "modules") {
            return Object.keys(section).map((modKey) => {
              const mod = section[modKey];
              return renderSection(mod.title || modKey, mod);
            });
          }
          return null;
        })}
      </div>
    </div>
  );
}
