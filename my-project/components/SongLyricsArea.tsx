"use client";

import { RefObject } from "react";
import { transposeChord, simplifyChord, formatChordNotation } from "@/lib/utils";

interface ChordSegment {
  chord?: string | null;
  text: string;
}

interface SongLine {
  segments: ChordSegment[];
}

interface SongSection {
  type?: string;
  label?: string;
  lines: SongLine[];
}

interface SongLyricsAreaProps {
  scrollContainerRef: RefObject<HTMLElement | null>;
  content: SongSection[];
  transpose: number;
  simplify: boolean;
  fontSize: string;
  notation: string;
}

const chordSizeMap: Record<string, string> = {
  sm: "text-xs h-5",
  md: "text-sm h-6",
  lg: "text-base h-7",
  xl: "text-lg h-8",
};

const lyricSizeMap: Record<string, string> = {
  sm: "text-sm min-h-[1.25rem]",
  md: "text-base min-h-[1.5rem]",
  lg: "text-lg min-h-[1.75rem]",
  xl: "text-xl min-h-[2rem]",
};

export default function SongLyricsArea({
  scrollContainerRef,
  content,
  transpose,
  simplify,
  fontSize,
  notation,
}: SongLyricsAreaProps) {
  const chordClass = chordSizeMap[fontSize] || chordSizeMap.md;
  const lyricClass = lyricSizeMap[fontSize] || lyricSizeMap.md;

  return (
    <main
      ref={scrollContainerRef}
      // RESPONSIVE: padding dinamico (p-4 per mobile, p-8 per schermi grandi)
      className="overflow-y-auto p-4 sm:p-8 font-mono bg-zinc-950/20 select-none scrollbar-thin"
    >
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        {content?.map((section, sIdx) => (
          <div key={sIdx} className="border-l-2 border-zinc-800 pl-3 sm:pl-4 space-y-4">
            {section.label && (
              <div className="text-xs font-bold uppercase tracking-wider text-orange-500/80">
                {section.label}
              </div>
            )}
            <div className="space-y-6">
              {section.lines?.map((line, lIdx) => (
                // RESPONSIVE FIX: Sostituito row-gap-4 (deprecato) con gap-y-3 e gap-x-1 per il wrapping mobile
                <div key={lIdx} className="flex flex-wrap gap-y-3 gap-x-1 leading-none">
                  {line.segments?.map((seg, segIdx) => {
                    let finalChord = "";
                    if (seg.chord) {
                      finalChord = transposeChord(seg.chord, transpose);
                      if (simplify) finalChord = simplifyChord(finalChord);
                      finalChord = formatChordNotation(finalChord, notation);
                    }

                    return (
                      <div key={segIdx} className="flex flex-col min-w-[0.25rem] mr-0.5 mb-1">
                        <span className={`${chordClass} text-orange-400 font-bold block whitespace-nowrap`}>
                          {finalChord || "\u00A0"}
                        </span>
                        <span className={`${lyricClass} text-zinc-200 whitespace-pre`}>
                          {seg.text || "\u00A0"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}