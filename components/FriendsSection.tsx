'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const FRIEND_CARDS = [
  {
    name: 'Arkadaşın',
    emoji: '💕',
    color: '#FF4D88',
    messages: [
      { q: 'Seni ilk gördüğümde...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'Sende en sevdiğim özellik...', a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'İyi ki varsın çünkü...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
    ],
  },
  {
    name: 'En Yakın Arkadaşın',
    emoji: '🌸',
    color: '#FFC2D1',
    messages: [
      { q: 'Seni ilk gördüğümde...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'Sende en sevdiğim özellik...', a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'İyi ki varsın çünkü...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
    ],
  },
  {
    name: 'Canın',
    emoji: '🦋',
    color: '#9B8EC4',
    messages: [
      { q: 'Seni ilk gördüğümde...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'Sende en sevdiğim özellik...', a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'İyi ki varsın çünkü...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
    ],
  },
  {
    name: 'Kıymetlim',
    emoji: '🌙',
    color: '#FFD700',
    messages: [
      { q: 'Seni ilk gördüğümde...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'Sende en sevdiğim özellik...', a: 'Arkadaşının mesajını buraya ekleyin.' },
      { q: 'İyi ki varsın çünkü...',       a: 'Arkadaşının mesajını buraya ekleyin.' },
    ],
  },
]

export default function FriendsSection() {
  const [selected, setSelected] = useState<typeof FRIEND_CARDS[0] | null>(null)

  return (
    <section id="friends" style={{ position: 'relative', minHeight: '100vh', padding: '8rem 1rem', overflow: 'hidden' }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 30% 50%, rgba(255,77,136,.03) 0%, transparent 60%)' }} />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', marginBottom: '4.5rem' }}
      >
        <p style={{ fontFamily: IN, fontSize: '.68rem', color: 'rgba(255,194,209,.45)', letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Hafıza Müzesi</p>
        <h2 className="text-gradient" style={{ fontFamily: PF, fontSize: 'clamp(2.2rem,5vw,4.5rem)', display: 'block', marginBottom: '1.2rem' }}>Arkadaşlarının Gözünden</h2>
        <div className="section-divider" style={{ marginBottom: '1.5rem' }} />
        <p style={{ fontFamily: CO, fontSize: '1.1rem', color: 'rgba(255,255,255,.4)', fontStyle: 'italic' }}>
          Seni sevenler ne düşünüyor?
        </p>
      </motion.div>

      {/* Grid */}
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
        {FRIEND_CARDS.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .8, delay: i * .12 }}
          >
            <div
              className="glass"
              onClick={() => setSelected(card)}
              style={{
                borderRadius: '1.6rem', padding: '2.5rem',
                textAlign: 'center', cursor: 'pointer',
                borderColor: `${card.color}18`,
                transition: 'transform .4s, box-shadow .4s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(-8px) scale(1.02)'
                el.style.boxShadow = `0 20px 60px ${card.color}20`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(0) scale(1)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Top shimmer */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${card.color}55,transparent)` }} />

              <div style={{ fontSize: '3rem', marginBottom: '1.25rem', filter: `drop-shadow(0 0 16px ${card.color}60)` }}>
                {card.emoji}
              </div>
              <h3 style={{ fontFamily: PF, fontSize: '1.3rem', color: 'rgba(255,255,255,.88)', marginBottom: '.5rem' }}>{card.name}</h3>
              <p style={{ fontFamily: CO, fontSize: '.9rem', color: `${card.color}70`, fontStyle: 'italic' }}>Mesajını gör →</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,5,.92)' }} onClick={() => setSelected(null)} />
            <motion.div
              initial={{ scale: .85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: .85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-pink"
              style={{ position: 'relative', borderRadius: '1.6rem', padding: '3rem', maxWidth: 500, width: '100%', boxShadow: `0 0 80px ${selected.color}20` }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', filter: `drop-shadow(0 0 20px ${selected.color}80)` }}>{selected.emoji}</span>
                <h3 style={{ fontFamily: PF, fontSize: '2rem', color: selected.color, marginTop: '1rem' }}>{selected.name}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {selected.messages.map((msg, i) => (
                  <div key={i} style={{ borderTop: '1px solid rgba(255,77,136,.15)', paddingTop: '1.25rem' }}>
                    <p style={{ fontFamily: IN, fontSize: '.6rem', color: 'rgba(255,194,209,.5)', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: '.6rem' }}>
                      {msg.q}
                    </p>
                    <p style={{ fontFamily: CO, fontSize: '1.1rem', color: 'rgba(255,255,255,.75)', fontStyle: 'italic', lineHeight: 1.65 }}>
                      {msg.a}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{
                  display: 'block', margin: '2.5rem auto 0', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: IN, fontSize: '.62rem', letterSpacing: '.28em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.25)',
                }}
              >
                Kapat ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
