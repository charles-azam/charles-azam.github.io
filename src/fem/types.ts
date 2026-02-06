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

export interface ModalResult {
  frequencies: number[]       // Natural frequencies in Hz
  angularFrequencies: number[] // Angular frequencies in rad/s
  modeShapes: number[][]      // Each mode shape is a vector of displacements for free DOFs
  fullModeShapes: number[][]  // Mode shapes expanded to all DOFs (including fixed = 0)
}

export interface FrameModel {
  nodes: Node[]
  elements: BeamElement[]
  fixedDOFs: number[]  // Indices of fixed DOFs in the global system
  totalDOFs: number
}
