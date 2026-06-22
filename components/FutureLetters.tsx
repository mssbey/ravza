'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const LETTERS = [
  {
    id: 1, icon: '📬', title: '1 Ay Sonra',
    subtitle: 'Yakında açılacak...',
    unlockDate: new Date(Date.now() + 30  * 24 * 60 * 60 * 1000),
    preview: 'Bir aylık yolculuğumuz tamamlandığında...',
    content: 'Bir ay geçti ve seninle geçirilen her gün bir öncekinden daha değerliydi. Bu mektubu yazarken sana olan sevgim büyüdü. Umarım bu ayı da güzelliklerle doldurdun. Seni seviyorum.',
  },
  {
    id: 2, icon: '💌', title: '6 Ay Sonra',
    subtitle: 'Biraz daha bekle...',
    unlockDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    preview: 'Altı aylık bir serüven...',
    content: 'Altı ay. 180 gün. Seninle her sabah uyanmak, her gece yanında olmak... Bu mektubu okuyorsan, demek ki buradayız. Hâlâ. Ve bu her şey demek.',
  },
  {
    id: 3, icon: '💝', title: '1 Yıl Sonra',
    subtitle: 'Özel bir gün için...',
    unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    preview: 'Bir yıllık sonsuzluk...',
    content: 'Bir yıl önce sana bu mektubu yazarken hayal edemezdim nasıl bir yıl geçireceğimizi. Ama şimdi biliyorum: seninle her an mükemmeldi. Seni seviyorum — bir yıl önce, bugün ve sonsuza kadar.',
  },
]

function Countdown({ target }: { target: Date }) {
  const [diff, setDiff] = useState(target.getTime() - Date.now())
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (diff <= 0) return <span style={{ color: '#FF4D88', fontFamily: PF }}>Açılabilir! ✨</span>

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  return (
    <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', marginTop: '1rem' }}>
      {[{ v: d, l: 'Gün' }, { v: h, l: 'Saat' }, { v: m, l: 'Dk' }, { v: s, l: 'Sn' }].map(({ v, l }) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: IN, fontSize: '1.6rem', fontWeight: 600, color: '#FF4D88', lineHeight: 1 }}>
            {String(v).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: IN, fontSize: '.55rem', color: 'rgba(255,255,255,.28)', letterSpacing: '.2em', textTransform: 'uppercase', marginTop: '.3rem' }}>
            {l}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FutureLetters() {
  const [opened, setOpened] = useState<number | null>(null)

  return (
    <section id="letters" style={{ position: 'relative', minHeight: '100vh', padding: '8rem 1rem', overflow: 'hidden' }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 60%, rgba(255,77,136,.04) 0%, transparent 65%)' }} />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', marginBottom: '4.5rem' }}
      >
        <p style={{ fontFamily: IN, fontSize: '.68rem', color: 'rgba(255,194,209,.45)', letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Zaman Kapsülleri</p>
        <h2 className="text-gradient" style={{ fontFamily: PF, fontSize: 'clamp(2.2rem,5vw,4.5rem)', display: 'block', marginBottom: '1.2rem' }}>Gelecekten Mektuplar</h2>
        <div className="section-divider" style={{ marginBottom: '1.5rem' }} />
        <p style={{ fontFamily: CO, fontSize: '1.1rem', color: 'rgba(255,255,255,.4)', fontStyle: 'italic' }}>
          Bazı sözler zamanı beklemeyi hak eder.
        </p>
      </motion.div>

      {/* Cards */}
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '2rem' }}>
        {LETTERS.map((letter, i) => {
          const unlocked = letter.unlockDate.getTime() <= Date.now()
          return (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .8, delay: i * .15 }}
            >
              <div
                className="glass"
                onClick={() => unlocked && setOpened(letter.id)}
                style={{
                  borderRadius: '1.6rem', padding: '2.5rem',
                  textAlign: 'center', position: 'relative', overflow: 'hidden',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  borderColor: unlocked ? 'rgba(255,77,136,.25)' : 'rgba(255,255,255,.06)',
                  transition: 'transform .3s, box-shadow .3s',
                }}
                onMouseEnter={e => { if (unlocked) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
              >
                {/* Top shimmer */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${unlocked ? '#FF4D88' : 'rgba(255,255,255,.15)'},transparent)` }} />

                <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem', filter: unlocked ? 'none' : 'grayscale(.7)' }}>
                  {unlocked ? letter.icon : '🔒'}
                </div>

                <h3 style={{ fontFamily: PF, fontSize: '1.5rem', color: unlocked ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.5)', marginBottom: '.5rem' }}>
                  {letter.title}
                </h3>
                <p style={{ fontFamily: CO, fontSize: '.95rem', color: 'rgba(255,194,209,.45)', fontStyle: 'italic', marginBottom: '1rem' }}>{letter.subtitle}</p>
                <p style={{ fontFamily: CO, fontSize: '.9rem', color: 'rgba(255,255,255,.25)', fontStyle: 'italic' }}>{letter.preview}</p>

                {!unlocked && <Countdown target={letter.unlockDate} />}

                {unlocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: '1.5rem', fontFamily: IN, fontSize: '.62rem', letterSpacing: '.28em', textTransform: 'uppercase', color: '#FF4D88' }}
                  >
                    Mektubu Aç →
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Letter modal */}
      <AnimatePresence>
        {opened !== null && (
          <motion.div
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,5,.92)' }} onClick={() => setOpened(null)} />

            {(() => {
              const l = LETTERS.find(x => x.id === opened)!
              return (
                <motion.div
                  initial={{ scale: .8, rotateY: 90 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  exit={{ scale: .8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                  className="glass-pink"
                  style={{
                    position: 'relative', borderRadius: '1.6rem', padding: '3rem',
                    maxWidth: 520, width: '100%', transformStyle: 'preserve-3d',
                    boxShadow: '0 0 80px rgba(255,77,136,.2)',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '3.5rem' }}>{l.icon}</span>
                    <h3 style={{ fontFamily: PF, fontSize: '2rem', color: '#FF4D88', marginTop: '1rem' }}>{l.title}</h3>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,77,136,.2)', paddingTop: '1.75rem' }}>
                    <p style={{ fontFamily: CO, fontSize: '1.2rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, fontStyle: 'italic', textAlign: 'center' }}>
                      {l.content}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpened(null)}
                    style={{
                      display: 'block', margin: '2rem auto 0', background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: IN, fontSize: '.62rem', letterSpacing: '.28em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,.25)',
                    }}
                  >
                    Kapat ×
                  </button>
                </motion.div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
