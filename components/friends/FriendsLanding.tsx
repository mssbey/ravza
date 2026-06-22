'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import gsap from 'gsap'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

type Phase = 'black' | 'stars' | 'text1' | 'text2' | 'galaxy' | 'title' | 'button'

export default function FriendsLanding({ onEnter, onBack }: { onEnter: () => void; onBack: () => void }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const camPosRef  = useRef({ x: 0, y: 800, z: 3200 })
  const camTargRef = useRef({ x: 0, y: 180, z: 720 })
  const rendRef    = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef  = useRef<THREE.PerspectiveCamera | null>(null)

  const [phase,   setPhase]   = useState<Phase>('black')
  const [t1,      setT1]      = useState('')
  const [t2,      setT2]      = useState('')
  const [exiting, setExiting] = useState(false)

  const L1 = 'Bu evrende bazı yıldızlar diğerlerinden daha parlaktır.'
  const L2 = 'Bu evren seni seven insanların hatıralarından oluşuyor.'

  /* ── Three.js galaxy ── */
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000)
    rendRef.current = renderer

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 12000)
    camera.position.set(camPosRef.current.x, camPosRef.current.y, camPosRef.current.z)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    /* ─ Galaxy particles ─ */
    const N_CORE  = 14000
    const N_ARM   = 10000
    const N_HALO  = 4500
    const TOTAL   = N_CORE + N_ARM * 2 + N_HALO

    const pos = new Float32Array(TOTAL * 3)
    const col = new Float32Array(TOTAL * 3)
    const siz = new Float32Array(TOTAL)
    let idx = 0

    // Core
    for (let i = 0; i < N_CORE; i++, idx++) {
      const r = Math.pow(Math.random(), 2.2) * 320
      const a = Math.random() * Math.PI * 2
      pos[idx*3]   = Math.cos(a) * r
      pos[idx*3+1] = (Math.random() - 0.5) * r * 0.1
      pos[idx*3+2] = Math.sin(a) * r
      const b = 0.65 + Math.random() * 0.35
      if (Math.random() < 0.45) { col[idx*3]=b; col[idx*3+1]=b*0.88; col[idx*3+2]=b*0.65 }
      else                       { col[idx*3]=b; col[idx*3+1]=b; col[idx*3+2]=b }
      siz[idx] = 0.9 + Math.random() * 1.8
    }

    // 2 spiral arms
    for (let arm = 0; arm < 2; arm++) {
      for (let i = 0; i < N_ARM; i++, idx++) {
        const t   = Math.pow(Math.random(), 0.55)
        const r   = 70 + t * 740
        const ang = arm * Math.PI + t * 3.8 + (Math.random() - 0.5) * 0.6
        const sp  = 12 + t * 45
        pos[idx*3]   = Math.cos(ang) * r + (Math.random() - 0.5) * sp
        pos[idx*3+1] = (Math.random() - 0.5) * (18 + t * 18)
        pos[idx*3+2] = Math.sin(ang) * r + (Math.random() - 0.5) * sp
        const b = 0.45 + Math.random() * 0.55
        const v = Math.random()
        if      (v < 0.35) { col[idx*3]=b*0.65; col[idx*3+1]=b*0.78; col[idx*3+2]=b }   // blue
        else if (v < 0.62) { col[idx*3]=b;      col[idx*3+1]=b*0.86; col[idx*3+2]=b*0.6 } // warm
        else               { col[idx*3]=b;      col[idx*3+1]=b;      col[idx*3+2]=b }      // white
        siz[idx] = 0.5 + Math.random() * 1.2
      }
    }

    // Halo
    for (let i = 0; i < N_HALO; i++, idx++) {
      const r  = 380 + Math.random() * 650
      const a  = Math.random() * Math.PI * 2
      const ib = (Math.random() - 0.5) * Math.PI * 0.38
      pos[idx*3]   = Math.cos(ib) * Math.cos(a) * r
      pos[idx*3+1] = Math.sin(ib) * r
      pos[idx*3+2] = Math.cos(ib) * Math.sin(a) * r
      const b = 0.28 + Math.random() * 0.35
      col[idx*3]=b; col[idx*3+1]=b; col[idx*3+2]=b*1.08
      siz[idx] = 0.4 + Math.random() * 0.7
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    geo.setAttribute('size',     new THREE.BufferAttribute(siz, 1))

    const mat = new THREE.PointsMaterial({
      size: 1.8, vertexColors: true, transparent: true, opacity: 0,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const galaxy = new THREE.Points(geo, mat)
    scene.add(galaxy)

    /* ─ Nebula ─ */
    const nN = 2200, nP = new Float32Array(nN * 3), nC = new Float32Array(nN * 3)
    for (let i = 0; i < nN; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.pow(Math.random(), 0.5) * 550
      nP[i*3]   = Math.cos(a)*r + (Math.random()-0.5)*220
      nP[i*3+1] = (Math.random()-0.5)*55
      nP[i*3+2] = Math.sin(a)*r + (Math.random()-0.5)*220
      const t = Math.random()
      if      (t<0.3) { nC[i*3]=0.11;nC[i*3+1]=0.05;nC[i*3+2]=0.4 }
      else if (t<0.6) { nC[i*3]=0.04;nC[i*3+1]=0.16;nC[i*3+2]=0.4 }
      else            { nC[i*3]=0.3; nC[i*3+1]=0.07;nC[i*3+2]=0.22 }
    }
    const nGeo = new THREE.BufferGeometry()
    nGeo.setAttribute('position', new THREE.BufferAttribute(nP, 3))
    nGeo.setAttribute('color',    new THREE.BufferAttribute(nC, 3))
    scene.add(new THREE.Points(nGeo, new THREE.PointsMaterial({
      size: 9, vertexColors: true, transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    })))

    /* ─ Background stars ─ */
    const sN = 5500, sP = new Float32Array(sN * 3), sC = new Float32Array(sN * 3)
    for (let i = 0; i < sN; i++) {
      sP[i*3]   = (Math.random()-0.5)*8000
      sP[i*3+1] = (Math.random()-0.5)*4000
      sP[i*3+2] = (Math.random()-0.5)*3000 - 500
      const b = 0.4 + Math.random()*0.6
      sC[i*3]=b; sC[i*3+1]=b*0.92; sC[i*3+2]=b
    }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(sP, 3))
    sGeo.setAttribute('color',    new THREE.BufferAttribute(sC, 3))
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ size:0.7, vertexColors:true, transparent:true, opacity:0.5, sizeAttenuation:true })))

    /* ─ Render loop ─ */
    const clock = new THREE.Clock()
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      const e = clock.getElapsedTime()

      if (mat.opacity < 0.88) mat.opacity += 0.0035

      galaxy.rotation.y = e * 0.016

      // Smooth camera drift toward target
      const cp = camPosRef.current
      const ct = camTargRef.current
      cp.x += (ct.x - cp.x) * 0.003
      cp.y += (ct.y - cp.y) * 0.003
      cp.z += (ct.z - cp.z) * 0.003

      camera.position.set(cp.x, cp.y, cp.z)
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    tick()

    const onR = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onR)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onR)
      renderer.dispose()
    }
  }, [])

  /* ── Phase sequencer ── */
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('stars'),  900),
      setTimeout(() => setPhase('text1'), 2200),
      setTimeout(() => setPhase('text2'), 6600),
      setTimeout(() => setPhase('galaxy'),10900),
      setTimeout(() => setPhase('title'), 11600),
      setTimeout(() => setPhase('button'),15500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (phase !== 'text1') return
    let i = 0
    const iv = setInterval(() => { i++; setT1(L1.slice(0, i)); if (i >= L1.length) clearInterval(iv) }, 45)
    return () => clearInterval(iv)
  }, [phase])

  useEffect(() => {
    if (phase !== 'text2') return
    let i = 0
    const iv = setInterval(() => { i++; setT2(L2.slice(0, i)); if (i >= L2.length) clearInterval(iv) }, 41)
    return () => clearInterval(iv)
  }, [phase])

  /* ── Enter handler ── */
  const enter = () => {
    setExiting(true)
    // Accelerate camera into galaxy
    gsap.to(camTargRef.current, { z: -300, y: 0, x: 0, duration: 1.6, ease: 'power2.in' })
    setTimeout(onEnter, 1050)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: exiting ? 1.05 : 0.5 }}
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== 'black' ? 0.3 : 0 }}
        whileHover={{ opacity: 0.85 }}
        onClick={onBack}
        style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#fff', zIndex: 10 }}
      >
        ← Geri
      </motion.button>

      {/* Content overlay */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5, padding: '0 clamp(1.5rem,6vw,3rem)', textAlign: 'center' }}>

        {/* Text 1 */}
        <AnimatePresence>
          {(phase === 'text1' || phase === 'text2') && (
            <motion.div
              key="t1"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, transition: { duration: 1.0 } }}
              transition={{ duration: 1.3 }}
              style={{ marginBottom: '2.6rem', maxWidth: 580 }}
            >
              <p style={{ fontFamily: PF, fontSize: 'clamp(1rem,2.8vw,1.65rem)', color: 'rgba(255,255,255,.9)', letterSpacing: '.02em', lineHeight: 1.65 }}>
                {t1}
                {phase === 'text1' && t1.length < L1.length && (
                  <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#ffd700', marginLeft: 3, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text 2 */}
        <AnimatePresence>
          {phase === 'text2' && (
            <motion.div
              key="t2"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, transition: { duration: 1.0 } }}
              transition={{ duration: 1.3 }}
              style={{ marginBottom: '4.5rem', maxWidth: 520 }}
            >
              <p style={{ fontFamily: CO, fontSize: 'clamp(.9rem,2.2vw,1.22rem)', color: 'rgba(255,220,150,.58)', fontStyle: 'italic', letterSpacing: '.03em', lineHeight: 1.8 }}>
                {t2}
                {t2.length < L2.length && (
                  <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#ffd700', marginLeft: 3, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Onun Evreni" cinematic title */}
        <AnimatePresence>
          {(phase === 'title' || phase === 'button') && (
            <motion.div
              key="title"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: phase === 'button' ? 0 : 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 2.0, ease: [0.2, 0.0, 0.3, 1] }}
              style={{ position: 'relative', marginBottom: '1.5rem' }}
            >
              <motion.p
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ fontFamily: IN, fontSize: '.52rem', letterSpacing: '.55em', textTransform: 'uppercase', color: 'rgba(255,215,0,.45)', marginBottom: '.9rem' }}
              >
                ✦ ✦ ✦
              </motion.p>
              <h1 style={{
                fontFamily: PF,
                fontSize: 'clamp(2.2rem,7vw,5.8rem)',
                color: '#fff',
                letterSpacing: '0.12em',
                textShadow: '0 0 60px rgba(255,215,0,0.5), 0 0 130px rgba(255,215,0,0.18)',
                margin: 0, lineHeight: 1.1,
              }}>
                Onun Evreni
              </h1>
              {/* Stardust particles floating around the title */}
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    x: [(Math.cos(i * 0.26) * (30 + Math.random()*100))],
                    y: [(Math.sin(i * 0.26) * (20 + Math.random()*80))],
                    scale: [0, 1+Math.random(), 0],
                  }}
                  transition={{
                    duration: 1.8 + Math.random() * 2.2,
                    delay: Math.random() * 2.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: 1.5 + Math.random() * 2,
                    height: 1.5 + Math.random() * 2,
                    borderRadius: '50%',
                    background: Math.random() < 0.5 ? '#FFD700' : '#fff',
                    left: '50%', top: '60%',
                    pointerEvents: 'none',
                    filter: 'blur(0.5px)',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA button */}
        <AnimatePresence>
          {phase === 'button' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [.25,.1,.25,1] }}
              style={{ position: 'relative' }}
            >
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 70px rgba(255,215,0,.55), 0 0 140px rgba(255,215,0,.22)' }}
                whileTap={{ scale: .97 }}
                onClick={enter}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,215,0,.55)',
                  borderRadius: '3rem',
                  padding: '1.1rem 3rem',
                  color: '#fff',
                  fontFamily: IN,
                  fontSize: '.78rem',
                  letterSpacing: '.28em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(255,215,0,.22)',
                  backdropFilter: 'blur(6px)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                Onların Gözünden Kendini Gör
              </motion.button>
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 2.6], opacity: [0.35, 0] }}
                  transition={{ duration: 2.8, delay: i * 0.7, repeat: Infinity, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: 0, borderRadius: '3rem', border: '1px solid rgba(255,215,0,.28)', pointerEvents: 'none' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 72% at 50% 50%, transparent 28%, rgba(0,0,0,.68) 100%)', pointerEvents: 'none', zIndex: 4 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%', background: 'linear-gradient(to top,#000 0%,transparent 100%)', pointerEvents: 'none', zIndex: 4 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '14%', background: 'linear-gradient(to bottom,rgba(0,0,0,.5) 0%,transparent 100%)', pointerEvents: 'none', zIndex: 4 }} />

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </motion.div>
  )
}
