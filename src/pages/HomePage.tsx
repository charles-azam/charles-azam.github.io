import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FemCanvas } from '../components/fem/FemCanvas'
import { ModeSelector } from '../components/fem/ModeSelector'
import { SeismicPanel } from '../components/fem/SeismicPanel'
import { TechnicalOverlay } from '../components/fem/TechnicalOverlay'
import { FrameControls } from '../components/fem/FrameControls'
import { ExcitationControls } from '../components/fem/ExcitationControls'
import { solveFrameModal } from '../fem/frame-model'
import type { FrameConfig } from '../fem/types'
import { DEFAULT_FRAME_CONFIG } from '../fem/types'

const NUM_MODES = 6

const featuredProjects = [
  {
    title: 'Jimmy Energy: Engineering-as-Code Transformation',
    url: '/projects',
    description: 'Led transformation of traditional engineering company to Git-based workflow.',
  },
  {
    title: 'OmniAgents',
    url: 'https://github.com/charles-azam/OmniAgents',
    description: 'Unified interface for building AI coding agents across multiple environments.',
  },
  {
    title: 'Predibench',
    url: 'https://predibench.com',
    description: 'Live platform benchmarking AI models on real-world prediction markets.',
  },
]

export function HomePage() {
  const [selectedMode, setSelectedMode] = useState(0)
  const [frameConfig, setFrameConfig] = useState<FrameConfig>(DEFAULT_FRAME_CONFIG)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [excitationMode, setExcitationMode] = useState<'free' | 'excitation'>('free')
  const [excitationFrequency, setExcitationFrequency] = useState(2.0)
  const [amplitudeFactor, setAmplitudeFactor] = useState(5.0)

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
    <div>
      {/* Hero section */}
      <section className="mx-auto max-w-5xl px-6 py-8">
        {/* Title bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">
            Earthquake Modal Analysis
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`px-2 py-1 text-[10px] rounded border cursor-pointer transition-colors ${
                showOverlay
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
              }`}
              title="Technical info"
            >
              Equations
            </button>
            <button
              onClick={() => setShowDrawer(true)}
              className="px-2.5 py-1 text-[10px] rounded border cursor-pointer transition-colors border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
              title="Seismic analysis details & structure parameters"
            >
              Engineering Details
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* FEM Canvas */}
          <div>
            <div className="relative border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] h-[380px]">
              <FemCanvas
                model={model}
                modalResult={modalResult}
                selectedMode={selectedMode}
                excitationMode={excitationMode}
                excitationFrequency={excitationFrequency}
                amplitudeFactor={amplitudeFactor}
              />
              <TechnicalOverlay
                model={model}
                modalResult={modalResult}
                visible={showOverlay}
              />
            </div>

            {/* Controls below canvas */}
            <div className="mt-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <ModeSelector
                  numModes={Math.min(NUM_MODES, modalResult.frequencies.length)}
                  selectedMode={selectedMode}
                  onSelectMode={setSelectedMode}
                />
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
              />
            </div>
          </div>

          {/* Intro text */}
          <div className="lg:pl-4">
            <h1 className="text-4xl font-bold text-white mb-4">Charles AZAM</h1>
            <p className="text-[15px] leading-relaxed mb-4 text-[var(--color-text)]">
              Structural engineer turned AI builder. The frame on the left is a real finite element
              solver running in your browser — assembling stiffness matrices, solving eigenvalue
              problems, rendering mode shapes. I bring the same engineering rigor to AI systems.
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Currently building open-source tools for AI agents, prediction markets, and technical
              search. Previously led engineering teams at Jimmy Energy, transforming traditional
              workflows into code-driven systems.
            </p>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.linkedin.com/in/charles-azam-a4223b135/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/charles-azam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://huggingface.co/charles-azam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
              >
                HuggingFace
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-5xl px-6 py-10 border-t border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold text-white mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target={project.url.startsWith('/') ? undefined : '_blank'}
              rel={project.url.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="block p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors group"
            >
              <h3 className="text-white font-medium mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">{project.description}</p>
            </a>
          ))}
        </div>
        <div className="mt-6">
          <Link
            to="/projects"
            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            View all projects &rarr;
          </Link>
        </div>
      </section>

      {/* Writing */}
      <section className="mx-auto max-w-5xl px-6 py-10 border-t border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold text-white mb-6">Writing</h2>
        <div className="space-y-4">
          <Link
            to="/blog/rag"
            className="block text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            Evaluate Your Own RAG: Why Best Practices Failed Us
          </Link>
          <Link
            to="/blog/predibench"
            className="block text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            PrediBench: Testing AI Models on Prediction Markets
          </Link>
          <Link
            to="/manifesto"
            className="block text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            Engineering-as-Code Manifesto
          </Link>
        </div>
      </section>

      {/* Slide-out drawer — seismic analysis + structure parameters */}
      {showDrawer && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Engineering Details
              </h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-[var(--color-text-muted)] hover:text-white transition-colors text-lg cursor-pointer px-2"
                title="Close (Esc)"
              >
                {'\u2715'}
              </button>
            </div>
            <div className="p-5 space-y-5">
              <SeismicPanel
                modalResult={modalResult}
                selectedMode={selectedMode}
                onSelectMode={setSelectedMode}
              />
              <FrameControls
                config={frameConfig}
                onChange={handleConfigChange}
                totalMass={modalResult.participation.totalMass}
                defaultExpanded
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
