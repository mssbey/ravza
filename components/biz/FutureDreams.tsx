'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

interface Dream {
  id: number
  emoji: string
  title: string
  body: string
  color: string
  glowRgb: string
  locked: boolean
  gradient: string
}

const DREAMS: Dream[] = [
  { id:1, emoji:'🏡', title:'Evimiz', body:'Sabahları birlikte kahve içtiğimiz, her köşesini beraber tasarladığımız bir yuva.', color:'#FFD700', glowRgb:'255,215,0', locked:false, gradient:'linear-gradient(135deg, rgba(255,215,0,.12) 0%, rgba(255,150,0,.06) 100%)' },
  { id:2, emoji:'✈️', title:'Dünya Turu', body:'Her kıtadan bir şehir, her şehirden bir anı. Seninle kaybolmak istediğim yerler.', color:'#4a9eff', glowRgb:'74,158,255', locked:false, gradient:'linear-gradient(135deg, rgba(74,158,255,.12) 0%, rgba(0,80,200,.06) 100%)' },
  { id:3, emoji:'🐶', title:'Bir Köpeğimiz', body:'Ona bir isim koyacağız. Sabah yürüyüşlerinde üçümüz olacağız.', color:'#e08000', glowRgb:'224,128,0', locked:false, gradient:'linear-gradient(135deg, rgba(224,128,0,.12) 0%, rgba(150,70,0,.06) 100%)' },
  { id:4, emoji:'🌸', title:'Japonya', body:'Kiraz çiçeklerinin altında, elinle elim, tek bir şey söyleyeceğim.', color:'#FF4D88', glowRgb:'255,77,136', locked:false, gradient:'linear-gradient(135deg, rgba(255,77,136,.12) 0%, rgba(180,0,70,.06) 100%)' },
  { id:5, emoji:'🎬', title:'Kendi Filmimiz', body:'Her anımızı kaydetmek istiyorum. Yaşlıyken birlikte izleriz.', color:'#c264fe', glowRgb:'194,100,254', locked:false, gradient:'linear-gradient(135deg, rgba(194,100,254,.12) 0%, rgba(100,0,180,.06) 100%)' },
  { id:6, emoji:'🌙', title:'Açık Havada Uyku', body:'Çadır, yıldızlar ve sen. Hayatımın en güzel gecelerinden biri olacak.', color:'#80c0ff', glowRgb:'128,192,255', locked:false, gradient:'linear-gradient(135deg, rgba(128,192,255,.12) 0%, rgba(0,80,160,.06) 100%)' },
  { id:7, emoji:'🔐', title:'Sır',       body:'Bu hayali seninle beraber hayal etmek çok güzel.', color:'rgba(255,255,255,.2)', glowRgb:'255,255,255', locked:true,  gradient:'linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.02) 100%)' },
  { id:8, emoji:'🔐', title:'Sır',       body:'Zamanı gelince açılacak.', color:'rgba(255,255,255,.2)', glowRgb:'255,255,255', locked:true, gradient:'linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.02) 100%)' },
]

