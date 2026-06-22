'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const PINS: Record<string, string> = { biz: '1234', friends: '5678' }

const AMBIENT = [
  'İyi ki varsın.',
  'Burada bir anı saklı.',
  'Birileri seni çok seviyor.',
  'Bir hikaye seni bekliyor.',
]
const AMBIENT_POS = [
  { l: 12, t: 72 },
  { l: 74, t: 20 },
  { l:  8, t: 38 },
  { l: 78, t: 68 },
]

const PORTALS = {
  biz: {
    label: 'Sadece Biz',
    sub:   'İkimizin anıları',
    desc:  'Anılarımız, şarkılarımız, her şeyimiz...',
    color: '#FF4D88',
    rgb:   '255,77,136',
    hint:  'İlk buluştuğumuz ay ve gün',
  },
  friends: {
    label: 'Arkadaşlarının',
    sub:   'Gözünden Sen',
    desc:  "Seda, Cemile ve İlayda'nın sözleri...",
    color: '#A78BFA',
    rgb:   '167,139,250',
    hint:  'Seni tanıdığım yıl',
  },
}

interface Props {
  onSelectBiz:     () => void
  onSelectFriends: () => void
}

export default function MainHub({ onSelectBiz, onSelectFriends }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: 0, y: 0 })
  const rafRef    = useRef<number>(0)

  const [ready,        setReady]       = useState(false)
  const [hovered,      setHovered]     = useState<null | 'biz' | 'friends'>(null)
  const [activePortal, setActivePortal] = useState<null | 'biz' | 'friends'>(null)
  const [phraseIdx,    setPhraseIdx]   = useState(0)
  const [isMobile,     setIsMobile]    = useState(false)

  const [digits,   setDigits]   = useState<string[]>([])
  const [pinState, setPinState] = useState<'idle' | 'shake' | 'success'>('idle')
  const [hint,     setHint]     = useState(false)

  useEffect(() => { setTimeout(() => setReady(true), 700) }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 680)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setPhraseIdx(i => (i + 1) % AMBIENT.length), 4200)
    return () => clearInterval(id)
  }, [])

  // ── Three.js ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 3000)
    camera.position.z = 500

    // Stars
    const starN   = 9000
    const starPos = new Float32Array(starN * 3)
    for (let i = 0; i < starN; i++) {
      starPos[i*3]   = (Math.random() - 0.5) * 3200
      starPos[i*3+1] = (Math.random() - 0.5) * 3200
      starPos[i*3+2] = (Math.random() - 0.5) * 1600
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 1.1, transparent: true, opacity: 0.55, sizeAttenuation: true,
    })))

    // Nebula clouds
    const makeNeb = (cx: number, cy: number, cz: number, col: number, n: number, sp: number) => {
      const pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        const th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI
        const r  = Math.random() * sp
        pos[i*3] = cx + r * Math.sin(ph) * Math.cos(th)
        pos[i*3+1] = cy + r * Math.sin(ph) * Math.sin(th) * 0.35
        pos[i*3+2] = cz + r * Math.cos(ph) * 0.28
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({ color: col, size: 2.8, transparent: true, opacity: 0.11, sizeAttenuation: true })
      scene.add(new THREE.Points(g, mat))
      return mat
    }
    const neb1 = makeNeb(-380,  130, -220, 0xFF4D88, 1400, 260)
    const neb2 = makeNeb( 340,  -70, -180, 0x8B5CF6, 1000, 210)
    const neb3 = makeNeb(  40,  210, -320, 0x4D88FF,  700, 190)

    // Galaxy core
    const galaxy = new THREE.Group()
    scene.add(galaxy)

    const ARM_N = 3, PER_ARM = 700
    const galPos    = new Float32Array(ARM_N * PER_ARM * 3)
    const galColors = new Float32Array(ARM_N * PER_ARM * 3)
    const cInner = new THREE.Color(0xFFD1E8)
    const cOuter = new THREE.Color(0x5B21B6)

    for (let a = 0; a < ARM_N; a++) {
      const off = (a / ARM_N) * Math.PI * 2
      for (let i = 0; i < PER_ARM; i++) {
        const idx = (a * PER_ARM + i) * 3
        const t   = i / PER_ARM
        const rad = t * 130
        const ang = off + t * Math.PI * 4.2 + (Math.random() - 0.5) * 0.45
        const sc  = (1 - t) * 6 + t * 22
        galPos[idx]   = Math.cos(ang) * rad + (Math.random() - 0.5) * sc
        galPos[idx+1] = (Math.random() - 0.5) * (6 + t * 18)
        galPos[idx+2] = Math.sin(ang) * rad + (Math.random() - 0.5) * sc
        const col = cInner.clone().lerp(cOuter, t)
        galColors[idx] = col.r; galColors[idx+1] = col.g; galColors[idx+2] = col.b
      }
    }
    const galGeo = new THREE.BufferGeometry()
    galGeo.setAttribute('position', new THREE.BufferAttribute(galPos,    3))
    galGeo.setAttribute('color',    new THREE.BufferAttribute(galColors, 3))
    galaxy.add(new THREE.Points(galGeo, new THREE.PointsMaterial({
      size: 1.9, transparent: true, opacity: 0.7, vertexColors: true, sizeAttenuation: true,
    })))

    const coreP = new Float32Array(400 * 3)
    for (let i = 0; i < 400; i++) {
      const th = Math.random() * Math.PI * 2, r = Math.random() * 20
      coreP[i*3] = Math.cos(th) * r; coreP[i*3+1] = (Math.random() - 0.5) * 6; coreP[i*3+2] = Math.sin(th) * r
    }
    const coreGeo = new THREE.BufferGeometry()
    coreGeo.setAttribute('position', new THREE.BufferAttribute(coreP, 3))
    galaxy.add(new THREE.Points(coreGeo, new THREE.PointsMaterial({ color: 0xFFF0F8, size: 3.2, transparent: true, opacity: 0.92 })))

    // Shooting stars
    type SS = { line: THREE.Line; mat: THREE.LineBasicMaterial; p: number; spd: number; s: THREE.Vector3; e: THREE.Vector3; active: boolean; wait: number }
    const ss: SS[] = []
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0)])
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      const line = new THREE.Line(geo, mat)
      scene.add(line)
      ss.push({ line, mat, p: 0, spd: 0.012 + Math.random() * 0.018, s: new THREE.Vector3(), e: new THREE.Vector3(), active: false, wait: Math.random() * 180 })
    }
    const resetSS = (s: SS) => {
      const x = (Math.random() - 0.5) * 2200, y = 200 + Math.random() * 400
      s.s.set(x, y, -100 + Math.random() * 80)
      s.e.set(x + (Math.random() - 0.65) * 500, y - 200 - Math.random() * 200, s.s.z)
      s.p = 0; s.active = true
    }

    const clock = new THREE.Clock()

    const render = () => {
      rafRef.current = requestAnimationFrame(render)
      const t = clock.getElapsedTime()

      camera.position.x += (mouseRef.current.x * 0.025 - camera.position.x) * 0.028
      camera.position.y += (-mouseRef.current.y * 0.025 - camera.position.y) * 0.028
      camera.lookAt(0, 0, 0)

      galaxy.rotation.y = t * 0.035
      galaxy.rotation.x = Math.sin(t * 0.08) * 0.04

      neb1.opacity = 0.09 + Math.sin(t * 0.7)   * 0.04
      neb2.opacity = 0.09 + Math.sin(t * 0.5+1) * 0.035
      neb3.opacity = 0.07 + Math.sin(t * 0.9+2) * 0.03

      ss.forEach(s => {
        if (!s.active) { if (--s.wait <= 0) { resetSS(s); s.wait = 140 + Math.random() * 280 } return }
        s.p += s.spd
        if (s.p >= 1) { s.active = false; s.mat.opacity = 0; return }
        const cur  = s.s.clone().lerp(s.e, s.p)
        const tail = s.s.clone().lerp(s.e, Math.max(0, s.p - 0.09))
        const attr = s.line.geometry.attributes.position as THREE.BufferAttribute
        attr.setXYZ(0, tail.x, tail.y, tail.z)
        attr.setXYZ(1, cur.x,  cur.y,  cur.z)
        attr.needsUpdate = true
        const fade = s.p < 0.12 ? s.p / 0.12 : s.p > 0.78 ? (1 - s.p) / 0.22 : 1
        s.mat.opacity = fade * 0.75
      })

      renderer.render(scene, camera)
    }
    render()

    const onMM = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX - window.innerWidth/2, y: e.clientY - window.innerHeight/2 }
    }
    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }
    window.addEventListener('mousemove', onMM)
    window.addEventListener('resize',    onResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('resize',    onResize)
      renderer.dispose()
    }
  }, [])

  // ── PIN logic ───────────────────────────────────────────────────
  const handleDigit = useCallback((d: string) => {
    if (!activePortal || digits.length >= 4 || pinState !== 'idle') return
    const next = [...digits, d]
    setDigits(next)
    if (next.length === 4) {
      if (next.join('') === PINS[activePortal]) {
        setPinState('success')
        setTimeout(() => { activePortal === 'biz' ? onSelectBiz() : onSelectFriends() }, 1300)
      } else {
        setPinState('shake')
        setTimeout(() => { setPinState('idle'); setDigits([]) }, 720)
      }
    }
  }, [activePortal, digits, pinState, onSelectBiz, onSelectFriends])

  const handleDel = useCallback(() => {
    if (pinState !== 'idle') return
    setDigits(d => d.slice(0, -1))
  }, [pinState])

  const openPortal = (p: 'biz' | 'friends') => {
    setActivePortal(p); setDigits([]); setPinState('idle'); setHint(false)
  }
  const closePortal = () => {
    setActivePortal(null); setDigits([]); setPinState('idle'); setHint(false)
  }

  const KEYS    = ['1','2','3','4','5','6','7','8','9','','0','⌫']
  const portal  = activePortal ? PORTALS[activePortal] : null
  const isBiz   = activePortal === 'biz'
  const accent  = portal?.color ?? '#FF4D88'
  const accRGB  = portal?.rgb   ?? '255,77,136'

  const pSize = isMobile ? 'min(72vw, 270px)' : 'clamp(250px, 28vw, 370px)'

  return (
    <motion.div
      key="hub"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.9 }}
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#04040e' }}
    >
      {/* Three.js canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* CSS nebula glow overlays */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: '-8%', top: '18%', width: '42%', height: '55%', background: 'radial-gradient(ellipse, rgba(255,77,136,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', right: '-4%', top: '28%', width: '38%', height: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(55px)' }} />
        <div style={{ position: 'absolute', left: '32%', top: '-5%', width: '36%', height: '38%', background: 'radial-gradient(ellipse, rgba(77,136,255,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* ══ MAIN HUB ════════════════════════════════════════════ */}
      <AnimatePresence>
        {ready && !activePortal && (
          <motion.div
            key="hub-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'absolute', top: 'clamp(1.8rem,5.5vh,3.5rem)', left: 0, right: 0, textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}
            >
              <motion.p
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 4.5, repeat: Infinity }}
                style={{ fontFamily: IN, fontSize: '0.58rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(255,194,209,0.55)', marginBottom: '0.7rem' }}
              >
                Dijital Evrenin
              </motion.p>
              <motion.h1
                animate={{ textShadow: ['0 0 40px rgba(255,77,136,0.2)', '0 0 80px rgba(255,77,136,0.55)', '0 0 40px rgba(255,77,136,0.2)'] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ fontFamily: PF, fontSize: 'clamp(1.9rem,4.8vw,3.8rem)', color: '#fff', letterSpacing: '0.09em', margin: '0 0 0.55rem 0' }}
              >
                SENİN EVRENİN
              </motion.h1>
              <p style={{ fontFamily: CO, fontSize: 'clamp(0.78rem,1.4vw,1.05rem)', color: 'rgba(255,194,209,0.42)', fontStyle: 'italic' }}>
                Burada seni seven insanların bıraktığı izler saklı.
              </p>
            </motion.div>

            {/* Floating ambient texts */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 0.2, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 1.6 }}
                  style={{
                    position: 'absolute',
                    left: `${AMBIENT_POS[phraseIdx].l}%`,
                    top:  `${AMBIENT_POS[phraseIdx].t}%`,
                    fontFamily: CO, fontSize: 'clamp(0.7rem,1.1vw,0.95rem)',
                    fontStyle: 'italic', color: 'rgba(255,200,228,0.85)',
                    whiteSpace: 'nowrap', transform: 'translate(-50%,-50%)',
                    textShadow: '0 0 24px rgba(255,140,200,0.3)',
                  }}
                >
                  {AMBIENT[phraseIdx]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Portals */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center', justifyContent: 'center',
              gap: isMobile ? '2rem' : 'clamp(2.5rem,6vw,6rem)',
              paddingTop: isMobile ? 'clamp(7rem,18vh,10rem)' : '0',
              paddingBottom: isMobile ? '4rem' : '0',
              zIndex: 10,
            }}>
              {(['biz', 'friends'] as const).map((id, idx) => {
                const p  = PORTALS[id]
                const isH = hovered === id
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 55, scale: 0.82 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.45 + idx * 0.18, duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <motion.button
                      onMouseEnter={() => setHovered(id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => openPortal(id)}
                      animate={{ scale: isH ? 1.06 : 1, y: isH ? -6 : 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      style={{
                        position: 'relative', border: 'none', cursor: 'pointer',
                        background: 'transparent', outline: 'none',
                        width: pSize, height: pSize, borderRadius: '50%',
                      }}
                    >
                      {/* Glow */}
                      <motion.div
                        animate={{ opacity: isH ? 1 : 0.35, scale: isH ? 1.12 : 0.95 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', inset: '-28%', borderRadius: '50%', background: `radial-gradient(circle, rgba(${p.rgb},0.18) 0%, transparent 65%)`, filter: 'blur(18px)', pointerEvents: 'none' }}
                      />

                      {/* Ring 1 — outer CW */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: isH ? 8 : 22, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', inset: '1%', borderRadius: '50%' }}
                      >
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid rgba(${p.rgb},0.45)`, boxShadow: `0 0 18px rgba(${p.rgb},0.28)` }} />
                        <div style={{ position: 'absolute', top: -4, left: 'calc(50% - 4px)', width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 12px ${p.color}, 0 0 24px rgba(${p.rgb},0.5)` }} />
                      </motion.div>

                      {/* Ring 2 — mid CCW */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: isH ? 12 : 32, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', inset: '10%', borderRadius: '50%' }}
                      >
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid rgba(${p.rgb},0.28)`, boxShadow: `0 0 10px rgba(${p.rgb},0.14)` }} />
                        <div style={{ position: 'absolute', top: -3, left: 'calc(50% - 3px)', width: 6, height: 6, borderRadius: '50%', background: p.color, opacity: 0.7, boxShadow: `0 0 8px ${p.color}` }} />
                      </motion.div>

                      {/* Ring 3 — inner CW */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: isH ? 18 : 45, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', inset: '18%', borderRadius: '50%' }}
                      >
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `0.8px solid rgba(${p.rgb},0.18)` }} />
                      </motion.div>

                      {/* Inner nebula */}
                      <motion.div
                        animate={{ opacity: isH ? 1 : 0.55 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', inset: '10%', borderRadius: '50%', background: `radial-gradient(circle at 38% 38%, rgba(${p.rgb},${isH ? '0.28' : '0.12'}) 0%, rgba(${p.rgb},0.06) 45%, transparent 70%)`, pointerEvents: 'none' }}
                      />

                      {/* Orbiting particle dots */}
                      {[0,1,2,3,4,5,6,7].map(i => {
                        const ang = (i / 8) * Math.PI * 2
                        return (
                          <motion.div
                            key={i}
                            animate={{ opacity: isH ? [0.5, 1, 0.5] : [0.18, 0.38, 0.18], scale: isH ? [1, 1.6, 1] : 1 }}
                            transition={{ duration: 2.2 + i * 0.28, repeat: Infinity, delay: i * 0.22 }}
                            style={{
                              position: 'absolute',
                              left: `calc(50% + ${Math.cos(ang) * 48}% - 3px)`,
                              top:  `calc(50% + ${Math.sin(ang) * 48}% - 3px)`,
                              width: 6, height: 6, borderRadius: '50%',
                              background: p.color, boxShadow: `0 0 8px ${p.color}`,
                              pointerEvents: 'none',
                            }}
                          />
                        )
                      })}

                      {/* Label */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '22%' }}>
                        <motion.p
                          animate={{ textShadow: isH ? `0 0 30px ${p.color}, 0 0 60px rgba(${p.rgb},0.4)` : 'none' }}
                          transition={{ duration: 0.4 }}
                          style={{ fontFamily: PF, fontSize: 'clamp(0.9rem,1.8vw,1.35rem)', color: '#fff', marginBottom: '0.25rem', textAlign: 'center', lineHeight: 1.2 }}
                        >
                          {p.label}
                        </motion.p>
                        <p style={{ fontFamily: CO, fontSize: 'clamp(0.68rem,1vw,0.88rem)', color: `rgba(${p.rgb},0.7)`, fontStyle: 'italic', textAlign: 'center' }}>
                          {p.sub}
                        </p>
                        <motion.div
                          animate={{ opacity: isH ? 1 : 0, y: isH ? 0 : 8 }}
                          transition={{ duration: 0.3 }}
                          style={{ marginTop: '0.8rem', fontFamily: IN, fontSize: '0.56rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: p.color, border: `1px solid rgba(${p.rgb},0.5)`, borderRadius: '2rem', padding: '0.3rem 0.8rem', boxShadow: `0 0 18px rgba(${p.rgb},0.3)` }}
                        >
                          Giriş Yap →
                        </motion.div>
                      </div>
                    </motion.button>

                    {/* Description below */}
                    <motion.p
                      animate={{ opacity: isH ? 0.65 : 0, y: isH ? 0 : 10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      style={{ marginTop: '1.2rem', fontFamily: CO, fontSize: 'clamp(0.7rem,1.1vw,0.88rem)', color: `rgba(${p.rgb},0.9)`, fontStyle: 'italic', textAlign: 'center', maxWidth: '180px', pointerEvents: 'none', lineHeight: 1.6 }}
                    >
                      {p.desc}
                    </motion.p>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              style={{ position: 'absolute', bottom: '2.2rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none', zIndex: 10 }}
            >
              <p style={{ fontFamily: IN, fontSize: '0.52rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)' }}>
                Bir portal seç
              </p>
              <motion.div
                animate={{ opacity: [0.3, 0.65, 0.3] }}
                transition={{ duration: 2.6, repeat: Infinity }}
                style={{ display: 'flex', justifyContent: 'center', gap: '0.38rem', marginTop: '0.55rem' }}
              >
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#FF4D88', opacity: 0.3 + i * 0.22 }} />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PORTAL ZOOM + PIN ═══════════════════════════════════ */}
      <AnimatePresence>
        {activePortal && portal && (
          <motion.div
            key="pin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(4,4,14,0.88)', backdropFilter: 'blur(24px)' }}
            />

            {/* Energy halo */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'absolute', width: 'min(75vmin,600px)', height: 'min(75vmin,600px)', borderRadius: '50%', background: `radial-gradient(circle, rgba(${accRGB},0.14) 0%, transparent 68%)`, filter: 'blur(10px)' }}
            />

            {/* Spinning energy rings */}
            {[
              { offset: '-2vmin', dur: 10,  dir:  1 },
              { offset: '3vmin',  dur: 15,  dir: -1 },
              { offset: '8vmin',  dur: 8,   dir:  1 },
            ].map((r, i) => (
              <motion.div
                key={i}
                animate={{ rotate: r.dir * 360 }}
                transition={{ duration: r.dur, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width:  `calc(min(75vmin,600px) + ${r.offset} * -2)`,
                  height: `calc(min(75vmin,600px) + ${r.offset} * -2)`,
                  borderRadius: '50%',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: `${1.4 - i * 0.3}px solid rgba(${accRGB},${0.35 - i * 0.08})`,
                  boxShadow: `0 0 ${22 + i * 8}px rgba(${accRGB},${0.2 - i * 0.05})`,
                }} />
                <div style={{
                  position: 'absolute', top: -4, left: 'calc(50% - 4px)',
                  width: 8, height: 8, borderRadius: '50%',
                  background: accent,
                  boxShadow: `0 0 14px ${accent}, 0 0 28px rgba(${accRGB},0.5)`,
                  opacity: 1 - i * 0.25,
                }} />
              </motion.div>
            ))}

            {/* PIN card */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'relative', zIndex: 5 }}
            >
              <motion.div
                animate={
                  pinState === 'shake'
                    ? { x: [-16, 16, -14, 14, -10, 10, -6, 6, 0] }
                    : pinState === 'success'
                    ? { scale: [1, 1.04, 1] }
                    : {}
                }
                transition={{ duration: 0.55 }}
                style={{
                  background: 'rgba(255,255,255,0.032)',
                  backdropFilter: 'blur(44px)',
                  border: `1px solid ${pinState === 'success' ? accent : 'rgba(255,255,255,0.09)'}`,
                  borderRadius: '2rem',
                  padding: 'clamp(1.8rem,4.5vw,2.8rem) clamp(1.8rem,4.5vw,3.2rem)',
                  width: 'min(370px, 88vw)',
                  boxShadow: pinState === 'success'
                    ? `0 0 90px rgba(${accRGB},0.45)`
                    : `0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)`,
                  transition: 'border-color 0.4s, box-shadow 0.4s',
                }}
              >
                {/* Back */}
                <motion.button
                  whileHover={{ x: -3 }}
                  onClick={closePortal}
                  style={{ position: 'absolute', top: '1.1rem', left: '1.3rem', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.22)', fontFamily: IN, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                >
                  ← Geri
                </motion.button>

                {/* Icon + title */}
                <div style={{ textAlign: 'center', marginBottom: '1.6rem', paddingTop: '0.4rem' }}>
                  <motion.div animate={{ scale: pinState === 'success' ? [1, 1.45, 1] : 1 }} style={{ fontSize: '2.2rem', marginBottom: '0.65rem' }}>
                    {isBiz ? '❤️' : '👭'}
                  </motion.div>
                  <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.25rem,2.8vw,1.65rem)', color: '#fff', marginBottom: '0.28rem' }}>
                    {portal.label}
                  </h2>
                  <p style={{ fontFamily: CO, fontSize: '0.86rem', color: 'rgba(255,255,255,0.27)', fontStyle: 'italic' }}>
                    {isBiz ? 'Özel anılarımıza hoş geldin' : 'Arkadaşların seni bekliyor'}
                  </p>
                </div>

                {/* PIN dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.6rem' }}>
                  {[0,1,2,3].map(i => {
                    const filled  = i < digits.length
                    const current = i === digits.length
                    return (
                      <motion.div
                        key={i}
                        animate={pinState === 'success' && filled ? { scale: [1, 1.45, 1] } : {}}
                        transition={{ delay: i * 0.08 }}
                        style={{
                          width: 14, height: 14, borderRadius: '50%',
                          background: filled ? accent : 'transparent',
                          border: `2px solid ${filled ? accent : current ? `rgba(${accRGB},0.6)` : 'rgba(255,255,255,0.14)'}`,
                          boxShadow: filled ? `0 0 14px ${accent}` : 'none',
                          transition: 'all 0.22s',
                        }}
                      />
                    )
                  })}
                </div>

                {/* Feedback */}
                <div style={{ textAlign: 'center', marginBottom: '0.9rem', minHeight: '1.2rem' }}>
                  <AnimatePresence>
                    {pinState === 'shake' && (
                      <motion.p key="err" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ fontFamily: IN, fontSize: '0.68rem', color: '#ff6b6b', letterSpacing: '0.07em' }}>
                        Yanlış şifre, tekrar dene
                      </motion.p>
                    )}
                    {pinState === 'success' && (
                      <motion.p key="ok" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontFamily: IN, fontSize: '0.68rem', color: accent, letterSpacing: '0.07em' }}>
                        ✓ Hoş geldin
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Keypad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  {KEYS.map((k, i) => {
                    const isDel   = k === '⌫'
                    const isEmpty = k === ''
                    return (
                      <motion.button
                        key={i}
                        whileHover={isEmpty ? {} : { scale: 1.08, background: isDel ? 'rgba(255,255,255,0.07)' : `rgba(${accRGB},0.14)` }}
                        whileTap={isEmpty ? {} : { scale: 0.92 }}
                        onClick={() => isEmpty ? undefined : isDel ? handleDel() : handleDigit(k)}
                        disabled={isEmpty || pinState === 'success'}
                        style={{
                          height: '3.1rem', borderRadius: '0.82rem',
                          background: isEmpty ? 'transparent' : 'rgba(255,255,255,0.042)',
                          border: isEmpty ? 'none' : '1px solid rgba(255,255,255,0.075)',
                          color: isDel ? 'rgba(255,255,255,0.4)' : '#fff',
                          fontFamily: IN, fontSize: isDel ? '1.1rem' : '1.22rem', fontWeight: '500',
                          cursor: isEmpty ? 'default' : 'pointer',
                          transition: 'background 0.14s',
                        }}
                      >
                        {k}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Hint */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => setHint(h => !h)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '0.58rem', color: 'rgba(255,255,255,0.14)', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                  >
                    İpucu {hint ? '▲' : '▼'}
                  </button>
                  <AnimatePresence>
                    {hint && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ fontFamily: CO, fontSize: '0.78rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.18)', marginTop: '0.45rem' }}
                      >
                        {portal.hint}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 32%, rgba(4,4,14,0.62) 100%)', zIndex: 18 }} />
    </motion.div>
  )
}
