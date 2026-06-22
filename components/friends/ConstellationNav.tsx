'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

interface PlanetDef {
  id: string; name: string; sub: string; desc: string
  emoji: string; color: string; glowRgb: string; bg: string; size: number
}

const PLANETS: PlanetDef[] = [
  {
    id: 'ilayda', name: 'İlayda', sub: 'Macera & Kahkaha', desc: 'Birlikte 47 anı',
    emoji: '✨', color: '#FFB347', glowRgb: '255,179,71', size: 228,
    bg: 'radial-gradient(circle at 38% 32%, #fff3c0 0%, #f0a020 28%, #c07810 58%, #6a3800 82%, #1a0800 100%)',
  },
  {
    id: 'seda', name: 'Seda', sub: 'Güvenli Liman', desc: 'Birlikte 38 anı',
    emoji: '🌸', color: '#4CAAFF', glowRgb: '76,170,255', size: 218,
    bg: 'radial-gradient(circle at 38% 32%, #c8f0ff 0%, #2880d0 28%, #1050a0 58%, #082060 82%, #010814 100%)',
  },
  {
    id: 'cemile', name: 'Cemile', sub: 'Gece Yarısı Sohbetleri', desc: 'Birlikte 29 anı',
    emoji: '🌙', color: '#FF7055', glowRgb: '255,112,85', size: 208,
    bg: 'radial-gradient(circle at 38% 32%, #ffd0c0 0%, #e04020 28%, #a02000 58%, #500800 82%, #100000 100%)',
  },
  {
    id: 'together', name: 'Hepimiz', sub: 'Bir Arada Olduğumuzda', desc: 'Ortak evren',
    emoji: '⭐', color: '#BB88FF', glowRgb: '187,136,255', size: 258,
    bg: 'radial-gradient(circle at 38% 32%, #f0e0ff 0%, #a060e8 28%, #6030b0 58%, #280870 82%, #050010 100%)',
  },
]

