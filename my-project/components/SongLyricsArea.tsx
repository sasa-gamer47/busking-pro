"use client";

import { RefObject } from "react";
import { SongSection, SongLine, SongSegment } from "@/lib/utils/supabase/types";
import { transposeChord, simplifyChord } from "@/lib/utils";

interface SongLyricsAreaProps {
  scrollContainerRef: RefObject<HTMLElement | null>;
  content: SongSection[] | undefined;
  transpose: number;
  simplify: boolean;
}

export default function SongLyricsArea({
  scrollContainerRef,
  content,
  transpose,
  simplify,
}: SongLyricsAreaProps) {
  return (
    <main
      ref={scrollContainerRef}
      className="col-start-1 col-end-2 row-start-2 row-end-3 overflow-y-auto p-8 bg-zinc-950/40 scroll-smooth"
    >
      <div className="max-w-2xl mx-auto space-y-8 font-mono text-lg">
        {content?.map((section, sectionIdx) => (
          <div key={sectionIdx} className="space-y-6">
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-500/5 px-2.5 py-1 rounded border border-orange-500/10">
                {section.label || section.type}
              </span>
              <div className="h-1 flex-1 bg-zinc-900" />
            </div>

            <div className="space-y-4">
              {section.lines?.map((line, lineIdx) => (
                <div key={lineIdx} className="flex flex-wrap items-end pb-2 leading-none">
                  {line.segments?.map((segment, segmentIdx) => (
                    <div key={segmentIdx} className="flex flex-col items-start min-w-fit">
                      
                      {/* Riga Accordi */}
                      <span className="h-6 font-mono text-base font-bold text-orange-400 tracking-wide pr-1 select-none">
                        {segment.chord ? (
                          simplify
                            ? simplifyChord(transposeChord(segment.chord, transpose))
                            : transposeChord(segment.chord, transpose)
                        ) : (
                          "\u00A0"
                        )}
                      </span>

                      {/* Riga Testo */}
                      <span className="font-sans text-xl text-zinc-200 tracking-normal whitespace-pre">
                        {segment.text}
                      </span>

                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}