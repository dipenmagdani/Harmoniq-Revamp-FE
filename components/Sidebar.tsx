"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Library,
  Mic2,
  Heart,
  ListMusic,
  Disc,
  Radio,
  Settings,
  Music2,
} from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const NavItem = ({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}) => (
  <Link href={to} className="relative group block">
    <div
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative z-10",
        active ? "text-white" : "text-zinc-400 hover:text-white"
      )}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2.5 : 2}
        className={clsx(
          "transition-transform duration-300 group-hover:scale-110",
          active ? "text-primary drop-shadow-[0_0_8px_rgba(211,0,0,0.5)]" : ""
        )}
      />
      <span className="font-medium tracking-wide">{label}</span>
    </div>
    {active && (
      <motion.div
        layoutId="activeNav"
        className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl backdrop-blur-sm z-0"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(211,0,0,0.8)]" />
    )}
  </Link>
);

export const Sidebar = () => {
  const path = usePathname();

  return (
    <div className="w-[260px] h-full flex flex-col bg-black/20 border-r border-white/5 hidden md:flex z-20 backdrop-blur-2xl">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-black flex items-center justify-center shadow-[0_0_15px_rgba(211,0,0,0.4)] border border-white/10">
            <Music2 className="text-white" size={20} />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-white">
            Harmoniq
          </span>
        </div>

        <div className="space-y-1">
          <NavItem to="/" icon={Home} label="Home" active={path === "/"} />
          <NavItem
            to="/search"
            icon={Search}
            label="Discover"
            active={path === "/search"}
          />
          <NavItem
            to="/radio"
            icon={Radio}
            label="Radio"
            active={path === "/radio"}
          />
        </div>
      </div>

      <div className="px-8 py-2 flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 pl-4">
          Library
        </div>
        <div className="space-y-1">
          <NavItem
            to="/playlists"
            icon={ListMusic}
            label="Playlists"
            active={path === "/playlists"}
          />
          <NavItem
            to="/artists"
            icon={Mic2}
            label="Artists"
            active={path === "/artists"}
          />
          <NavItem
            to="/albums"
            icon={Disc}
            label="Albums"
            active={path === "/albums"}
          />
          <NavItem
            to="/favorites"
            icon={Heart}
            label="Liked Songs"
            active={path === "/favorites"}
          />
        </div>
      </div>

      <div className="p-6 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-black border border-white/5 relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500"></div>
          <h4 className="font-bold text-white mb-1 relative z-10">Premium</h4>
          <p className="text-xs text-zinc-400 mb-3 relative z-10">
            Hi-Res Lossless Audio
          </p>
          <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all">
            Upgrade
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3 px-2 text-zinc-400 hover:text-white cursor-pointer transition-colors">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>
    </div>
  );
};
