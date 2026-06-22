'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

type Phase = 'black' | 'stars' | 'line1' | 'line2' | 'button' | 'exiting'

interface Props { onEnter: () => void; onBack: () => void }

export default function CosmicLanding({ onEnter, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const [phase,   setPhase]   = useState<Phase>('black')
  const [typed1,  setTyped1]  = useState('')
  const [typed2,  setTyped2]  = useState('')

  const LINE1 = 'Bu evren senin için oluşturuldu.'
  const LINE2 = 'Burada birlikte yaşadığımız her şey yaşıyor.'

  /* Three.js star field */
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

    /* Stars in layers */
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
        // Star color palette: white, blue-white, warm
        const t = Math.random()
        if (t < 0.6)      { col[i*3]=1;    col[i*3+1]=1;    col[i*3+2]=1    } // white
        else if (t < 0.8) { col[i*3]=0.8;  col[i*3+1]=0.88; col[i*3+2]=1    } // blue-white
        else if (t < 0.92){ col[i*3]=1;    col[i*3+1]=0.92; col[i*3+2]=0.75 } // warm
        else              { col[i*3]=1;    col[i*3+1]=0.5;  col[i*3+2]=0.7  } // pink
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity, sizeAttenuation: true })
      const pts = new THREE.Points(geo, mat)
      starMeshes.push(pts)
      scene.add(pts)
    })

    /* Nebula — soft colored cloud */
    const nebGeo = new THREE.BufferGeometry()
    const nebN   = 2200
    const nebPos = new Float32Array(nebN * 3)
    const nebCol = new Float32Array(nebN * 3)
    for (let i = 0; i < nebN; i++) {
      const angle = Math.random() * Math.PI * 2
      const r     = Math.pow(Math.random(), 0.5) * 500
      nebPos[i*3]   = Math.cos(angle)*r + (Math.random()-0.5)*200
      nebPos[i*3+1] = Math.sin(angle)*r*0.4 + (Math.random()-0.5)*100
      nebPos[i*3+2] = (Math.random()-0.5)*300 - 200
      const t = Math.random()
      if (t < 0.5) { nebCol[i*3]=0.35; nebCol[i*3+1]=0.08; nebCol[i*3+2]=0.22 } // deep pink
      else         { nebCol[i*3]=0.12; nebCol[i*3+1]=0.06; nebCol[i*3+2]=0.28 } // indigo
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3))
    nebGeo.setAttribute('color',    new THREE.BufferAttribute(nebCol, 3))
    scene.add(new THREE.Points(nebGeo, new THREE.PointsMaterial({ size: 3.5, vertexColors: true, transparent: true, opacity: 0.28, sizeAttenuation: true, blending: THREE.AdditiveBlending })))

    const clock = new THREE.Clock()
    const tick  = () => {
      rafRef.current = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      camera.position.x  = Math.sin(t*0.04)*18
      camera.position.y  = Math.cos(t*0.03)*10
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

  /* Phase sequencer */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setPhase('stars'), 600))
    timers.push(setTimeout(() => setPhase('line1'), 2200))
    timers.push(setTimeout(() => setPhase('line2'), 5800))
    timers.push(setTimeout(() => setPhase('button'), 10000))
    return () => timers.forEach(clearTimeout)
  }, [])

  /* Typewriter line 1 */
  useEffect(() => {
    if (phase !== 'line1') return
    let i = 0
    const iv = setInterval(() => {
      i++
      setTyped1(LINE1.slice(0, i))
      if (i >= LINE1.length) clearInterval(iv)
    }, 52)
    return () => clearInterval(iv)
  }, [phase])

  /* Typewriter line 2 */
  useEffect(() => {
    if (phase !== 'line2') return
    let i = 0
    const iv = setInterval(() => {
      i++
      setTyped2(LINE2.slice(0, i))
      if (i >= LINE2.length) clearInterval(iv)
    }, 44)
    return () => clearInterval(iv)
  }, [phase])

  const handleEnter = () => {
    setPhase('exiting')
    setTimeout(onEnter, 900)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: phase === 'exiting' ? 0.9 : 0.6 }}
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: phase !== 'black' ? 0.3 : 0 }}
        whileHover={{ opacity: 0.8 }}
        onClick={onBack}
        style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#fff', zIndex: 10 }}
      >
        ← Geri
      </motion.button>

      {/* Central text */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5, padding: '0 2rem', textAlign: 'center' }}>

        <AnimatePresence>
          {(phase === 'line1' || phase === 'line2' || phase === 'button' || phase === 'exiting') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              style={{ marginBottom: '2.5rem' }}
            >
              <p style={{ fontFamily: PF, fontSize: 'clamp(1.1rem,3.5vw,1.9rem)', color: 'rgba(255,255,255,.9)', letterSpacing: '.02em', lineHeight: 1.5, minHeight: '2.2em' }}>
                {typed1}
                {phase === 'line1' && typed1.length < LINE1.length && (
                  <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#FF4D88', marginLeft: 3, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(phase === 'line2' || phase === 'button' || phase === 'exiting') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              style={{ marginBottom: '4rem' }}
            >
              <p style={{ fontFamily: CO, fontSize: 'clamp(.95rem,2.5vw,1.35rem)', color: 'rgba(255,194,209,.6)', fontStyle: 'italic', letterSpacing: '.03em', lineHeight: 1.7, minHeight: '2.2em' }}>
                {typed2}
                {phase === 'line2' && typed2.length < LINE2.length && (
                  <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#FF4D88', marginLeft: 3, verticalAlign: 'text-bottom', animation: 'blink 1s step-end infinite' }} />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'button' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 60px rgba(255,77,136,.55), 0 0 120px rgba(255,77,136,.25)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEnter}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,77,136,.55)',
                  borderRadius: '3rem',
                  padding: '1rem 3rem',
                  color: '#fff',
                  fontFamily: IN,
                  fontSize: '.8rem',
                  letterSpacing: '.3em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(255,77,136,.25), 0 0 60px rgba(255,77,136,.1)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Evrene Gir
              </motion.button>

              {/* Pulse rings */}
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
      </div>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,.6) 100%)', pointerEvents: 'none' }} />

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, #000 0%, transparent 100%)', pointerEvents: 'none' }} />
    </motion.div>
  )
}
