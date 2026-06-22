'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

/* Heart parametric curve */
function heartPoints(count: number, scale: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    const t  = (i / count) * Math.PI * 2
    const x  = 16 * Math.pow(Math.sin(t), 3)
    const y  = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)
    const jx = (Math.random()-.5)*2.5
    const jy = (Math.random()-.5)*2.5
    pts.push(new THREE.Vector3((x+jx)*scale, (y+jy)*scale, (Math.random()-.5)*scale*.4))
  }
  return pts
}

type Stage = 'scatter' | 'gathering' | 'heart' | 'text' | 'end'

export default function FinalExperience({ onBack }: { onBack: () => void }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const [stage,     setStage]   = useState<Stage>('scatter')
  const [showText,  setShowText]= useState(false)
  const [showEnd,   setShowEnd] = useState(false)
  const particlesRef= useRef<{ current: THREE.Vector3[]; target: THREE.Vector3[]; speed: number[] } | null>(null)
  const stageRef    = useRef<Stage>('scatter')
  stageRef.current  = stage

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, .1, 3000)
    camera.position.z = 320

    const N = 800

    /* Scatter positions */
    const scatterPos = Array.from({ length: N }, () =>
      new THREE.Vector3((Math.random()-.5)*700, (Math.random()-.5)*700, (Math.random()-.5)*300)
    )

    /* Heart positions */
    const heartPos = heartPoints(N, 9.5)

    /* Random gather speeds */
    const speeds = Array.from({ length: N }, () => .018 + Math.random()*.025)
    particlesRef.current = { current: scatterPos.map(v => v.clone()), target: heartPos, speed: speeds }

    /* Particle geometry */
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(N*3)
    const col = new Float32Array(N*3)
    for (let i = 0; i < N; i++) {
      pos[i*3]=scatterPos[i].x; pos[i*3+1]=scatterPos[i].y; pos[i*3+2]=scatterPos[i].z
      // pink palette
      const t = Math.random()
      if (t < .45) { col[i*3]=1; col[i*3+1]=.3; col[i*3+2]=.55 }       // pink
      else if (t < .75) { col[i*3]=1; col[i*3+1]=.75; col[i*3+2]=.86 } // light pink
      else { col[i*3]=1; col[i*3+1]=1; col[i*3+2]=1 }                    // white
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    const mat  = new THREE.PointsMaterial({ size: 2.8, vertexColors: true, transparent: true, opacity: .9, sizeAttenuation: true, blending: THREE.AdditiveBlending })
    const pts  = new THREE.Points(geo, mat)
    scene.add(pts)

    /* Background stars */
    const bgGeo = new THREE.BufferGeometry()
    const bgPos = new Float32Array(3000*3)
    for (let i = 0; i < 3000; i++) { bgPos[i*3]=(Math.random()-.5)*2000; bgPos[i*3+1]=(Math.random()-.5)*2000; bgPos[i*3+2]=(Math.random()-.5)*800 }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
    scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({ size:.65, color:0xffffff, transparent:true, opacity:.3, sizeAttenuation:true })))

    const clock = new THREE.Clock()
    const pArr  = geo.attributes.position.array as Float32Array
    const pc    = particlesRef.current!

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      const t   = clock.getElapsedTime()
      const cur = stageRef.current

      if (cur === 'gathering' || cur === 'heart') {
        let allDone = true
        for (let i = 0; i < N; i++) {
          const tx = pc.target[i].x, ty = pc.target[i].y, tz = pc.target[i].z
          const cx = pArr[i*3], cy = pArr[i*3+1], cz = pArr[i*3+2]
          const s  = pc.speed[i]
          pArr[i*3]   += (tx - cx) * s
          pArr[i*3+1] += (ty - cy) * s
          pArr[i*3+2] += (tz - cz) * s
          const d = Math.sqrt((tx-pArr[i*3])**2 + (ty-pArr[i*3+1])**2)
          if (d > 1) allDone = false
        }
        geo.attributes.position.needsUpdate = true
        if (allDone && cur === 'gathering') stageRef.current = 'heart'
      }

      if (cur === 'heart') {
        pts.rotation.y = Math.sin(t*.3)*.08
        pts.rotation.x = Math.sin(t*.2)*.05
        mat.opacity    = .9 + Math.sin(t*2)*.08
      }

      if (cur === 'scatter') pts.rotation.y = t*.0006

      camera.position.x = Math.sin(t*.05)*15
      camera.position.y = Math.cos(t*.04)*8
      camera.lookAt(0,0,0)
      renderer.render(scene, camera)
    }
    tick()

    const onR = () => { camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight) }
    window.addEventListener('resize',onR)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize',onR); renderer.dispose() }
  }, [])

  /* Auto-sequence */
  useEffect(() => {
    const t1 = setTimeout(() => setStage('gathering'), 2200)
    const t2 = setTimeout(() => { setStage('heart'); setShowText(true) }, 5500)
    const t3 = setTimeout(() => setShowEnd(true), 9000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: .28 }} whileHover={{ opacity: .8 }}
        onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#fff', zIndex: 20 }}
      >
        ← Geri
      </motion.button>

      {/* Opening message */}
      <AnimatePresence>
        {stage === 'scatter' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }}
            transition={{ delay: .3, duration: .9 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center', padding: '2rem' }}
          >
            <motion.p
              animate={{ opacity: [.4,.8,.4] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ fontFamily: IN, fontSize: '.62rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(255,194,209,.4)', marginBottom: '1.5rem' }}
            >
              Son bölüm
            </motion.p>
            <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.4rem,4vw,2.4rem)', color: 'rgba(255,255,255,.75)', marginBottom: '.6rem' }}>
              Anılar toplanıyor…
            </h2>
            <p style={{ fontFamily: CO, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,194,209,.35)' }}>
              Birlikte yaşadığımız her şey, bir arada
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart formed text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .6, duration: 1.2 }}
            style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', width: '90vw', maxWidth: 560 }}
          >
            <p style={{ fontFamily: PF, fontSize: 'clamp(1.2rem,3.5vw,2rem)', color: '#fff', marginBottom: '.6rem', textShadow: '0 0 40px rgba(255,77,136,.5)' }}>
              "Bu hikaye burada bitmiyor."
            </p>
            <p style={{ fontFamily: CO, fontSize: 'clamp(.88rem,2vw,1.05rem)', fontStyle: 'italic', color: 'rgba(255,194,209,.4)' }}>
              Her yeni gün, yeni bir sayfa
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ∞ Ending */}
      <AnimatePresence>
        {showEnd && (
          <motion.div
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [.25,.1,.25,1] }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontFamily: PF, fontSize: 'clamp(4rem,12vw,8rem)', color: '#FF4D88', lineHeight: 1, textShadow: '0 0 60px rgba(255,77,136,.7), 0 0 120px rgba(255,77,136,.3)' }}
            >
              ∞
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}
              style={{ fontFamily: IN, fontSize: '.72rem', letterSpacing: '.4em', textTransform: 'uppercase', color: 'rgba(255,194,209,.45)', marginTop: '1.5rem' }}
            >
              To Be Continued
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 25%, rgba(0,0,0,.6) 100%)', pointerEvents: 'none' }} />
    </motion.div>
  )
}
