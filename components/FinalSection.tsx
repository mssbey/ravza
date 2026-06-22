'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const SLIDES = [
  'Seni tanıdığım ilk andan itibaren...',
  'Her gülen gözünde bir dünya gördüm.',
  'Kalbim seninle büyüdü.',
  'Ve ne olursa olsun...',
  'Seni sevmek en güzel şeyim oldu.',
  '♥',
]

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 1,
  color: i % 3 === 0 ? '#FF4D88' : i % 3 === 1 ? '#FFC2D1' : '#fff',
  duration: 4 + Math.random() * 5,
  delay: Math.random() * 4,
}))

export default function FinalSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-150px' })

  const [showSlideshow, setShowSlideshow] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)
  const [slideDone, setSlideDone] = useState(false)

  const startSlideshow = () => {
    setShowSlideshow(true)
    setSlideDone(false)
    setSlideIdx(0)

    let i = 0
    const next = () => {
      if (i >= SLIDES.length - 1) { setSlideDone(true); return }
      i++
      setSlideIdx(i)
      setTimeout(next, i === SLIDES.length - 1 ? 3000 : 2400)
    }
    setTimeout(next, 2400)
  }

  return (
    <section
      id="final"
      ref={ref}
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#020205' }}
    >
      {/* Ambient particles */}
      {inView && PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', left: p.x, top: p.y,
            width: p.size, height: p.size,
            borderRadius: '50%', background: p.color,
            pointerEvents: 'none',
          }}
          animate={{ y: [0, -55, 0], opacity: [0, .65, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* BG gradient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 60%, rgba(255,77,136,.06) 0%, transparent 65%)' }} />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 760, padding: '2rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [.4,0,.2,1] }}
        >
          <p style={{ fontFamily: IN, fontSize: '.68rem', color: 'rgba(255,194,209,.4)', letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: '2rem' }}>Son Sayfa</p>

          <h2
            style={{
              fontFamily: PF,
              fontSize: 'clamp(2.2rem,6vw,5.5rem)',
              lineHeight: 1.2,
              marginBottom: '3rem',
              color: 'rgba(255,255,255,.95)',
              textShadow: '0 0 80px rgba(255,77,136,.2)',
            }}
          >
            Eğer Bir Gün{' '}
            <span className="text-gradient" style={{ display: 'inline-block' }}>Ayrı Kalırsak</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: .9 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}
        >
          <p style={{ fontFamily: CO, fontSize: 'clamp(1rem,2vw,1.3rem)', color: 'rgba(255,255,255,.58)', lineHeight: 1.8, fontStyle: 'italic' }}>
            "Bu sayfayı hazırlarken amacım sadece bugün mutlu olman değildi..."
          </p>
          <p style={{ fontFamily: CO, fontSize: 'clamp(.95rem,1.8vw,1.2rem)', color: 'rgba(255,255,255,.38)', lineHeight: 1.8, fontStyle: 'italic' }}>
            Sana hatırlatmak istedim: Ne zaman yalnız hissedersen, bu sayfaya geri dön.
            Burada seni seven insanların sesi, kalbi ve sevgisi var.
          </p>
          <p style={{ fontFamily: CO, fontSize: 'clamp(.95rem,1.8vw,1.2rem)', color: 'rgba(255,255,255,.38)', lineHeight: 1.8, fontStyle: 'italic' }}>
            Ve en önemlisi: Sen burada sonsuzca seviliyorsun.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.6 }}
          onClick={startSlideshow}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: .97 }}
          className="glass-pink"
          style={{
            borderRadius: '3rem', padding: '.9rem 2.8rem', cursor: 'pointer',
            fontFamily: IN, fontSize: '.7rem', letterSpacing: '.28em', textTransform: 'uppercase',
            color: '#FF4D88', border: '1px solid rgba(255,77,136,.25)',
          }}
        >
          Son Sahneyi Oynat ▶
        </motion.button>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 2.2 }}
          style={{ marginTop: '5rem' }}
        >
          <div style={{ width: 80, height: 1, margin: '0 auto 1.5rem', background: 'linear-gradient(90deg,transparent,#FF4D88,transparent)' }} />
          <p className="text-gradient" style={{ fontFamily: PF, fontSize: '2rem', fontStyle: 'italic', display: 'block' }}>
            Seni Seviyorum ♥
          </p>
        </motion.div>
      </div>

      {/* Cinematic slideshow */}
      <AnimatePresence>
        {showSlideshow && (
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(2,2,8,.97)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (slideDone) setShowSlideshow(false) }}
          >
            {/* Rising particles */}
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  bottom: 0,
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#FF4D88' : '#FFC2D1',
                  pointerEvents: 'none',
                }}
                animate={{ y: [0, -(window.innerHeight + 100)], opacity: [0, .9, 0] }}
                transition={{ duration: 6 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }}
              />
            ))}

            {/* Slide text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={slideIdx}
                initial={{ opacity: 0, y: 25, scale: .95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25, scale: 1.05 }}
                transition={{ duration: .85 }}
                style={{
                  fontFamily: PF,
                  fontSize: 'clamp(1.6rem,4vw,3.5rem)',
                  color: slideIdx === SLIDES.length - 1 ? '#FF4D88' : 'rgba(255,255,255,.9)',
                  textAlign: 'center', padding: '0 2rem',
                  textShadow: slideIdx === SLIDES.length - 1 ? '0 0 60px rgba(255,77,136,.8)' : '0 0 40px rgba(255,77,136,.3)',
                  filter: slideIdx === SLIDES.length - 1 ? 'drop-shadow(0 0 30px rgba(255,77,136,.6))' : 'none',
                  zIndex: 10, position: 'relative',
                }}
              >
                {SLIDES[slideIdx]}
              </motion.p>
            </AnimatePresence>

            {slideDone && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: .5 }}
                style={{
                  position: 'absolute', bottom: '3.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: IN, fontSize: '.6rem', letterSpacing: '.25em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.22)',
                }}
              >
                Kapat ×
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
