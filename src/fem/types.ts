export interface Node {
  id: number
  x: number
  y: number
}

export interface BeamElement {
  id: number
  nodeI: number
  nodeJ: number
  E: number      // Young's modulus (Pa)
  A: number      // Cross-sectional area (m^2)
  I: number      // Second moment of area (m^4)
  rho: number    // Density (kg/m^3)
}

export interface ParticipationData {
  participationFactors: number[]   // gamma_i per mode (horizontal direction)
  effectiveMassRatios: number[]    // M_eff_i / M_total per mode
  totalMass: number                // Total structural mass (kg)
}

export interface ModalResult {
  frequencies: number[]            // Natural frequencies in Hz
  angularFrequencies: number[]     // Angular frequencies in rad/s
  modeShapes: number[][]           // Each mode shape is a vector of displacements for free DOFs
  fullModeShapes: number[][]       // Mode shapes expanded to all DOFs (including fixed = 0)
  participation: ParticipationData
  Mff: number[][]                  // Free-DOF mass matrix (needed for participation computation)
  freeDOFs: number[]               // Indices of free DOFs
  solveTimeMs: number              // Wall-clock time for the solve
}

export interface FrameModel {
  nodes: Node[]
  elements: BeamElement[]
  fixedDOFs: number[]  // Indices of fixed DOFs in the global system
  totalDOFs: number
}

export interface SteelSection {
  name: string
  A: number   // m^2
  I: number   // m^4
}

/**
 * Per-story configuration.
 * Story i connects level i (bottom) to level i+1 (top).
 * - columnSection: the two columns in this story (lateral stiffness)
 * - beamSection: the beam at the top of this story (floor stiffness)
 * - floorLoadKgPerM2: mass at the top level of this story
 */
export interface StoryConfig {
  columnSection: SteelSection
  beamSection: SteelSection
  floorLoadKgPerM2: number  // kg/m²
}

export interface FrameConfig {
  storyHeight: number      // m (2.5-4.5) — uniform for simplicity
  bayWidth: number         // m (3-6)
  tributaryDepth: number   // m — depth of building tributary to this frame
  stories: StoryConfig[]   // one entry per story (length = numStories)
}

export const COLUMN_SECTIONS: SteelSection[] = [
  { name: 'HEB 160', A: 54.3e-4, I: 2492e-8 },
  { name: 'HEB 200', A: 78.1e-4, I: 5696e-8 },
  { name: 'HEB 260', A: 118.4e-4, I: 14920e-8 },
  { name: 'HEB 300', A: 149.1e-4, I: 25170e-8 },
]

export const BEAM_SECTIONS: SteelSection[] = [
  { name: 'IPE 240', A: 39.1e-4, I: 3892e-8 },
  { name: 'IPE 300', A: 53.8e-4, I: 8356e-8 },
  { name: 'IPE 360', A: 72.7e-4, I: 16270e-8 },
  { name: 'IPE 400', A: 84.5e-4, I: 23130e-8 },
]

export const DEFAULT_STORY_CONFIG: StoryConfig = {
  columnSection: COLUMN_SECTIONS[1], // HEB 200
  beamSection: BEAM_SECTIONS[1],     // IPE 300
  floorLoadKgPerM2: 500,             // ~20cm concrete slab + finishes + live load
}

export const DEFAULT_FRAME_CONFIG: FrameConfig = {
  storyHeight: 3.0,
  bayWidth: 4.0,
  tributaryDepth: 4.0,
  stories: [
    { ...DEFAULT_STORY_CONFIG },
    { ...DEFAULT_STORY_CONFIG },
    { ...DEFAULT_STORY_CONFIG },
  ],
}
