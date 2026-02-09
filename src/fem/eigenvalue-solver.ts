import { eigs, multiply, inv, matrix, type Matrix } from 'mathjs'

/**
 * Solve the generalized eigenvalue problem K*phi = omega^2 * M*phi
 * using the M^(-1)*K approach.
 *
 * Returns eigenvalues (omega^2) sorted ascending and corresponding eigenvectors.
 */
export function solveEigenvalueProblem(
  Kff: number[][],
  Mff: number[][],
): { eigenvalues: number[]; eigenvectors: number[][] } {
  const n = Kff.length

  // Form A = M^(-1) * K
  const Mmat = matrix(Mff)
  const Kmat = matrix(Kff)
  const Minv = inv(Mmat)
  const A = multiply(Minv, Kmat) as Matrix

  // Solve standard eigenvalue problem A*x = lambda*x
  const result = eigs(A)

  // Extract eigenvalues from result.values
  const rawValues = result.values.valueOf() as (number | { re: number; im: number })[]

  // Extract eigenvectors from result.eigenvectors (array of {value, vector} objects)
  const eigenvectorObjects = result.eigenvectors as {
    value: number | { re: number; im: number }
    vector: { valueOf(): (number | { re: number; im: number })[] }
  }[]

  // Convert to real numbers (discard tiny imaginary parts from numerical noise)
  const toReal = (v: number | { re: number; im: number }): number =>
    typeof v === 'number' ? v : v.re

  const eigenvalues: number[] = rawValues.map(toReal)

  // Extract eigenvector arrays
  const eigenvectors: number[][] = eigenvectorObjects.map((ev) => {
    const vec = ev.vector.valueOf() as (number | { re: number; im: number })[]
    return vec.map(toReal)
  })

  // Sort by eigenvalue (ascending)
  const indices = eigenvalues.map((_, i) => i)
  indices.sort((a, b) => eigenvalues[a] - eigenvalues[b])

  const sortedValues = indices.map((i) => eigenvalues[i])
  const sortedVectors = indices.map((i) => {
    const vec = eigenvectors[i]
    // Normalize
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0))
    return vec.map((v) => v / norm)
  })

  // Filter out near-zero or negative eigenvalues (rigid body modes)
  const validIndices: number[] = []
  for (let i = 0; i < n; i++) {
    if (sortedValues[i] > 1e-6) {
      validIndices.push(i)
    }
  }

  return {
    eigenvalues: validIndices.map((i) => sortedValues[i]),
    eigenvectors: validIndices.map((i) => sortedVectors[i]),
  }
}
