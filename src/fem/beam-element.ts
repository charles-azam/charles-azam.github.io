import type { BeamElement, Node } from './types'

/**
 * Compute the 6x6 local stiffness matrix for an Euler-Bernoulli beam element.
 * DOFs per node: [u, v, theta] (axial, transverse, rotation)
 * Local x-axis along the beam.
 */
export function localStiffnessMatrix(element: BeamElement, length: number): number[][] {
  const { E, A, I } = element
  const L = length
  const L2 = L * L
  const L3 = L * L * L

  const EA_L = (E * A) / L
  const EI_L3 = (E * I) / L3
  const EI_L2 = (E * I) / L2
  const EI_L = (E * I) / L

  // 6x6 stiffness matrix [u1, v1, θ1, u2, v2, θ2]
  return [
    [EA_L, 0, 0, -EA_L, 0, 0],
    [0, 12 * EI_L3, 6 * EI_L2, 0, -12 * EI_L3, 6 * EI_L2],
    [0, 6 * EI_L2, 4 * EI_L, 0, -6 * EI_L2, 2 * EI_L],
    [-EA_L, 0, 0, EA_L, 0, 0],
    [0, -12 * EI_L3, -6 * EI_L2, 0, 12 * EI_L3, -6 * EI_L2],
    [0, 6 * EI_L2, 2 * EI_L, 0, -6 * EI_L2, 4 * EI_L],
  ]
}

/**
 * Compute the 6x6 consistent mass matrix for an Euler-Bernoulli beam element.
 */
export function consistentMassMatrix(element: BeamElement, length: number): number[][] {
  const { rho, A } = element
  const L = length
  const m = rho * A * L

  // Axial mass terms
  const ma = m / 6

  // Transverse (bending) mass terms
  const mb = m / 420

  return [
    [2 * ma, 0, 0, ma, 0, 0],
    [0, 156 * mb, 22 * L * mb, 0, 54 * mb, -13 * L * mb],
    [0, 22 * L * mb, 4 * L * L * mb, 0, 13 * L * mb, -3 * L * L * mb],
    [ma, 0, 0, 2 * ma, 0, 0],
    [0, 54 * mb, 13 * L * mb, 0, 156 * mb, -22 * L * mb],
    [0, -13 * L * mb, -3 * L * L * mb, 0, -22 * L * mb, 4 * L * L * mb],
  ]
}

/**
 * Compute the 6x6 coordinate transformation matrix T for a beam element.
 * Transforms from local to global coordinates.
 * For a 2D frame: rotation by angle θ where cos(θ) = dx/L, sin(θ) = dy/L
 */
export function transformationMatrix(nodeI: Node, nodeJ: Node, length: number): number[][] {
  const c = (nodeJ.x - nodeI.x) / length
  const s = (nodeJ.y - nodeI.y) / length

  return [
    [c, s, 0, 0, 0, 0],
    [-s, c, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, c, s, 0],
    [0, 0, 0, -s, c, 0],
    [0, 0, 0, 0, 0, 1],
  ]
}

/**
 * Compute the length of a beam element.
 */
export function elementLength(nodeI: Node, nodeJ: Node): number {
  const dx = nodeJ.x - nodeI.x
  const dy = nodeJ.y - nodeI.y
  return Math.sqrt(dx * dx + dy * dy)
}
