"use client"

import { useState } from "react"
import { updateUserSettings } from "@/lib/utils/actions"
import { Button } from "@/components/ui/button"
import { Save, Music, Type, ArrowUpRight, CheckCircle2 } from "lucide-react"

interface SettingsClientProps {
  initialSettings: {
    chord_notation: string
    default_font_size: string
    default_scroll_speed: number
  }
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [notation, setNotation] = useState(initialSettings.chord_notation)
  const [fontSize, setFontSize] = useState(initialSettings.default_font_size)
  const [scrollSpeed, setScrollSpeed] = useState(initialSettings.default_scroll_speed)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)
    const res = await updateUserSettings({
      chord_notation: notation,
      default_font_size: fontSize,
      default_scroll_speed: scrollSpeed,
    })
    setLoading(false)
    console.log(res)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  // Mappa per il box di anteprima dinamica
  const previewChords: Record<string, string[]> = {
    english: ["C", "F#m", "A", "Gmaj7"],
    italian: ["Do", "Fa#m", "La", "Solmaj7"],
  }

  const fontClasses: Record<string, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-xl font-bold",
  }

  return (
    <div className="w-full h-full p-10 flex flex-col gap-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Impostazioni Applicazione</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Personalizza la tua esperienza di visualizzazione dei brani e l&apos;esecuzione live.
        </p>
      </div>

      <div className="bg-zinc-800 h-0.5 w-full"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonna Opzioni (Sinistra) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. Sistema di Notazione */}
          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center gap-x-2 text-zinc-200 font-bold text-base">
              <Music className="text-orange-500 h-5 w-5" />
              <h3>Sintassi e Notazione Accordi</h3>
            </div>
            <p className="text-xs text-zinc-500">Scegli come preferisci visualizzare le sigle degli accordi nei testi dei tuoi brani.</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setNotation("english")}
                className={`p-4 rounded-xl border text-sm font-semibold transition text-center cursor-pointer ${
                  notation === "english"
                    ? "border-orange-500 bg-orange-500/10 text-orange-400"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                Anglosassone (C, D, E...)
              </button>
              <button
                onClick={() => setNotation("italian")}
                className={`p-4 rounded-xl border text-sm font-semibold transition text-center cursor-pointer ${
                  notation === "italian"
                    ? "border-orange-500 bg-orange-500/10 text-orange-400"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                Latina / Italiana (Do, Re, Mi...)
              </button>
            </div>
          </div>

          {/* 2. Dimensione Font Live */}
          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center gap-x-2 text-zinc-200 font-bold text-base">
              <Type className="text-orange-500 h-5 w-5" />
              <h3>Dimensione Testo di Default (Schermata Live)</h3>
            </div>
            <p className="text-xs text-zinc-500">Imposta la grandezza standard del font di accordi e testo all&apos;apertura di un brano.</p>
            <div className="flex gap-x-2 pt-2">
              {["sm", "md", "lg", "xl"].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase transition cursor-pointer ${
                    fontSize === size
                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Velocità Scorrimento */}
          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between text-zinc-200 font-bold text-base">
              <div className="flex items-center gap-x-2">
                <ArrowUpRight className="text-orange-500 h-5 w-5" />
                <h3>Velocità Auto-Scroll di Partenza</h3>
              </div>
              <span className="text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded text-sm font-mono">{scrollSpeed}x</span>
            </div>
            <p className="text-xs text-zinc-500">Regola il livello di velocità iniziale quando attivi lo scorrimento automatico delle canzoni.</p>
            <input
              type="range"
              min="1"
              max="10"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-full accent-orange-500 bg-zinc-900 h-2 rounded-lg cursor-pointer mt-2"
            />
          </div>

        </div>

        {/* Colonna Anteprima Live (Destra) */}
        <div className="flex flex-col gap-y-4">
          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-zinc-500 font-bold text-xs tracking-wider uppercase">Anteprima Schermo Live</h4>
              <div className="bg-zinc-900/80 rounded-lg p-4 border border-zinc-800 min-h-[160px] flex flex-col justify-center font-mono space-y-3 transition-all">
                {/* Visualizzazione Accordi Dinamici */}
                <div className="text-orange-400 font-bold text-sm tracking-wide space-x-3">
                  {previewChords[notation].map((chord, idx) => (
                    <span key={idx}>{chord}</span>
                  ))}
                </div>
                {/* Visualizzazione Dimensione Testo Dinamica */}
                <p className={`${fontClasses[fontSize]} text-zinc-300 transition-all duration-150`}>
                  Nel mezzo del cammin di nostra vita...
                </p>
              </div>
            </div>

            {/* Pulsanti Azione Finali */}
            <div className="space-y-2 mt-6">
              {success && (
                <div className="flex items-center gap-x-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl justify-center font-semibold">
                  <CheckCircle2 size={14} /> Impostazioni salvate correttamente!
                </div>
              )}
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 rounded-xl transition cursor-pointer"
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? "Salvataggio..." : "Salva Impostazioni"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}