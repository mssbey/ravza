'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const CARDS = [
  {
    icon: '⚡',
    title: 'Senin Süper Gücün',
    text: 'Herkesin içini karanlık bir günde bile aydınlatabiliyorsun. Sadece gülümsemen yeterli. Bu sıradan bir güç değil — bu sihir.',
    color: '#FF4D88',
    glow: 'rgba(255,77,136,.35)',
  },
  {
    icon: '✨',
    title: 'En Güzel Gülüşün',
    text: 'Gerçekten güldüğünde tüm dünya durur. Gözlerin kıvılcım saçar, dudakların eğrilir ve o an için yaşamaya değer her şey anlam kazanır.',
    color: '#FFC2D1',
    glow: 'rgba(255,194,209,.35)',
  },
  {
    icon: '💫',
    title: 'Bende Bıraktığın İz',
    text: 'Seni tanımadan önceki ben ile sonraki ben arasında derin bir fark var. Daha iyi biri oldum. Ve bunu sana borçluyum.',
    color: '#FFD700',
    glow: 'rgba(255,215,0,.3)',
  },
]

function TiltCard({ card, idx }: { card: typeof CARDS[0]; idx: number }) {
  const ref   = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r  = ref.current!.getBoundingClientRect()
    const cx = e.clientX - r.left
    const cy = e.clientY - r.top
    setTilt({ x: (cy / r.height - .5) * -22, y: (cx / r.width  - .5) * 22 })
    setGlow({ x: (cx / r.width) * 100, y: (cy / r.height) * 100 })
  }

  const onLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlow({ x: 50, y: 50 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, delay: idx * .15, ease: [.4,0,.2,1] }}
      style={{ height: '100%' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        style={{ transformStyle: 'preserve-3d', perspective: 1000, height: '100%' }}
      >
        <div
          className="glass"
          style={{
            borderRadius: '1.6rem', padding: '2.5rem',
            height: '100%', position: 'relative', overflow: 'hidden',
            borderColor: `${card.color}22`,
            transition: 'box-shadow .4s',
          }}
        >
          {/* Dynamic glow */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '1.6rem',
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, ${card.glow} 0%, transparent 65%)`,
            transition: 'background .1s',
            pointerEvents: 'none',
          }} />

          {/* Top edge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg,transparent,${card.color}55,transparent)`,
          }} />

          {/* Content */}
          <div style={{ position: 'relative', transform: 'translateZ(24px)' }}>
            <div style={{
              fontSize: '3.2rem', marginBottom: '1.5rem', display: 'inline-block',
              filter: `drop-shadow(0 0 18px ${card.glow})`,
            }}>
              {card.icon}
            </div>

            <h3 style={{
              fontFamily: PF, fontSize: '1.5rem', color: card.color,
              marginBottom: '1.25rem', lineHeight: 1.3,
            }}>
              {card.title}
            </h3>

            <p style={{
              fontFamily: CO, fontSize: '1.1rem',
              color: 'rgba(255,255,255,.68)', lineHeight: 1.75, fontStyle: 'italic',
            }}>
              {card.text}
            </p>
          </div>

          {/* Bottom shimmer on hover */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg,transparent,${card.color}25,transparent)`,
          }} />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function WhoYouAreToMe() {
  return (
    <section id="who-you-are" style={{ position: 'relative', minHeight: '100vh', padding: '8rem 1rem', overflow: 'hidden' }}>
      {/* BG glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,77,136,.04) 0%, transparent 65%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <p style={{ fontFamily: IN, fontSize: '.68rem', color: 'rgba(255,194,209,.45)', letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Gözlerimden</p>
          <h2 className="text-gradient" style={{ fontFamily: PF, fontSize: 'clamp(2.2rem,5vw,4.5rem)', marginBottom: '1.2rem', display: 'block' }}>
            Sen Kimsin Benim İçin?
          </h2>
          <div className="section-divider" style={{ marginBottom: '1.5rem' }} />
          <p style={{ fontFamily: CO, fontSize: '1.1rem', color: 'rgba(255,255,255,.4)', fontStyle: 'italic' }}>
            Seni anlatmak için kelimeler yetmez. Ama deneyelim.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
        }}>
          {CARDS.map((c, i) => <TiltCard key={c.title} card={c} idx={i} />)}
        </div>
      </div>
    </section>
  )
}
