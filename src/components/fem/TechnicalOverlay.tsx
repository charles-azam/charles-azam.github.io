import type { FrameModel, ModalResult } from '../../fem/types'

interface TechnicalOverlayProps {
  model: FrameModel
  modalResult: ModalResult
}

export function TechnicalOverlay({ model, modalResult }: TechnicalOverlayProps) {
  const numFreeDOFs = model.totalDOFs - model.fixedDOFs.length
  const numElements = model.elements.length

  return (
    <div className="border border-t-0 border-[var(--color-border)] rounded-b-lg bg-[var(--color-bg-secondary)] px-3 py-2 font-mono text-[var(--color-text-muted)] flex items-center justify-between gap-4 flex-wrap">
      {/* Stats */}
      <div className="text-[10px]">
        <span className="text-white">{numFreeDOFs}</span> DOFs |{' '}
        <span className="text-white">{numElements}</span> elements |{' '}
        Solved in <span className="text-[var(--color-accent)]">{modalResult.solveTimeMs.toFixed(1)}ms</span>
      </div>

      {/* Equations — compact inline */}
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[9px]">
        <span>
          <span className="opacity-50">Eigenvalue</span>{' '}
          <span className="text-white/70">K{'\u03C6'} = {'\u03C9'}{'\u00B2'}M{'\u03C6'}</span>
        </span>
        <span>
          <span className="opacity-50">{'\u03B3'}<sub>i</sub></span>{' '}
          <span className="text-white/70">= {'\u03C6'}<sup>T</sup>Mr / {'\u03C6'}<sup>T</sup>M{'\u03C6'}</span>
        </span>
        <span>
          <span className="opacity-50">D<sub>i</sub></span>{' '}
          <span className="text-white/70">= 1/|1{'\u2212'}(f<sub>exc</sub>/f<sub>i</sub>){'\u00B2'}|</span>
        </span>
      </div>
    </div>
  )
}
