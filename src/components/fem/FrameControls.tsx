import type { ReactNode } from 'react'
import type { FrameConfig, StoryConfig, SteelSection } from '../../fem/types'
import { COLUMN_SECTIONS, BEAM_SECTIONS } from '../../fem/types'
import { useState } from 'react'

interface FrameControlsProps {
  config: FrameConfig
  onChange: (config: FrameConfig) => void
  totalMass: number
  defaultExpanded?: boolean
}

function SectionSelect({
  label,
  sections,
  selected,
  onChange,
}: {
  label: string
  sections: SteelSection[]
  selected: SteelSection
  onChange: (section: SteelSection) => void
}) {
  return (
    <div>
      <label className="block text-[10px] text-[var(--color-text-muted)] mb-0.5 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={selected.name}
        onChange={(e) => {
          const section = sections.find((s) => s.name === e.target.value)
          if (section) onChange(section)
        }}
        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-2 py-1 text-xs text-[var(--color-text)] cursor-pointer"
      >
        {sections.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: ReactNode
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs font-mono text-[var(--color-accent)]">
          {Number.isInteger(value) ? value : value.toFixed(1)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-[var(--color-border)] rounded appearance-none cursor-pointer accent-[var(--color-accent)]"
      />
    </div>
  )
}

function formatSI(value: number, unit: string): string {
  if (Math.abs(value) >= 1) return `${value.toFixed(1)} ${unit}`
  if (Math.abs(value) >= 1e-2) return `${(value * 1e2).toFixed(1)} c${unit}`
  if (Math.abs(value) >= 1e-4) return `${(value * 1e4).toFixed(2)} ${unit === 'm\u00B2' ? 'cm\u00B2' : 'cm\u2074'}`
  return `${value.toExponential(2)} ${unit}`
}

function StoryRow({
  index,
  story,
  numStories,
  bayWidth,
  tributaryDepth,
  onChange,
}: {
  index: number
  story: StoryConfig
  numStories: number
  bayWidth: number
  tributaryDepth: number
  onChange: (updated: StoryConfig) => void
}) {
  const levelLabel = index === numStories - 1 ? 'Roof' : `Level ${index + 1}`
  const floorMass = story.floorLoadKgPerM2 * bayWidth * tributaryDepth

  return (
    <div className="border border-[var(--color-border)] rounded p-3 space-y-2">
      {/* Story header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white">
          Story {index + 1}
          <span className="text-[var(--color-text-muted)] font-normal ml-1.5">
            {'\u2192'} {levelLabel}
          </span>
        </span>
        {tributaryDepth > 0 && story.floorLoadKgPerM2 > 0 && (
          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
            {(floorMass / 1000).toFixed(1)}t
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-2 gap-2">
        <SectionSelect
          label="Columns (stiffness)"
          sections={COLUMN_SECTIONS}
          selected={story.columnSection}
          onChange={(s) => onChange({ ...story, columnSection: s })}
        />
        <SectionSelect
          label="Beam (floor)"
          sections={BEAM_SECTIONS}
          selected={story.beamSection}
          onChange={(s) => onChange({ ...story, beamSection: s })}
        />
      </div>

      {/* Properties compact view */}
      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-[var(--color-text-muted)]">
        <div>
          I<sub>col</sub> = <span className="text-[var(--color-text)]">{formatSI(story.columnSection.I, 'm\u2074')}</span>
        </div>
        <div>
          I<sub>beam</sub> = <span className="text-[var(--color-text)]">{formatSI(story.beamSection.I, 'm\u2074')}</span>
        </div>
      </div>

      {/* Floor mass slider */}
      <SliderControl
        label="Floor mass"
        value={story.floorLoadKgPerM2}
        min={0}
        max={1200}
        step={50}
        unit={<> kg/m<sup>2</sup></>}
        onChange={(v) => onChange({ ...story, floorLoadKgPerM2: v })}
      />
    </div>
  )
}

export function FrameControls({ config, onChange, totalMass, defaultExpanded = false }: FrameControlsProps) {
  const [collapsed, setCollapsed] = useState(!defaultExpanded)
  const numStories = config.stories.length

  function updateStory(index: number, updated: StoryConfig) {
    const newStories = [...config.stories]
    newStories[index] = updated
    onChange({ ...config, stories: newStories })
  }

  function addStory() {
    if (numStories >= 6) return
    // Copy the top story's config for the new one
    const topStory = config.stories[numStories - 1]
    onChange({ ...config, stories: [...config.stories, { ...topStory }] })
  }

  function removeStory() {
    if (numStories <= 2) return
    onChange({ ...config, stories: config.stories.slice(0, -1) })
  }

  return (
    <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
      >
        <span>Structure Parameters</span>
        <span className="text-sm">{collapsed ? '\u25BC' : '\u25B2'}</span>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-border)]">
          {/* Global geometry */}
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SliderControl
              label="Story height"
              value={config.storyHeight}
              min={2.5}
              max={4.5}
              step={0.5}
              unit="m"
              onChange={(v) => onChange({ ...config, storyHeight: v })}
            />
            <SliderControl
              label="Bay width"
              value={config.bayWidth}
              min={3}
              max={6}
              step={0.5}
              unit="m"
              onChange={(v) => onChange({ ...config, bayWidth: v })}
            />
            <SliderControl
              label="Tributary depth"
              value={config.tributaryDepth}
              min={0}
              max={8}
              step={0.5}
              unit="m"
              onChange={(v) => onChange({ ...config, tributaryDepth: v })}
            />
          </div>

          {/* Add / remove floors */}
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                Floors ({numStories} stories)
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={removeStory}
                  disabled={numStories <= 2}
                  className="px-2 py-0.5 text-xs rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Remove floor
                </button>
                <button
                  onClick={addStory}
                  disabled={numStories >= 6}
                  className="px-2 py-0.5 text-xs rounded border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Add floor
                </button>
              </div>
            </div>

            {/* Per-story configs — top to bottom (roof first) */}
            <div className="space-y-2">
              {config.stories.map((_, i) => {
                const displayIndex = numStories - 1 - i
                return (
                  <StoryRow
                    key={displayIndex}
                    index={displayIndex}
                    story={config.stories[displayIndex]}
                    numStories={numStories}
                    bayWidth={config.bayWidth}
                    tributaryDepth={config.tributaryDepth}
                    onChange={(updated) => updateStory(displayIndex, updated)}
                  />
                )
              })}
            </div>
          </div>

          {/* Total mass summary */}
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[var(--color-text-muted)]">{'\u03C1'}<sub>steel</sub> = 7850 kg/m{'\u00B3'}</span>
              <span className="text-[var(--color-text-muted)]">
                M<sub>tot</sub> = <span className="text-[var(--color-accent)] font-semibold">{totalMass >= 1000 ? `${(totalMass / 1000).toFixed(2)} t` : `${totalMass.toFixed(0)} kg`}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
