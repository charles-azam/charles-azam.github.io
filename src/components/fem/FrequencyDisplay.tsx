interface FrequencyDisplayProps {
  frequency: number    // Hz
  angularFrequency: number  // rad/s
  modeNumber: number
}

export function FrequencyDisplay({ frequency, angularFrequency, modeNumber }: FrequencyDisplayProps) {
  return (
    <div className="text-sm text-[var(--color-text-muted)] space-y-1">
      <p>
        <span className="text-white font-medium">Mode {modeNumber}:</span>{' '}
        f = <span className="text-[var(--color-accent)]">{frequency.toFixed(2)} Hz</span>
      </p>
      <p className="text-xs">
        {'\u03C9'} = {angularFrequency.toFixed(2)} rad/s
      </p>
    </div>
  )
}
