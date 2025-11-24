"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { getImageUrl } from "@/app/lib/api";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps {
  id: string;
  image: any;
  title: string;
  subtitle: string;
  type: "album" | "playlist" | "song" | "artist";
  onPlay?: () => void;
  className?: string;
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const GenericCard: React.FC<CardProps> = ({
  id,
  image,
  title,
  subtitle,
  type,
  onPlay,
  className,
}) => {
  const linkTo = type === "song" ? "#" : `/${type}/${id}`;
  const isArtist = type === "artist";

  return (
    <Link href={linkTo}>
      <div
        className={cn(
          "group flex flex-col gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors duration-300",
          className
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden shadow-lg aspect-square",
            isArtist ? "rounded-full" : "rounded-xl"
          )}
        >
          <img
            src={getImageUrl(image)}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-75",
              isArtist ? "rounded-full" : "rounded-xl"
            )}
            loading="lazy"
          />

          {/* Play Button Overlay */}
          {!isArtist && (
            <div className="absolute bottom-2 right-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPlay && onPlay();
                }}
                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-black/40 hover:scale-105 active:scale-95 hover:bg-primary-glow transition-all"
              >
                <Play size={24} fill="currentColor" className="ml-1" />
              </button>
            </div>
          )}
        </div>

        <h3 className="font-bold text-white text-base truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 truncate font-medium">{subtitle}</p>
      </div>
    </Link>
  );
};
