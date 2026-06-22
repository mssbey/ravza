'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

interface Planet {
  id: string
  title: string
  sub: string
  emoji: string
  size: number
  gradient: string
  glow: string
  glowRgb: string
  hasRing?: boolean
  ringColor?: string
  desktopPos: { x: string; y: string }
}

const PLANETS: Planet[] = [
  {
    id: 'ilk-tanisma',
    title: 'İlk Tanışma',
    sub: 'Her şeyin başladığı an',
    emoji: '🌍',
    size: 72,
    gradient: 'radial-gradient(circle at 34% 28%, #b8e4ff, #4a9eff 28%, #1a55cc 55%, #071540 85%)',
    glow: '#4a9eff', glowRgb: '74,158,255',
    desktopPos: { x: '14%', y: '62%' },
  },
  {
    id: 'ilk-mesajlar',
    title: 'İlk Mesajlar',
    sub: 'Kelimelerin içindeki his',
    emoji: '🌙',
    size: 60,
    gradient: 'radial-gradient(circle at 38% 32%, #f8f5e8, #d4cca0 30%, #8a8258 62%, #2a2410 88%)',
    glow: '#d4c878', glowRgb: '212,200,120',
    desktopPos: { x: '42%', y: '22%' },
  },
  {
    id: 'album',
    title: 'Albümümüz',
    sub: 'Dondurulan anlar',
    emoji: '📸',
    size: 80,
    gradient: 'radial-gradient(circle at 34% 28%, #fff4a8, #f0b400 30%, #a07200 60%, #3c2200 88%)',
    glow: '#f0c000', glowRgb: '240,192,0',
    hasRing: true, ringColor: 'rgba(240,192,0,0.4)',
    desktopPos: { x: '80%', y: '26%' },
  },
  {
    id: 'sesli',
    title: 'Sesli Anılar',
    sub: 'Sesin hâlâ kulağımda',
    emoji: '🎙',
    size: 64,
    gradient: 'radial-gradient(circle at 34% 28%, #e4a0ff, #c264fe 30%, #7a00cc 60%, #280040 88%)',
    glow: '#c264fe', glowRgb: '194,100,254',
    desktopPos: { x: '26%', y: '40%' },
  },
  {
    id: 'mektuplar',
    title: 'Mektuplar',
    sub: 'Kaleme döktüklerim',
    emoji: '📜',
    size: 68,
    gradient: 'radial-gradient(circle at 34% 28%, #ffd4a0, #e08000 30%, #884000 60%, #2a1000 88%)',
    glow: '#e08000', glowRgb: '224,128,0',
    desktopPos: { x: '14%', y: '26%' },
  },
  {
    id: 'timeline',
    title: 'Zaman Tüneli',
    sub: 'Geçmişten bugüne',
    emoji: '⏳',
    size: 58,
    gradient: 'radial-gradient(circle at 34% 28%, #f8faff, #c8d4e8 28%, #6a7a96 58%, #141e2c 88%)',
    glow: '#c0c8e0', glowRgb: '192,200,224',
    desktopPos: { x: '78%', y: '72%' },
  },
  {
    id: 'gelecek',
    title: 'Gelecek Hayaller',
    sub: 'Birlikte kuracaklarımız',
    emoji: '🔮',
    size: 76,
    gradient: 'radial-gradient(circle at 34% 28%, #f0faff, #a8d8ff 25%, #5090ee 55%, #0c1a50 88%)',
    glow: '#80c0ff', glowRgb: '128,192,255',
    desktopPos: { x: '38%', y: '60%' },
  },
  {
    id: 'mss',
    title: "MSS'den",
    sub: 'Sadece sana özel',
    emoji: '💌',
    size: 70,
    gradient: 'radial-gradient(circle at 34% 28%, #ffd4e0, #ff6b8a 28%, #cc1a44 58%, #3a0015 88%)',
    glow: '#ff4d7a', glowRgb: '255,77,122',
    desktopPos: { x: '58%', y: '50%' },
  },
]

