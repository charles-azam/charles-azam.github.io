import type { FrameModel, FrameConfig, ModalResult, ParticipationData } from './types'
import { DEFAULT_FRAME_CONFIG } from './types'
import { assembleGlobalMatrices } from './assembly'
import { applyBoundaryConditions } from './boundary-conditions'
import { solveEigenvalueProblem } from './eigenvalue-solver'

/**
 * Create a parametric single-bay steel frame with per-story sections.
 *
 * Node layout (example for 3 stories):
 *   7 -------- 8     (roof,   y=3*h)
 *   |          |
 *   5 -------- 6     (floor2, y=2*h)
 *   |          |
 *   3 -------- 4     (floor1, y=h)
 *   |          |
 *   1 -------- 2     (ground, y=0, fixed supports)
 *
 * For N stories: 2*(N+1) nodes, 2*N columns + N beams
 * Total DOFs = 6*(N+1), fixed DOFs = [0,1,2,3,4,5] (nodes 1 & 2)
 */
export function createParametricFrame(config: FrameConfig): FrameModel {
  const { storyHeight, bayWidth, stories } = config
  const numStories = stories.length

  const E = 200e9     // Pa (200 GPa)
  const rho = 7850    // kg/m^3

  const numNodePairs = numStories + 1
  const nodes = []

  for (let level = 0; level < numNodePairs; level++) {
    const y = level * storyHeight
    nodes.push({ id: 2 * level + 1, x: 0, y })
    nodes.push({ id: 2 * level + 2, x: bayWidth, y })
  }

  let elemId = 1
  const elements = []

  // Columns and beams per story, each with its own section
  for (let story = 0; story < numStories; story++) {
    const { columnSection, beamSection } = stories[story]

    const bottomLeft = 2 * story + 1
    const topLeft = 2 * (story + 1) + 1
    const bottomRight = 2 * story + 2
    const topRight = 2 * (story + 1) + 2

    // Left column
    elements.push({
      id: elemId++,
      nodeI: bottomLeft,
      nodeJ: topLeft,
      E,
      A: columnSection.A,
      I: columnSection.I,
      rho,
    })
    // Right column
    elements.push({
      id: elemId++,
      nodeI: bottomRight,
      nodeJ: topRight,
      E,
      A: columnSection.A,
      I: columnSection.I,
      rho,
    })
    // Beam at top of this story
    elements.push({
      id: elemId++,
      nodeI: topLeft,
      nodeJ: topRight,
      E,
      A: beamSection.A,
      I: beamSection.I,
      rho,
    })
  }

  // Fixed supports at ground nodes (nodes 1 and 2)
  const fixedDOFs = [0, 1, 2, 3, 4, 5]

  return {
    nodes,
    elements,
    fixedDOFs,
    totalDOFs: nodes.length * 3,
  }
}

/**
 * Add lumped floor masses to the global mass matrix (per-story floor loads).
 *
 * At each floor level, the mass is:
 *   m_floor = q_i × L_bay × D_trib
 * split equally between the two nodes at that level.
 */
export function addFloorMasses(
  M: number[][],
  config: FrameConfig,
): void {
  const { tributaryDepth, bayWidth, stories } = config

  if (tributaryDepth <= 0) return

  for (let story = 0; story < stories.length; story++) {
    const q = stories[story].floorLoadKgPerM2
    if (q <= 0) continue

    const floorMassTotal = q * bayWidth * tributaryDepth
    const massPerNode = floorMassTotal / 2

    const level = story + 1 // floor level (1-indexed, above ground)
    const leftNodeId = 2 * level + 1
    const rightNodeId = 2 * level + 2

    for (const nodeId of [leftNodeId, rightNodeId]) {
      const dofU = (nodeId - 1) * 3
      const dofV = (nodeId - 1) * 3 + 1
      M[dofU][dofU] += massPerNode
      M[dofV][dofV] += massPerNode
    }
  }
}

/**
 * Compute modal participation factors and effective modal mass for horizontal excitation.
 *
 * gamma_i = (phi_i^T M r) / (phi_i^T M phi_i)
 * M_eff_i = (phi_i^T M r)^2 / (phi_i^T M phi_i)
 *
 * where r is the influence vector: 1 for horizontal DOFs (u), 0 for vertical (v) and rotation (theta).
 */
export function computeParticipationFactors(
  modeShapes: number[][],
  Mff: number[][],
  freeDOFs: number[],
): ParticipationData {
  const n = freeDOFs.length

  const r = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    if (freeDOFs[i] % 3 === 0) {
      r[i] = 1
    }
  }

  let totalMass = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      totalMass += r[i] * Mff[i][j] * r[j]
    }
  }

  const participationFactors: number[] = []
  const effectiveMassRatios: number[] = []

  for (const phi of modeShapes) {
    let phiMphi = 0
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        phiMphi += phi[i] * Mff[i][j] * phi[j]
      }
    }

    let phiMr = 0
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        phiMr += phi[i] * Mff[i][j] * r[j]
      }
    }

    const gamma = phiMr / phiMphi
    const mEff = (phiMr * phiMr) / phiMphi

    participationFactors.push(gamma)
    effectiveMassRatios.push(totalMass > 0 ? mEff / totalMass : 0)
  }

  return { participationFactors, effectiveMassRatios, totalMass }
}

/**
 * Run the full modal analysis on a parametric frame.
 */
export function solveFrameModal(
  numModes: number = 6,
  config: FrameConfig = DEFAULT_FRAME_CONFIG,
): { model: FrameModel; result: ModalResult } {
  const t0 = performance.now()

  const model = createParametricFrame(config)
  const { K, M } = assembleGlobalMatrices(model)

  addFloorMasses(M, config)

  const { Kff, Mff, freeDOFs } = applyBoundaryConditions(K, M, model.fixedDOFs, model.totalDOFs)

  const { eigenvalues, eigenvectors } = solveEigenvalueProblem(Kff, Mff)

  const angularFrequencies = eigenvalues.map((lambda) => Math.sqrt(lambda))
  const frequencies = angularFrequencies.map((omega) => omega / (2 * Math.PI))

  const fullModeShapes = eigenvectors.map((modeShape) => {
    const full = new Array(model.totalDOFs).fill(0)
    for (let i = 0; i < freeDOFs.length; i++) {
      full[freeDOFs[i]] = modeShape[i]
    }
    return full
  })

  const n = Math.min(numModes, frequencies.length)

  const limitedModeShapes = eigenvectors.slice(0, n)
  const participation = computeParticipationFactors(limitedModeShapes, Mff, freeDOFs)

  const solveTimeMs = performance.now() - t0

  return {
    model,
    result: {
      frequencies: frequencies.slice(0, n),
      angularFrequencies: angularFrequencies.slice(0, n),
      modeShapes: limitedModeShapes,
      fullModeShapes: fullModeShapes.slice(0, n),
      participation,
      Mff,
      freeDOFs,
      solveTimeMs,
    },
  }
}
