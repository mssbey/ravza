'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

/* ── CONFIGURE ── */
const START_DATE  = new Date('2024-02-14T20:00:00')
const MAIN_DATE   = '14 Şubat 2024'
const MAIN_LABEL  = 'Birlikte Olduğumuz Gün'

interface Milestone {
  time: string
  title: string
  body: string
  emoji: string
  photo?: string
}

const MILESTONES: Milestone[] = [
  { time: '18:30', emoji: '☕', title: 'O mesaj', body: 'O an ne diyeceğimi bilmiyordum ama bir şeylerin değiştiğini hissediyordum.' },
  { time: '19:15', emoji: '💬', title: 'İlk söz', body: '"Seninle konuşmak çok kolay." diye düşündüm. Ve haklıydım.' },
  { time: '20:00', emoji: '🌙', title: 'Gün battı', body: 'Saatlerce konuştuk. Dışarısı kararmıştı ama içimde bir şey aydınlanıyordu.' },
  { time: '22:45', emoji: '💖', title: 'O an', body: 'Sana söylediğimde kalbim o kadar hızlı atıyordu ki… Ve sen güldün. O gülüşü unutamıyorum.' },
  { time: '23:59', emoji: '✨', title: 'Gece yarısı', body: 'Telefonu bırakmak istemedim. Hâlâ istemiyorum.' },
]

