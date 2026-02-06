import type { FrameModel, ModalResult } from '../../fem/types'

interface TechnicalOverlayProps {
  model: FrameModel
  modalResult: ModalResult
  visible: boolean
}

export function TechnicalOverlay({ model, modalResult, visible }: TechnicalOverlayProps) {
  if (!visible) return null

  const numFreeDOFs = model.totalDOFs - model.fixedDOFs.length
  const numElements = model.elements.length

  return (
    <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-sm rounded-lg px-3 py-2 text-[10px] font-mono text-[var(--color-text-muted)] space-y-1.5 pointer-events-none max-w-[260px]">
      {/* Stats */}
      <div>
        <span className="text-white">{numFreeDOFs}</span> DOFs |{' '}
        <span className="text-white">{numElements}</span> elements |{' '}
        Solved in <span className="text-[var(--color-accent)]">{modalResult.solveTimeMs.toFixed(1)}ms</span>
      </div>

      {/* Separator */}
      <div className="border-t border-white/10" />

      {/* Equations */}
      <div className="space-y-1 text-[9px] leading-relaxed">
        <div>
          <span className="text-[var(--color-text-muted)] opacity-60">Eigenvalue problem:</span>
          <br />
          <span className="text-white/80">K{'\u03C6'} = {'\u03C9'}{'\u00B2'}M{'\u03C6'}</span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] opacity-60">Participation factor:</span>
          <br />
          <span className="text-white/80">{'\u03B3'}<sub>i</sub> = {'\u03C6'}<sub>i</sub><sup>T</sup>Mr / {'\u03C6'}<sub>i</sub><sup>T</sup>M{'\u03C6'}<sub>i</sub></span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] opacity-60">Effective modal mass:</span>
          <br />
          <span className="text-white/80">M<sub>eff,i</sub> = ({'\u03C6'}<sub>i</sub><sup>T</sup>Mr){'\u00B2'} / {'\u03C6'}<sub>i</sub><sup>T</sup>M{'\u03C6'}<sub>i</sub></span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] opacity-60">Floor lumped mass (2D reduction):</span>
          <br />
          <span className="text-white/80">M = M<sub>frame</sub> + {'\u03A3'} q{'\u00B7'}L{'\u00B7'}D<sub>trib</sub></span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] opacity-60">Amplification (excitation):</span>
          <br />
          <span className="text-white/80">D<sub>i</sub> = 1 / |1 {'\u2212'} (f<sub>exc</sub>/f<sub>i</sub>){'\u00B2'}|</span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] opacity-60">Hermite interpolation:</span>
          <br />
          <span className="text-white/80">v({'\u03BE'}) = N<sub>1</sub>v<sub>i</sub> + N<sub>2</sub>{'\u03B8'}<sub>i</sub> + N<sub>3</sub>v<sub>j</sub> + N<sub>4</sub>{'\u03B8'}<sub>j</sub></span>
        </div>
      </div>
    </div>
  )
}
