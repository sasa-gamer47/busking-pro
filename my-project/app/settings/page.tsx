// app/settings/page.tsx

import { getUserSettings } from "@/lib/utils/actions"
import SettingsClient from "@/components/SettingsClient"

export default async function SettingsPage() {
  const currentSettings = await getUserSettings()


  // Se l'utente non ha un profilo pronto o non è loggato, usiamo i fallback strutturali
  const fallbackSettings = currentSettings || {
    chord_notation: "english",
    default_font_size: "md",
    default_scroll_speed: 5,
  }

  return (
    <main className="absolute min-h-screen w-4/5 left-1/5 bg-zinc-900 text-zinc-300">
      <SettingsClient initialSettings={fallbackSettings} />
    </main>
  )
}