import type { FrameModel, ModalResult } from './types'
import { assembleGlobalMatrices } from './assembly'
import { applyBoundaryConditions } from './boundary-conditions'
import { solveEigenvalueProblem } from './eigenvalue-solver'

/**
 * Define a 3-story single-bay steel frame.
 *
 * Node layout:
 *   7 -------- 8     (roof,   y=9m)
 *   |          |
 *   5 -------- 6     (floor2, y=6m)
 *   |          |
 *   3 -------- 4     (floor1, y=3m)
 *   |          |
 *   1 -------- 2     (ground, y=0m, fixed supports)
 *
 * Bay width: 4m, story height: 3m
 */
export function createThreeStoryFrame(): FrameModel {
  const bayWidth = 4.0 // m
  const storyHeight = 3.0 // m

  // Steel properties
  const E = 200e9     // Pa (200 GPa)
  const rho = 7850    // kg/m^3

  // Column section ~ HEB 200
  const colA = 78.1e-4   // m^2
  const colI = 5696e-8   // m^4

  // Beam section ~ IPE 300
  const beamA = 53.8e-4  // m^2
  const beamI = 8356e-8  // m^4

  const nodes = [
    { id: 1, x: 0, y: 0 },
    { id: 2, x: bayWidth, y: 0 },
    { id: 3, x: 0, y: storyHeight },
    { id: 4, x: bayWidth, y: storyHeight },
    { id: 5, x: 0, y: 2 * storyHeight },
    { id: 6, x: bayWidth, y: 2 * storyHeight },
    { id: 7, x: 0, y: 3 * storyHeight },
    { id: 8, x: bayWidth, y: 3 * storyHeight },
  ]

  let elemId = 1
  const makeCol = (nI: number, nJ: number) => ({
    id: elemId++,
    nodeI: nI,
    nodeJ: nJ,
    E,
    A: colA,
    I: colI,
    rho,
  })
  const makeBeam = (nI: number, nJ: number) => ({
    id: elemId++,
    nodeI: nI,
    nodeJ: nJ,
    E,
    A: beamA,
    I: beamI,
    rho,
  })

  const elements = [
    // Columns (vertical)
    makeCol(1, 3), // left column, story 1
    makeCol(2, 4), // right column, story 1
    makeCol(3, 5), // left column, story 2
    makeCol(4, 6), // right column, story 2
    makeCol(5, 7), // left column, story 3
    makeCol(6, 8), // right column, story 3
    // Beams (horizontal)
    makeBeam(3, 4), // floor 1
    makeBeam(5, 6), // floor 2
    makeBeam(7, 8), // roof
  ]

  // Fixed supports at nodes 1 and 2: all 3 DOFs each
  // Node 1 -> DOFs 0, 1, 2; Node 2 -> DOFs 3, 4, 5
  const fixedDOFs = [0, 1, 2, 3, 4, 5]

  return {
    nodes,
    elements,
    fixedDOFs,
    totalDOFs: nodes.length * 3, // 24
  }
}

/**
 * Run the full modal analysis on the 3-story frame.
 */
export function solveFrameModal(numModes: number = 6): ModalResult {
  const model = createThreeStoryFrame()
  const { K, M } = assembleGlobalMatrices(model)
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

  return {
    frequencies: frequencies.slice(0, n),
    angularFrequencies: angularFrequencies.slice(0, n),
    modeShapes: eigenvectors.slice(0, n),
    fullModeShapes: fullModeShapes.slice(0, n),
  }
}
