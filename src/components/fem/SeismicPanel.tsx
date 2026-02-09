import type { ModalResult } from '../../fem/types'

interface SeismicPanelProps {
  modalResult: ModalResult
  selectedMode: number
  onSelectMode: (mode: number) => void
  lang?: string
}

export function SeismicPanel({ modalResult, selectedMode, onSelectMode, lang = 'en' }: SeismicPanelProps) {
  const t = {
    title: lang === 'fr' ? 'Analyse Modale Sismique' : 'Seismic Modal Analysis',
    massCaptured: lang === 'fr' ? 'de masse captée' : 'mass captured',
    mode: lang === 'fr' ? 'Mode' : 'Mode',
    description: lang === 'fr' 
      ? "En génie parasismique, l'analyse modale révèle comment un bâtiment répond aux mouvements du sol. Une participation plus élevée = une contribution sismique plus forte. Les normes exigent de capter \u226590% de la masse totale."
      : "In earthquake engineering, modal analysis reveals how a building responds to ground motion. Higher participation = stronger seismic contribution. Codes require capturing \u226590% of total mass.",
  }
  const { frequencies, participation } = modalResult
  const { participationFactors, effectiveMassRatios } = participation
  const cumulativeMass = effectiveMassRatios.reduce((sum, r) => sum + r, 0)

  return (
    <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">
          {t.title}
        </h3>
        <span className="text-xs text-[var(--color-text-muted)]">
          {(cumulativeMass * 100).toFixed(0)}% {t.massCaptured}
        </span>
      </div>

      {/* Mode table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
              <th className="text-left py-1.5 pr-2">{t.mode}</th>
              <th className="text-right py-1.5 px-2">f (Hz)</th>
              <th className="text-right py-1.5 px-2">T (s)</th>
              <th className="text-right py-1.5 px-2">{'\u03B3'}</th>
              <th className="text-left py-1.5 px-2 min-w-[120px]">
                M<sub>eff</sub> / M<sub>tot</sub>
              </th>
            </tr>
          </thead>
          <tbody>
            {frequencies.map((f, i) => {
              const isSelected = i === selectedMode
              const gamma = participationFactors[i]
              const massRatio = effectiveMassRatios[i]
              const barWidth = Math.min(Math.abs(massRatio) * 100, 100)

              return (
                <tr
                  key={i}
                  onClick={() => onSelectMode(i)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-accent)]/10'
                      : 'hover:bg-[var(--color-accent)]/5'
                  }`}
                >
                  <td className="py-1.5 pr-2">
                    <span
                      className={`inline-block w-5 h-5 rounded text-center leading-5 text-xs font-medium ${
                        isSelected
                          ? 'bg-[var(--color-accent)] text-white '
                          : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className={`text-right py-1.5 px-2 font-mono ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}`}>
                    {f.toFixed(2)}
                  </td>
                  <td className="text-right py-1.5 px-2 font-mono text-[var(--color-text-muted)]">
                    {(1 / f).toFixed(3)}
                  </td>
                  <td className="text-right py-1.5 px-2 font-mono text-[var(--color-text-muted)]">
                    {gamma.toFixed(2)}
                  </td>
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-[var(--color-border)] rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all duration-300"
                          style={{
                            width: `${barWidth}%`,
                            backgroundColor: isSelected
                              ? 'var(--color-accent)'
                              : massRatio > 0.05
                                ? 'var(--color-accent)'
                                : 'var(--color-text-muted)',
                            opacity: isSelected ? 1 : 0.7,
                          }}
                        />
                      </div>
                      <span className="text-[var(--color-text-muted)] font-mono w-10 text-right">
                        {(massRatio * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[10px] text-[var(--color-text-muted)] leading-relaxed italic">
        {t.description}
      </p>
    </div>
  )
}
