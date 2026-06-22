'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

interface Polaroid {
  id: number
  file: string
  caption: string
  date: string
  gradient: string
  rotation: number
  x: string
  y: string
  scale: number
  zBase: number
  voiceHint?: string
}

const BASE = '/alb%C3%BCm%C3%BCm%C3%BCz'

function ap(name: string) {
  return `${BASE}/${name.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`
}

const POLAROIDS: Polaroid[] = [
  { id:1,  file: ap('WhatsApp Image 2026-06-23 at 01.23.35.jpeg'),      caption:'Seninle her an güzel',       date:'♡', gradient:'linear-gradient(145deg,#1a0010 0%,#4d0030 50%,#ff4d88 100%)', rotation:-6,  x:'5%',  y:'6%',  scale:1,    zBase:5  },
  { id:2,  file: ap('WhatsApp Image 2026-06-23 at 01.23.36.jpeg'),      caption:'En güzel gülüşün',           date:'♡', gradient:'linear-gradient(145deg,#0a0a18 0%,#1e1e50 50%,#6666ff 100%)', rotation:4,   x:'25%', y:'3%',  scale:.9,   zBase:4  },
  { id:3,  file: ap('WhatsApp Image 2026-06-23 at 01.23.36 (1).jpeg'),  caption:'Seni seviyorum',             date:'♡', gradient:'linear-gradient(145deg,#1a0d00 0%,#4d2600 50%,#ff9900 100%)', rotation:-3,  x:'47%', y:'6%',  scale:.88,  zBase:6  },
  { id:4,  file: ap('WhatsApp Image 2026-06-23 at 01.23.36 (2).jpeg'),  caption:'Favorilerimden biri',        date:'♡', gradient:'linear-gradient(145deg,#061a06 0%,#1a4020 50%,#44aa44 100%)', rotation:7,   x:'68%', y:'4%',  scale:.85,  zBase:3  },
  { id:5,  file: ap('WhatsApp Image 2026-06-23 at 01.23.36 (3).jpeg'),  caption:'Bu anı çok sevdim',          date:'♡', gradient:'linear-gradient(145deg,#001428 0%,#003055 50%,#0088cc 100%)', rotation:-5,  x:'84%', y:'8%',  scale:.92,  zBase:7  },
  { id:6,  file: ap('WhatsApp Image 2026-06-23 at 01.23.36 (4).jpeg'),  caption:'Her an seninle',             date:'♡', gradient:'linear-gradient(145deg,#0d0014 0%,#280040 50%,#8800cc 100%)', rotation:5,   x:'2%',  y:'42%', scale:.95,  zBase:8  },
  { id:7,  file: ap('WhatsApp Image 2026-06-23 at 01.23.37.jpeg'),      caption:'Sen varsın, yeter',          date:'♡', gradient:'linear-gradient(145deg,#1a0005 0%,#4d001a 50%,#ee0055 100%)', rotation:-4,  x:'20%', y:'46%', scale:1.05, zBase:9  },
  { id:8,  file: ap('WhatsApp Image 2026-06-23 at 01.23.37 (1).jpeg'),  caption:'Seninle her yer güzel',      date:'♡', gradient:'linear-gradient(145deg,#08080e 0%,#181828 50%,#334488 100%)', rotation:8,   x:'40%', y:'44%', scale:.87,  zBase:5  },
  { id:9,  file: ap('WhatsApp Image 2026-06-23 at 01.23.37 (2).jpeg'),  caption:'Gözlerim seni arıyor',       date:'♡', gradient:'linear-gradient(145deg,#001020 0%,#003040 50%,#0099cc 100%)', rotation:-7,  x:'60%', y:'42%', scale:.93,  zBase:6  },
  { id:10, file: ap('WhatsApp Image 2026-06-23 at 01.23.37 (3).jpeg'),  caption:'Bu gülüş beni mahvetti',     date:'♡', gradient:'linear-gradient(145deg,#1a0010 0%,#500030 50%,#ff4d88 100%)', rotation:3,   x:'78%', y:'46%', scale:.88,  zBase:4  },
  { id:11, file: ap('WhatsApp Image 2026-06-23 at 01.23.37 (4).jpeg'),  caption:'Kalbim seninle',             date:'♡', gradient:'linear-gradient(145deg,#18100a 0%,#4a2800 50%,#ff8800 100%)', rotation:-5,  x:'90%', y:'44%', scale:.82,  zBase:3  },
  { id:12, file: ap('WhatsApp Image 2026-06-23 at 01.23.37 (5).jpeg'),  caption:'Beraber geçen zamanlar',     date:'♡', gradient:'linear-gradient(145deg,#0c0018 0%,#28004a 50%,#8800bb 100%)', rotation:6,   x:'8%',  y:'72%', scale:.9,   zBase:5  },
  { id:13, file: ap('WhatsApp Image 2026-06-23 at 01.23.38.jpeg'),      caption:'Seni çok seviyorum',         date:'♡', gradient:'linear-gradient(145deg,#1a0010 0%,#4d0030 50%,#ff4d88 100%)', rotation:-4,  x:'28%', y:'70%', scale:1,    zBase:7  },
  { id:14, file: ap('WhatsApp Image 2026-06-23 at 01.23.38 (1).jpeg'),  caption:'Seninle mutlu oldum',        date:'♡', gradient:'linear-gradient(145deg,#0a0a18 0%,#1e1e50 50%,#6666ff 100%)', rotation:5,   x:'52%', y:'74%', scale:.88,  zBase:4  },
  { id:15, file: ap('WhatsApp Image 2026-06-23 at 01.23.38 (2).jpeg'),  caption:'Her zaman seninleyim',       date:'♡', gradient:'linear-gradient(145deg,#1a0d00 0%,#4d2600 50%,#ff9900 100%)', rotation:-6,  x:'74%', y:'72%', scale:.92,  zBase:6  },
]

