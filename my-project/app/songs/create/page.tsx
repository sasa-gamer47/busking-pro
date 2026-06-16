"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";

// Definizione dei tipi per la struttura a segmenti della canzone
interface Segment {
  chord: string;
  text: string;
}

interface Line {
  id: string;
  segments: Segment[];
}

interface Section {
  id: string;
  label: string; // Es. "STROFA 1", "RITORNELLO 1"
  lines: Line[];
}

export default function CreateSongPage() {
  const router = useRouter();
  const baseId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stati per i metadati del brano
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [bpm, setBpm] = useState<number>(90);
  const [capo, setCapo] = useState<number>(0);
  const [originalKey, setOriginalKey] = useState("C");
  
  // Nuovi stati separati per la durata
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  // Stato iniziale dell'editor
  const [sections, setSections] = useState<Section[]>([
    {
      id: "sec_1",
      label: "STROFA 1",
      lines: [
        {
          id: "line_1",
          segments: [{ chord: "", text: "" }],
        },
      ],
    },
  ]);

  // --- FUNZIONI DI GESTIONE DELLE SEZIONI E RIGHE ---

  const addSection = (type: string) => {
    const timestamp = crypto.randomUUID();
    const count = sections.filter((s) => s.label.startsWith(type)).length + 1;
    const newSection: Section = {
      id: `sec_${timestamp}`,
      label: `${type} ${count}`,
      lines: [{ id: `line_${timestamp}`, segments: [{ chord: "", text: "" }] }],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const addLine = (sectionId: string) => {
    const timestamp = crypto.randomUUID();
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          lines: [...sec.lines, { id: `line_${timestamp}`, segments: [{ chord: "", text: "" }] }],
        };
      })
    );
  };

  const removeLine = (sectionId: string, lineId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        if (sec.lines.length <= 1) return sec;
        return { ...sec, lines: sec.lines.filter((l) => l.id !== lineId) };
      })
    );
  };

  const addSegment = (sectionId: string, lineId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          lines: sec.lines.map((l) => {
            if (l.id !== lineId) return l;
            return { ...l, segments: [...l.segments, { chord: "", text: "" }] };
          }),
        };
      })
    );
  };

  const updateSegment = (
    sectionId: string,
    lineId: string,
    segmentIndex: number,
    field: "chord" | "text",
    value: string
  ) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          lines: sec.lines.map((l) => {
            if (l.id !== lineId) return l;
            return {
              ...l,
              segments: l.segments.map((seg, idx) => {
                if (idx !== segmentIndex) return seg;
                return { ...seg, [field]: value };
              }),
            };
          }),
        };
      })
    );
  };

  // --- SALVATAGGIO SUL DATABASE ---

  const handleSave = async () => {
    if (!title || !artist) {
      alert("Titolo e Artista sono obbligatori!");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Devi essere loggato per creare un brano");
      setIsSubmitting(false);
      return;
    }

    // Conversione dei minuti e secondi in un unico valore intero in secondi
    const totalDurationInSeconds = (durationMinutes * 60) + durationSeconds;

    // Costruzione della struttura JSON coerente con il visualizzatore funzionante
    const lyricsStructure = sections.map((sec) => {
      const rawType = sec.label.split(" ")[0].toLowerCase();

      return {
        type: rawType,
        label: sec.label,
        lines: sec.lines.map((l) => ({
          segments: l.segments.map((seg) => ({
            text: seg.text,
            chord: seg.chord.trim() === "" ? null : seg.chord.trim(),
           })),
        })),
      };
    });

    const { error } = await supabase.from("songs").insert([
      {
        user_id: user.id,
        title,
        artist,
        bpm,
        original_key: originalKey,
        content: lyricsStructure,
        duration: totalDurationInSeconds, // Salvataggio del valore calcolato in secondi
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Errore durante il salvataggio: " + error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 p-8 font-sans fixed left-[20%] right-0 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER DELLA PAGINA */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">CREA NUOVO BRANO</h1>
            <p className="text-zinc-400 text-sm mt-1">Inserisci i metadati e componi lo spartito a blocchi.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium transition text-sm cursor-pointer"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-black font-bold rounded-xl transition text-sm cursor-pointer"
            >
              {isSubmitting ? "Salvataggio..." : "Salva Brano"}
            </button>
          </div>
        </div>

        {/* SEZIONE METADATI (Aggiornata a md:grid-cols-6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Titolo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Creep"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Artista</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Es. Radiohead"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">BPM</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value) || 0)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Capotasto</label>
            <input
              type="number"
              value={capo}
              onChange={(e) => setCapo(parseInt(e.target.value) || 0)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Tonalità</label>
            <input
              type="text"
              value={originalKey}
              onChange={(e) => setOriginalKey(e.target.value)}
              placeholder="Es. G"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-white focus:outline-none transition text-sm"
            />
          </div>
          
          {/* Nuovo box di Input per la durata diviso in Minuti e Secondi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Durata</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="Min"
                title="Minuti"
                className="w-1/2 bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-white focus:outline-none transition text-sm text-center font-mono"
              />
              <input
                type="number"
                min="0"
                max="59"
                value={durationSeconds}
                onChange={(e) => {
                  let val = parseInt(e.target.value) || 0;
                  if (val > 59) val = 59;
                  if (val < 0) val = 0;
                  setDurationSeconds(val);
                }}
                placeholder="Sec"
                title="Secondi"
                className="w-1/2 bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-xl px-3 py-2.5 text-white focus:outline-none transition text-sm text-center font-mono"
              />
            </div>
          </div>
        </div>

        {/* CONTROLLI RAPIDI */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mr-2">Aggiungi Sezione:</span>
          {["STROFA", "RITORNELLO", "BRIDGE", "INTRO", "STRUMENTALE"].map((type) => (
            <button
              key={type}
              onClick={() => addSection(type)}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              + {type}
            </button>
          ))}
        </div>

        {/* COMPOSIZIONE DINAMICA */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <span className="text-sm font-black tracking-wide text-orange-400 bg-orange-500/10 px-3 py-1 rounded-md">
                  {section.label}
                </span>
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-xs font-bold text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  Rimuovi Sezione
                </button>
              </div>

              <div className="space-y-6">
                {section.lines.map((line) => (
                  <div key={line.id} className="relative group bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/40 space-y-3">
                    
                    <button
                      onClick={() => removeLine(section.id, line.id)}
                      className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 text-xs transition cursor-pointer"
                      title="Elimina riga"
                    >
                      ✕
                    </button>

                    <div className="flex flex-wrap gap-x-2 gap-y-4 items-end pr-6">
                      {line.segments.map((segment, sIdx) => (
                        <div key={sIdx} className="flex flex-col w-32 min-w-[8rem] space-y-1">
                          
                          <input
                            type="text"
                            value={segment.chord}
                            onChange={(e) =>
                              updateSegment(section.id, line.id, sIdx, "chord", e.target.value)
                            }
                            placeholder="Accordo"
                            className="w-full bg-zinc-900/80 text-orange-400 font-bold font-mono text-xs border border-zinc-800 focus:border-orange-500 rounded-md px-2 py-1 text-center focus:outline-none placeholder-zinc-700"
                          />

                          <input
                            type="text"
                            value={segment.text}
                            onChange={(e) =>
                              updateSegment(section.id, line.id, sIdx, "text", e.target.value)
                            }
                            placeholder="..."
                            className="w-full bg-transparent text-white text-sm border-b border-zinc-800 focus:border-orange-500 px-1 py-1 focus:outline-none placeholder-zinc-700"
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => addSegment(section.id, line.id)}
                        className="h-8 w-8 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg flex items-center justify-center text-sm font-bold transition mb-1 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addLine(section.id)}
                className="w-full py-2 bg-zinc-950/60 hover:bg-zinc-950 border border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                + Aggiungi Riga a {section.label}
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}