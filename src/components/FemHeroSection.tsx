import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { FemCanvas } from './fem/FemCanvas'
import { ModeSelector } from './fem/ModeSelector'
import { SeismicPanel } from './fem/SeismicPanel'
import { TechnicalOverlay } from './fem/TechnicalOverlay'
import { FrameControls } from './fem/FrameControls'
import { ExcitationControls } from './fem/ExcitationControls'
import { solveFrameModal } from '../fem/frame-model'
import type { FrameConfig } from '../fem/types'
import { DEFAULT_FRAME_CONFIG } from '../fem/types'

const NUM_MODES = 6

export function FemHeroSection({ lang = 'en' }: { lang?: string }) {
  const [selectedMode, setSelectedMode] = useState(0)
  const [frameConfig, setFrameConfig] = useState<FrameConfig>(DEFAULT_FRAME_CONFIG)
  const [showDrawer, setShowDrawer] = useState(false)
  const [excitationMode, setExcitationMode] = useState<'free' | 'excitation'>('free')
  const [excitationFrequency, setExcitationFrequency] = useState(2.0)
  const [amplitudeFactor, setAmplitudeFactor] = useState(5.0)

  const t = {
    configure: lang === 'fr' ? 'Configurer' : 'Configure',
    engineeringDetails: lang === 'fr' ? 'Détails Techniques' : 'Engineering Details',
    close: lang === 'fr' ? 'Fermer' : 'Close',
  }

  // Debounced config for solver
  const [debouncedConfig, setDebouncedConfig] = useState<FrameConfig>(DEFAULT_FRAME_CONFIG)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleConfigChange = useCallback((newConfig: FrameConfig) => {
    setFrameConfig(newConfig)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedConfig(newConfig)
    }, 150)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const { model, result: modalResult } = useMemo(
    () => solveFrameModal(NUM_MODES, debouncedConfig),
    [debouncedConfig],
  )

  // Reset selected mode if it exceeds available modes
  useEffect(() => {
    if (selectedMode >= modalResult.frequencies.length) {
      setSelectedMode(0)
    }
  }, [modalResult.frequencies.length, selectedMode])

  // Close drawer on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowDrawer(false)
    }
    if (showDrawer) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [showDrawer])

  return (
    <>
      <div className="relative border border-[var(--color-border)] rounded-t-lg overflow-hidden bg-[var(--color-bg-secondary)] h-[380px] shadow-sm">
        <FemCanvas
          model={model}
          modalResult={modalResult}
          selectedMode={selectedMode}
          excitationMode={excitationMode}
          excitationFrequency={excitationFrequency}
          amplitudeFactor={amplitudeFactor}
        />
        <TechnicalOverlay model={model} modalResult={modalResult} selectedMode={selectedMode} />
      </div>

      {/* Controls inside the white box */}
      <div className="border border-t-0 border-[var(--color-border)] rounded-b-lg bg-[var(--color-bg-secondary)] px-3 py-3 space-y-3 shadow-sm">
        <div className="flex items-center gap-3">
          <ModeSelector
            numModes={Math.min(NUM_MODES, modalResult.frequencies.length)}
            selectedMode={selectedMode}
            frequencies={modalResult.frequencies}
            onSelectMode={setSelectedMode}
            lang={lang}
          />
          <button
            onClick={() => setShowDrawer(true)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded border cursor-pointer transition-colors border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            title={t.configure}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.295a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.295 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.295A1 1 0 011 11.18V9.82a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.53l1.25.834a6.957 6.957 0 011.416-.587l.295-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            {t.configure}
          </button>
        </div>
        <ExcitationControls
          mode={excitationMode}
          onModeChange={setExcitationMode}
          excitationFrequency={excitationFrequency}
          onFrequencyChange={setExcitationFrequency}
          naturalFrequencies={modalResult.frequencies}
          selectedMode={selectedMode}
          amplitudeFactor={amplitudeFactor}
          onAmplitudeChange={setAmplitudeFactor}
          lang={lang}
        />
      </div>

      {/* Slide-out drawer — seismic analysis + structure parameters */}
      {showDrawer && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
              <h2 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">
                {t.engineeringDetails}
              </h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-lg cursor-pointer px-2"
                title={`${t.close} (Esc)`}
              >
                {'\u2715'}
              </button>
            </div>
            <div className="p-5 space-y-5">
              <SeismicPanel
                modalResult={modalResult}
                selectedMode={selectedMode}
                onSelectMode={setSelectedMode}
                lang={lang}
              />
              <FrameControls
                config={frameConfig}
                onChange={handleConfigChange}
                totalMass={modalResult.participation.totalMass}
                defaultExpanded
                lang={lang}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
