interface ModeSelectorProps {
  numModes: number
  selectedMode: number
  frequencies: number[]
  onSelectMode: (mode: number) => void
}

export function ModeSelector({ numModes, selectedMode, frequencies, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">
        Mode
      </label>
      <select
        value={selectedMode}
        onChange={(e) => onSelectMode(parseInt(e.target.value))}
        className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1.5 text-xs text-[var(--color-text)] cursor-pointer font-mono"
      >
        {Array.from({ length: numModes }, (_, i) => (
          <option key={i} value={i}>
            Mode {i + 1} — {frequencies[i]?.toFixed(2)} Hz
          </option>
        ))}
      </select>
    </div>
  )
}
