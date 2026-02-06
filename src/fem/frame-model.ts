import type { FrameModel, FrameConfig, ModalResult, ParticipationData } from './types'
import { DEFAULT_FRAME_CONFIG } from './types'
import { assembleGlobalMatrices } from './assembly'
import { applyBoundaryConditions } from './boundary-conditions'
import { solveEigenvalueProblem } from './eigenvalue-solver'

/**
 * Create a parametric single-bay steel frame with N stories.
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
  const { numStories, storyHeight, bayWidth, columnSection, beamSection } = config

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

  // Columns: connect each level to the one above
  for (let story = 0; story < numStories; story++) {
    const bottomLeft = 2 * story + 1
    const topLeft = 2 * (story + 1) + 1
    const bottomRight = 2 * story + 2
    const topRight = 2 * (story + 1) + 2

    elements.push({
      id: elemId++,
      nodeI: bottomLeft,
      nodeJ: topLeft,
      E,
      A: columnSection.A,
      I: columnSection.I,
      rho,
    })
    elements.push({
      id: elemId++,
      nodeI: bottomRight,
      nodeJ: topRight,
      E,
      A: columnSection.A,
      I: columnSection.I,
      rho,
    })
  }

  // Beams: connect left and right nodes at each level above ground
  for (let story = 1; story <= numStories; story++) {
    const left = 2 * story + 1
    const right = 2 * story + 2
    elements.push({
      id: elemId++,
      nodeI: left,
      nodeJ: right,
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
 * Add lumped floor masses to the global mass matrix.
 *
 * In a real building, the seismic mass comes mostly from floor slabs, not the frame itself.
 * The 2D frame model represents one frame slice; the tributary depth defines how much
 * floor area feeds mass into this frame.
 *
 * At each floor level (above ground), the total floor mass is:
 *   m_floor = q × L_bay × D_trib
 * where q = floor load (kg/m²), L_bay = bay width, D_trib = tributary depth.
 *
 * This mass is split equally between the two nodes at that level and added
 * to the translational DOFs (u and v). Rotational DOF gets no lumped mass.
 *
 * The stiffness matrix K is NOT modified — the frame provides all lateral stiffness.
 * Only M changes: M_total = M_frame + M_floor
 */
export function addFloorMasses(
  M: number[][],
  config: FrameConfig,
): void {
  const { floorLoadKgPerM2, tributaryDepth, bayWidth, numStories } = config

  if (floorLoadKgPerM2 <= 0 || tributaryDepth <= 0) return

  const floorMassTotal = floorLoadKgPerM2 * bayWidth * tributaryDepth // kg per floor level
  const massPerNode = floorMassTotal / 2 // split between left and right nodes

  // Floor levels are at y = storyHeight, 2*storyHeight, ..., numStories*storyHeight
  // (not ground level — ground nodes are fixed anyway)
  for (let level = 1; level <= numStories; level++) {
    const leftNodeId = 2 * level + 1
    const rightNodeId = 2 * level + 2

    // Add lumped mass to u and v DOFs (horizontal and vertical translation)
    for (const nodeId of [leftNodeId, rightNodeId]) {
      const dofU = (nodeId - 1) * 3     // horizontal
      const dofV = (nodeId - 1) * 3 + 1 // vertical
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

  // Influence vector r: 1 for horizontal DOFs (index % 3 === 0), 0 otherwise
  // In the free DOF space
  const r = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    if (freeDOFs[i] % 3 === 0) {
      r[i] = 1
    }
  }

  // Compute total mass: r^T M r
  let totalMass = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      totalMass += r[i] * Mff[i][j] * r[j]
    }
  }

  const participationFactors: number[] = []
  const effectiveMassRatios: number[] = []

  for (const phi of modeShapes) {
    // phi^T M phi
    let phiMphi = 0
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        phiMphi += phi[i] * Mff[i][j] * phi[j]
      }
    }

    // phi^T M r
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

  // Add lumped floor masses: M_total = M_frame + M_floor
  addFloorMasses(M, config)

  const { Kff, Mff, freeDOFs } = applyBoundaryConditions(K, M, model.fixedDOFs, model.totalDOFs)

  const { eigenvalues, eigenvectors } = solveEigenvalueProblem(Kff, Mff)

  // Convert eigenvalues to frequencies
  const angularFrequencies = eigenvalues.map((lambda) => Math.sqrt(lambda))
  const frequencies = angularFrequencies.map((omega) => omega / (2 * Math.PI))

  // Expand mode shapes to full DOF vector (including zeros at fixed DOFs)
  const fullModeShapes = eigenvectors.map((modeShape) => {
    const full = new Array(model.totalDOFs).fill(0)
    for (let i = 0; i < freeDOFs.length; i++) {
      full[freeDOFs[i]] = modeShape[i]
    }
    return full
  })

  // Limit to requested number of modes
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
