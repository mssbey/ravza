'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const PINS: Record<string, string> = {
  biz:     '1234',
  friends: '5678',
}

interface Props {
  section: 'biz' | 'friends'
  onSuccess: () => void
  onBack: () => void
}

export default function LoginGate({ section, onSuccess, onBack }: Props) {
  const [digits,  setDigits]  = useState<string[]>([])
  const [shake,   setShake]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [hint,    setHint]    = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  const isBiz = section === 'biz'
  const accent = isBiz ? '#FF4D88' : '#FFC2D1'
  const accentDim = isBiz ? 'rgba(255,77,136,.18)' : 'rgba(255,194,209,.18)'

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width  = window.innerWidth
    const H = canvas.height = window.innerHeight

    const pts = Array.from({ length: 120 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .25,
      vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.5 + .3,
      op: Math.random() * .45 + .08,
    }))

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = isBiz ? `rgba(255,77,136,${p.op})` : `rgba(255,194,209,${p.op})`
        ctx.fill()
      })
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [isBiz])

  const handleDigit = (d: string) => {
    if (digits.length >= 4 || success) return
    const next = [...digits, d]
    setDigits(next)

    if (next.length === 4) {
      const entered = next.join('')
      if (entered === PINS[section]) {
        setSuccess(true)
        setTimeout(() => onSuccess(), 1200)
      } else {
        setShake(true)
        setTimeout(() => { setShake(false); setDigits([]) }, 700)
      }
    }
  }

  const handleDelete = () => {
    if (success) return
    setDigits(d => d.slice(0, -1))
  }

  const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: .96 }}
      transition={{ duration: .6, ease: [.25,.1,.25,1] }}
      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#050505' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* Radial glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 55% 50% at 50% 50%, ${isBiz ? 'rgba(255,77,136,.08)' : 'rgba(255,194,209,.06)'} 0%, transparent 70%)` }} />

      {/* Back */}
      <motion.button
        whileHover={{ x: -3 }}
        onClick={onBack}
        style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.4rem', color: 'rgba(255,255,255,.28)', fontFamily: IN, fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', zIndex: 10 }}
      >
        ← Geri
      </motion.button>

      {/* Card */}
      <motion.div
        animate={shake ? { x: [-14, 14, -12, 12, -8, 8, 0] } : success ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: .55 }}
        style={{
          position: 'relative', zIndex: 5,
          background: 'rgba(255,255,255,.03)',
          backdropFilter: 'blur(32px)',
          border: `1px solid ${success ? accent : 'rgba(255,255,255,.07)'}`,
          borderRadius: '1.8rem',
          padding: 'clamp(2rem,5vw,3.2rem) clamp(1.8rem,5vw,3.6rem)',
          width: 'min(380px, 90vw)',
          boxShadow: success ? `0 0 80px ${isBiz ? 'rgba(255,77,136,.35)' : 'rgba(255,194,209,.3)'}` : '0 24px 80px rgba(0,0,0,.5)',
          transition: 'border-color .4s, box-shadow .4s',
        }}
      >
        {/* Icon + title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            animate={{ scale: success ? [1, 1.3, 1] : 1 }}
            style={{ fontSize: '2.6rem', marginBottom: '.8rem', display: 'block' }}
          >
            {isBiz ? '❤️' : '👭'}
          </motion.div>
          <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.3rem,3vw,1.7rem)', color: '#fff', marginBottom: '.4rem' }}>
            {isBiz ? 'Sadece Biz' : 'Arkadaşların'}
          </h2>
          <p style={{ fontFamily: CO, fontSize: '.9rem', color: 'rgba(255,255,255,.3)', fontStyle: 'italic' }}>
            {isBiz ? 'Özel anılarımıza hoş geldin' : 'Arkadaşların seni bekliyor'}
          </p>
        </div>

        {/* PIN circles */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {[0,1,2,3].map(i => {
            const filled  = i < digits.length
            const current = i === digits.length
            return (
              <motion.div
                key={i}
                animate={success && filled ? { scale: [1, 1.35, 1], background: accent } : {}}
                transition={{ delay: i * .07 }}
                style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: filled ? accent : 'transparent',
                  border: `2px solid ${filled ? accent : current ? `rgba(${isBiz?'255,77,136':'255,194,209'},.55)` : 'rgba(255,255,255,.15)'}`,
                  boxShadow: filled ? `0 0 12px ${accent}` : 'none',
                  transition: 'all .2s',
                }}
              />
            )
          })}
        </div>

        {/* Feedback */}
        <div style={{ textAlign: 'center', marginBottom: '1.2rem', minHeight: '1.2rem' }}>
          <AnimatePresence>
            {shake && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontFamily: IN, fontSize: '.72rem', color: '#ff6b6b', letterSpacing: '.08em' }}>
                Yanlış şifre, tekrar dene
              </motion.p>
            )}
            {success && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: IN, fontSize: '.72rem', color: accent, letterSpacing: '.08em' }}>
                ✓ Hoş geldin
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem' }}>
          {KEYS.map((k, idx) => {
            const isDelete = k === '⌫'
            const isEmpty  = k === ''
            return (
              <motion.button
                key={idx}
                whileHover={isEmpty ? {} : { scale: 1.07, background: isDelete ? 'rgba(255,255,255,.06)' : accentDim }}
                whileTap={isEmpty ? {} : { scale: .93 }}
                onClick={() => isEmpty ? undefined : isDelete ? handleDelete() : handleDigit(k)}
                disabled={isEmpty || success}
                style={{
                  height: '3.2rem', borderRadius: '.85rem',
                  background: isEmpty ? 'transparent' : 'rgba(255,255,255,.04)',
                  border: isEmpty ? 'none' : `1px solid rgba(255,255,255,.07)`,
                  color: isDelete ? 'rgba(255,255,255,.45)' : '#fff',
                  fontFamily: IN,
                  fontSize: isDelete ? '1.1rem' : '1.2rem',
                  fontWeight: '500',
                  cursor: isEmpty ? 'default' : 'pointer',
                  transition: 'background .15s',
                }}
              >
                {k}
              </motion.button>
            )
          })}
        </div>

        {/* Hint */}
        <div style={{ textAlign: 'center', marginTop: '1.8rem' }}>
          <button
            onClick={() => setHint(h => !h)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.62rem', color: 'rgba(255,255,255,.15)', letterSpacing: '.15em', textTransform: 'uppercase' }}
          >
            İpucu {hint ? '▲' : '▼'}
          </button>
          <AnimatePresence>
            {hint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ fontFamily: CO, fontSize: '.8rem', fontStyle: 'italic', color: 'rgba(255,255,255,.2)', marginTop: '.5rem' }}
              >
                {isBiz ? 'İlk buluştuğumuz ay ve gün' : 'Seni tanıdığım yıl'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
