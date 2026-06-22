'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const BASE   = '/mss%20ilk%20mesaj'
const ACCENT = '#e8d5a0'
const ARGB   = '232,213,160'

const SLIDES = [
  { src: `${BASE}/1.jpeg`,             title: 'İlk WhatsApp Konuşmamız',                      num: '01' },
  { src: `${BASE}/2.jpeg`,             title: 'İlk Bana Yazışın',                             num: '02' },
  { src: `${BASE}/3.jpeg`,             title: 'Bahaneden Seni Görmek İstiyorum',              num: '03' },
  { src: `${BASE}/4.jpeg`,             title: 'Doğum Günümü Kutlayana Kadar Beklemiştim',    num: '04' },
  { src: `${BASE}/yapt%C4%B1.jpeg`,   title: 'Tek Dileğim Sendin, Onu da Gerçekleştirdim',  num: '05' },
]

/* ── Confetti ── */
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ['#FFD700','#FFB347','#FF85C1','#BB88FF','#80CFFF','#FFFFFF','#FFE066','#FF6B9D','#A8FFD0']
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      size: 5 + Math.random() * 7,
      delay: Math.random() * 5,
      dur: 4 + Math.random() * 5,
      rot: Math.random() * 720 - 360,
      isCircle: Math.random() > 0.38,
    }))
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: 0,
            width: p.size,
            height: p.isCircle ? p.size : p.size * 0.45,
            borderRadius: p.isCircle ? '50%' : '1px',
            background: p.color,
          }}
          animate={{ y: ['-2vh', '105vh'], rotate: [0, p.rot], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

/* ── Single message card ── */
function MessageCard({ slide, index }: { slide: typeof SLIDES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 55 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.14, duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ width: '100%', maxWidth: 400, margin: '0 auto', position: 'relative' }}
    >
      {/* Number badge */}
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 10,
        width: 36, height: 36, borderRadius: '50%',
        background: `rgba(${ARGB},0.1)`,
        border: `1px solid rgba(${ARGB},0.28)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontFamily: IN, fontSize: '0.63rem', color: `rgba(${ARGB},0.75)`, letterSpacing: '0.05em' }}>
          {slide.num}
        </span>
      </div>

      {/* Photo frame */}
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        border: `1px solid rgba(${ARGB},0.12)`,
        background: 'rgba(255,255,255,0.02)',
        boxShadow: `0 10px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(${ARGB},0.05)`,
      }}>
        <img src={slide.src} alt={slide.title} style={{ width: '100%', display: 'block' }} draggable={false} />
      </div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 + index * 0.14, duration: 0.6 }}
        style={{ textAlign: 'center', padding: '1.1rem 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem' }}
      >
        <div style={{ width: 26, height: 1, background: `rgba(${ARGB},0.28)` }} />
        <span style={{ fontFamily: CO, fontSize: '0.97rem', fontStyle: 'italic', color: `rgba(${ARGB},0.72)`, letterSpacing: '0.02em' }}>
          {slide.title}
        </span>
        <div style={{ width: 26, height: 1, background: `rgba(${ARGB},0.28)` }} />
      </motion.div>
    </motion.div>
  )
}

/* ── Dilek card ── */
function DilekCard({ show }: { show: boolean }) {
  const baseDelay = 0.25 + SLIDES.length * 0.14 + 0.4

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: baseDelay, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}
    >
      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, rgba(${ARGB},0.35))` }} />
        <motion.span
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontFamily: IN, fontSize: '0.75rem', color: `rgba(${ARGB},0.55)` }}
        >✦</motion.span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(${ARGB},0.35), transparent)` }} />
      </div>

      {/* Image */}
      <div style={{
        borderRadius: 24,
        overflow: 'hidden',
        border: `1px solid rgba(${ARGB},0.22)`,
        boxShadow: `0 0 80px rgba(${ARGB},0.12), 0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(${ARGB},0.07)`,
        position: 'relative',
      }}>
        <img src={`${BASE}/dilek.jpeg`} alt="Dilek" style={{ width: '100%', display: 'block' }} draggable={false} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 100%, rgba(${ARGB},0.08) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay + 0.7, duration: 1 }}
        style={{ textAlign: 'center', padding: '2.2rem 1rem 0' }}
      >
        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          style={{ fontFamily: IN, fontSize: '0.7rem', letterSpacing: '0.3em', color: `rgba(${ARGB},0.45)`, margin: '0 0 1rem' }}
        >✦ &nbsp; ✦ &nbsp; ✦</motion.p>

        <p style={{
          fontFamily: PF,
          fontSize: 'clamp(1rem,3.5vw,1.5rem)',
          letterSpacing: '0.1em',
          color: `rgba(${ARGB},0.92)`,
          textShadow: `0 0 50px rgba(${ARGB},0.45)`,
          lineHeight: 1.65,
          margin: 0,
        }}>
          DOĞRU ZAMANDA
          <br />
          <span style={{
            fontFamily: CO,
            fontStyle: 'italic',
            fontSize: '1.18em',
            letterSpacing: '0.04em',
            color: '#fff',
            textShadow: `0 0 40px rgba(${ARGB},0.5)`,
          }}>
            İçten Dilenmiş
          </span>
          <br />
          BİR DİLEK
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ── Main ── */
export default function IlkMesajlar({ onBack }: { onBack: () => void }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const dilekRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = dilekRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShowConfetti(true) },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{ position: 'fixed', inset: 0, background: '#06050a', overflow: 'hidden' }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 0%, rgba(${ARGB},0.05) 0%, transparent 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)', backgroundSize: '90px 90px', opacity: 0.16 }} />

      {showConfetti && <Confetti />}

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        whileHover={{ opacity: 0.85, x: -3 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', zIndex: 50, background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}
      >
        ← Geri
      </motion.button>

      {/* Scroll area */}
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        paddingTop: '5.5rem', paddingBottom: '7rem',
        paddingLeft: 'clamp(1.2rem,5vw,2.5rem)',
        paddingRight: 'clamp(1.2rem,5vw,2.5rem)',
        scrollbarWidth: 'none',
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.85 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <motion.div
            animate={{ opacity: [0.4, 0.95, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '2.4rem', marginBottom: '1.1rem', filter: `drop-shadow(0 0 22px rgba(${ARGB},0.65))` }}
          >🌙</motion.div>

          <h1 style={{ fontFamily: PF, fontSize: 'clamp(1.7rem,4.5vw,2.6rem)', color: '#fff', margin: '0 0 0.5rem', textShadow: `0 0 45px rgba(${ARGB},0.35)` }}>
            İlk Mesajlar
          </h1>
          <p style={{ fontFamily: CO, fontSize: 'clamp(0.9rem,2vw,1.1rem)', fontStyle: 'italic', color: `rgba(${ARGB},0.52)`, margin: 0 }}>
            Kelimeler arasında gizlenen his
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', marginTop: '1.6rem' }}>
            <div style={{ width: 38, height: 1, background: `rgba(${ARGB},0.22)` }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: `rgba(${ARGB},0.38)` }} />
            <div style={{ width: 38, height: 1, background: `rgba(${ARGB},0.22)` }} />
          </div>
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center' }}>
          {SLIDES.map((s, i) => (
            <MessageCard key={s.src} slide={s} index={i} />
          ))}

          {/* Dilek */}
          <div ref={dilekRef} style={{ width: '100%' }}>
            <DilekCard show={showConfetti} />
          </div>
        </div>
      </div>

      {/* Fade edges */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5.5rem', background: 'linear-gradient(to bottom, #06050a, transparent)', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5rem', background: 'linear-gradient(to top, #06050a, transparent)', pointerEvents: 'none', zIndex: 10 }} />
    </motion.div>
  )
}