function LiveCounter() {
  const [counts, setCounts] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const update = () => {
      const ms = Date.now() - START_DATE.getTime()
      const s  = Math.floor(ms / 1000)
      setCounts({ d: Math.floor(s/86400), h: Math.floor((s%86400)/3600), m: Math.floor((s%3600)/60), s: s%60 })
    }
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [])

  const items = [
    { value: counts.d, label: 'Gün' },
    { value: counts.h, label: 'Saat' },
    { value: counts.m, label: 'Dakika' },
    { value: counts.s, label: 'Saniye' },
  ]

  return (
    <div style={{ display: 'flex', gap: 'clamp(.6rem,3vw,1.8rem)', justifyContent: 'center', flexWrap: 'wrap' }}>
      {items.map(({ value, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .4 + i*.1 }}
          style={{ textAlign: 'center', minWidth: 70 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={value}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: .25 }}
              style={{ fontFamily: PF, fontSize: 'clamp(1.8rem,5vw,3rem)', color: '#fff', lineHeight: 1, marginBottom: '.3rem', textShadow: '0 0 30px rgba(255,77,136,.5)' }}
            >
              {String(value).padStart(2,'0')}
            </motion.p>
          </AnimatePresence>
          <p style={{ fontFamily: IN, fontSize: '.6rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,194,209,.45)' }}>
            {label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

export default function SevgiliGun({ onBack }: { onBack: () => void }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const bgY = useTransform(scrollYProgress, [0,1], ['0%', '25%'])

  /* Cosmic bg */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000)
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, .1, 2000)
    camera.position.z = 400

    const geo = new THREE.BufferGeometry()
    const N   = 5000
    const pos = new Float32Array(N*3)
    const col = new Float32Array(N*3)
    for (let i = 0; i < N; i++) {
      pos[i*3]=(Math.random()-.5)*2000; pos[i*3+1]=(Math.random()-.5)*2000; pos[i*3+2]=(Math.random()-.5)*1000
      const t=Math.random()
      if(t<.6){col[i*3]=1;col[i*3+1]=.9;col[i*3+2]=.95}
      else if(t<.85){col[i*3]=1;col[i*3+1]=.6;col[i*3+2]=.75}
      else{col[i*3]=.8;col[i*3+1]=.7;col[i*3+2]=1}
    }
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3))
    geo.setAttribute('color',new THREE.BufferAttribute(col,3))
    scene.add(new THREE.Points(geo,new THREE.PointsMaterial({size:1,vertexColors:true,transparent:true,opacity:.55,sizeAttenuation:true})))

    const nebGeo=new THREE.BufferGeometry()
    const nPos=new Float32Array(1200*3),nCol=new Float32Array(1200*3)
    for(let i=0;i<1200;i++){
      const a=Math.random()*Math.PI*2,r=Math.pow(Math.random(),.5)*600
      nPos[i*3]=Math.cos(a)*r;nPos[i*3+1]=Math.sin(a)*r*.25;nPos[i*3+2]=(Math.random()-.5)*200-200
      nCol[i*3]=.55;nCol[i*3+1]=.1;nCol[i*3+2]=.28
    }
    nebGeo.setAttribute('position',new THREE.BufferAttribute(nPos,3))
    nebGeo.setAttribute('color',new THREE.BufferAttribute(nCol,3))
    scene.add(new THREE.Points(nebGeo,new THREE.PointsMaterial({size:3.5,vertexColors:true,transparent:true,opacity:.3,sizeAttenuation:true,blending:THREE.AdditiveBlending})))

    const clock=new THREE.Clock()
    const tick=()=>{ rafRef.current=requestAnimationFrame(tick); const t=clock.getElapsedTime(); camera.position.x=Math.sin(t*.04)*12; camera.position.y=Math.cos(t*.03)*8; renderer.render(scene,camera) }
    tick()
    const onR=()=>{ camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight) }
    window.addEventListener('resize',onR)
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener('resize',onR); renderer.dispose() }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .8 }}
      style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Scrollable content */}
      <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,77,136,.3) transparent' }}>

        {/* Hero section */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', position: 'relative' }}>

          {/* Back */}
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}
            whileHover={{ x: -3 }} onClick={onBack}
            style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)' }}
          >
            ← Geri
          </motion.button>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
            style={{ fontFamily: IN, fontSize: '.62rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(255,194,209,.4)', marginBottom: '2rem' }}
          >
            {MAIN_LABEL}
          </motion.p>

          {/* BIG DATE */}
          <motion.h1
            initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: .5, duration: 1.2, ease: [.25,.1,.25,1] }}
            style={{
              fontFamily: PF, fontSize: 'clamp(2.8rem,10vw,7rem)',
              color: '#fff', lineHeight: 1.05, marginBottom: '2.5rem',
              textShadow: '0 0 60px rgba(255,77,136,.4), 0 0 120px rgba(255,77,136,.15)',
            }}
          >
            {MAIN_DATE}
          </motion.h1>

          {/* Heart decoration */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem', filter: 'drop-shadow(0 0 20px rgba(255,77,136,.8))' }}
          >
            💖
          </motion.div>

          {/* Live counter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}
            style={{
              padding: 'clamp(1.4rem,4vw,2.4rem) clamp(1.8rem,6vw,3.6rem)',
              background: 'rgba(255,255,255,.03)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,77,136,.18)',
              borderRadius: '1.6rem',
              marginBottom: '2rem',
              boxShadow: '0 0 60px rgba(255,77,136,.08)',
            }}
          >
            <p style={{ fontFamily: CO, fontSize: '.82rem', fontStyle: 'italic', color: 'rgba(255,194,209,.45)', marginBottom: '1.4rem' }}>
              Birlikte geçirdiğimiz zaman
            </p>
            <LiveCounter />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', marginTop: '1rem' }}
          >
            <p style={{ fontFamily: IN, fontSize: '.58rem', letterSpacing: '.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,.15)' }}>
              O günü hatırla
            </p>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <svg width="18" height="28" viewBox="0 0 18 28"><path d="M9 0 L9 20 M2 14 L9 22 L16 14" stroke="rgba(255,77,136,.35)" strokeWidth="1.5" fill="none" /></svg>
            </motion.div>
          </motion.div>
        </section>

        {/* Timeline */}
        <section style={{ maxWidth: 640, margin: '0 auto', padding: '2rem clamp(1rem,5vw,2.5rem) 6rem' }}>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: .8 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#FF4D88,transparent)', margin: '0 auto 1.2rem' }} />
            <p style={{ fontFamily: CO, fontSize: '1.05rem', fontStyle: 'italic', color: 'rgba(255,255,255,.25)' }}>O günün dakika dakika izleri</p>
          </motion.div>

          {/* Vertical line */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1.8rem', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(255,77,136,.3) 15%, rgba(255,77,136,.3) 85%, transparent)' }} />

            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i*.12, duration: .6 }}
                style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.8rem', alignItems: 'flex-start' }}
              >
                {/* Timeline dot */}
                <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,77,136,.12)', border: '1px solid rgba(255,77,136,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 0 16px rgba(255,77,136,.25)' }}>
                  {m.emoji}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: '.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '.8rem', marginBottom: '.5rem' }}>
                    <p style={{ fontFamily: IN, fontSize: '.58rem', letterSpacing: '.18em', color: '#FF4D88', textTransform: 'uppercase' }}>{m.time}</p>
                    <h3 style={{ fontFamily: PF, fontSize: '1rem', color: '#fff' }}>{m.title}</h3>
                  </div>
                  <p style={{ fontFamily: CO, fontSize: '.92rem', fontStyle: 'italic', color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>{m.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: .9 }}
            style={{ textAlign: 'center', padding: '3rem 0 2rem' }}
          >
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#FF4D88,transparent)', margin: '0 auto 2rem' }} />
            <p style={{ fontFamily: PF, fontSize: 'clamp(1.1rem,3vw,1.6rem)', fontStyle: 'italic', color: 'rgba(255,255,255,.65)', lineHeight: 1.6, marginBottom: '1rem' }}>
              "O gün her şey değişti."
            </p>
            <p style={{ fontFamily: CO, fontSize: '.88rem', fontStyle: 'italic', color: 'rgba(255,194,209,.35)', lineHeight: 1.6 }}>
              Ve ben bunun için sonsuz minnetarım.
            </p>
            <motion.div
              animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
              style={{ fontSize: '2rem', marginTop: '2rem', filter: 'drop-shadow(0 0 16px rgba(255,77,136,.7))' }}
            >
              ♾️
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Top + bottom fades */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom,#000 0%,transparent 100%)', pointerEvents: 'none', zIndex: 15 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top,#000 0%,transparent 100%)', pointerEvents: 'none', zIndex: 15 }} />
    </motion.div>
  )
}
