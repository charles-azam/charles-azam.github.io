/**
 * Extract the free-DOF submatrices from global K and M using the partition method.
 * Fixed DOFs are removed (their rows and columns are deleted).
 */
export function applyBoundaryConditions(
  K: number[][],
  M: number[][],
  fixedDOFs: number[],
  totalDOFs: number,
): { Kff: number[][]; Mff: number[][]; freeDOFs: number[] } {
  const fixedSet = new Set(fixedDOFs)
  const freeDOFs: number[] = []

  for (let i = 0; i < totalDOFs; i++) {
    if (!fixedSet.has(i)) {
      freeDOFs.push(i)
    }
  }

  const n = freeDOFs.length
  const Kff: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))
  const Mff: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Kff[i][j] = K[freeDOFs[i]][freeDOFs[j]]
      Mff[i][j] = M[freeDOFs[i]][freeDOFs[j]]
    }
  }

  return { Kff, Mff, freeDOFs }
}
