"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SongHeaderProps {
  backUrl: string;
  title: string;
  artist: string | null;
}

export default function SongHeader({ backUrl, title, artist }: SongHeaderProps) {
  return (
    <header className="col-start-1 col-end-2 row-start-1 row-end-2 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href={backUrl}
          className="p-2 -ml-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            PERFORMANCE_MODE
          </span>
          <h1 className="text-xl font-bold text-zinc-200">
            {title} <span className="text-zinc-500 text-sm font-normal">/ {artist}</span>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4 text-zinc-400" />
    </header>
  );
}