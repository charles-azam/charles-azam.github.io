import type { FrameModel, Node } from './types'
import {
  localStiffnessMatrix,
  consistentMassMatrix,
  transformationMatrix,
  elementLength,
} from './beam-element'

/**
 * Create a zero-filled square matrix of given size.
 */
function zeroMatrix(n: number): number[][] {
  return Array.from({ length: n }, () => new Array(n).fill(0))
}

/**
 * Multiply: result = T^T * M * T (6x6 matrices)
 */
function transformToGlobal(T: number[][], localMat: number[][]): number[][] {
  const n = 6
  // temp = localMat * T
  const temp: number[][] = zeroMatrix(n)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0
      for (let k = 0; k < n; k++) {
        sum += localMat[i][k] * T[k][j]
      }
      temp[i][j] = sum
    }
  }

  // result = T^T * temp
  const result: number[][] = zeroMatrix(n)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0
      for (let k = 0; k < n; k++) {
        sum += T[k][i] * temp[k][j]
      }
      result[i][j] = sum
    }
  }

  return result
}

/**
 * Get the global DOF indices for a beam element.
 * Each node has 3 DOFs: [u, v, θ].
 * Node i (0-indexed) maps to DOFs [3*i, 3*i+1, 3*i+2].
 */
function elementDOFs(nodeI: number, nodeJ: number): number[] {
  const i = nodeI - 1 // convert 1-indexed to 0-indexed
  const j = nodeJ - 1
  return [3 * i, 3 * i + 1, 3 * i + 2, 3 * j, 3 * j + 1, 3 * j + 2]
}

/**
 * Assemble global stiffness and mass matrices from the frame model.
 */
export function assembleGlobalMatrices(model: FrameModel): {
  K: number[][]
  M: number[][]
} {
  const n = model.totalDOFs
  const K = zeroMatrix(n)
  const M = zeroMatrix(n)

  const nodeMap = new Map<number, Node>()
  for (const node of model.nodes) {
    nodeMap.set(node.id, node)
  }

  for (const element of model.elements) {
    const nodeI = nodeMap.get(element.nodeI)!
    const nodeJ = nodeMap.get(element.nodeJ)!
    const L = elementLength(nodeI, nodeJ)

    const Klocal = localStiffnessMatrix(element, L)
    const Mlocal = consistentMassMatrix(element, L)
    const T = transformationMatrix(nodeI, nodeJ, L)

    const Kglobal = transformToGlobal(T, Klocal)
    const Mglobal = transformToGlobal(T, Mlocal)

    const dofs = elementDOFs(element.nodeI, element.nodeJ)

    // Scatter into global matrices
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        K[dofs[i]][dofs[j]] += Kglobal[i][j]
        M[dofs[i]][dofs[j]] += Mglobal[i][j]
      }
    }
  }

  return { K, M }
}
