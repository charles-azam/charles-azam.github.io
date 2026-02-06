import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FemCanvas } from '../components/fem/FemCanvas'
import { ModeSelector } from '../components/fem/ModeSelector'
import { FrequencyDisplay } from '../components/fem/FrequencyDisplay'
import { solveFrameModal } from '../fem/frame-model'

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

  const modalResult = useMemo(() => solveFrameModal(NUM_MODES), [])

  return (
    <div>
      {/* Hero section */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* FEM Canvas */}
          <div>
            <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] h-[350px]">
              <FemCanvas modalResult={modalResult} selectedMode={selectedMode} />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <ModeSelector
                numModes={Math.min(NUM_MODES, modalResult.frequencies.length)}
                selectedMode={selectedMode}
                onSelectMode={setSelectedMode}
              />
              {modalResult.frequencies[selectedMode] !== undefined && (
                <FrequencyDisplay
                  frequency={modalResult.frequencies[selectedMode]}
                  angularFrequency={modalResult.angularFrequencies[selectedMode]}
                  modeNumber={selectedMode + 1}
                />
              )}
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              Real-time FEM modal analysis of a 3-story steel frame. Euler-Bernoulli beam elements, solved client-side.
            </p>
          </div>

          {/* Intro text */}
          <div className="lg:pl-8">
            <h1 className="text-4xl font-bold text-white mb-4">Charles AZAM</h1>
            <p className="text-lg mb-4">
              I build AI systems for complex engineering and technical problems.
            </p>
            <p className="text-[var(--color-text-muted)] mb-6">
              Currently building open-source tools for AI agents, prediction markets, and technical
              search. Previously led engineering teams at Jimmy Energy, transforming traditional
              workflows into code-driven systems.
            </p>
            <div className="flex gap-4 mb-8">
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
    </div>
  )
}
