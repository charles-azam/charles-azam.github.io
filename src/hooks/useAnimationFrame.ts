import { useEffect, useRef } from 'react'

export function useAnimationFrame(callback: (time: number) => void) {
  const requestRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    function animate(timestamp: number) {
      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp
      }
      const elapsed = (timestamp - startTimeRef.current) / 1000 // seconds
      callback(elapsed)
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [callback])
}
