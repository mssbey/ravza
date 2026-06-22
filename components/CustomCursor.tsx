'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos,      setPos]      = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    const onMove  = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const onOver  = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setHovering(!!el.closest('button,a,[role="button"],[data-cursor="pointer"]'))
    }
    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseover',  onOver)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseover',  onOver)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
    }
  }, [])

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: pos.x - 6,
          y: pos.y - 6,
          scale: clicking ? 0.65 : hovering ? 1.9 : 1,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.4 }}
      >
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: hovering ? '#FF4D88' : '#fff',
          boxShadow: hovering ? '0 0 20px #FF4D88, 0 0 40px rgba(255,77,136,.5)' : 'none',
        }} />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: pos.x - 22,
          y: pos.y - 22,
          scale:   hovering ? 1.7 : 1,
          opacity: hovering ? 0.95 : 0.5,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 0.9 }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: `1.5px solid ${hovering ? '#FF4D88' : 'rgba(255,255,255,.6)'}`,
          boxShadow: hovering ? '0 0 30px rgba(255,77,136,.5)' : 'none',
        }} />
      </motion.div>
    </>
  )
}
