import { useRef, useEffect, useCallback } from 'react'
import type { ModalResult, FrameModel } from '../../fem/types'
import { useAnimationFrame } from '../../hooks/useAnimationFrame'

interface FemCanvasProps {
  model: FrameModel
  modalResult: ModalResult
  selectedMode: number
  excitationMode?: 'free' | 'excitation'
  excitationFrequency?: number
  amplitudeFactor?: number
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

export function FemCanvas({
  model,
  modalResult,
  selectedMode,
  excitationMode = 'free',
  excitationFrequency = 2.0,
  amplitudeFactor = 1.0,
}: FemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)

  // Compute structure bounds dynamically
  const maxX = Math.max(...model.nodes.map((n) => n.x))
  const maxY = Math.max(...model.nodes.map((n) => n.y))
  const numStories = Math.round(maxY / (maxY / ((model.nodes.length / 2) - 1)))

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

      ctx.clearRect(0, 0, width, height)

      // Dynamic coordinate scaling — leave room on the left for the overlay
      const leftPadding = 130
      const padding = 50
      const structWidth = maxX
      const structHeight = maxY
      const scaleX = (width - leftPadding - padding) / structWidth
      const scaleY = (height - 2 * padding) / structHeight
      const scale = Math.min(scaleX, scaleY)

      const offsetX = leftPadding + (width - leftPadding - padding - structWidth * scale) / 2
      const offsetY = height - padding

      function toCanvas(x: number, y: number): [number, number] {
        return [offsetX + x * scale, offsetY - y * scale]
      }

      // Compute displacement for this frame
      let getFullDisplacement: (dofIndex: number) => number

      if (excitationMode === 'excitation') {
        // Base excitation: modal superposition
        // response = sum_i gamma_i * D_i(f_exc) * phi_i * sin(2pi * f_exc * t)
        const fExc = excitationFrequency
        const { participationFactors } = modalResult.participation
        const amplitudes: number[] = []

        for (let i = 0; i < modalResult.frequencies.length; i++) {
          const fi = modalResult.frequencies[i]
          const ratio = fExc / fi
          // Dynamic amplification factor, capped at 20
          const D = 1 / Math.abs(1 - ratio * ratio)
          const cappedD = Math.min(D, 20)
          amplitudes.push(participationFactors[i] * cappedD)
        }

        // Normalize so max displacement is reasonable
        const maxAmp = Math.max(...amplitudes.map(Math.abs), 1e-10)
        const normFactor = 1 / maxAmp

        const phase = Math.sin(2 * Math.PI * Math.min(fExc, 8) * time)

        getFullDisplacement = (dofIndex: number) => {
          let total = 0
          for (let i = 0; i < modalResult.fullModeShapes.length; i++) {
            total += amplitudes[i] * normFactor * modalResult.fullModeShapes[i][dofIndex]
          }
          return total * phase
        }
      } else {
        // Free vibration: single mode sinusoidal
        const modeShape = modalResult.fullModeShapes[selectedMode]
        const omega = modalResult.angularFrequencies[selectedMode]
        const animSpeed = Math.min(omega, 8)
        const phase = Math.sin(animSpeed * time)

        getFullDisplacement = (dofIndex: number) => {
          return modeShape[dofIndex] * phase
        }
      }

      const amplitudeScale = scale * 0.15 * amplitudeFactor

      // Get displaced canvas position for a node
      function getDisplaced(nodeId: number): [number, number] {
        const node = model.nodes[nodeId - 1]
        const dofBase = (nodeId - 1) * 3
        const u = getFullDisplacement(dofBase)
        const v = getFullDisplacement(dofBase + 1)
        return toCanvas(
          node.x + u * amplitudeScale / scale,
          node.y + v * amplitudeScale / scale,
        )
      }

      // Draw base excitation ground motion
      if (excitationMode === 'excitation') {
        const phase = Math.sin(2 * Math.PI * Math.min(excitationFrequency, 8) * time)
        const groundShift = phase * 3 // small visual shift for ground

        // Draw ground motion arrows
        ctx.strokeStyle = '#2d6374'
        ctx.lineWidth = 1.5
        ctx.setLineDash([2, 2])
        const [, groundY] = toCanvas(0, 0)
        const arrowY = groundY + 25

        // Left-right arrow
        ctx.beginPath()
        ctx.moveTo(offsetX - 15 + groundShift, arrowY)
        ctx.lineTo(offsetX + maxX * scale + 15 + groundShift, arrowY)
        ctx.stroke()

        // Arrow heads
        const arrowSize = 5
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(offsetX - 15 + groundShift, arrowY)
        ctx.lineTo(offsetX - 15 + groundShift + arrowSize, arrowY - arrowSize)
        ctx.moveTo(offsetX - 15 + groundShift, arrowY)
        ctx.lineTo(offsetX - 15 + groundShift + arrowSize, arrowY + arrowSize)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(offsetX + maxX * scale + 15 + groundShift, arrowY)
        ctx.lineTo(offsetX + maxX * scale + 15 + groundShift - arrowSize, arrowY - arrowSize)
        ctx.moveTo(offsetX + maxX * scale + 15 + groundShift, arrowY)
        ctx.lineTo(offsetX + maxX * scale + 15 + groundShift - arrowSize, arrowY + arrowSize)
        ctx.stroke()

        // Label
        ctx.fillStyle = '#2d6374'
        ctx.font = '9px Manrope, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('ground motion', offsetX + maxX * scale / 2, arrowY + 12)
      }

