'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const B1 = '/mss%20zaman%20t%C3%BCneli'
const B2 = '/mss%20zaman%20t%C3%BCneli%202'

function enc(f: string) {
  return f.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')
}

/* ── Folder 1 (99 photos) ── */
const FILES1 = [
  'WhatsApp Image 2026-06-23 at 00.45.31.jpeg',
  'WhatsApp Image 2026-06-23 at 00.45.31 (1).jpeg',
  'WhatsApp Image 2026-06-23 at 00.45.31 (2).jpeg',
  'WhatsApp Image 2026-06-23 at 00.45.33.jpeg',
  'WhatsApp Image 2026-06-23 at 00.45.35.jpeg',
  'WhatsApp Image 2026-06-23 at 00.45.35 (1).jpeg',
  'WhatsApp Image 2026-06-23 at 00.45.41.jpeg',
  ...Array.from({ length: 92 }, (_, i) => `WhatsApp Image 2026-06-23 at 00.45.41 (${i + 1}).jpeg`),
]

/* ── Folder 2 (150 photos) ── */
const FILES2 = [
  'WhatsApp Image 2026-06-23 at 01.09.17.jpeg',
  ...Array.from({ length: 42 }, (_, i) => `WhatsApp Image 2026-06-23 at 01.09.17 (${i + 1}).jpeg`),
  'WhatsApp Image 2026-06-23 at 01.09.18.jpeg',
  ...Array.from({ length: 6 },  (_, i) => `WhatsApp Image 2026-06-23 at 01.09.18 (${i + 1}).jpeg`),
  'WhatsApp Image 2026-06-23 at 01.17.15.jpeg',
  'WhatsApp Image 2026-06-23 at 01.17.15 (1).jpeg',
  'WhatsApp Image 2026-06-23 at 01.17.23.jpeg',
  ...Array.from({ length: 3 },  (_, i) => `WhatsApp Image 2026-06-23 at 01.17.23 (${i + 1}).jpeg`),
  'WhatsApp Image 2026-06-23 at 01.17.25.jpeg',
  ...Array.from({ length: 4 },  (_, i) => `WhatsApp Image 2026-06-23 at 01.17.25 (${i + 1}).jpeg`),
  'WhatsApp Image 2026-06-23 at 01.17.27.jpeg',
  ...Array.from({ length: 48 }, (_, i) => `WhatsApp Image 2026-06-23 at 01.17.27 (${i + 1}).jpeg`),
  'WhatsApp Image 2026-06-23 at 01.17.28.jpeg',
  ...Array.from({ length: 39 }, (_, i) => `WhatsApp Image 2026-06-23 at 01.17.28 (${i + 1}).jpeg`),
]

const PHOTOS = [
  ...FILES1.map((f, i) => ({ src: `${B1}/${enc(f)}`, id: i })),
  ...FILES2.map((f, i) => ({ src: `${B2}/${enc(f)}`, id: FILES1.length + i })),
]

const ACCENT     = '#c8a8e0'
const ACCENT_RGB = '200,168,224'

