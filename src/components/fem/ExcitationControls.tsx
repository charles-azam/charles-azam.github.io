interface ExcitationControlsProps {
  mode: 'free' | 'excitation'
  onModeChange: (mode: 'free' | 'excitation') => void
  excitationFrequency: number
  onFrequencyChange: (freq: number) => void
  naturalFrequencies: number[]
  selectedMode: number
  amplitudeFactor: number
  onAmplitudeChange: (factor: number) => void
}

export function ExcitationControls({
  mode,
  onModeChange,
  excitationFrequency,
  onFrequencyChange,
  naturalFrequencies,
  selectedMode,
  amplitudeFactor,
  onAmplitudeChange,
}: ExcitationControlsProps) {
  // Check if excitation frequency is near any natural frequency
  const nearResonance = naturalFrequencies.findIndex(
    (f) => Math.abs(excitationFrequency - f) / f < 0.08,
  )

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex rounded-md overflow-hidden border border-[var(--color-border)] w-fit">
        <button
          onClick={() => onModeChange('free')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            mode === 'free'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-transparent text-[var(--color-text-muted)] hover:text-white'
          }`}
        >
          Free Vibration
        </button>
        <button
          onClick={() => onModeChange('excitation')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            mode === 'excitation'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-transparent text-[var(--color-text-muted)] hover:text-white'
          }`}
        >
          Base Excitation
        </button>
      </div>

      {/* Amplitude factor */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
            Displacement scale
          </label>
          <span className="text-xs font-mono text-[var(--color-accent)]">
            {'\u00D7'}{amplitudeFactor.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min={0.2}
          max={5.0}
          step={0.1}
          value={amplitudeFactor}
          onChange={(e) => onAmplitudeChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-[var(--color-border)] rounded appearance-none cursor-pointer accent-[var(--color-accent)]"
        />
      </div>

      {/* Excitation frequency slider */}
      {mode === 'excitation' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
              Excitation frequency
            </label>
            <span className="text-xs font-mono text-[var(--color-accent)]">
              {excitationFrequency.toFixed(1)} Hz
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={15}
            step={0.1}
            value={excitationFrequency}
            onChange={(e) => onFrequencyChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-[var(--color-border)] rounded appearance-none cursor-pointer accent-[var(--color-accent)]"
          />
          {/* Frequency markers for natural frequencies */}
          <div className="relative h-2 mt-0.5">
            {naturalFrequencies.map((f, i) => {
              const pos = ((f - 0.5) / (15 - 0.5)) * 100
              if (pos < 0 || pos > 100) return null
              return (
                <div
                  key={i}
                  className="absolute top-0 w-px h-2"
                  style={{
                    left: `${pos}%`,
                    backgroundColor: i === selectedMode ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    opacity: i === selectedMode ? 1 : 0.4,
                  }}
                  title={`f${i + 1} = ${f.toFixed(2)} Hz`}
                />
              )
            })}
          </div>
          {nearResonance >= 0 && (
            <div className="text-[10px] text-amber-400 mt-1 font-medium">
              Near resonance with Mode {nearResonance + 1}!
            </div>
          )}
        </div>
      )}

      {/* Mode selector for free vibration */}
      {mode === 'free' && (
        <div className="text-[10px] text-[var(--color-text-muted)]">
          Showing Mode {selectedMode + 1} | f = {naturalFrequencies[selectedMode]?.toFixed(2)} Hz
        </div>
      )}
    </div>
  )
}