function CrystalCard({ dream, index }: { dream: Dream; index: number }) {
  const ref  = useRef<HTMLDivElement>(null)
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const sX   = useSpring(rotX, { stiffness: 200, damping: 16 })
  const sY   = useSpring(rotY, { stiffness: 200, damping: 16 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dream.locked) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    rotY.set(((e.clientX - r.left) / r.width  - .5) * 20)
    rotX.set(((e.clientY - r.top)  / r.height - .5) * -16)
  }
  const onLeave = () => { rotX.set(0); rotY.set(0) }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: .88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: .08 + index*.06, duration: .65, ease: [.25,.1,.25,1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 800 }}
    >
      <motion.div
        whileHover={!dream.locked ? {
          boxShadow: `0 0 50px rgba(${dream.glowRgb},.5), 0 0 100px rgba(${dream.glowRgb},.2), 0 20px 60px rgba(0,0,0,.5)`,
          borderColor: `rgba(${dream.glowRgb},.45)`,
        } : {}}
        transition={{ duration: .3 }}
        animate={{
          y: dream.locked ? 0 : [0,-6,0],
          boxShadow: `0 8px 32px rgba(0,0,0,.45), 0 0 20px rgba(${dream.glowRgb},.12)`,
        }}
        style={{
          rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d',
          background: dream.gradient,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(${dream.glowRgb},.15)`,
          borderRadius: '1.4rem',
          padding: 'clamp(1.4rem,3vw,2rem) clamp(1.2rem,2.5vw,1.8rem)',
          position: 'relative',
          overflow: 'hidden',
          cursor: dream.locked ? 'default' : 'pointer',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        } as React.CSSProperties}
      >
        {/* Crystal shimmer */}
        {!dream.locked && (
          <motion.div
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 4 + index*0.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: '-50%', background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,.08) 50%, transparent 60%)', transform: 'skewX(-20deg)', pointerEvents: 'none' }}
          />
        )}

        {/* Lock shimmer */}
        {dream.locked && (
          <motion.div
            animate={{ opacity: [.3,.6,.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(60deg, transparent, transparent 10px, rgba(255,255,255,.01) 11px)', borderRadius: '1.4rem' }}
          />
        )}

        <div>
          <span style={{ fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', display: 'block', marginBottom: '.8rem', filter: dream.locked ? 'grayscale(1)' : `drop-shadow(0 0 10px rgba(${dream.glowRgb},.6))` }}>
            {dream.emoji}
          </span>
          <h3 style={{ fontFamily: PF, fontSize: 'clamp(1rem,1.8vw,1.2rem)', color: dream.locked ? 'rgba(255,255,255,.2)' : '#fff', marginBottom: '.5rem' }}>
            {dream.title}
          </h3>
          {!dream.locked && (
            <p style={{ fontFamily: CO, fontSize: 'clamp(.82rem,1.4vw,.92rem)', fontStyle: 'italic', color: 'rgba(255,255,255,.45)', lineHeight: 1.6 }}>
              {dream.body}
            </p>
          )}
          {dream.locked && (
            <p style={{ fontFamily: IN, fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.15)' }}>
              Yakında açılacak
            </p>
          )}
        </div>

        {!dream.locked && (
          <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: dream.color, boxShadow: `0 0 6px rgba(${dream.glowRgb},.8)` }} />
            <span style={{ fontFamily: IN, fontSize: '.58rem', letterSpacing: '.15em', textTransform: 'uppercase', color: `rgba(${dream.glowRgb},.6)` }}>Hayal</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function FutureDreams({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .7 }}
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: 'radial-gradient(ellipse at 30% 20%, rgba(15,5,30,.95) 0%, #000 70%)' }}
    >
      {/* Particle-like stars */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.35) 1px, transparent 1px), radial-gradient(circle, rgba(255,200,255,.2) 1px, transparent 1px)', backgroundSize: '80px 80px, 130px 130px', backgroundPosition: '0 0, 40px 40px', opacity: .4, pointerEvents: 'none' }} />

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
        whileHover={{ x: -3 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', zIndex: 10 }}
      >
        ← Geri
      </motion.button>

      {/* Scrollable */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(128,192,255,.3) transparent', padding: '5rem clamp(1rem,5vw,3rem) 5rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}
        >
          <p style={{ fontFamily: IN, fontSize: '.62rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(128,192,255,.4)', marginBottom: '.8rem' }}>Birlikte</p>
          <h1 style={{ fontFamily: PF, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', marginBottom: '.6rem' }}>Gelecek Hayallerimiz</h1>
          <p style={{ fontFamily: CO, fontSize: 'clamp(.85rem,1.8vw,1rem)', fontStyle: 'italic', color: 'rgba(128,192,255,.35)' }}>Birlikte kuracaklarımız</p>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#80c0ff,transparent)', margin: '1.5rem auto 0' }} />
        </motion.div>

        {/* Crystal grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,80vw), 1fr))', gap: 'clamp(1rem,2.5vw,1.6rem)', maxWidth: 1100, margin: '0 auto', paddingBottom: '3rem' }}>
          {DREAMS.map((dream, i) => <CrystalCard key={dream.id} dream={dream} index={i} />)}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', padding: '2rem 0 3rem' }}
        >
          <p style={{ fontFamily: CO, fontSize: 'clamp(.9rem,1.8vw,1.05rem)', fontStyle: 'italic', color: 'rgba(255,255,255,.15)' }}>
            "Seninle her hayal, gerçekten daha güzel."
          </p>
        </motion.div>
      </div>

      {/* Top + bottom fades */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to bottom,#000 0%,transparent 100%)', pointerEvents: 'none', zIndex: 5 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to top,#000 0%,transparent 100%)', pointerEvents: 'none', zIndex: 5 }} />
    </motion.div>
  )
}