/* ── Star background ── */
function StarCanvas() {
  const cvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const ctx = cv.getContext('2d')!

    const setSize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    setSize()
    window.addEventListener('resize', setSize)

    type Star = { x: number; y: number; r: number; o: number; ph: number; sp: number }
    const mkStars = (n: number, rMax: number, oMax: number): Star[] =>
      Array.from({ length: n }, () => ({
        x: Math.random() * cv.width, y: Math.random() * cv.height,
        r: Math.random() * rMax + 0.15,
        o: Math.random() * oMax + 0.1,
        ph: Math.random() * Math.PI * 2,
        sp: 0.3 + Math.random() * 0.5,
      }))

    const small  = mkStars(260, 0.9, 0.42)
    const bright = mkStars(16,  1.4, 0.48)

    let id = 0; let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      t += 0.01

      small.forEach(s => {
        const o = s.o * (0.65 + 0.35 * Math.sin(t * s.sp + s.ph))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(215,228,255,${o})`; ctx.fill()
      })

      bright.forEach(s => {
        const o = s.o * (0.55 + 0.45 * Math.sin(t * s.sp + s.ph))
        const arm = s.r * 2.8
        ctx.save(); ctx.globalAlpha = o * 0.65
        ctx.strokeStyle = 'rgba(255,248,230,0.75)'; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm); ctx.stroke()
        ctx.restore()
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,248,230,${o})`; ctx.fill()
      })

      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', setSize) }
  }, [])

  return <canvas ref={cvRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

/* ── Planet card ── */
function PlanetCard({
  planet, onClick, dimmed, selected,
}: {
  planet: PlanetDef; onClick: () => void; dimmed: boolean; selected: boolean
}) {
  const [hov, setHov] = useState(false)
  const sz = planet.size

  return (
    <motion.div
      animate={{ opacity: dimmed ? 0 : 1, scale: selected ? 1.12 : 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', cursor: dimmed ? 'default' : 'pointer' }}
      onHoverStart={() => { if (!dimmed && !selected) setHov(true) }}
      onHoverEnd={() => setHov(false)}
      onClick={() => { if (!dimmed && !selected) onClick() }}
    >
      {/* Sphere container */}
      <div style={{ position: 'relative', width: sz, height: sz }}>

        {/* Orbit ring 1 */}
        <motion.div
          animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.88 }}
          transition={{ duration: 0.28 }}
          style={{
            position: 'absolute', inset: -20, borderRadius: '50%',
            border: `1px solid rgba(${planet.glowRgb},0.35)`,
            pointerEvents: 'none',
          }}
        />
        {/* Orbit ring 2 */}
        <motion.div
          animate={{ opacity: hov ? 0.4 : 0, scale: hov ? 1 : 0.8 }}
          transition={{ duration: 0.28, delay: 0.06 }}
          style={{
            position: 'absolute', inset: -38, borderRadius: '50%',
            border: `1px solid rgba(${planet.glowRgb},0.14)`,
            pointerEvents: 'none',
          }}
        />

        {/* Breathing glow */}
        <motion.div
          animate={{ opacity: [0.3, hov ? 0.72 : 0.5, 0.3], scale: [1, 1.06, 1] }}
          transition={{ duration: hov ? 2 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -(sz * 0.18),
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${planet.glowRgb},0.2) 0%, transparent 68%)`,
            filter: 'blur(16px)',
            pointerEvents: 'none',
          }}
        />

        {/* Sphere */}
        <motion.div
          animate={{ scale: hov ? 1.07 : 1 }}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: planet.bg,
            boxShadow: hov
              ? `0 0 55px rgba(${planet.glowRgb},0.55), 0 0 110px rgba(${planet.glowRgb},0.22), inset -${sz * 0.12}px -${sz * 0.09}px ${sz * 0.17}px rgba(0,0,0,0.88)`
              : `0 0 28px rgba(${planet.glowRgb},0.22), 0 0 60px rgba(${planet.glowRgb},0.08), inset -${sz * 0.12}px -${sz * 0.09}px ${sz * 0.17}px rgba(0,0,0,0.88)`,
            transition: 'box-shadow 0.32s ease',
          }}
        >
          {/* Specular */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 26%, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.06) 38%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          {/* Shadow depth */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle at 72% 74%, rgba(0,0,0,0.38) 0%, transparent 52%)',
            pointerEvents: 'none',
          }} />
          {/* Emoji */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: `${sz * 0.24}px`,
            filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.92))',
          }}>
            {planet.emoji}
          </div>
        </motion.div>
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{
          fontFamily: PF, fontSize: '1.12rem', color: planet.color,
          letterSpacing: '0.05em', margin: '0 0 0.3rem',
          textShadow: `0 0 22px rgba(${planet.glowRgb},0.48)`,
        }}>{planet.name}</p>
        <p style={{
          fontFamily: CO, fontSize: '0.87rem', fontStyle: 'italic',
          color: 'rgba(255,255,255,0.4)', margin: '0 0 0.22rem',
        }}>{planet.sub}</p>
        <p style={{
          fontFamily: IN, fontSize: '0.6rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: `rgba(${planet.glowRgb},0.36)`, margin: 0,
        }}>{planet.desc}</p>
      </div>
    </motion.div>
  )
}

/* ── Props ── */
interface Props {
  onSelect: (id: string) => void
  onBack: () => void
  onTogether: () => void
  onWhoAreYou: () => void
}

/* ── Desktop ── */
function DesktopNav({ onSelect, onBack, onTogether, onWhoAreYou }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => { setTimeout(() => setReady(true), 180) }, [])

  const handleClick = (id: string) => {
    if (selected) return
    setSelected(id)
    setTimeout(() => { id === 'together' ? onTogether() : onSelect(id) }, 980)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'fixed', inset: 0, background: '#02020e', overflow: 'hidden' }}
    >
      <StarCanvas />

      {/* Nebula blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '12%', left: '6%', width: '38vw', height: '38vh', background: 'radial-gradient(ellipse, rgba(70,25,108,0.11) 0%, transparent 70%)', filter: 'blur(55px)' }} />
        <div style={{ position: 'absolute', bottom: '14%', right: '8%', width: '32vw', height: '32vh', background: 'radial-gradient(ellipse, rgba(18,48,110,0.09) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '42%', left: '48%', width: '28vw', height: '28vh', background: 'radial-gradient(ellipse, rgba(100,35,60,0.07) 0%, transparent 70%)', filter: 'blur(65px)' }} />
      </div>

      {/* Fade overlay on select */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: 'easeIn' }}
            style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 50, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -14 }}
        transition={{ delay: 0.38, duration: 0.7 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.6rem clamp(1.5rem,4vw,3rem)',
        }}
      >
        <motion.button whileHover={{ opacity: 0.85, x: -3 }} onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          ← Çıkış
        </motion.button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: PF, fontSize: 'clamp(0.92rem,2vw,1.12rem)', color: 'rgba(255,255,255,0.82)', letterSpacing: '0.04em', margin: '0 0 0.2rem' }}>
            Arkadaşların Evreni
          </p>
          <p style={{ fontFamily: CO, fontSize: '0.68rem', fontStyle: 'italic', color: 'rgba(255,215,0,0.3)', margin: 0 }}>
            Bir gezegene tıkla · içine gir
          </p>
        </div>

        <motion.button whileHover={{ opacity: 0.78 }} onClick={onWhoAreYou}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
          Sen Kimsin? ◈
        </motion.button>
      </motion.div>

      {/* Planets row */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 'clamp(2.5rem,4.5vw,6rem)',
        padding: '6rem 3rem 3rem',
      }}>
        {PLANETS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 45 }}
            transition={{ delay: 0.28 + i * 0.1, duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <PlanetCard
              planet={p}
              onClick={() => handleClick(p.id)}
              dimmed={!!selected && selected !== p.id}
              selected={selected === p.id}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: ready && !selected ? 0.26 : 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: IN, fontSize: '0.55rem', letterSpacing: '0.24em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
          pointerEvents: 'none', whiteSpace: 'nowrap', margin: 0,
        }}
      >
        Bir gezegene tıkla · keşfe başla
      </motion.p>
    </motion.div>
  )
}

/* ── Mobile ── */
function MobileNav({ onSelect, onBack, onTogether }: Props) {
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const touchX = useRef(0)
  const [dir, setDir] = useState(1)

  useEffect(() => { setTimeout(() => setReady(true), 280) }, [])

  const handleClick = (id: string) => {
    if (selected) return
    setSelected(id)
    setTimeout(() => { id === 'together' ? onTogether() : onSelect(id) }, 980)
  }

  const swipe = (d: 1 | -1) => {
    setDir(d)
    setActive(i => Math.max(0, Math.min(PLANETS.length - 1, i + d)))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: '#02020e', overflow: 'hidden' }}
    >
      <StarCanvas />

      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '55vh',
        background: 'radial-gradient(ellipse, rgba(60,20,100,0.13) 0%, transparent 70%)',
        filter: 'blur(55px)', pointerEvents: 'none',
      }} />

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 50, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: ready ? 1 : 0, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.4rem 1.5rem',
        }}
      >
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          ← Çıkış
        </button>
        <p style={{ fontFamily: PF, fontSize: '0.95rem', color: 'rgba(255,255,255,0.78)', margin: 0 }}>
          Arkadaşların Evreni
        </p>
        <div style={{ width: 48 }} />
      </motion.div>

      {/* Planet */}
      <div
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 45) swipe(dx < 0 ? 1 : -1)
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          {ready && (
            <motion.div
              key={active}
              custom={dir}
              initial={{ opacity: 0, x: dir * 55, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir * -55, scale: 0.92 }}
              transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <PlanetCard
                planet={{ ...PLANETS[active], size: 276 }}
                onClick={() => handleClick(PLANETS[active].id)}
                dimmed={false}
                selected={selected === PLANETS[active].id}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute', bottom: '5.5rem', left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', zIndex: 20,
      }}>
        <motion.button
          onClick={() => swipe(-1)}
          animate={{ opacity: active > 0 ? 0.45 : 0.1 }}
          whileHover={{ opacity: 0.8 }}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>
          ←
        </motion.button>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {PLANETS.map((p, i) => (
            <motion.div key={p.id}
              animate={{ width: i === active ? 22 : 5, background: i === active ? p.color : 'rgba(255,255,255,0.18)' }}
              style={{ height: 5, borderRadius: 3, cursor: 'pointer' }}
              onClick={() => { setDir(i > active ? 1 : -1); setActive(i) }}
            />
          ))}
        </div>
        <motion.button
          onClick={() => swipe(1)}
          animate={{ opacity: active < PLANETS.length - 1 ? 0.45 : 0.1 }}
          whileHover={{ opacity: 0.8 }}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>
          →
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 0.28 : 0 }}
        transition={{ delay: 1.2 }}
        style={{ position: 'absolute', bottom: '2.2rem', left: '50%', transform: 'translateX(-50%)', fontFamily: IN, fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', pointerEvents: 'none', margin: 0 }}>
        Kaydırarak gezegenler arası geç
      </motion.p>
    </motion.div>
  )
}

/* ── Main export ── */
export default function ConstellationNav({ onSelect, onBack, onTogether, onWhoAreYou }: Props) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
    ? <MobileNav onSelect={onSelect} onBack={onBack} onTogether={onTogether} onWhoAreYou={onWhoAreYou} />
    : <DesktopNav onSelect={onSelect} onBack={onBack} onTogether={onTogether} onWhoAreYou={onWhoAreYou} />
}
