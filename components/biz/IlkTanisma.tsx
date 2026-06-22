'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const AMBER     = '#c8965a'
const AMBER_RGB = '200,150,90'
const CREAM     = 'rgba(255,245,228,0.88)'

/* ── Confetti ── */
function Confetti() {
  const pieces = useMemo(() => {
    const cols = ['#FFD700','#E8B870','#FFC47A','#FFECB3','#FFF4DC','#F5A623','#FFD27F','#FFF0A0','#FF9F6B','#FFFACD']
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: cols[i % cols.length],
      size: 5 + Math.random() * 7,
      delay: Math.random() * 4,
      dur: 4 + Math.random() * 5,
      rot: Math.random() * 720 - 360,
      isCircle: Math.random() > 0.42,
    }))
  }, [])
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {pieces.map(p => (
        <motion.div key={p.id}
          style={{ position: 'absolute', left: `${p.x}%`, top: 0, width: p.size, height: p.isCircle ? p.size : p.size * 0.45, borderRadius: p.isCircle ? '50%' : '1px', background: p.color }}
          animate={{ y: ['-2vh', '108vh'], rotate: [0, p.rot], opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

/* Story paragraphs */
const STORY: { type: string; text: string; speaker?: string }[] = [
  { type: 'narration', text: "Arkadaşlarımızla birlikte otururken Aslı'yla kahve almak için sıraya geçmiştik. Sırada beklerken uzakta bir kız gördüm." },
  { type: 'dialogue',  text: '"Oha, çok güzel... Çok tatlı bir kız değil mi?" dedim.' },
  { type: 'narration', text: 'Tam o anda o güzel kız bize döndü ve el salladı.' },
  { type: 'beat',      text: 'Ne olduğunu anlayamamıştım.' },
  { type: 'dialogue',  text: '"O benim oda arkadaşım, Ravza." dedi.', speaker: "Aslı gülerek:" },
  { type: 'narration', text: 'Sonra sana tekrar baktım.' },
  { type: 'narration', text: 'Belki birkaç saniyeydi ama bana çok daha uzun gelmişti.' },
  { type: 'emphasis',  text: 'Çünkü o an yüzündeki gülümsemeyi gördüm.' },
  { type: 'narration', text: 'İnsan gerçekten ilk görüşte aşık olabilir mi bilmiyordum.' },
  { type: 'pause',     text: 'O güne kadar…' },
  { type: 'narration', text: 'Ama o gün o duygunun nasıl bir şey olduğunu tattım.' },
  { type: 'closing',   text: 'Seni ilk gördüğüm andan itibaren seninle ilgili sayısız hayal kurdum.' },
  { type: 'closing',   text: 'Şimdi ise tek isteğim, kurduğum o hayalleri seninle birlikte yaşamak.' },
  { type: 'closing',   text: 'Hayatın bana getireceği her güzel günde, her zor günde, her yeni başlangıçta yanında olmak istiyorum.' },
  { type: 'closing',   text: "Çünkü benim hikâyem, seni gördüğüm o gün başladı." },
  { type: 'finale',    text: "Ve hâlâ en sevdiğim bölümünde yaşamaya devam ediyorum." },
]

function Paragraph({ item, index }: { item: typeof STORY[0]; index: number }) {
  const delay = 1.1 + index * 0.09

  if (item.type === 'beat') {
    return (
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.75 }}
        style={{
          fontFamily: CO, fontStyle: 'italic',
          fontSize: 'clamp(1rem,2.2vw,1.18rem)',
          color: `rgba(${AMBER_RGB},0.75)`,
          textAlign: 'center',
          margin: '0.2rem 0',
          letterSpacing: '0.03em',
        }}
      >{item.text}</motion.p>
    )
  }

  if (item.type === 'dialogue') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.7 }}
        style={{ paddingLeft: 'clamp(1.5rem,4vw,3rem)', borderLeft: `2px solid rgba(${AMBER_RGB},0.22)` }}
      >
        {item.speaker && (
          <p style={{ fontFamily: IN, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `rgba(${AMBER_RGB},0.45)`, margin: '0 0 0.3rem' }}>
            {item.speaker}
          </p>
        )}
        <p style={{
          fontFamily: CO, fontStyle: 'italic',
          fontSize: 'clamp(1rem,2.2vw,1.18rem)',
          color: CREAM, margin: 0,
          letterSpacing: '0.02em', lineHeight: 1.75,
        }}>{item.text}</p>
      </motion.div>
    )
  }

  if (item.type === 'emphasis') {
    return (
      <motion.p
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          fontFamily: CO, fontStyle: 'italic',
          fontSize: 'clamp(1.15rem,2.8vw,1.55rem)',
          color: `rgba(${AMBER_RGB},0.92)`,
          textAlign: 'center',
          letterSpacing: '0.03em',
          lineHeight: 1.6,
          margin: '0.4rem 0',
          textShadow: `0 0 40px rgba(${AMBER_RGB},0.35)`,
        }}
      >{item.text}</motion.p>
    )
  }

  if (item.type === 'pause') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 1 }}
        style={{ textAlign: 'center' }}
      >
        <p style={{
          fontFamily: CO, fontStyle: 'italic',
          fontSize: 'clamp(1.05rem,2.4vw,1.3rem)',
          color: `rgba(${AMBER_RGB},0.55)`,
          letterSpacing: '0.1em',
          margin: 0,
        }}>{item.text}</p>
      </motion.div>
    )
  }

  if (item.type === 'closing') {
    return (
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8 }}
        style={{
          fontFamily: CO,
          fontSize: 'clamp(1rem,2.2vw,1.18rem)',
          color: `rgba(255,245,228,0.78)`,
          letterSpacing: '0.02em',
          lineHeight: 1.85,
          margin: 0,
        }}
      >{item.text}</motion.p>
    )
  }

  if (item.type === 'finale') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ textAlign: 'center', padding: '0.8rem 0' }}
      >
        <div style={{ width: 40, height: 1, background: `rgba(${AMBER_RGB},0.3)`, margin: '0 auto 1.4rem' }} />
        <p style={{
          fontFamily: CO, fontStyle: 'italic',
          fontSize: 'clamp(1.15rem,2.8vw,1.5rem)',
          color: '#fff',
          letterSpacing: '0.04em',
          lineHeight: 1.65,
          textShadow: `0 0 50px rgba(${AMBER_RGB},0.4)`,
          margin: 0,
        }}>{item.text}</p>
      </motion.div>
    )
  }

  /* narration (default) */
  return (
    <motion.p
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.75 }}
      style={{
        fontFamily: CO,
        fontSize: 'clamp(1rem,2.2vw,1.18rem)',
        color: CREAM,
        letterSpacing: '0.02em',
        lineHeight: 1.85,
        margin: 0,
      }}
    >{item.text}</motion.p>
  )
}

