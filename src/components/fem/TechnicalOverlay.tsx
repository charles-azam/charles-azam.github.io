import type { FrameModel, ModalResult } from '../../fem/types'

interface TechnicalOverlayProps {
  model: FrameModel
  modalResult: ModalResult
  selectedMode: number
}

export function TechnicalOverlay({ model, modalResult, selectedMode }: TechnicalOverlayProps) {
  const numFreeDOFs = model.totalDOFs - model.fixedDOFs.length
  const numElements = model.elements.length
  const freq = modalResult.frequencies[selectedMode]
  const gamma = modalResult.participation.participationFactors[selectedMode]
  const massRatio = modalResult.participation.effectiveMassRatios[selectedMode]

  return (
    <div className="absolute left-0 top-0 bottom-0 w-[125px] p-3 flex flex-col justify-between pointer-events-none font-mono">
      {/* Mode values */}
      <div className="space-y-1">
        <div className="text-[9px] text-[var(--color-accent)] font-semibold uppercase tracking-wider">
          Mode {selectedMode + 1}
        </div>
        <div className="text-[10px] space-y-0.5">
          <div>
            <span className="text-[var(--color-text-muted)]">f = </span>
            <span className="text-[var(--color-text)]">{freq.toFixed(2)}</span>
            <span className="text-[var(--color-text-muted)]"> Hz</span>
          </div>
          <div>
            <span className="text-[var(--color-text-muted)]">T = </span>
            <span className="text-[var(--color-text)]">{(1 / freq).toFixed(3)}</span>
            <span className="text-[var(--color-text-muted)]"> s</span>
          </div>
          <div>
            <span className="text-[var(--color-text-muted)]">{'\u03B3'} = </span>
            <span className="text-[var(--color-text)]">{gamma.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[var(--color-text-muted)]">M<sub>eff</sub>/M<sub>tot</sub> = </span>
            <span className="text-[var(--color-text)]">{(massRatio * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-[var(--color-text-muted)]">{'\u03C9'} = </span>
            <span className="text-[var(--color-text)]">{modalResult.angularFrequencies[selectedMode].toFixed(1)}</span>
            <span className="text-[var(--color-text-muted)]"> rad/s</span>
          </div>
        </div>
      </div>

      {/* Equations & stats */}
      <div className="space-y-1.5">
        <div className="text-[8px] text-[var(--color-text)]/50 space-y-0.5">
          <div>K{'\u03C6'} = {'\u03C9'}{'\u00B2'}M{'\u03C6'}</div>
          <div>{'\u03B3'} = {'\u03C6'}{'\u1D40'}Mr / {'\u03C6'}{'\u1D40'}M{'\u03C6'}</div>
          <div>D = 1/|1{'\u2212'}(f<sub>e</sub>/f<sub>i</sub>){'\u00B2'}|</div>
        </div>
        <div className="text-[8px] text-[var(--color-text-muted)]">
          {numFreeDOFs} DOFs {'\u00B7'} {numElements} elem
          <br />
          {modalResult.solveTimeMs.toFixed(1)}ms
        </div>
      </div>
    </div>
  )
}
