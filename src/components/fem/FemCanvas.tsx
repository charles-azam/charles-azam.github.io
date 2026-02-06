import { useRef, useEffect, useCallback } from 'react'
import type { ModalResult } from '../../fem/types'
import { createThreeStoryFrame } from '../../fem/frame-model'
import { useAnimationFrame } from '../../hooks/useAnimationFrame'

interface FemCanvasProps {
  modalResult: ModalResult
  selectedMode: number
}

/**
 * Hermite shape functions for smooth beam curvature interpolation.
 * xi in [0, 1] is the normalized position along the element.
 */
function hermiteN1(xi: number): number {
  return 1 - 3 * xi * xi + 2 * xi * xi * xi
}
function hermiteN2(xi: number, L: number): number {
  return L * xi * (1 - xi) * (1 - xi)
}
function hermiteN3(xi: number): number {
  return xi * xi * (3 - 2 * xi)
}
function hermiteN4(xi: number, L: number): number {
  return L * xi * xi * (xi - 1)
}

export function FemCanvas({ modalResult, selectedMode }: FemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)
  const model = createThreeStoryFrame()

  // Get the full mode shape for the selected mode
  const modeShape = modalResult.fullModeShapes[selectedMode]
  const omega = modalResult.angularFrequencies[selectedMode]

  const draw = useCallback(
    (time: number) => {
      timeRef.current = time
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Handle DPI scaling
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      const width = rect.width
      const height = rect.height

      // Clear
      ctx.clearRect(0, 0, width, height)

      // Coordinate transform: structure space -> canvas space
      // Structure: x=[0,4], y=[0,9]
      const padding = 40
      const structWidth = 4
      const structHeight = 9
      const scaleX = (width - 2 * padding) / structWidth
      const scaleY = (height - 2 * padding) / structHeight
      const scale = Math.min(scaleX, scaleY)

      const offsetX = (width - structWidth * scale) / 2
      const offsetY = height - padding

      function toCanvas(x: number, y: number): [number, number] {
        return [offsetX + x * scale, offsetY - y * scale]
      }

      // Animation: sinusoidal oscillation
      // Use a slower animation speed for visual clarity
      const animSpeed = Math.min(omega, 8)
      const phase = Math.sin(animSpeed * time)
      const amplitudeScale = scale * 0.15

      // Get displaced position for a node
      function getDisplaced(nodeId: number): [number, number] {
        const node = model.nodes[nodeId - 1]
        const dofBase = (nodeId - 1) * 3
        const u = modeShape[dofBase]     // horizontal displacement
        const v = modeShape[dofBase + 1] // vertical displacement
        return toCanvas(
          node.x + u * phase * amplitudeScale / scale,
          node.y + v * phase * amplitudeScale / scale,
        )
      }

      // Draw fixed supports (triangles at nodes 1 and 2)
      ctx.fillStyle = '#444'
      for (const nodeId of [1, 2]) {
        const [cx, cy] = toCanvas(model.nodes[nodeId - 1].x, model.nodes[nodeId - 1].y)
        ctx.beginPath()
        ctx.moveTo(cx - 10, cy + 16)
        ctx.lineTo(cx + 10, cy + 16)
        ctx.lineTo(cx, cy)
        ctx.closePath()
        ctx.fill()

        // Ground line
        ctx.strokeStyle = '#444'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(cx - 14, cy + 16)
        ctx.lineTo(cx + 14, cy + 16)
        ctx.stroke()
      }

      // Draw undeformed structure (dim, dashed)
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])

      for (const elem of model.elements) {
        const nodeI = model.nodes[elem.nodeI - 1]
        const nodeJ = model.nodes[elem.nodeJ - 1]
        const [x1, y1] = toCanvas(nodeI.x, nodeI.y)
        const [x2, y2] = toCanvas(nodeJ.x, nodeJ.y)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      ctx.setLineDash([])

      // Draw deformed structure using Hermite interpolation
      ctx.strokeStyle = '#ff6b35'
      ctx.lineWidth = 2.5

      for (const elem of model.elements) {
        const nodeI = model.nodes[elem.nodeI - 1]
        const nodeJ = model.nodes[elem.nodeJ - 1]

        const dx = nodeJ.x - nodeI.x
        const dy = nodeJ.y - nodeI.y
        const L = Math.sqrt(dx * dx + dy * dy)
        const cosA = dx / L
        const sinA = dy / L

        // Get local DOF values for this element
        const dofI = (elem.nodeI - 1) * 3
        const dofJ = (elem.nodeJ - 1) * 3

        // Global displacements
        const uI = modeShape[dofI]
        const vI = modeShape[dofI + 1]
        const thetaI = modeShape[dofI + 2]
        const uJ = modeShape[dofJ]
        const vJ = modeShape[dofJ + 1]
        const thetaJ = modeShape[dofJ + 2]

        // Transform to local coordinates
        // local axial: u_local = cos*u_global + sin*v_global
        // local transverse: v_local = -sin*u_global + cos*v_global
        const vLocalI = -sinA * uI + cosA * vI
        const vLocalJ = -sinA * uJ + cosA * vJ

        const numSegments = 20
        ctx.beginPath()

        for (let s = 0; s <= numSegments; s++) {
          const xi = s / numSegments
          const xLocal = xi * L

          // Hermite interpolation for transverse displacement
          const vLocal =
            hermiteN1(xi) * vLocalI +
            hermiteN2(xi, L) * thetaI +
            hermiteN3(xi) * vLocalJ +
            hermiteN4(xi, L) * thetaJ

          // Axial interpolation (linear)
          const uLocalI = cosA * uI + sinA * vI
          const uLocalJ = cosA * uJ + sinA * vJ
          const uLocal = uLocalI * (1 - xi) + uLocalJ * xi

          // Back to global displacement
          const dispX = cosA * uLocal - sinA * vLocal
          const dispY = sinA * uLocal + cosA * vLocal

          // World position
          const worldX = nodeI.x + cosA * xLocal + dispX * phase * amplitudeScale / scale
          const worldY = nodeI.y + sinA * xLocal + dispY * phase * amplitudeScale / scale

          const [canvasX, canvasY] = toCanvas(worldX, worldY)

          if (s === 0) {
            ctx.moveTo(canvasX, canvasY)
          } else {
            ctx.lineTo(canvasX, canvasY)
          }
        }

        ctx.stroke()
      }

      // Draw deformed nodes
      ctx.fillStyle = '#ff6b35'
      for (let nodeId = 1; nodeId <= model.nodes.length; nodeId++) {
        const [cx, cy] = getDisplaced(nodeId)
        ctx.beginPath()
        ctx.arc(cx, cy, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [modeShape, omega, model],
  )

  // ResizeObserver for responsive canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver(() => {
      draw(timeRef.current)
    })

    observer.observe(canvas)
    return () => observer.disconnect()
  }, [draw])

  useAnimationFrame(draw)

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[300px]"
      style={{ display: 'block' }}
    />
  )
}
