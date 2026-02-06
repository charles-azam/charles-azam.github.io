import type { FrameConfig, SteelSection } from '../../fem/types'
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
      <label className="block text-[10px] text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">
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
  unit: string
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

function SectionProperties({ label, section }: { label: string; section: SteelSection }) {
  return (
    <div className="text-[10px] text-[var(--color-text-muted)] font-mono space-y-0.5">
      <div className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] opacity-60 mb-0.5">{label}: {section.name}</div>
      <div>E = <span className="text-[var(--color-text)]">200 GPa</span></div>
      <div>A = <span className="text-[var(--color-text)]">{formatSI(section.A, 'm\u00B2')}</span></div>
      <div>I = <span className="text-[var(--color-text)]">{formatSI(section.I, 'm\u2074')}</span></div>
    </div>
  )
}

export function FrameControls({ config, onChange, totalMass, defaultExpanded = false }: FrameControlsProps) {
  const [collapsed, setCollapsed] = useState(!defaultExpanded)

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
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SliderControl
              label="Stories"
              value={config.numStories}
              min={2}
              max={6}
              step={1}
              unit=""
              onChange={(v) => onChange({ ...config, numStories: v })}
            />
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
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SectionSelect
              label="Column section"
              sections={COLUMN_SECTIONS}
              selected={config.columnSection}
              onChange={(s) => onChange({ ...config, columnSection: s })}
            />
            <SectionSelect
              label="Beam section"
              sections={BEAM_SECTIONS}
              selected={config.beamSection}
              onChange={(s) => onChange({ ...config, beamSection: s })}
            />
          </div>

          {/* Floor mass (depth / tributary) */}
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] opacity-60 mb-2">
              Floor mass (3D {'\u2192'} 2D reduction)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SliderControl
                label="Floor load"
                value={config.floorLoadKgPerM2}
                min={0}
                max={1200}
                step={50}
                unit=" kg/m\u00B2"
                onChange={(v) => onChange({ ...config, floorLoadKgPerM2: v })}
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
            {config.floorLoadKgPerM2 > 0 && config.tributaryDepth > 0 && (
              <div className="mt-2 text-[10px] text-[var(--color-text-muted)] font-mono">
                m<sub>floor</sub> = {config.floorLoadKgPerM2} {'\u00D7'} {config.bayWidth.toFixed(1)} {'\u00D7'} {config.tributaryDepth.toFixed(1)} = <span className="text-[var(--color-text)]">{(config.floorLoadKgPerM2 * config.bayWidth * config.tributaryDepth / 1000).toFixed(1)} t/level</span>
              </div>
            )}
          </div>

          {/* Mechanical properties */}
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="grid grid-cols-3 gap-3">
              <SectionProperties label="Columns" section={config.columnSection} />
              <SectionProperties label="Beams" section={config.beamSection} />
              <div className="text-[10px] text-[var(--color-text-muted)] font-mono space-y-0.5">
                <div className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] opacity-60 mb-0.5">Structure</div>
                <div>{'\u03C1'} = <span className="text-[var(--color-text)]">7850 kg/m{'\u00B3'}</span></div>
                <div>M<sub>tot</sub> = <span className="text-[var(--color-accent)]">{totalMass >= 1000 ? `${(totalMass / 1000).toFixed(2)} t` : `${totalMass.toFixed(0)} kg`}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