      // Draw hatched ground line
      const [groundLeftX, groundY] = toCanvas(0, 0)
      const [groundRightX] = toCanvas(maxX, 0)
      const extend = 20
      const hatchY = groundY + 16

      ctx.strokeStyle = '#8da4b3'
      ctx.lineWidth = 1.5
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(groundLeftX - extend, hatchY)
      ctx.lineTo(groundRightX + extend, hatchY)
      ctx.stroke()

      // Hatching below ground line
      ctx.strokeStyle = '#b9c7d1'
      ctx.lineWidth = 0.8
      const hatchSpacing = 6
      const hatchLength = 8
      for (let x = groundLeftX - extend; x <= groundRightX + extend; x += hatchSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, hatchY)
        ctx.lineTo(x - hatchLength * 0.7, hatchY + hatchLength)
        ctx.stroke()
      }

      // Draw fixed supports (triangles at ground nodes)
      ctx.fillStyle = '#cfdae2'
      for (let nodeId = 1; nodeId <= 2; nodeId++) {
        const [cx, cy] = toCanvas(model.nodes[nodeId - 1].x, model.nodes[nodeId - 1].y)
        ctx.beginPath()
        ctx.moveTo(cx - 10, cy + 16)
        ctx.lineTo(cx + 10, cy + 16)
        ctx.lineTo(cx, cy)
        ctx.closePath()
        ctx.fill()
      }

      // Draw undeformed structure (dim, dashed)
      ctx.setLineDash([4, 4])

      for (const elem of model.elements) {
        const nodeI = model.nodes[elem.nodeI - 1]
        const nodeJ = model.nodes[elem.nodeJ - 1]
        const [x1, y1] = toCanvas(nodeI.x, nodeI.y)
        const [x2, y2] = toCanvas(nodeJ.x, nodeJ.y)

        // Different visual weight for columns vs beams
        const isColumn = Math.abs(nodeJ.y - nodeI.y) > Math.abs(nodeJ.x - nodeI.x)
        ctx.strokeStyle = isColumn ? '#bdc9d1' : '#cdd7de'
        ctx.lineWidth = isColumn ? 1 : 0.8

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      ctx.setLineDash([])

      // Draw deformed structure using Hermite interpolation
      for (const elem of model.elements) {
        const nodeI = model.nodes[elem.nodeI - 1]
        const nodeJ = model.nodes[elem.nodeJ - 1]

        const dx = nodeJ.x - nodeI.x
        const dy = nodeJ.y - nodeI.y
        const L = Math.sqrt(dx * dx + dy * dy)
        const cosA = dx / L
        const sinA = dy / L

        const isColumn = Math.abs(dy) > Math.abs(dx)
        ctx.strokeStyle = '#153544'
        ctx.lineWidth = isColumn ? 2.5 : 2

        // Get DOF values for this element
        const dofI = (elem.nodeI - 1) * 3
        const dofJ = (elem.nodeJ - 1) * 3

        const uI = getFullDisplacement(dofI)
        const vI = getFullDisplacement(dofI + 1)
        const thetaI = getFullDisplacement(dofI + 2)
        const uJ = getFullDisplacement(dofJ)
        const vJ = getFullDisplacement(dofJ + 1)
        const thetaJ = getFullDisplacement(dofJ + 2)

        // Transform to local coordinates
        const vLocalI = -sinA * uI + cosA * vI
        const vLocalJ = -sinA * uJ + cosA * vJ

        const numSegments = 20
        ctx.beginPath()

        for (let s = 0; s <= numSegments; s++) {
          const xi = s / numSegments
          const xLocal = xi * L

          const vLocal =
            hermiteN1(xi) * vLocalI +
            hermiteN2(xi, L) * thetaI +
            hermiteN3(xi) * vLocalJ +
            hermiteN4(xi, L) * thetaJ

          const uLocalI2 = cosA * uI + sinA * vI
          const uLocalJ2 = cosA * uJ + sinA * vJ
          const uLocal = uLocalI2 * (1 - xi) + uLocalJ2 * xi

          const dispX = cosA * uLocal - sinA * vLocal
          const dispY = sinA * uLocal + cosA * vLocal

          const worldX = nodeI.x + cosA * xLocal + dispX * amplitudeScale / scale
          const worldY = nodeI.y + sinA * xLocal + dispY * amplitudeScale / scale

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
      for (let nodeId = 1; nodeId <= model.nodes.length; nodeId++) {
        const [cx, cy] = getDisplaced(nodeId)
        ctx.beginPath()
        ctx.arc(cx, cy, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.strokeStyle = '#153544'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Floor labels
      const storyHeight = maxY / numStories
      const labels = ['Ground']
      for (let i = 1; i < numStories; i++) labels.push(`Level ${i}`)
      labels.push('Roof')

      ctx.fillStyle = '#5e7382'
      ctx.font = '9px Manrope, sans-serif'
      ctx.textAlign = 'right'

      for (let i = 0; i <= numStories; i++) {
        const [, cy] = toCanvas(0, i * storyHeight)
        ctx.fillText(labels[i], offsetX - 25, cy)
      }
    },
    [model, modalResult, selectedMode, excitationMode, excitationFrequency, amplitudeFactor, maxX, maxY, numStories],
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
