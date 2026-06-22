'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const MEMORIES = [
  { title: 'İlk Bakışımız',        text: 'O an gözlerini gördüğümde hayatımın değişeceğini hissettim. Ve haklıydım.' },
  { title: 'Seninle Gülen Ben',    text: 'Seninle gülerken hiçbir şeyin önemi kalmıyor. Sadece o an var, sadece sen.' },
  { title: 'Seni Özlediğimde',     text: 'Aramızda mesafe olsa bile, aynı gökyüzüne bakıyoruz. Bu beni teselli eder.' },
  { title: 'Teşekkürler',          text: 'Hayatımda olduğun için. Sadece sen olduğun için. Her şey için teşekkürler.' },
  { title: 'Sonsuz Bir An',        text: 'Bazı anlar o kadar mükemmeldir ki onları sonsuza taşımak istersin. Sen öylesin.' },
  { title: 'Sen ve Ben',           text: 'İki ayrı dünya. Ama aynı evren. İki ayrı kalp. Ama aynı atış.' },
  { title: 'İçindeki Işık',        text: 'İçindeki ışık gözlerinden dışarı sızıyor. Her bakışında onu görebiliyorum.' },
  { title: 'Sessiz Anlar',         text: 'Seninle sessiz olmak bile anlamlı. Konuşmaya gerek yok — sen yeterlisin.' },
  { title: 'Kahkahan',             text: 'Kahkahandaki özgürlük... Sanki tüm dünyayı unuttun. O an en güzel anın.' },
  { title: 'Gece Düşünceleri',     text: 'Gece uyuyamadığımda seni düşünüyorum. Ve huzur buluyorum.' },
]

export default function StarSkyExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)
  const [selected, setSelected] = useState<typeof MEMORIES[0] | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.offsetWidth  || window.innerWidth
    const h = canvas.offsetHeight || window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x020208, 1)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 2000)
    camera.position.z = 380

    /* Background stars */
    const bgGeo = new THREE.BufferGeometry()
    const bgN   = 7000
    const bgPos = new Float32Array(bgN * 3)
    for (let i = 0; i < bgN; i++) {
      bgPos[i*3]   = (Math.random()-.5)*2800
      bgPos[i*3+1] = (Math.random()-.5)*2800
      bgPos[i*3+2] = (Math.random()-.5)*1200
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
    scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .9, transparent: true, opacity: .65 })))

    /* Pink nebula sprites */
    const nebGeo = new THREE.BufferGeometry()
    const nebN   = 600
    const nebPos = new Float32Array(nebN * 3)
    for (let i = 0; i < nebN; i++) {
      const ang = Math.random() * Math.PI * 2
      const r   = 200 + Math.random() * 200
      nebPos[i*3]   = Math.cos(ang) * r
      nebPos[i*3+1] = Math.sin(ang) * r
      nebPos[i*3+2] = (Math.random()-.5)*300
    }
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3))
    scene.add(new THREE.Points(nebGeo, new THREE.PointsMaterial({ color: 0xFF4D88, size: 2.5, transparent: true, opacity: .12 })))

    /* Memory stars */
    const mGeo  = new THREE.BufferGeometry()
    const mPos  = new Float32Array(MEMORIES.length * 3)
    const mData = MEMORIES.map((m, i) => {
      const angle = (i / MEMORIES.length) * Math.PI * 2
      const r     = 130 + (i % 3) * 35 + Math.random() * 20
      const x = Math.cos(angle) * r + (Math.random()-.5)*30
      const y = Math.sin(angle) * r + (Math.random()-.5)*30
      const z = (Math.random()-.5)*80
      mPos[i*3]   = x
      mPos[i*3+1] = y
      mPos[i*3+2] = z
      return { ...m, pos: new THREE.Vector3(x, y, z) }
    })
    mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3))
    const mMat = new THREE.PointsMaterial({ color: 0xFF4D88, size: 8, sizeAttenuation: true, transparent: true, opacity: .9 })
    const mPts = new THREE.Points(mGeo, mMat)
    scene.add(mPts)

    /* Constellation lines */
    const lineGeo = new THREE.BufferGeometry()
    const linePos: number[] = []
    for (let i = 0; i < mData.length; i++) {
      const next = mData[(i + 1) % mData.length]
      linePos.push(mData[i].pos.x, mData[i].pos.y, mData[i].pos.z)
      linePos.push(next.pos.x, next.pos.y, next.pos.z)
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3))
    scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xFF4D88, transparent: true, opacity: .08 })))

    /* Raycaster */
    const raycaster = new THREE.Raycaster()
    raycaster.params.Points!.threshold = 12
    const mouse = new THREE.Vector2()

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObject(mPts)
      if (hits.length > 0 && hits[0].index !== undefined) {
        setSelected(mData[hits[0].index])
      }
    }
    canvas.addEventListener('click', onClick)

    /* Animate */
    const clock = new THREE.Clock()
    const render = () => {
      rafRef.current = requestAnimationFrame(render)
      const t = clock.getElapsedTime()
      mMat.opacity = .7 + Math.sin(t * 1.8) * .25
      mMat.size    = 7 + Math.sin(t * 2.2) * 2
      camera.rotation.y = Math.sin(t * .08) * .06
      camera.rotation.x = Math.sin(t * .05) * .03
      renderer.render(scene, camera)
    }
    render()

    const onResize = () => {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
      renderer.setSize(cw, ch)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <section
      id="stars"
      ref={containerRef}
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ position: 'absolute', top: '4rem', left: 0, right: 0, textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}
      >
        <p style={{ fontFamily: IN, fontSize: '.68rem', color: 'rgba(255,194,209,.45)', letterSpacing: '.28em', textTransform: 'uppercase', marginBottom: '1rem' }}>Gece Gökyüzü</p>
        <h2 className="text-gradient" style={{ fontFamily: PF, fontSize: 'clamp(2.2rem,5vw,4rem)', display: 'block', marginBottom: '.75rem' }}>Yıldız Anılar</h2>
        <p style={{ fontFamily: CO, fontSize: '1.05rem', color: 'rgba(255,255,255,.35)', fontStyle: 'italic' }}>
          Pembe yıldızlara tıkla — gizli anıları keşfet
        </p>
      </motion.div>

      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100vh', display: 'block', cursor: 'crosshair' }}
      />

      {/* Memory modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{ position: 'absolute', inset: 0, background: 'rgba(2,2,8,.88)' }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ scale: .8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: .8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-pink"
              style={{ position: 'relative', borderRadius: '1.6rem', padding: '3rem', maxWidth: 440, width: '100%', textAlign: 'center' }}
            >
              {/* Star icon */}
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }} className="glow-pink">⭐</div>

              <h3 style={{ fontFamily: PF, fontSize: '1.8rem', color: '#FF4D88', marginBottom: '1.25rem' }}>{selected.title}</h3>

              <div style={{ width: 48, height: 1, margin: '0 auto 1.5rem', background: 'linear-gradient(90deg,transparent,#FF4D88,transparent)' }} />

              <p style={{ fontFamily: CO, fontSize: '1.2rem', color: 'rgba(255,255,255,.78)', lineHeight: 1.7, fontStyle: 'italic' }}>
                {selected.text}
              </p>

              <button
                onClick={() => setSelected(null)}
                style={{
                  marginTop: '2.5rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: IN, fontSize: '.62rem', letterSpacing: '.28em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.25)',
                }}
              >
                Kapat ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