export default function FloatingAlbum({ onBack }: { onBack: () => void }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const [open,      setOpen]      = useState<Polaroid | null>(null)
  const [dragTarget, setDragTarget] = useState<number | null>(null)

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
    const geo=new THREE.BufferGeometry(); const N=4000
    const pos=new Float32Array(N*3),col=new Float32Array(N*3)
    for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*2400;pos[i*3+1]=(Math.random()-.5)*2400;pos[i*3+2]=(Math.random()-.5)*800;col[i*3]=1;col[i*3+1]=.92;col[i*3+2]=.95}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3))
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:.75,vertexColors:true,transparent:true,opacity:.38,sizeAttenuation:true}))
    scene.add(pts)
    const clock=new THREE.Clock()
    const tick=()=>{ rafRef.current=requestAnimationFrame(tick); const t=clock.getElapsedTime(); pts.rotation.y=t*.0004; renderer.render(scene,camera) }
    tick()
    const onR=()=>{ camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight) }
    window.addEventListener('resize',onR)
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener('resize',onR); renderer.dispose() }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .7 }}
      style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}
        whileHover={{ x: -3 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', zIndex: 40 }}
      >
        ← Geri
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
        style={{ position: 'absolute', top: '1.2rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 40, pointerEvents: 'none' }}
      >
        <h1 style={{ fontFamily: PF, fontSize: 'clamp(1rem,2.5vw,1.4rem)', color: 'rgba(255,255,255,.75)' }}>Albümümüz</h1>
        <p style={{ fontFamily: CO, fontSize: '.72rem', fontStyle: 'italic', color: 'rgba(255,194,209,.35)' }}>Donmuş anlar</p>
      </motion.div>

      {/* Floating polaroids */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {POLAROIDS.map((p, i) => (
          <motion.div
            key={p.id}
            drag
            dragMomentum={false}
            onDragStart={() => setDragTarget(p.id)}
            onDragEnd={() => setDragTarget(null)}
            initial={{ opacity: 0, scale: .7, rotate: p.rotation }}
            animate={{
              opacity: 1,
              scale: dragTarget === p.id ? p.scale * 1.08 : p.scale,
              rotate: p.rotation,
              y: dragTarget === p.id ? -4 : [0, -8, 0],
            }}
            transition={{
              opacity: { delay: .05*i, duration: .5 },
              scale:   { delay: .05*i, type: 'spring', stiffness: 200, damping: 20 },
              y:       { duration: 4 + i*0.3, repeat: Infinity, ease: 'easeInOut', delay: i*0.4 },
            }}
            style={{
              position: 'absolute',
              left: p.x, top: p.y,
              width: 'clamp(130px,18vw,190px)',
              cursor: 'grab',
              zIndex: dragTarget === p.id ? 30 : p.zBase,
              filter: `drop-shadow(0 8px 24px rgba(0,0,0,.7)) drop-shadow(0 0 12px rgba(255,77,136,.12))`,
            }}
            onClick={() => { if (dragTarget === null || dragTarget !== p.id) setOpen(p) }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {/* Polaroid frame */}
            <div style={{
              background: '#f5f0e8',
              borderRadius: '.3rem',
              padding: '.6rem .6rem .5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,.4), inset 0 0 0 1px rgba(0,0,0,.08)',
            }}>
              {/* Photo area */}
              <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '.5rem', borderRadius: '.15rem', aspectRatio: '4/3' }}>
                <div style={{ position: 'absolute', inset: 0, background: p.gradient }} />
                <img src={p.file} alt={p.caption} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
              </div>
              {/* Caption area */}
              <div style={{ padding: '.3rem .2rem .1rem' }}>
                <p style={{ fontFamily: CO, fontSize: 'clamp(.62rem,.9vw,.75rem)', fontStyle: 'italic', color: '#2a2020', lineHeight: 1.3, textAlign: 'center', marginBottom: '.15rem' }}>
                  {p.caption}
                </p>
                <p style={{ fontFamily: IN, fontSize: 'clamp(.5rem,.7vw,.6rem)', color: '#998888', textAlign: 'center', letterSpacing: '.08em' }}>
                  {p.date}
                </p>
                {p.voiceHint && (
                  <p style={{ fontFamily: IN, fontSize: '.55rem', color: '#FF4D88', textAlign: 'center', marginTop: '.15rem' }}>{p.voiceHint}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .3 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.9)', backdropFilter: 'blur(24px)' }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: .7, rotate: open.rotation, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: .7, rotate: open.rotation*2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              style={{
                background: '#f5f0e8',
                borderRadius: '.5rem',
                padding: 'clamp(.8rem,2vw,1.4rem)',
                maxWidth: 'min(88vw, 500px)',
                boxShadow: '0 0 80px rgba(255,77,136,.2), 0 24px 80px rgba(0,0,0,.7)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '.25rem', marginBottom: '.8rem', aspectRatio: '4/3' }}>
                <div style={{ position: 'absolute', inset: 0, background: open.gradient }} />
                <img src={open.file} alt={open.caption} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
              </div>
              <div style={{ padding: '.4rem .2rem', textAlign: 'center' }}>
                <p style={{ fontFamily: PF, fontSize: 'clamp(1rem,2.2vw,1.2rem)', color: '#2a1a1a', marginBottom: '.3rem' }}>{open.caption}</p>
                <p style={{ fontFamily: IN, fontSize: '.65rem', color: '#998080', letterSpacing: '.1em' }}>{open.date}</p>
                {open.voiceHint && (
                  <p style={{ fontFamily: CO, fontSize: '.78rem', fontStyle: 'italic', color: '#FF4D88', marginTop: '.5rem' }}>{open.voiceHint}</p>
                )}
              </div>
            </motion.div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              onClick={() => setOpen(null)}
              style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', width: 40, height: 40, color: 'rgba(255,255,255,.6)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