export default function IlkTanisma({ onBack }: { onBack: () => void }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bottomRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShowConfetti(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ position: 'fixed', inset: 0, background: '#07050d', overflow: 'hidden' }}
    >
      {/* Subtle dot stars */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
        backgroundSize: '88px 88px', opacity: 0.14,
      }} />
      {/* Warm center glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, rgba(${AMBER_RGB},0.05) 0%, transparent 65%)`,
      }} />

      {showConfetti && <Confetti />}

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        whileHover={{ opacity: 0.85, x: -3 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', zIndex: 50, background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}
      >← Geri</motion.button>

      {/* Scroll container */}
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        scrollbarWidth: 'none',
        paddingBottom: '8rem',
      }}>

        {/* ── Photo hero ── */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ position: 'relative', width: '100%', height: 'clamp(320px,58vh,520px)', overflow: 'hidden' }}
        >
          <img
            src="/mahur.jpeg"
            alt="Mahur"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', filter: 'brightness(0.72) saturate(0.88)' }}
            draggable={false}
          />
          {/* Gradient fade to page bg */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, rgba(7,5,13,0.18) 0%, rgba(7,5,13,0.08) 40%, rgba(7,5,13,0.72) 78%, #07050d 100%)`,
          }} />
          {/* Subtle side vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(7,5,13,0.45) 0%, transparent 30%, transparent 70%, rgba(7,5,13,0.45) 100%)',
          }} />

          {/* Photo overlay text */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: 'clamp(1.5rem,4vw,3rem) clamp(1.5rem,6vw,4rem)',
            textAlign: 'center',
          }}>
            {/* Location pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.35rem 1.1rem',
                borderRadius: '2rem',
                border: `1px solid rgba(${AMBER_RGB},0.3)`,
                background: `rgba(${AMBER_RGB},0.08)`,
                backdropFilter: 'blur(12px)',
                marginBottom: '1.2rem',
              }}
            >
              <span style={{ fontSize: '0.72rem' }}>📍</span>
              <span style={{ fontFamily: IN, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: `rgba(${AMBER_RGB},0.75)` }}>Mahur Cafe</span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontFamily: CO, fontStyle: 'italic',
                fontSize: 'clamp(2.2rem,6vw,4rem)',
                color: '#fff',
                margin: '0 0 0.5rem',
                letterSpacing: '0.04em',
                textShadow: `0 0 60px rgba(${AMBER_RGB},0.45), 0 2px 30px rgba(0,0,0,0.7)`,
                lineHeight: 1.2,
              }}
            >
              Mahur'daydık.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.8 }}
              style={{
                fontFamily: CO, fontStyle: 'italic',
                fontSize: 'clamp(0.85rem,1.8vw,1.05rem)',
                color: `rgba(${AMBER_RGB},0.65)`,
                letterSpacing: '0.06em',
                margin: 0,
              }}
            >
              Seni ilk gördüğüm gün &nbsp;·&nbsp; İlk aşık olduğum gün
            </motion.p>
          </div>
        </motion.div>

        {/* ── Story ── */}
        <div style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: 'clamp(2rem,5vw,4rem) clamp(1.4rem,5vw,2.5rem) 0',
        }}>
          {/* Chapter label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '2.8rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ width: 42, height: 1, background: `rgba(${AMBER_RGB},0.25)` }} />
              <span style={{ fontFamily: IN, fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${AMBER_RGB},0.38)` }}>İlk Tanışma</span>
              <div style={{ width: 42, height: 1, background: `rgba(${AMBER_RGB},0.25)` }} />
            </div>
          </motion.div>

          {/* Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            {STORY.map((item, i) => (
              <Paragraph key={i} item={item} index={i} />
            ))}
          </div>

          {/* Final ornament */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 + STORY.length * 0.09 + 0.5, duration: 1 }}
            style={{ textAlign: 'center', marginTop: '4rem' }}
          >
            <motion.div
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ fontFamily: IN, fontSize: '0.75rem', letterSpacing: '0.35em', color: `rgba(${AMBER_RGB},0.45)` }}
            >
              ✦ &nbsp; ✦ &nbsp; ✦
            </motion.div>
          </motion.div>
        </div>

        {/* ── Bottom photo ── */}
        <div ref={bottomRef} style={{
          maxWidth: 680,
          margin: '4rem auto 0',
          padding: '0 clamp(1.2rem,4vw,2rem)',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: showConfetti ? 1 : 0, y: showConfetti ? 0 : 50 }}
            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative' }}
          >
            {/* Outer glow ring */}
            <div style={{
              position: 'absolute', inset: -2,
              borderRadius: 28,
              background: `linear-gradient(135deg, rgba(${AMBER_RGB},0.45) 0%, rgba(${AMBER_RGB},0.08) 50%, rgba(${AMBER_RGB},0.35) 100%)`,
              filter: 'blur(1px)',
            }} />

            {/* Photo */}
            <div style={{
              position: 'relative',
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: `0 0 80px rgba(${AMBER_RGB},0.18), 0 30px 70px rgba(0,0,0,0.7)`,
            }}>
              <img
                src="/mahur.jpeg"
                alt="Mahur — o gün"
                style={{ width: '100%', display: 'block', filter: 'brightness(0.78) saturate(0.9)' }}
                draggable={false}
              />
              {/* Warm amber overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at 50% 50%, rgba(${AMBER_RGB},0.06) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              {/* Bottom gradient */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: 'linear-gradient(to top, rgba(7,5,13,0.7) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />
              {/* Overlaid caption */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: 'clamp(1.2rem,3vw,2rem)',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: CO, fontStyle: 'italic',
                  fontSize: 'clamp(1rem,2.5vw,1.35rem)',
                  color: `rgba(${AMBER_RGB},0.9)`,
                  letterSpacing: '0.05em',
                  textShadow: `0 0 30px rgba(${AMBER_RGB},0.5)`,
                  margin: 0,
                }}>O gün, her şey başladı.</p>
              </div>
            </div>

            {/* Caption below */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: showConfetti ? 1 : 0, y: showConfetti ? 0 : 12 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              style={{ textAlign: 'center', padding: '1.8rem 1rem 0' }}
            >
              <motion.p
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ fontFamily: IN, fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: `rgba(${AMBER_RGB},0.4)`, margin: '0 0 0.8rem' }}
              >✦ &nbsp; ✦ &nbsp; ✦</motion.p>
              <p style={{
                fontFamily: CO, fontStyle: 'italic',
                fontSize: 'clamp(0.9rem,2vw,1.1rem)',
                color: 'rgba(255,245,228,0.45)',
                letterSpacing: '0.04em',
                margin: 0, lineHeight: 1.7,
              }}>
                Mahur'daydık.<br />
                <span style={{ fontSize: '0.9em', color: `rgba(${AMBER_RGB},0.38)` }}>Ve sen bana el salladın.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* bottom spacer */}
        <div style={{ height: '8rem' }} />
      </div>

      {/* Top fade */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4rem', background: 'linear-gradient(to bottom, #07050d, transparent)', pointerEvents: 'none', zIndex: 10 }} />
      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5rem', background: 'linear-gradient(to top, #07050d, transparent)', pointerEvents: 'none', zIndex: 10 }} />
    </motion.div>
  )
}