export default function ZamanTuneli({ onBack }: { onBack: () => void }) {
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    const bar = barRef.current
    if (!el || !bar) return
    const onScroll = () => {
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight)
      bar.style.width = `${Math.min(pct * 100, 100)}%`
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, ei) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.style.transitionDelay = `${ei * 0.04}s`
          el.style.opacity = '1'
          el.style.transform = 'translateX(0) translateY(0)'
          obs.unobserve(el)
          setTimeout(() => { el.style.transitionDelay = '0s' }, 700)
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    cardRefs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{ position: 'fixed', inset: 0, background: '#030209', overflow: 'hidden' }}
    >
      {/* Star dots */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
        backgroundSize: '88px 88px', opacity: 0.18,
      }} />

      {/* Top glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 0%, rgba(${ACCENT_RGB},0.06) 0%, transparent 55%)`,
      }} />

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        whileHover={{ opacity: 0.8, x: -3 }} onClick={onBack}
        style={{
          position: 'absolute', top: '1.4rem', left: '1.4rem', zIndex: 50,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: IN, fontSize: '0.65rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
        }}
      >
        ← Geri
      </motion.button>

      {/* Scroll area */}
      <div ref={scrollRef} style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        paddingTop: '5rem', paddingBottom: '8rem',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1rem' }}
        >
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            style={{ fontSize: '2rem', marginBottom: '1rem', filter: `drop-shadow(0 0 22px rgba(${ACCENT_RGB},0.7))` }}
          >
            ⏳
          </motion.div>
          <h1 style={{ fontFamily: PF, fontSize: 'clamp(1.7rem,4.5vw,2.4rem)', color: '#fff', margin: '0 0 0.5rem', textShadow: `0 0 40px rgba(${ACCENT_RGB},0.3)` }}>
            Zaman Tüneli
          </h1>
          <p style={{ fontFamily: CO, fontSize: 'clamp(0.9rem,2vw,1.05rem)', fontStyle: 'italic', color: `rgba(${ACCENT_RGB},0.5)`, margin: 0 }}>
            Geçmişten bugüne, seninle her an
          </p>
          <p style={{ fontFamily: IN, fontSize: '0.62rem', letterSpacing: '0.2em', color: `rgba(${ACCENT_RGB},0.3)`, marginTop: '0.6rem' }}>
            {PHOTOS.length} fotoğraf
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '1.4rem' }}>
            <div style={{ width: 40, height: 1, background: `rgba(${ACCENT_RGB},0.2)` }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: `rgba(${ACCENT_RGB},0.35)` }} />
            <div style={{ width: 40, height: 1, background: `rgba(${ACCENT_RGB},0.2)` }} />
          </div>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto', padding: '0 clamp(1rem,4vw,2rem)' }}>

          {/* Center line (desktop) */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, transparent, rgba(${ACCENT_RGB},0.22) 4%, rgba(${ACCENT_RGB},0.22) 96%, transparent)`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }} />

          {PHOTOS.map((photo, i) => {
            const isLeft = i % 2 === 0
            return (
              <div
                key={photo.id}
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  alignItems: 'center',
                  marginBottom: 'clamp(1.2rem,2.5vw,2rem)',
                  position: 'relative',
                }}
              >
                {/* Center dot */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 7, height: 7, borderRadius: '50%',
                  background: `rgba(${ACCENT_RGB},0.45)`,
                  boxShadow: `0 0 8px rgba(${ACCENT_RGB},0.35)`,
                  zIndex: 2,
                }} />

                {/* Card */}
                <div
                  ref={el => { cardRefs.current[i] = el }}
                  style={{
                    width: 'calc(50% - 26px)',
                    opacity: 0,
                    transform: `translateX(${isLeft ? '-24px' : '24px'})`,
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    willChange: 'opacity, transform',
                  }}
                >
                  <div
                    style={{
                      borderRadius: 14,
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid rgba(${ACCENT_RGB},0.09)`,
                      boxShadow: `0 6px 28px rgba(0,0,0,0.5)`,
                      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.boxShadow = `0 10px 40px rgba(0,0,0,0.65), 0 0 24px rgba(${ACCENT_RGB},0.14)`
                      el.style.transform = 'scale(1.018)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.boxShadow = `0 6px 28px rgba(0,0,0,0.5)`
                      el.style.transform = 'scale(1)'
                    }}
                  >
                    {/* Fixed-ratio image container */}
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', background: 'rgba(255,255,255,0.02)' }}>
                      <img
                        src={photo.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    {/* Index */}
                    <div style={{ padding: '0.45rem 0.8rem', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.22)' }}>
                      <span style={{ fontFamily: IN, fontSize: '0.55rem', letterSpacing: '0.12em', color: `rgba(${ACCENT_RGB},0.35)` }}>
                        {String(i + 1).padStart(3, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* End marker */}
          <div style={{ textAlign: 'center', padding: '3rem 0 1rem', position: 'relative', zIndex: 2 }}>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}
            >
              <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, rgba(${ACCENT_RGB},0.3), transparent)` }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 16px rgba(${ACCENT_RGB},0.7)` }} />
              <p style={{ fontFamily: CO, fontSize: '0.88rem', fontStyle: 'italic', color: `rgba(${ACCENT_RGB},0.4)`, marginTop: '0.5rem' }}>
                Devam ediyoruz...
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `rgba(${ACCENT_RGB},0.1)`, zIndex: 20, pointerEvents: 'none' }}>
        <div ref={barRef} style={{ height: '100%', width: '0%', background: `linear-gradient(90deg, rgba(${ACCENT_RGB},0.4), ${ACCENT})`, transition: 'width 0.1s linear', boxShadow: `0 0 6px rgba(${ACCENT_RGB},0.5)` }} />
      </div>

      {/* Top/bottom fades */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5rem', background: 'linear-gradient(to bottom, #030209, transparent)', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5rem', background: 'linear-gradient(to top, #030209, transparent)', pointerEvents: 'none', zIndex: 10 }} />
    </motion.div>
  )
}