interface Props {
  onSelect: (id: string) => void
  onBack: () => void
  onFinale: () => void
}

export default function GalaxyNav({ onSelect, onBack, onFinale }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const mouseRef    = useRef({ x: 0, y: 0 })
  const [ready,     setReady]     = useState(false)
  const [hovered,   setHovered]   = useState<string | null>(null)
  const [activeMob, setActiveMob] = useState(0)
  const [isMobile,  setIsMobile]  = useState(false)
  const touchStartX = useRef(0)

  /* Detect mobile */
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Three.js deep-space background */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 3000)
    camera.position.z = 500

    const addStars = (count: number, size: number, depth: number, opacity: number) => {
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(count * 3)
      const col = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i*3]   = (Math.random()-0.5)*depth*2
        pos[i*3+1] = (Math.random()-0.5)*depth*2
        pos[i*3+2] = (Math.random()-0.5)*depth-100
        const t = Math.random()
        if (t < 0.6)      { col[i*3]=1; col[i*3+1]=1; col[i*3+2]=1 }
        else if (t < 0.8) { col[i*3]=.8; col[i*3+1]=.88; col[i*3+2]=1 }
        else if (t < .92) { col[i*3]=1; col[i*3+1]=.92; col[i*3+2]=.75 }
        else              { col[i*3]=1; col[i*3+1]=.5; col[i*3+2]=.7 }
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({ size, vertexColors: true, transparent: true, opacity, sizeAttenuation: true })
      const pts = new THREE.Points(geo, mat)
      scene.add(pts)
      return pts
    }
    const s1 = addStars(5000, .8,  2000, .55)
    const s2 = addStars(2000, 1.4, 1200, .4)
    const s3 = addStars(500,  2.2, 700,  .3)

    // Nebula
    const nebGeo = new THREE.BufferGeometry()
    const nebN   = 3000
    const nebPos = new Float32Array(nebN*3)
    const nebCol = new Float32Array(nebN*3)
    for (let i = 0; i < nebN; i++) {
      const a = Math.random()*Math.PI*2, r = Math.pow(Math.random(),0.5)*800
      nebPos[i*3]   = Math.cos(a)*r + (Math.random()-.5)*300
      nebPos[i*3+1] = Math.sin(a)*r*.3 + (Math.random()-.5)*150
      nebPos[i*3+2] = (Math.random()-.5)*400 - 300
      if (Math.random()<.45) { nebCol[i*3]=.35; nebCol[i*3+1]=.06; nebCol[i*3+2]=.22 }
      else if (Math.random()<.55) { nebCol[i*3]=.08; nebCol[i*3+1]=.04; nebCol[i*3+2]=.32 }
      else { nebCol[i*3]=.04; nebCol[i*3+1]=.1; nebCol[i*3+2]=.22 }
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3))
    nebGeo.setAttribute('color',    new THREE.BufferAttribute(nebCol, 3))
    scene.add(new THREE.Points(nebGeo, new THREE.PointsMaterial({ size:4, vertexColors:true, transparent:true, opacity:.22, sizeAttenuation:true, blending:THREE.AdditiveBlending })))

    setTimeout(() => setReady(true), 600)

    const clock = new THREE.Clock()
    const tick  = () => {
      rafRef.current = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      camera.position.x += (mouseRef.current.x*.02 - camera.position.x)*.03
      camera.position.y += (-mouseRef.current.y*.02 - camera.position.y)*.03
      camera.lookAt(0, 0, 0)
      s1.rotation.y = t*.0005; s1.rotation.x = t*.0003
      s2.rotation.y = -t*.0008; s2.rotation.x = t*.0005
      s3.rotation.y = t*.001
      renderer.render(scene, camera)
    }
    tick()

    const onMM = (e: MouseEvent) => { mouseRef.current = { x: e.clientX-window.innerWidth/2, y: e.clientY-window.innerHeight/2 } }
    const onResize = () => { camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight) }
    window.addEventListener('mousemove', onMM)
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('mousemove',onMM); window.removeEventListener('resize',onResize); renderer.dispose() }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 30) return
    if (dx < 0) setActiveMob(i => Math.min(i+1, PLANETS.length-1))
    else         setActiveMob(i => Math.max(i-1, 0))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: .8 }}
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.4rem clamp(1rem,4vw,2.5rem)' }}>
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: ready ? 1 : 0, x: 0 }} transition={{ delay: .8 }}
          whileHover={{ x: -3 }}
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}
        >
          ← Çıkış
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: ready ? 1 : 0, y: 0 }} transition={{ delay: .6 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontFamily: PF, fontSize: 'clamp(.9rem,2vw,1.1rem)', color: 'rgba(255,255,255,.75)', marginBottom: '.15rem' }}>Senin Evrenin</p>
          <p style={{ fontFamily: CO, fontSize: '.72rem', fontStyle: 'italic', color: 'rgba(255,194,209,.4)' }}>Bir anıya dokunmak için seç</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: ready ? 1 : 0, x: 0 }} transition={{ delay: .8 }}
          whileHover={{ color: '#FF4D88' }}
          onClick={onFinale}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)', transition: 'color .3s' }}
        >
          Final ◈
        </motion.button>
      </div>

      {/* ──── DESKTOP: floating planets ──── */}
      {!isMobile && (
        <AnimatePresence>
          {ready && PLANETS.map((planet, i) => (
            <PlanetNode
              key={planet.id}
              planet={planet}
              index={i}
              isHovered={hovered === planet.id}
              onHover={setHovered}
              onClick={() => onSelect(planet.id)}
              style={{ position: 'absolute', left: planet.desktopPos.x, top: planet.desktopPos.y, transform: 'translate(-50%,-50%)' }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* ──── MOBILE: swipe carousel ──── */}
      {isMobile && (
        <div
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', overflow: 'hidden' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%', position: 'relative' }}
              >
                {PLANETS.map((planet, i) => {
                  const offset    = i - activeMob
                  const isActive  = offset === 0
                  const isNear    = Math.abs(offset) === 1
                  return (
                    <motion.div
                      key={planet.id}
                      animate={{
                        x: `calc(${(offset * 100)}vw - ${offset * 50}px)`,
                        scale: isActive ? 1 : isNear ? 0.62 : 0.35,
                        opacity: isActive ? 1 : isNear ? 0.45 : 0,
                        filter: isActive ? 'blur(0px)' : `blur(${isNear ? 3 : 8}px)`,
                        zIndex: isActive ? 10 : 5-Math.abs(offset),
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                      style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}
                      onClick={() => isActive ? onSelect(planet.id) : setActiveMob(i)}
                    >
                      <PlanetSphere planet={planet} size={planet.size * 1.4} pulse />
                      {isActive && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginTop: '.5rem' }}>
                          <p style={{ fontFamily: PF, fontSize: '1.15rem', color: '#fff', marginBottom: '.25rem' }}>{planet.title}</p>
                          <p style={{ fontFamily: CO, fontSize: '.82rem', fontStyle: 'italic', color: `rgba(${planet.glowRgb},.65)` }}>{planet.sub}</p>
                          <motion.p animate={{ opacity: [.4,.9,.4] }} transition={{ duration: 2, repeat: Infinity }}
                            style={{ fontFamily: IN, fontSize: '.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginTop: '.8rem' }}>
                            Dokunmak için tıkla
                          </motion.p>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile dots */}
          <div style={{ position: 'absolute', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '.5rem', zIndex: 20 }}>
            {PLANETS.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === activeMob ? 20 : 5, background: i === activeMob ? '#FF4D88' : 'rgba(255,255,255,.25)' }}
                style={{ height: 5, borderRadius: 3 }}
                onClick={() => setActiveMob(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hovered planet tooltip (desktop) */}
      <AnimatePresence>
        {hovered && !isMobile && (() => {
          const p = PLANETS.find(pl => pl.id === hovered)
          if (!p) return null
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              style={{
                position: 'fixed', left: p.desktopPos.x, top: `calc(${p.desktopPos.y} + ${p.size/2 + 18}px)`,
                transform: 'translateX(-50%)', zIndex: 30, textAlign: 'center', pointerEvents: 'none',
                padding: '.5rem 1rem', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(10px)',
                borderRadius: '.6rem', border: `1px solid rgba(${p.glowRgb},.25)`,
              }}
            >
              <p style={{ fontFamily: PF, fontSize: '.88rem', color: '#fff', whiteSpace: 'nowrap' }}>{p.title}</p>
              <p style={{ fontFamily: CO, fontSize: '.72rem', fontStyle: 'italic', color: `rgba(${p.glowRgb},.75)`, whiteSpace: 'nowrap' }}>{p.sub}</p>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(0,0,0,.5) 100%)', pointerEvents: 'none', zIndex: 1 }} />
    </motion.div>
  )
}

/* ─── Planet Node (desktop) ─── */
function PlanetNode({ planet, index, isHovered, onHover, onClick, style }: {
  planet: Planet; index: number; isHovered: boolean; onHover: (id: string|null) => void; onClick: () => void; style?: React.CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: .1 + index*.06, type: 'spring', stiffness: 180, damping: 18 }}
      style={{ ...style, zIndex: isHovered ? 20 : 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={() => onHover(planet.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <PlanetSphere planet={planet} size={planet.size} pulse={isHovered} hover={isHovered} />
    </motion.div>
  )
}

/* ─── Planet Sphere Visual ─── */
function PlanetSphere({ planet, size, pulse, hover }: { planet: Planet; size: number; pulse?: boolean; hover?: boolean }) {
  return (
    <motion.div
      style={{ position: 'relative', width: size, height: size, cursor: 'pointer' }}
      animate={{ y: pulse ? [0,-8,0] : 0, scale: hover ? 1.1 : 1 }}
      transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, scale: { type: 'spring', stiffness: 220, damping: 16 } }}
    >
      {/* Atmosphere outer glow */}
      <motion.div
        animate={{ opacity: hover ? 1 : 0.45, scale: hover ? 1.25 : 1 }}
        transition={{ duration: .4 }}
        style={{
          position: 'absolute',
          inset: -size*.22,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${planet.glowRgb},.35) 0%, transparent 70%)`,
          filter: `blur(${size*.15}px)`,
        }}
      />

      {/* Planet body */}
      <motion.div
        animate={{
          boxShadow: hover
            ? `0 0 ${size*.4}px rgba(${planet.glowRgb},.9), 0 0 ${size*.8}px rgba(${planet.glowRgb},.5), 0 0 ${size*1.4}px rgba(${planet.glowRgb},.2), inset -${size*.15}px -${size*.1}px ${size*.25}px rgba(0,0,0,.7)`
            : `0 0 ${size*.2}px rgba(${planet.glowRgb},.55), 0 0 ${size*.45}px rgba(${planet.glowRgb},.25), inset -${size*.15}px -${size*.1}px ${size*.25}px rgba(0,0,0,.7)`,
        }}
        transition={{ duration: .3 }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: planet.gradient,
        }}
      />

      {/* Ring (Saturn-like planets) */}
      {planet.hasRing && (
        <div style={{
          position: 'absolute',
          left: -size*.38, right: -size*.38,
          top: '42%', height: size*.18,
          background: `linear-gradient(90deg, transparent 0%, ${planet.ringColor} 20%, ${planet.ringColor} 80%, transparent 100%)`,
          borderRadius: '50%',
          transform: 'rotateX(70deg)',
          opacity: .7,
        }} />
      )}

      {/* Surface shimmer */}
      <motion.div
        animate={{ opacity: [0, 0.18, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: Math.random()*2 }}
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 65% 25%, rgba(255,255,255,.5) 0%, transparent 45%)' }}
      />

      {/* Emoji */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size*.32, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.8))' }}>
        {planet.emoji}
      </div>
    </motion.div>
  )
}
