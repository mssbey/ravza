'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const VAULT_ITEMS = [
  { id: 1, emoji: '🌙', label: 'Bunu kötü hissettiğin gün dinle',    hint: 'Seni duyuyorum. Her zaman buradayım ve seni seviyorum.',         locked: false },
  { id: 2, emoji: '💛', label: 'Bunu özlediğinde aç',                 hint: 'Ben de özlüyorum. Her saniye, her nefeste.',                     locked: false },
  { id: 3, emoji: '✨', label: 'Bunu çok mutlu olduğunda aç',         hint: 'Sevinciyle dolu her anında seninleyim — uzakta da olsam.',       locked: false },
  { id: 4, emoji: '🎂', label: 'Bunu doğum gününde aç',               hint: 'Doğduğun günün benim için ne kadar kıymetli olduğunu biliyor musun?', locked: true, date: 'Doğum Günün' },
]

const BAR_COUNT = 42

function WaveBar({ playing, idx }: { playing: boolean; idx: number }) {
  const height = 20 + Math.sin(idx * 0.7) * 55
  return (
    <motion.div
      style={{ flex: 1, borderRadius: 4, background: '#FF4D88' }}
      animate={playing ? {
        height: [`${height * .4}%`, `${height}%`, `${height * .4}%`],
        opacity: [.6, 1, .6],
      } : { height: '18%', opacity: .35 }}
      transition={{
        duration: .7 + idx * .02,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: idx * .015,
      }}
    />
  )
}

export default function VoiceVault() {
  const [opened,  setOpened]  = useState<number | null>(null)
  const [playing, setPlaying] = useState<number | null>(null)

  const toggle = (id: number, locked: boolean) => {
    if (locked) return
    setOpened(prev => {
      if (prev === id) { setPlaying(null); return null }
      setPlaying(null)
      return id
    })
  }

  return (
    <section id="vault" style={{ position: 'relative', minHeight: '100vh', padding: '8rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 40%, rgba(255,77,136,.04) 0%, transparent 65%)' }} />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', marginBottom: '4.5rem' }}
      >
        <p style={{ fontFamily: IN, fontSize: '.68rem', color: 'rgba(255,194,209,.45)', letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Ses Kasası</p>
        <h2 className="text-gradient" style={{ fontFamily: PF, fontSize: 'clamp(2.2rem,5vw,4.5rem)', display: 'block', marginBottom: '1.2rem' }}>Sesli Mesajlar</h2>
        <div className="section-divider" style={{ marginBottom: '1.5rem' }} />
        <p style={{ fontFamily: CO, fontSize: '1.1rem', color: 'rgba(255,255,255,.4)', fontStyle: 'italic', maxWidth: 480, margin: '0 auto' }}>
          Her kaset bir andır. Her an sana aittir.
        </p>
      </motion.div>

      {/* Cards */}
      <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {VAULT_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7, delay: i * .1 }}
          >
            <div
              className="glass"
              onClick={() => toggle(item.id, item.locked)}
              style={{
                borderRadius: '1.2rem',
                overflow: 'hidden',
                borderColor: opened === item.id ? 'rgba(255,77,136,.4)' : 'rgba(255,255,255,.06)',
                opacity: item.locked ? .5 : 1,
                cursor: item.locked ? 'not-allowed' : 'pointer',
                transition: 'transform .3s, border-color .3s',
                transform: opened === item.id ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.4rem 1.75rem' }}>
                <span style={{ fontSize: '2.2rem', filter: item.locked ? 'grayscale(1)' : 'none' }}>
                  {item.locked ? '🔒' : item.emoji}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: PF, fontSize: '1.05rem', color: 'rgba(255,255,255,.9)', marginBottom: item.locked ? '.3rem' : 0 }}>
                    {item.label}
                  </p>
                  {item.locked && item.date && (
                    <p style={{ fontFamily: CO, fontSize: '.85rem', color: 'rgba(255,255,255,.28)', fontStyle: 'italic' }}>
                      {item.date}'na kadar kilitli
                    </p>
                  )}
                </div>
                {!item.locked && (
                  <motion.span
                    animate={{ rotate: opened === item.id ? 90 : 0 }}
                    transition={{ duration: .28 }}
                    style={{ color: 'rgba(255,77,136,.6)', fontSize: '1rem' }}
                  >
                    ▶
                  </motion.span>
                )}
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {opened === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .38 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '1.25rem 1.75rem 1.6rem', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                      {/* Waveform */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 48, marginBottom: '1.2rem' }}>
                        {Array.from({ length: BAR_COUNT }).map((_, j) => (
                          <WaveBar key={j} playing={playing === item.id} idx={j} />
                        ))}
                      </div>

                      <p style={{ fontFamily: CO, fontSize: '1.05rem', color: 'rgba(255,255,255,.65)', fontStyle: 'italic', marginBottom: '1.2rem', lineHeight: 1.65 }}>
                        {item.hint}
                      </p>

                      <button
                        onClick={(e) => { e.stopPropagation(); setPlaying(v => v === item.id ? null : item.id) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '.6rem',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: IN, fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase',
                          color: playing === item.id ? '#FFC2D1' : '#FF4D88',
                          transition: 'color .25s',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{playing === item.id ? '⏸' : '▶'}</span>
                        {playing === item.id ? 'Duraklat' : 'Oynat'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
