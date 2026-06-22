'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

type Phase = 'idle' | 'clicked' | 'label' | 'text1' | 'text2' | 'final' | 'button' | 'exiting'

interface Props { onEnter: () => void; onBack: () => void }

const TEXT1 = 'Bazı insanlar gökyüzündeki yıldızlar gibidir.'
const TEXT2 = 'Milyarlarca insanın arasında bile onları kaybetmezsin.'
const TEXTF = 'Ben seni kaybetmem.'

export default function CosmicLanding({ onEnter, onBack }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const timersRef  = useRef<ReturnType<typeof setTimeout>[]>([])
  const [phase,    setPhase]   = useState<Phase>('idle')
  const [typed1,   setTyped1]  = useState('')
  const [typed2,   setTyped2]  = useState('')
  const [typedF,   setTypedF]  = useState('')

  /* Three.js starfield */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000)
    camera.position.z = 400

    const layers = [
      { count: 4000, size: 0.7, depth: 1800, opacity: 0.6 },
      { count: 2500, size: 1.2, depth: 1200, opacity: 0.45 },
      { count: 800,  size: 2.0, depth: 600,  opacity: 0.35 },
    ]
    const starMeshes: THREE.Points[] = []
    layers.forEach(({ count, size, depth, opacity }) => {
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(count * 3)
      const col = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i*3]   = (Math.random()-0.5)*depth*2
        pos[i*3+1] = (Math.random()-0.5)*depth*2
        pos[i*3+2] = (Math.random()-0.5)*depth
        const t = Math.random()
        if (t < 0.6)       { col[i*3]=1;   col[i*3+1]=1;    col[i*3+2]=1    }
        else if (t < 0.8)  { col[i*3]=0.8; col[i*3+1]=0.88; col[i*3+2]=1    }
        else if (t < 0.92) { col[i*3]=1;   col[i*3+1]=0.92; col[i*3+2]=0.75 }
        else               { col[i*3]=1;   col[i*3+1]=0.5;  col[i*3+2]=0.7  }
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity, sizeAttenuation: true })
      const pts = new THREE.Points(geo, mat)
      starMeshes.push(pts)
      scene.add(pts)
    })

    /* Subtle nebula */
    const nebGeo = new THREE.BufferGeometry()
    const nebN   = 1500
    const nebPos = new Float32Array(nebN * 3)
    const nebCol = new Float32Array(nebN * 3)
    for (let i = 0; i < nebN; i++) {
      const angle = Math.random() * Math.PI * 2
      const r     = Math.pow(Math.random(), 0.5) * 400
      nebPos[i*3]   = Math.cos(angle)*r + (Math.random()-0.5)*150
      nebPos[i*3+1] = Math.sin(angle)*r*0.4 + (Math.random()-0.5)*80
      nebPos[i*3+2] = (Math.random()-0.5)*300 - 200
      if (Math.random() < 0.5) { nebCol[i*3]=0.25; nebCol[i*3+1]=0.06; nebCol[i*3+2]=0.18 }
      else                     { nebCol[i*3]=0.10; nebCol[i*3+1]=0.05; nebCol[i*3+2]=0.22 }
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3))
    nebGeo.setAttribute('color',    new THREE.BufferAttribute(nebCol, 3))
    scene.add(new THREE.Points(nebGeo, new THREE.PointsMaterial({
      size: 3, vertexColors: true, transparent: true, opacity: 0.18,
      sizeAttenuation: true, blending: THREE.AdditiveBlending,
    })))

    const clock = new THREE.Clock()
    const tick  = () => {
      rafRef.current = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      camera.position.x = Math.sin(t*0.04)*18
      camera.position.y = Math.cos(t*0.03)*10
      starMeshes.forEach((m, i) => { m.rotation.y = t*0.0008*(i+1); m.rotation.x = t*0.0004*(i+1) })
      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', onResize); renderer.dispose() }
  }, [])

  /* Cleanup on unmount */
  useEffect(() => { return () => { timersRef.current.forEach(clearTimeout) } }, [])

  const handleStarClick = () => {
    if (phase !== 'idle') return
    setPhase('clicked')
    const push = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms)
      timersRef.current.push(id)
    }
    push(() => setPhase('label'),  800)
    push(() => setPhase('text1'),  2400)
    push(() => setPhase('text2'),  5300)
    push(() => setPhase('final'),  8400)
    push(() => setPhase('button'), 11400)
  }

  /* Typewriters */
  useEffect(() => {
    if (phase !== 'text1') return
    let i = 0
    const iv = setInterval(() => { i++; setTyped1(TEXT1.slice(0, i)); if (i >= TEXT1.length) clearInterval(iv) }, 48)
    return () => clearInterval(iv)
  }, [phase])

  useEffect(() => {
    if (phase !== 'text2') return
    let i = 0
    const iv = setInterval(() => { i++; setTyped2(TEXT2.slice(0, i)); if (i >= TEXT2.length) clearInterval(iv) }, 44)
    return () => clearInterval(iv)
  }, [phase])

  useEffect(() => {
    if (phase !== 'final') return
    let i = 0
    const iv = setInterval(() => { i++; setTypedF(TEXTF.slice(0, i)); if (i >= TEXTF.length) clearInterval(iv) }, 62)
    return () => clearInterval(iv)
  }, [phase])

  const handleEnter = () => { setPhase('exiting'); setTimeout(onEnter, 900) }

  const expanded  = phase !== 'idle'
  const inPhases  = (list: Phase[]) => list.includes(phase)

  const CURSOR = (
    <span style={{ display:'inline-block', width:2, height:'1em', background:'#ffe890', marginLeft:3, verticalAlign:'text-bottom', animation:'blink 1s step-end infinite' }} />
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: phase === 'exiting' ? 0.9 : 0.6 }}
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Light burst on click */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.65, 0] }}
          transition={{ duration: 2.4, ease: 'easeOut', times: [0, 0.25, 1] }}
          style={{
            position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 4,
            background: 'radial-gradient(circle at 50% 42%, rgba(255,255,210,0.5) 0%, rgba(255,220,140,0.2) 18%, transparent 55%)',
          }}
        />
      )}

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1 }}
        whileHover={{ opacity: 0.8 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#fff', zIndex: 10 }}
      >
        ← Geri
      </motion.button>

      {/* Center column */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 2rem',
      }}>

        {/* Star wrapper */}
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: expanded ? '2rem' : '0',
          transition: 'margin-bottom 0.8s ease',
        }}>
          {/* Idle pulse rings */}
          {!expanded && [1,2,3].map(i => (
            <motion.div key={i}
              animate={{ scale: [1, 4.5], opacity: [0.45, 0] }}
              transition={{ duration: 3.2, delay: i * 0.9, repeat: Infinity, ease: 'easeOut' }}
              style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,210,0.14)', pointerEvents: 'none' }}
            />
          ))}

          {/* The star */}
          <motion.div
            onClick={handleStarClick}
            animate={{
              scale: expanded ? 3.4 : [1, 1.45, 1],
              boxShadow: expanded
                ? '0 0 55px 22px rgba(255,255,200,0.52), 0 0 130px 55px rgba(255,230,120,0.18)'
                : '0 0 14px 4px rgba(255,255,200,0.32), 0 0 36px 12px rgba(255,230,100,0.1)',
            }}
            transition={{
              scale:     expanded ? { duration: 0.9, ease: [0.25,0.1,0.25,1] } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              boxShadow: { duration: 1.2 },
            }}
            style={{
              width: 14, height: 14, borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 38%, #fffff8, #fff8d0, #ffe890)',
              cursor: phase === 'idle' ? 'pointer' : 'default',
              position: 'relative', zIndex: 2, flexShrink: 0,
            }}
          />
        </div>

        {/* Dubhe label */}
        <AnimatePresence>
          {inPhases(['label','text1','text2','final','button','exiting']) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{
                fontFamily: IN, fontSize: '0.64rem',
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'rgba(255,248,180,0.52)',
                marginBottom: '3.5rem',
              }}
            >
              Dubhe &nbsp;•&nbsp; 61°27′
            </motion.p>
          )}
        </AnimatePresence>

        {/* Text block */}
        <div style={{ textAlign: 'center', maxWidth: 510 }}>

          <AnimatePresence>
            {inPhases(['text1','text2','final','button','exiting']) && (
              <motion.p
                key="t1"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ fontFamily: CO, fontSize: 'clamp(1rem,2.6vw,1.35rem)', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', lineHeight: 1.78, marginBottom: '0.8rem' }}
              >
                {typed1}{phase === 'text1' && typed1.length < TEXT1.length && CURSOR}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {inPhases(['text2','final','button','exiting']) && (
              <motion.p
                key="t2"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ fontFamily: CO, fontSize: 'clamp(1rem,2.6vw,1.35rem)', fontStyle: 'italic', color: 'rgba(255,255,255,0.58)', lineHeight: 1.78, marginBottom: '2.8rem' }}
              >
                {typed2}{phase === 'text2' && typed2.length < TEXT2.length && CURSOR}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {inPhases(['final','button','exiting']) && (
              <motion.p
                key="tf"
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.25,0.1,0.25,1] }}
                style={{
                  fontFamily: PF,
                  fontSize: 'clamp(1.3rem,3.5vw,2rem)',
                  color: '#fff',
                  letterSpacing: '0.02em',
                  textShadow: '0 0 40px rgba(255,255,180,0.4), 0 0 80px rgba(255,200,100,0.18)',
                  marginBottom: '3rem',
                }}
              >
                {typedF}
                {phase === 'final' && typedF.length < TEXTF.length && (
                  <span style={{ display:'inline-block', width:2, height:'1em', background:'#ffaaaa', marginLeft:3, verticalAlign:'text-bottom', animation:'blink 1s step-end infinite' }} />
                )}
                {inPhases(['button','exiting']) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: 'backOut' }}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    🤍
                  </motion.span>
                )}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Enter button */}
        <AnimatePresence>
          {phase === 'button' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25,0.1,0.25,1] }}
              style={{ position: 'relative' }}
            >
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 60px rgba(255,77,136,.55), 0 0 120px rgba(255,77,136,.25)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEnter}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,77,136,.55)',
                  borderRadius: '3rem', padding: '1rem 3rem',
                  color: '#fff', fontFamily: IN, fontSize: '.8rem',
                  letterSpacing: '.3em', textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(255,77,136,.25)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Evrene Gir
              </motion.button>
              {[1,2,3].map(i => (
                <motion.div key={i}
                  animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
                  transition={{ duration: 2.8, delay: i*0.7, repeat: Infinity, ease: 'easeOut' }}
                  style={{ position: 'absolute', inset: 0, borderRadius: '3rem', border: '1px solid rgba(255,77,136,.3)', pointerEvents: 'none' }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.32, 0.32, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, delay: 2.5, repeat: Infinity }}
              style={{
                marginTop: '3rem', fontFamily: IN, fontSize: '0.57rem',
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              tıkla
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,.6) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: 'linear-gradient(to top, #000 0%, transparent 100%)', pointerEvents: 'none' }} />
    </motion.div>
  )
}
