'use client'

import { motion } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

interface Props {
  title: string
  subtitle: string
  emoji: string
  color: string
  onBack: () => void
}

export default function ChapterShell({ title, subtitle, emoji, color, onBack }: Props) {
  const rgb = color.replace('#','')
  const r   = parseInt(rgb.substring(0,2),16)
  const g   = parseInt(rgb.substring(2,4),16)
  const b   = parseInt(rgb.substring(4,6),16)
  const glowRgb = `${r},${g},${b}`

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .7 }}
      style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at 50% 30%, rgba(${glowRgb},.08) 0%, #000 60%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Subtle stars */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '90px 90px', opacity: .25, pointerEvents: 'none' }} />

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
        whileHover={{ x: -3 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)' }}
      >
        ← Geri
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: .8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: .2, duration: .9, type: 'spring', stiffness: 160, damping: 18 }}
        style={{ textAlign: 'center', padding: '2rem' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: 'clamp(3rem,8vw,5rem)', marginBottom: '1.5rem', filter: `drop-shadow(0 0 24px rgba(${glowRgb},.7))` }}
        >
          {emoji}
        </motion.div>

        <h1 style={{ fontFamily: PF, fontSize: 'clamp(1.8rem,5vw,3rem)', color: '#fff', marginBottom: '.6rem', textShadow: `0 0 40px rgba(${glowRgb},.4)` }}>
          {title}
        </h1>

        <p style={{ fontFamily: CO, fontSize: 'clamp(.9rem,2vw,1.1rem)', fontStyle: 'italic', color: `rgba(${glowRgb},.6)`, marginBottom: '2.5rem' }}>
          {subtitle}
        </p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '.6rem',
          padding: '.9rem 2rem', borderRadius: '2rem',
          border: `1px solid rgba(${glowRgb},.25)`,
          background: `rgba(${glowRgb},.06)`,
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, animation: 'pulse-ring 2s infinite' }} />
          <p style={{ fontFamily: IN, fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: `rgba(${glowRgb},.55)` }}>
            Yakında hazır olacak
          </p>
        </div>
      </motion.div>

      <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{ fontFamily: CO, fontSize: '.72rem', fontStyle: 'italic', color: 'rgba(255,255,255,.1)' }}>
          Her bölüm özenle hazırlanıyor
        </p>
      </div>
    </motion.div>
  )
}
