'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const MILESTONES = [
  { id: 1, icon: '💌', date: '— İlk Mesaj —',      title: 'İlk Mesaj',          desc: 'Yazışmalarımız küçük bir "merhaba" ile başladı. O mesajın ne kadar büyük bir evreni açacağını bilmiyordum.', color: '#FF4D88' },
  { id: 2, icon: '🌸', date: '— İlk Buluşma —',    title: 'İlk Buluşma',        desc: 'Seni ilk gördüğümde zamanın durduğunu hissettim. Gerçekten sen miydin, yoksa hayal mi diye merak ettim.', color: '#FF6B9D' },
  { id: 3, icon: '📸', date: '— İlk Fotoğraf —',   title: 'İlk Fotoğraf',       desc: 'İlk fotoğrafımız. O an o kadar güzeldi ki, onu durdurmak istedim sonsuza kadar.', color: '#FFA0C0' },
  { id: 4, icon: '✈️', date: '— İlk Yolculuk —',   title: 'İlk Yolculuk',       desc: 'Seninle gittiğim her yer özel. Ama ilk yolculuğumuz... tamamen farklıydı. Bir macera, bir başlangıç.', color: '#FF4D88' },
  { id: 5, icon: '🌧️', date: '— İlk Tartışma —',  title: 'İlk Tartışma',       desc: 'Her ilişkide fırtınalar olur. Bizimkiler de oldu. Ama her fırtınanın ardından gökkuşağı çıktı.', color: '#9B8EC4' },
  { id: 6, icon: '🌟', date: '— Yıl Dönümü —',     title: 'İlk Yıl Dönümü',    desc: 'Bir yıl. 365 gün gülen, ağlayan, büyüyen biz. Ve bu sadece başlangıç.', color: '#FFD700' },
]

function Card({ m, idx }: { m: typeof MILESTONES[0]; idx: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const left   = idx % 2 === 0

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 40px 1fr',
        alignItems: 'center',
        marginBottom: '5rem',
        gap: '1.5rem',
      }}
    >
      {/* LEFT slot */}
      <motion.div
        initial={{ opacity: 0, x: left ? -60 : 0 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: .85, ease: [.4,0,.2,1] }}
        style={{ display: left ? 'block' : 'none' }}
      >
        {left && <CardContent m={m} />}
      </motion.div>

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: .5, delay: .25 }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          border: `2px solid ${m.color}`,
          background: `${m.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 18px ${m.color}50`,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
        </div>
      </motion.div>

      {/* RIGHT slot */}
      <motion.div
        initial={{ opacity: 0, x: !left ? 60 : 0 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: .85, ease: [.4,0,.2,1] }}
        style={{ display: !left ? 'block' : 'none' }}
      >
        {!left && <CardContent m={m} />}
      </motion.div>
    </div>
  )
}

function CardContent({ m }: { m: typeof MILESTONES[0] }) {
  return (
    <div className="glass" style={{
      borderRadius: '1.25rem', padding: '2rem',
      borderColor: `${m.color}25`,
      transition: 'transform .4s, box-shadow .4s',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,${m.color}60,transparent)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '2.4rem', filter: `drop-shadow(0 0 14px ${m.color}80)` }}>{m.icon}</span>
        <div>
          <p style={{ fontFamily: IN, fontSize: '.62rem', color: `${m.color}80`, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: '.3rem' }}>{m.date}</p>
          <h3 style={{ fontFamily: PF, fontSize: '1.5rem', color: m.color }}>{m.title}</h3>
        </div>
      </div>
      <p style={{ fontFamily: CO, fontSize: '1.1rem', color: 'rgba(255,255,255,.68)', lineHeight: 1.7, fontStyle: 'italic' }}>{m.desc}</p>
    </div>
  )
}

export default function OurStory() {
  return (
    <section id="our-story" style={{ position: 'relative', minHeight: '100vh', padding: '8rem 1rem', overflow: 'hidden' }}>
      {/* BG blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 400, height: 400, background: 'rgba(255,77,136,.04)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 400, height: 400, background: 'rgba(255,77,136,.03)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <p style={{ fontFamily: IN, fontSize: '.68rem', color: 'rgba(255,194,209,.45)', letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Zaman İçinde Yolculuk</p>
          <h2 className="text-gradient" style={{ fontFamily: PF, fontSize: 'clamp(2.5rem,6vw,5rem)', marginBottom: '1.2rem', display: 'block' }}>Bizim Hikayemiz</h2>
          <div className="section-divider" style={{ marginBottom: '1.5rem' }} />
          <p style={{ fontFamily: CO, fontSize: '1.15rem', color: 'rgba(255,255,255,.45)', fontStyle: 'italic', maxWidth: 520, margin: '0 auto' }}>
            Her anın kendi sihri vardı. Her adım bizi daha da yaklaştırdı.
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Centre line */}
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom,transparent,#FF4D88 15%,#FF4D88 85%,transparent)',
          }} />

          {MILESTONES.map((m, i) => <Card key={m.id} m={m} idx={i} />)}
        </div>
      </div>
    </section>
  )
}
