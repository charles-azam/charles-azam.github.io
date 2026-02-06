interface ModeSelectorProps {
  numModes: number
  selectedMode: number
  onSelectMode: (mode: number) => void
}

export function ModeSelector({ numModes, selectedMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: numModes }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelectMode(i)}
          className={`px-3 py-1.5 text-sm rounded border transition-colors cursor-pointer ${
            selectedMode === i
              ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
              : 'bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'
          }`}
        >
          Mode {i + 1}
        </button>
      ))}
    </div>
  )
}
