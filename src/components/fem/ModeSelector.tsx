interface ModeSelectorProps {
  numModes: number
  selectedMode: number
  frequencies: number[]
  onSelectMode: (mode: number) => void
  lang?: string
}

export function ModeSelector({ numModes, selectedMode, frequencies, onSelectMode, lang = 'en' }: ModeSelectorProps) {
  const t = {
    mode: lang === 'fr' ? 'Mode' : 'Mode',
  }
  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">
        {t.mode}
      </label>
      <select
        value={selectedMode}
        onChange={(e) => onSelectMode(parseInt(e.target.value))}
        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1.5 text-xs text-[var(--color-text)] cursor-pointer font-mono"
      >
        {Array.from({ length: numModes }, (_, i) => (
          <option key={i} value={i}>
            {t.mode} {i + 1} — {frequencies[i]?.toFixed(2)} Hz
          </option>
        ))}
      </select>
    </div>
  )
}
