'use client'

import { useRef, useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

/* ══════════════════════════════════════════════
   PLANET DEFINITIONS
══════════════════════════════════════════════ */
interface PlanetDef {
  id: string; name: string; emoji: string; sub: string; desc: string
  color: string; glowRgb: string; type: 'earth'|'saturn'|'mars'|'jupiter'
  radius: number; orbitRadius: number; orbitSpeed: number
  orbitTilt: number; startAngle: number
  atmoColor: [number,number,number]; hasRings: boolean; hasMoon: boolean
}

const PLANETS: PlanetDef[] = [
  {
    id:'seda', name:'Seda', emoji:'🌸', sub:'Güvenli Liman', desc:'Onun Güvenli Limanı',
    color:'#4CAAFF', glowRgb:'76,170,255', type:'earth',
    radius:1.1, orbitRadius:9, orbitSpeed:0.055, orbitTilt:0.05, startAngle:0.8,
    atmoColor:[0.18,0.55,1.0], hasRings:false, hasMoon:true,
  },
  {
    id:'ilayda', name:'İlayda', emoji:'✨', sub:'Macera & Kahkaha', desc:'Birlikte Yazılan Hikayeler',
    color:'#FFB347', glowRgb:'255,179,71', type:'saturn',
    radius:1.35, orbitRadius:15, orbitSpeed:0.038, orbitTilt:0.09, startAngle:2.3,
    atmoColor:[1.0,0.72,0.28], hasRings:true, hasMoon:false,
  },
  {
    id:'cemile', name:'Cemile', emoji:'🌙', sub:'Gece Yarısı Sohbetleri', desc:'Gece Yarısı Sohbetleri',
    color:'#FF7055', glowRgb:'255,112,85', type:'mars',
    radius:0.92, orbitRadius:21, orbitSpeed:0.026, orbitTilt:-0.04, startAngle:5.6,
    atmoColor:[1.0,0.35,0.18], hasRings:false, hasMoon:false,
  },
  {
    id:'together', name:'Hepimiz', emoji:'⭐', sub:'Bir Arada', desc:'Bir Arada Olduğumuzda',
    color:'#BB88FF', glowRgb:'187,136,255', type:'jupiter',
    radius:1.85, orbitRadius:29, orbitSpeed:0.018, orbitTilt:0.07, startAngle:1.2,
    atmoColor:[0.68,0.42,1.0], hasRings:false, hasMoon:true,
  },
]

const CONNECTIONS = [[0,1],[0,2],[0,3],[1,3],[2,3],[1,2]]

/* ══════════════════════════════════════════════
   CANVAS TEXTURE GENERATORS
══════════════════════════════════════════════ */

function makeEarthTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width=1024; c.height=512
  const x = c.getContext('2d')!

  // Ocean
  const og = x.createLinearGradient(0,0,0,512)
  og.addColorStop(0,'#0d2a60'); og.addColorStop(0.4,'#1a4c8a')
  og.addColorStop(0.7,'#1e5a8a'); og.addColorStop(1,'#0d2a60')
  x.fillStyle=og; x.fillRect(0,0,1024,512)

  // Polar caps
  const pg=x.createLinearGradient(0,0,0,75)
  pg.addColorStop(0,'rgba(220,235,255,0.96)'); pg.addColorStop(1,'transparent')
  x.fillStyle=pg; x.fillRect(0,0,1024,75)
  const pg2=x.createLinearGradient(0,440,0,512)
  pg2.addColorStop(0,'transparent'); pg2.addColorStop(1,'rgba(215,230,255,0.88)')
  x.fillStyle=pg2; x.fillRect(0,440,1024,72)

  // Continents
  ;[
    {cx:160,cy:185,rx:118,ry:78,r:0.3,c:'#2d6b20'},
    {cx:330,cy:195,rx:58,ry:85,r:-0.2,c:'#3d7a28'},
    {cx:555,cy:158,rx:88,ry:62,r:0.45,c:'#355f1e'},
    {cx:710,cy:248,rx:108,ry:73,r:-0.1,c:'#2a5c1a'},
    {cx:860,cy:198,rx:68,ry:78,r:0.4,c:'#3a7022'},
    {cx:96,cy:318,rx:78,ry:48,r:-0.3,c:'#7a6a30'},
    {cx:410,cy:345,rx:62,ry:44,r:0.2,c:'#4a8a2a'},
    {cx:660,cy:375,rx:88,ry:53,r:-0.4,c:'#355f1e'},
    {cx:950,cy:215,rx:52,ry:62,r:0.1,c:'#2d5f1c'},
  ].forEach(({cx,cy,rx,ry,r,c})=>{
    x.save(); x.translate(cx,cy); x.rotate(r)
    const g=x.createRadialGradient(0,0,0,0,0,Math.max(rx,ry))
    g.addColorStop(0,c); g.addColorStop(0.75,c+'cc'); g.addColorStop(1,'transparent')
    x.fillStyle=g; x.beginPath(); x.ellipse(0,0,rx,ry,0,0,Math.PI*2); x.fill()
    // Desert highlight
    const dg=x.createRadialGradient(rx*0.2,ry*-0.1,0,0,0,rx*0.5)
    dg.addColorStop(0,'rgba(175,135,55,0.45)'); dg.addColorStop(1,'transparent')
    x.fillStyle=dg; x.beginPath(); x.ellipse(rx*0.2,-ry*0.1,rx*0.45,ry*0.35,0,0,Math.PI*2); x.fill()
    x.restore()
  })

  // Cloud bands
  x.globalAlpha=0.5
  ;[
    {cx:205,cy:138,w:285,h:28},{cx:510,cy:118,w:195,h:24},
    {cx:765,cy:155,w:175,h:26},{cx:95,cy:258,w:295,h:20},
    {cx:425,cy:275,w:245,h:24},{cx:710,cy:295,w:215,h:22},
    {cx:160,cy:375,w:255,h:26},{cx:610,cy:395,w:195,h:20},
  ].forEach(({cx,cy,w,h})=>{
    const cg=x.createLinearGradient(cx,cy,cx+w,cy+h)
    cg.addColorStop(0,'transparent'); cg.addColorStop(0.3,'rgba(255,255,255,0.82)')
    cg.addColorStop(0.7,'rgba(240,248,255,0.68)'); cg.addColorStop(1,'transparent')
    x.fillStyle=cg; x.beginPath(); x.ellipse(cx+w/2,cy+h/2,w/2,h,0,0,Math.PI*2); x.fill()
  })
  x.globalAlpha=1

  return new THREE.CanvasTexture(c)
}

function makeSaturnTex(): THREE.CanvasTexture {
  const c=document.createElement('canvas'); c.width=1024; c.height=512
  const x=c.getContext('2d')!

  const bands=[
    {y:0,h:38,c1:'#7a4e1e',c2:'#9a6a30'},{y:38,h:32,c1:'#b87e3e',c2:'#c88e4e'},
    {y:70,h:44,c1:'#dca858',c2:'#eccA68'},{y:114,h:30,c1:'#c09040',c2:'#d0a050'},
    {y:144,h:52,c1:'#e8c278',c2:'#f8d288'},{y:196,h:36,c1:'#ccA858',c2:'#dCb868'},
    {y:232,h:44,c1:'#b88240',c2:'#c89250'},{y:276,h:38,c1:'#d4a460',c2:'#e4b470'},
    {y:314,h:54,c1:'#f0ca88',c2:'#ffda98'},{y:368,h:34,c1:'#d0a055',c2:'#e0b065'},
    {y:402,h:40,c1:'#b87e3a',c2:'#c88e4a'},{y:442,h:70,c1:'#9a5e28',c2:'#aa6e38'},
  ]
  bands.forEach(({y,h,c1,c2})=>{
    const g=x.createLinearGradient(0,y,0,y+h)
    g.addColorStop(0,c1); g.addColorStop(0.5,c2); g.addColorStop(1,c1)
    x.fillStyle=g; x.fillRect(0,y,1024,h)
  })
  // Swirl strokes
  for(let i=0;i<9;i++){
    x.save(); x.globalAlpha=0.11; x.strokeStyle=i%2===0?'#FFE0AA':'#8a5020'; x.lineWidth=3
    x.beginPath()
    for(let px=0;px<1024;px+=3){
      const py=40+i*52+Math.sin(px*0.022+i)*10+Math.cos(px*0.038)*5
      if(px===0) x.moveTo(px,py); else x.lineTo(px,py)
    }
    x.stroke(); x.restore()
  }
  // Pink-rose atmosphere at poles
  const tg=x.createLinearGradient(0,0,0,100)
  tg.addColorStop(0,'rgba(255,150,150,0.38)'); tg.addColorStop(1,'transparent')
  x.fillStyle=tg; x.fillRect(0,0,1024,100)
  const bg=x.createLinearGradient(0,410,0,512)
  bg.addColorStop(0,'transparent'); bg.addColorStop(1,'rgba(255,150,150,0.38)')
  x.fillStyle=bg; x.fillRect(0,410,1024,102)

  return new THREE.CanvasTexture(c)
}

function makeMarsTex(): THREE.CanvasTexture {
  const c=document.createElement('canvas'); c.width=1024; c.height=512
  const x=c.getContext('2d')!

  const bg=x.createLinearGradient(0,0,1024,512)
  bg.addColorStop(0,'#7a1e00'); bg.addColorStop(0.3,'#a83010'); bg.addColorStop(0.7,'#963010'); bg.addColorStop(1,'#7a1e00')
  x.fillStyle=bg; x.fillRect(0,0,1024,512)

  // North polar cap
  const pg=x.createLinearGradient(0,0,0,72)
  pg.addColorStop(0,'rgba(215,228,255,0.92)'); pg.addColorStop(1,'transparent')
  x.fillStyle=pg; x.fillRect(0,0,1024,72)

  // Highlands
  ;[{cx:185,cy:198,rx:128,ry:78},{cx:505,cy:148,rx:98,ry:68},{cx:785,cy:245,rx:118,ry:88},
    {cx:325,cy:338,rx:88,ry:58},{cx:658,cy:378,rx:108,ry:73}].forEach(({cx,cy,rx,ry})=>{
    const g=x.createRadialGradient(cx,cy,0,cx,cy,Math.max(rx,ry))
    g.addColorStop(0,'rgba(195,112,55,0.58)'); g.addColorStop(0.5,'rgba(175,82,38,0.28)'); g.addColorStop(1,'transparent')
    x.fillStyle=g; x.beginPath(); x.ellipse(cx,cy,rx,ry,0.2,0,Math.PI*2); x.fill()
  })

  // Valles Marineris
  x.save(); x.globalAlpha=0.42; x.strokeStyle='#2a0000'; x.lineWidth=7
  x.beginPath(); x.moveTo(350,265); x.bezierCurveTo(480,245,585,285,722,262); x.stroke()
  x.globalAlpha=0.18; x.lineWidth=18; x.stroke(); x.restore()

  // Impact craters
  for(let i=0;i<14;i++){
    const cx=55+Math.random()*918, cy=62+Math.random()*398, r=7+Math.random()*22
    x.save(); x.globalAlpha=0.32
    const cg=x.createRadialGradient(cx-r*0.25,cy-r*0.25,0,cx,cy,r)
    cg.addColorStop(0,'#2a0800'); cg.addColorStop(0.7,'#501500'); cg.addColorStop(0.88,'#923a18'); cg.addColorStop(1,'transparent')
    x.fillStyle=cg; x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.fill()
    x.restore()
  }

  return new THREE.CanvasTexture(c)
}

function makeJupiterTex(): THREE.CanvasTexture {
  const c=document.createElement('canvas'); c.width=1024; c.height=512
  const x=c.getContext('2d')!

  const bands=[
    {y:0,h:33,c1:'#7a4018',c2:'#8a5028'},{y:33,h:26,c1:'#b87858',c2:'#c88868'},
    {y:59,h:38,c1:'#6a3810',c2:'#7a4820'},{y:97,h:30,c1:'#d0a870',c2:'#e0b880'},
    {y:127,h:44,c1:'#a06830',c2:'#b07840'},{y:171,h:36,c1:'#f0c870',c2:'#ffd888'},
    {y:207,h:40,c1:'#be8040',c2:'#ce9050'},{y:247,h:38,c1:'#ecc080',c2:'#fcd090'},
    {y:285,h:42,c1:'#9a5a20',c2:'#aa6a30'},{y:327,h:30,c1:'#d4a055',c2:'#e4b065'},
    {y:357,h:40,c1:'#8a4a18',c2:'#9a5a28'},{y:397,h:35,c1:'#c08050',c2:'#d09060'},
    {y:432,h:80,c1:'#7a4018',c2:'#8a5028'},
  ]
  bands.forEach(({y,h,c1,c2})=>{
    const g=x.createLinearGradient(0,y,0,y+h)
    g.addColorStop(0,c1); g.addColorStop(0.5,c2); g.addColorStop(1,c1)
    x.fillStyle=g; x.fillRect(0,y,1024,h)
  })
  // Turbulence swirls
  for(let i=0;i<11;i++){
    x.save(); x.globalAlpha=0.13; x.strokeStyle=i%3===0?'#FFD898':'#501800'; x.lineWidth=2.5
    x.beginPath()
    for(let px=0;px<1024;px+=3){
      const py=28+i*42+Math.sin(px*0.028+i*1.1)*7+Math.cos(px*0.065+i)*3.5
      if(px===0) x.moveTo(px,py); else x.lineTo(px,py)
    }
    x.stroke(); x.restore()
  }
  // Great Red Spot
  x.save(); x.translate(608,285); x.scale(1.55,0.72)
  const sg=x.createRadialGradient(0,0,0,0,0,52)
  sg.addColorStop(0,'rgba(100,12,6,0.92)'); sg.addColorStop(0.4,'rgba(145,32,16,0.78)')
  sg.addColorStop(0.78,'rgba(165,55,28,0.45)'); sg.addColorStop(1,'transparent')
  x.fillStyle=sg; x.beginPath(); x.arc(0,0,52,0,Math.PI*2); x.fill()
  x.restore()

  return new THREE.CanvasTexture(c)
}

function makeRingTex(): THREE.CanvasTexture {
  const c=document.createElement('canvas'); c.width=512; c.height=1
  const x=c.getContext('2d')!
  const g=x.createLinearGradient(0,0,512,0)
  g.addColorStop(0,'transparent'); g.addColorStop(0.08,'rgba(255,210,95,0.05)')
  g.addColorStop(0.18,'rgba(228,185,75,0.52)'); g.addColorStop(0.3,'rgba(252,218,95,0.82)')
  g.addColorStop(0.42,'rgba(205,172,65,0.6)'); g.addColorStop(0.5,'rgba(252,215,95,0.92)')
  g.addColorStop(0.6,'rgba(188,155,58,0.56)'); g.addColorStop(0.7,'rgba(238,195,78,0.72)')
  g.addColorStop(0.82,'rgba(215,175,68,0.38)'); g.addColorStop(0.92,'rgba(195,158,48,0.12)')
  g.addColorStop(1,'transparent')
  x.fillStyle=g; x.fillRect(0,0,512,1)
  return new THREE.CanvasTexture(c)
}

function makeGlowSprite(r:number,g:number,b:number): THREE.CanvasTexture {
  const c=document.createElement('canvas'); c.width=128; c.height=128
  const ctx=c.getContext('2d')!
  const gr=ctx.createRadialGradient(64,64,0,64,64,64)
  gr.addColorStop(0,`rgba(${r},${g},${b},1)`)
  gr.addColorStop(0.28,`rgba(${r},${g},${b},0.75)`)
  gr.addColorStop(0.6,`rgba(${r},${g},${b},0.28)`)
  gr.addColorStop(1,`rgba(${r},${g},${b},0)`)
  ctx.fillStyle=gr; ctx.fillRect(0,0,128,128)
  return new THREE.CanvasTexture(c)
}

/* ══════════════════════════════════════════════
   ORBIT RING
══════════════════════════════════════════════ */
function OrbitRing({ radius, tilt, color }: { radius:number; tilt:number; color:string }) {
  const geo = useMemo(()=> new THREE.TorusGeometry(radius, 0.016, 2, 512), [radius])
  return (
    <mesh geometry={geo} rotation={[Math.PI/2+tilt, 0, 0]}>
      <meshBasicMaterial color={color} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

/* ══════════════════════════════════════════════
   PLANET RINGS (Saturn)
══════════════════════════════════════════════ */
function PlanetRings({ r }: { r:number }) {
  const ringTex = useMemo(()=> makeRingTex(), [])
  const geo = useMemo(()=>{
    const g = new THREE.RingGeometry(r*1.38, r*2.65, 128)
    const pos = g.attributes.position as THREE.BufferAttribute
    const uv  = g.attributes.uv  as THREE.BufferAttribute
    const v3  = new THREE.Vector3()
    for (let i=0;i<pos.count;i++){
      v3.fromBufferAttribute(pos,i)
      const d = v3.length()
      const t = (d - r*1.38) / (r*2.65 - r*1.38)
      uv.setXY(i, t, 0)
    }
    return g
  }, [r])
  return (
    <mesh geometry={geo} rotation={[Math.PI/2.15, 0, 0.28]}>
      <meshBasicMaterial map={ringTex} side={THREE.DoubleSide} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

/* ══════════════════════════════════════════════
   MOON
══════════════════════════════════════════════ */
function PlanetMoon({ r }: { r:number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ang     = useRef(Math.random()*Math.PI*2)
  const dist    = r*2.3

  useFrame((_,dt)=>{
    ang.current += dt*0.65
    if (meshRef.current)
      meshRef.current.position.set(Math.cos(ang.current)*dist, Math.sin(ang.current)*dist*0.28, Math.sin(ang.current)*dist)
  })
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[r*0.2, 14, 14]} />
      <meshStandardMaterial color="#aaaaaa" roughness={0.92} />
    </mesh>
  )
}

/* ══════════════════════════════════════════════
   PLANET MESH
══════════════════════════════════════════════ */
interface PlanetProps {
  data: PlanetDef
  index: number
  positionsRef: React.MutableRefObject<THREE.Vector3[]>
  hoveredRef: React.MutableRefObject<string|null>
  onHover: (id:string)=>void
  onLeave: ()=>void
  onSelect: (id:string)=>void
  flyingId: string|null
}

function Planet({ data, index, positionsRef, hoveredRef, onHover, onLeave, onSelect, flyingId }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef  = useRef<THREE.Mesh>(null)
  const atmo1Ref = useRef<THREE.Mesh>(null)
  const atmo2Ref = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Sprite>(null)
  const angleRef = useRef(data.startAngle)

  const texture = useMemo(()=>{
    if (typeof window==='undefined') return null
    switch(data.type){
      case 'earth':   return makeEarthTex()
      case 'saturn':  return makeSaturnTex()
      case 'mars':    return makeMarsTex()
      case 'jupiter': return makeJupiterTex()
    }
  },[data.type])

  const glowTex = useMemo(()=>{
    if (typeof window==='undefined') return null
    const [r,g,b] = data.atmoColor
    return makeGlowSprite(Math.round(r*255), Math.round(g*255), Math.round(b*255))
  },[data.atmoColor])

  useFrame((_s,dt)=>{
    if (flyingId) {
      // Freeze orbit animation while camera is flying to this planet or another
      return
    }
    angleRef.current += dt * data.orbitSpeed * 0.22

    const a = angleRef.current
    const x = Math.cos(a) * data.orbitRadius
    const z = Math.sin(a) * data.orbitRadius * Math.cos(data.orbitTilt)
    const y = Math.sin(a) * data.orbitRadius * Math.sin(data.orbitTilt)

    if (groupRef.current) {
      groupRef.current.position.set(x,y,z)
      // Update shared positions array
      if (positionsRef.current) positionsRef.current[index].set(x,y,z)
    }

    if (meshRef.current) meshRef.current.rotation.y += dt*0.16

    const isHov = hoveredRef.current===data.id
    if (atmo1Ref.current) {
      const mat = atmo1Ref.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((isHov ? 0.32 : 0.14) - mat.opacity)*dt*4
    }
    if (atmo2Ref.current) {
      const mat = atmo2Ref.current.material as THREE.MeshBasicMaterial
      mat.opacity += ((isHov ? 0.1 : 0.04) - mat.opacity)*dt*4
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.SpriteMaterial
      mat.opacity += ((isHov ? 0.55 : 0.22) - mat.opacity)*dt*4
    }
  })

  return (
    <group ref={groupRef}>
      {/* Glow halo sprite */}
      {glowTex && (
        <sprite ref={glowRef} scale={[data.radius*6, data.radius*6, 1]}>
          <spriteMaterial map={glowTex} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      )}

      {/* Outer atmosphere */}
      <mesh ref={atmo2Ref}>
        <sphereGeometry args={[data.radius*1.22, 28, 28]} />
        <meshBasicMaterial
          color={new THREE.Color(...data.atmoColor)}
          transparent opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>

      {/* Inner atmosphere */}
      <mesh ref={atmo1Ref}>
        <sphereGeometry args={[data.radius*1.07, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(...data.atmoColor)}
          transparent opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>

      {/* Invisible enlarged hit target — makes small/distant planets easier to click */}
      <mesh
        onPointerOver={e=>{ e.stopPropagation(); onHover(data.id) }}
        onPointerOut={()=>onLeave()}
        onClick={e=>{ e.stopPropagation(); onSelect(data.id) }}
      >
        <sphereGeometry args={[data.radius * 2.8, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Planet body */}
      <mesh
        ref={meshRef}
        onPointerOver={e=>{ e.stopPropagation(); onHover(data.id) }}
        onPointerOut={()=>onLeave()}
        onClick={e=>{ e.stopPropagation(); onSelect(data.id) }}
      >
        <sphereGeometry args={[data.radius, 72, 72]} />
        {texture
          ? <meshPhongMaterial map={texture} shininess={12} specular={new THREE.Color(0x111111)} />
          : <meshPhongMaterial color={data.color} shininess={12} />
        }
      </mesh>

      {/* Specular rim */}
      <mesh>
        <sphereGeometry args={[data.radius*1.001, 28, 28]} />
        <meshBasicMaterial
          color={new THREE.Color(...data.atmoColor)}
          transparent opacity={0.08}
          blending={THREE.AdditiveBlending} depthWrite={false}
        />
      </mesh>

      {/* Rings */}
      {data.hasRings && <PlanetRings r={data.radius} />}

      {/* Moon */}
      {data.hasMoon && <PlanetMoon r={data.radius} />}

      {/* HTML label */}
      <Html center position={[0, data.radius+0.55, 0]} style={{ pointerEvents:'none', userSelect:'none' }}>
        <div style={{ textAlign:'center', whiteSpace:'nowrap' }}>
          <p style={{
            fontFamily:PF, margin:0,
            fontSize:'clamp(0.78rem,1.4vw,0.95rem)',
            color:data.color,
            letterSpacing:'0.06em',
            textShadow:`0 0 18px ${data.color}99`,
          }}>{data.name}</p>
        </div>
      </Html>
    </group>
  )
}

/* ══════════════════════════════════════════════
   CONSTELLATION LINES
══════════════════════════════════════════════ */
function ConstellationLines({
  positionsRef, connections, hoveredId,
}: {
  positionsRef: React.MutableRefObject<THREE.Vector3[]>
  connections: number[][]
  hoveredId: string|null
}) {
  const lineRef = useRef<THREE.LineSegments>(null)
  const geoRef  = useRef(new THREE.BufferGeometry())

  useFrame(()=>{
    if (!positionsRef.current) return
    const pts: number[] = []
    connections.forEach(([a,b])=>{
      const pa=positionsRef.current![a], pb=positionsRef.current![b]
      if (pa&&pb) pts.push(pa.x,pa.y,pa.z, pb.x,pb.y,pb.z)
    })
    const arr = new Float32Array(pts)
    geoRef.current.setAttribute('position', new THREE.BufferAttribute(arr,3))
    geoRef.current.attributes.position && (geoRef.current.attributes.position.needsUpdate=true)
  })

  return (
    <lineSegments ref={lineRef} geometry={geoRef.current}>
      <lineBasicMaterial color="#ffffff" transparent opacity={hoveredId ? 0.28 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  )
}

/* ══════════════════════════════════════════════
   CENTRAL STAR
══════════════════════════════════════════════ */
function CentralStar() {
  const c1=useRef<THREE.Mesh>(null)
  const c2=useRef<THREE.Mesh>(null)
  const c3=useRef<THREE.Mesh>(null)

  useFrame(s=>{
    const t=s.clock.elapsedTime
    if (c1.current) c1.current.scale.setScalar(1+Math.sin(t*1.1)*0.04)
    if (c2.current) { c2.current.scale.setScalar(1+Math.sin(t*0.7)*0.07); (c2.current.material as THREE.MeshBasicMaterial).opacity=0.3+Math.sin(t*0.7)*0.07 }
    if (c3.current) { c3.current.scale.setScalar(1+Math.sin(t*0.5+1)*0.1); (c3.current.material as THREE.MeshBasicMaterial).opacity=0.12+Math.sin(t*0.5)*0.03 }
  })

  return (
    <group>
      <mesh><sphereGeometry args={[0.88,28,28]}/><meshBasicMaterial color="#FFF8E0"/></mesh>
      <mesh ref={c1}><sphereGeometry args={[1.5,22,22]}/><meshBasicMaterial color="#FFF4C0" transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
      <mesh ref={c2}><sphereGeometry args={[2.5,18,18]}/><meshBasicMaterial color="#FFCC70" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
      <mesh ref={c3}><sphereGeometry args={[4.0,14,14]}/><meshBasicMaterial color="#FF8800" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════
   GALAXY BACKGROUND
══════════════════════════════════════════════ */
function GalaxyBG() {
  const s1=useRef<THREE.Points>(null)
  const s2=useRef<THREE.Points>(null)
  const arm=useRef<THREE.Points>(null)

  const starGeo1 = useMemo(()=>{
    const N=9000, p=new Float32Array(N*3), c=new Float32Array(N*3)
    for (let i=0;i<N;i++){
      p[i*3]=(Math.random()-0.5)*2800; p[i*3+1]=(Math.random()-0.5)*1600; p[i*3+2]=(Math.random()-0.5)*2000-50
      const t=Math.random()
      if(t<0.45){c[i*3]=1;c[i*3+1]=0.94;c[i*3+2]=1}
      else if(t<0.7){c[i*3]=1;c[i*3+1]=0.8;c[i*3+2]=0.58}
      else if(t<0.88){c[i*3]=0.72;c[i*3+1]=0.8;c[i*3+2]=1}
      else{c[i*3]=1;c[i*3+1]=0.68;c[i*3+2]=0.68}
    }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3)); return g
  },[])

  const starGeo2 = useMemo(()=>{
    const N=2500, p=new Float32Array(N*3), c=new Float32Array(N*3)
    for (let i=0;i<N;i++){
      p[i*3]=(Math.random()-0.5)*1800; p[i*3+1]=(Math.random()-0.5)*1000; p[i*3+2]=(Math.random()-0.5)*1400-100
      const b=0.5+Math.random()*0.5; c[i*3]=b;c[i*3+1]=b*0.9;c[i*3+2]=b
    }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3)); return g
  },[])

  const armGeo = useMemo(()=>{
    const N=7000, p=new Float32Array(N*3), c=new Float32Array(N*3)
    for (let i=0;i<N;i++){
      const t=(i/N)*Math.PI*4; const r=40+t*18; const sp=10+t*4
      const arm=Math.floor(Math.random()*2); const ang=t+arm*Math.PI
      p[i*3]=Math.cos(ang)*r+(Math.random()-0.5)*sp
      p[i*3+1]=(Math.random()-0.5)*10
      p[i*3+2]=Math.sin(ang)*r+(Math.random()-0.5)*sp-180
      const b=0.55+Math.random()*0.45
      if(Math.random()<0.38){c[i*3]=b*0.62;c[i*3+1]=b*0.75;c[i*3+2]=b}
      else{c[i*3]=b;c[i*3+1]=b*0.72;c[i*3+2]=b*0.42}
    }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3)); return g
  },[])

  const nebGeo = useMemo(()=>{
    const N=4500, p=new Float32Array(N*3), c=new Float32Array(N*3)
    for (let i=0;i<N;i++){
      const a=Math.random()*Math.PI*2, r=Math.pow(Math.random(),0.38)*1000
      p[i*3]=Math.cos(a)*r+(Math.random()-0.5)*420; p[i*3+1]=(Math.random()-0.5)*130; p[i*3+2]=(Math.random()-0.5)*620-380
      const t=Math.random()
      if(t<0.22){c[i*3]=0.12;c[i*3+1]=0.04;c[i*3+2]=0.42}
      else if(t<0.44){c[i*3]=0.04;c[i*3+1]=0.2;c[i*3+2]=0.44}
      else if(t<0.62){c[i*3]=0.38;c[i*3+1]=0.06;c[i*3+2]=0.24}
      else if(t<0.78){c[i*3]=0.22;c[i*3+1]=0.12;c[i*3+2]=0.06}
      else{c[i*3]=0.24;c[i*3+1]=0.1;c[i*3+2]=0.38}
    }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3)); g.setAttribute('color',new THREE.BufferAttribute(c,3)); return g
  },[])

  useFrame(s=>{
    const t=s.clock.elapsedTime*0.00022
    if(s1.current) s1.current.rotation.y=t
    if(s2.current) s2.current.rotation.y=-t*1.35
    if(arm.current) arm.current.rotation.y=t*0.55
  })

  return (<>
    <points ref={s1} geometry={starGeo1}><pointsMaterial size={0.72} vertexColors transparent opacity={0.58} sizeAttenuation /></points>
    <points ref={s2} geometry={starGeo2}><pointsMaterial size={1.55} vertexColors transparent opacity={0.42} sizeAttenuation /></points>
    <points ref={arm} geometry={armGeo}><pointsMaterial size={0.85} vertexColors transparent opacity={0.38} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} /></points>
    <points geometry={nebGeo}><pointsMaterial size={6.5} vertexColors transparent opacity={0.22} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} /></points>
  </>)
}

/* ══════════════════════════════════════════════
   CAMERA RIG
══════════════════════════════════════════════ */
function CameraRig({
  flyingIndex, positionsRef, onArrived,
}: {
  flyingIndex: number|null
  positionsRef: React.MutableRefObject<THREE.Vector3[]>
  onArrived: ()=>void
}) {
  const { camera } = useThree()
  const arrived    = useRef(false)
  const mouse      = useRef({x:0,y:0})
  const time       = useRef(0)

  useEffect(()=>{
    camera.position.set(0,12,44)
    camera.lookAt(0,0,0)
  },[])

  useEffect(()=>{
    arrived.current=false
    function onMM(e:MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove',onMM)
    return ()=>window.removeEventListener('mousemove',onMM)
  },[])

  useEffect(()=>{ arrived.current=false },[flyingIndex])

  useFrame((_,dt)=>{
    time.current+=dt
    if (flyingIndex!==null && positionsRef.current) {
      const target = positionsRef.current[flyingIndex]
      if (!target) return
      // Fly toward planet's far side (slightly past it away from origin)
      const dir = target.clone().normalize()
      const camTarget = target.clone().add(dir.clone().multiplyScalar(2.5))
      camera.position.lerp(camTarget, dt*1.1)
      camera.lookAt(target)

      if (!arrived.current && camera.position.distanceTo(target) < 5.5) {
        arrived.current=true
        onArrived()
      }
    } else {
      // Gentle orbit drift with mouse parallax
      const baseZ = 44
      const tx = Math.sin(time.current*0.055)*4 + mouse.current.x*2.5
      const ty = Math.cos(time.current*0.038)*2 + mouse.current.y*(-1.5)

      camera.position.x += (tx - camera.position.x)*dt*0.7
      camera.position.y += (ty - camera.position.y)*dt*0.7
      camera.position.z += (baseZ - camera.position.z)*dt*0.5
      camera.lookAt(0,0,0)
    }
  })

  return null
}

/* ══════════════════════════════════════════════
   MOBILE CAROUSEL (unchanged from original)
══════════════════════════════════════════════ */
function MobileNav({ onSelect, onBack, onTogether, onWhoAreYou }: Props) {
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const rafRef=useRef<number>(0)
  const [ready,setReady]=useState(false)
  const [active,setActive]=useState(0)
  const touchX=useRef(0)

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv)return
    const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:false})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setClearColor(0x020008)
    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,3000)
    camera.position.z=500
    const layer=(n:number,sz:number,d:number,op:number)=>{
      const g=new THREE.BufferGeometry(),p=new Float32Array(n*3),c=new Float32Array(n*3)
      for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*d*2;p[i*3+1]=(Math.random()-.5)*d*2;p[i*3+2]=(Math.random()-.5)*d-100;const t=Math.random();if(t<.45){c[i*3]=1;c[i*3+1]=.95;c[i*3+2]=1}else if(t<.7){c[i*3]=1;c[i*3+1]=.82;c[i*3+2]=.65}else{c[i*3]=.75;c[i*3+1]=.82;c[i*3+2]=1}}
      g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(c,3))
      const pts=new THREE.Points(g,new THREE.PointsMaterial({size:sz,vertexColors:true,transparent:true,opacity:op,sizeAttenuation:true}))
      scene.add(pts);return pts
    }
    const s1=layer(7000,.68,2200,.52),s2=layer(2500,1.3,1400,.37)
    const clock=new THREE.Clock()
    const tick=()=>{rafRef.current=requestAnimationFrame(tick);const t=clock.getElapsedTime();s1.rotation.y=t*.00032;s2.rotation.y=-t*.00058;renderer.render(scene,camera)}
    tick()
    setTimeout(()=>setReady(true),400)
    const onR=()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)}
    window.addEventListener('resize',onR)
    return ()=>{cancelAnimationFrame(rafRef.current);window.removeEventListener('resize',onR);renderer.dispose()}
  },[])

  const handleClick=(id:string)=>{
    if(id==='together') onTogether(); else onSelect(id)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.8}}
      style={{position:'fixed',inset:0,background:'#020008',overflow:'hidden'}}>
      <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>
      <motion.button initial={{opacity:0}} animate={{opacity:ready?.3:0}} whileHover={{opacity:.8}} onClick={onBack}
        style={{position:'absolute',top:'1.5rem',left:'1.5rem',background:'none',border:'none',cursor:'pointer',fontFamily:IN,fontSize:'.62rem',letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',zIndex:20}}>
        ← Çıkış
      </motion.button>
      <div style={{position:'absolute',top:0,left:0,right:0,zIndex:20,textAlign:'center',padding:'1.6rem'}}>
        <motion.p initial={{opacity:0,y:-10}} animate={{opacity:ready?1:0,y:0}} transition={{delay:.4}}
          style={{fontFamily:PF,fontSize:'1.05rem',color:'rgba(255,255,255,.82)'}}>Arkadaşların Evreni</motion.p>
      </div>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',overflow:'hidden'}}
        onTouchStart={e=>{touchX.current=e.touches[0].clientX}}
        onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-touchX.current;if(Math.abs(dx)<30)return;if(dx<0)setActive(i=>Math.min(i+1,PLANETS.length-1));else setActive(i=>Math.max(i-1,0))}}>
        {ready && PLANETS.map((p,i)=>{
          const off=i-active,isA=off===0,isN=Math.abs(off)===1
          return (
            <motion.div key={p.id}
              animate={{x:`calc(${off*100}vw - ${off*50}px)`,scale:isA?1:isN?.58:.22,opacity:isA?1:isN?.36:0,filter:isA?'blur(0px)':`blur(${isN?5:14}px)`,zIndex:isA?10:5-Math.abs(off)}}
              transition={{type:'spring',stiffness:200,damping:26}}
              style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'1.8rem'}}
              onClick={()=>isA?handleClick(p.id):setActive(i)}>
              <div style={{position:'relative',width:160,height:160}}>
                <motion.div animate={{opacity:[.3,.65,.3],scale:[1,1.55,1]}} transition={{duration:2.8,repeat:Infinity,ease:'easeOut'}}
                  style={{position:'absolute',inset:-24,borderRadius:'50%',background:`radial-gradient(circle,rgba(${p.glowRgb},.38) 0%,transparent 68%)`,filter:'blur(12px)'}}/>
                <div style={{position:'absolute',inset:0,borderRadius:'50%',background:
                  p.type==='earth'?'radial-gradient(circle at 32% 26%,#c8e8ff 0%,#2d6fa0 25%,#1a4c8a 52%,#0d2a60 78%,#010814 100%)':
                  p.type==='saturn'?'radial-gradient(circle at 32% 26%,#fff5e0 0%,#ecb840 25%,#c08030 52%,#6a4010 78%,#180c00 100%)':
                  p.type==='mars'?'radial-gradient(circle at 32% 26%,#fad0c0 0%,#cc4820 25%,#a03010 52%,#3a0a00 78%,#0a0000 100%)':
                  'radial-gradient(circle at 32% 26%,#ffeec0 0%,#d09840 25%,#a06020 52%,#3a1800 78%,#090300 100%)',
                  boxShadow:`0 0 40px rgba(${p.glowRgb},.65),0 0 80px rgba(${p.glowRgb},.28),inset -20px -14px 32px rgba(0,0,0,.85)`}}/>
                <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'radial-gradient(circle at 28% 22%,rgba(255,255,255,.55) 0%,rgba(255,255,255,.08) 30%,transparent 55%)'}}/>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3.5rem',filter:'drop-shadow(0 2px 10px rgba(0,0,0,.9))'}}>{p.emoji}</div>
              </div>
              {isA&&(
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} style={{textAlign:'center'}}>
                  <p style={{fontFamily:PF,fontSize:'1.35rem',color:p.color,marginBottom:'.3rem',textShadow:`0 0 22px rgba(${p.glowRgb},.55)`}}>{p.name}</p>
                  <p style={{fontFamily:CO,fontSize:'.88rem',fontStyle:'italic',color:`rgba(${p.glowRgb},.65)`,marginBottom:'1rem'}}>{p.sub}</p>
                  <motion.p animate={{opacity:[.3,.8,.3]}} transition={{duration:2,repeat:Infinity}}
                    style={{fontFamily:IN,fontSize:'.58rem',letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(255,255,255,.24)'}}>Girmek için tıkla</motion.p>
                </motion.div>
              )}
            </motion.div>
          )
        })}
        <div style={{position:'absolute',bottom:'5rem',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'.5rem',zIndex:20}}>
          {PLANETS.map((_,i)=>(
            <motion.div key={i} animate={{width:i===active?22:5,background:i===active?PLANETS[i].color:'rgba(255,255,255,.22)'}}
              style={{height:5,borderRadius:3,cursor:'pointer'}} onClick={()=>setActive(i)}/>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
interface Props {
  onSelect: (id:string)=>void
  onBack: ()=>void
  onTogether: ()=>void
  onWhoAreYou: ()=>void
}

export default function ConstellationNav({ onSelect, onBack, onTogether, onWhoAreYou }: Props) {
  const [hovered,    setHovered]    = useState<string|null>(null)
  const [flyingId,   setFlyingId]   = useState<string|null>(null)
  const [flyingIdx,  setFlyingIdx]  = useState<number|null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [ready,      setReady]      = useState(false)
  const [isMobile,   setIsMobile]   = useState(false)

  // Shared planet positions array for constellation lines + camera rig
  const positionsRef = useRef<THREE.Vector3[]>(PLANETS.map(()=> new THREE.Vector3()))
  // Hovered ref for planet components (avoids prop drilling re-renders)
  const hoveredRef   = useRef<string|null>(null)

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768)
    check(); window.addEventListener('resize',check)
    setTimeout(()=>setReady(true), 350)
    return ()=>window.removeEventListener('resize',check)
  },[])

  const handleHover = useCallback((id:string)=>{
    setHovered(id); hoveredRef.current=id
  },[])

  const handleLeave = useCallback(()=>{
    setHovered(null); hoveredRef.current=null
  },[])

  const handleSelect = useCallback((id:string)=>{
    if (transitioning) return
    const idx = PLANETS.findIndex(p=>p.id===id)
    setFlyingId(id); setFlyingIdx(idx); setTransitioning(true)
  },[transitioning])

  const handleArrived = useCallback(()=>{
    setTimeout(()=>{
      if (flyingId==='together') onTogether()
      else if (flyingId) onSelect(flyingId)
    }, 350)
  },[flyingId, onSelect, onTogether])

  if (isMobile) return <MobileNav onSelect={onSelect} onBack={onBack} onTogether={onTogether} onWhoAreYou={onWhoAreYou} />

  const hovPlanet = PLANETS.find(p=>p.id===hovered)

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:1.04}}
      transition={{duration:0.9}}
      style={{position:'fixed',inset:0,background:'#010008',overflow:'hidden'}}
    >
      {/* ── R3F Canvas ── */}
      <Canvas
        camera={{position:[0,12,44],fov:55,near:0.1,far:2000}}
        gl={{antialias:true,powerPreference:'high-performance'}}
        style={{position:'absolute',inset:0}}
        dpr={[1,2]}
      >
        <color attach="background" args={['#010008']} />
        <ambientLight intensity={0.08} />
        <pointLight position={[0,0,0]} intensity={5} color="#FFF0CC" distance={80} decay={2} />
        <pointLight position={[0,0,0]} intensity={2} color="#4488FF" distance={120} decay={2} />

        <GalaxyBG />

        <Suspense fallback={null}>
          <CentralStar />

          {PLANETS.map((p,i)=>(
            <OrbitRing key={`orbit-${p.id}`} radius={p.orbitRadius} tilt={p.orbitTilt} color={p.color} />
          ))}

          {PLANETS.map((p,i)=>(
            <Planet
              key={p.id}
              data={p}
              index={i}
              positionsRef={positionsRef}
              hoveredRef={hoveredRef}
              onHover={handleHover}
              onLeave={handleLeave}
              onSelect={handleSelect}
              flyingId={flyingId}
            />
          ))}

          <ConstellationLines positionsRef={positionsRef} connections={CONNECTIONS} hoveredId={hovered} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.22} luminanceSmoothing={0.88} intensity={1.2} radius={0.85} />
            <Vignette offset={0.28} darkness={0.72} />
          </EffectComposer>
        </Suspense>

        <CameraRig flyingIndex={flyingIdx} positionsRef={positionsRef} onArrived={handleArrived} />
      </Canvas>

      {/* ── Transition overlay ── */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}}
            transition={{duration:1.1, delay:0.7}}
            style={{position:'absolute',inset:0,background:'#000',zIndex:100,pointerEvents:'none'}}
          />
        )}
      </AnimatePresence>

      {/* ── Ambient hover tint ── */}
      <AnimatePresence>
        {hovPlanet && (
          <motion.div key={hovPlanet.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.6}}
            style={{position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
              background:`radial-gradient(ellipse 80% 70% at 50% 50%, rgba(${hovPlanet.glowRgb},.07) 0%, transparent 65%)`}}/>
        )}
      </AnimatePresence>

      {/* ── Vignette ── */}
      <div style={{position:'absolute',inset:0,zIndex:4,pointerEvents:'none',
        background:'radial-gradient(ellipse 90% 82% at 50% 50%, transparent 28%, rgba(0,0,6,.75) 100%)'}}/>

      {/* ── Top bar ── */}
      <motion.div
        initial={{opacity:0,y:-18}} animate={{opacity:ready?1:0,y:ready?0:-18}} transition={{delay:.5}}
        style={{position:'absolute',top:0,left:0,right:0,zIndex:30,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.6rem clamp(1.2rem,4vw,2.8rem)'}}>
        <motion.button initial={{opacity:0,x:-10}} animate={{opacity:ready?.32:0,x:0}} whileHover={{opacity:.85,x:-3}} onClick={onBack}
          style={{background:'none',border:'none',cursor:'pointer',fontFamily:IN,fontSize:'.62rem',letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(255,255,255,.4)'}}>
          ← Çıkış
        </motion.button>

        <motion.div initial={{opacity:0,y:-14}} animate={{opacity:ready?1:0,y:0}} transition={{delay:.55}} style={{textAlign:'center'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.75rem',marginBottom:'.4rem'}}>
            <div style={{width:30,height:.5,background:'linear-gradient(90deg,transparent,rgba(255,215,0,.38))'}}/>
            <motion.div animate={{opacity:[.4,.9,.4],scale:[1,1.2,1]}} transition={{duration:3,repeat:Infinity}}
              style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,215,0,.6)',boxShadow:'0 0 8px rgba(255,215,0,.6)'}}/>
            <div style={{width:30,height:.5,background:'linear-gradient(90deg,rgba(255,215,0,.38),transparent)'}}/>
          </div>
          <p style={{fontFamily:PF,fontSize:'clamp(.9rem,2.2vw,1.1rem)',color:'rgba(255,255,255,.84)',letterSpacing:'.04em'}}>Arkadaşların Evreni</p>
          <p style={{fontFamily:CO,fontSize:'.68rem',fontStyle:'italic',color:'rgba(255,215,0,.32)',marginTop:'.18rem'}}>Bir gezegene tıkla · içine gir</p>
        </motion.div>

        <motion.button initial={{opacity:0,x:10}} animate={{opacity:ready?.26:0,x:0}} whileHover={{opacity:.78}} onClick={onWhoAreYou}
          style={{background:'none',border:'none',cursor:'pointer',fontFamily:IN,fontSize:'.58rem',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.3)'}}>
          Sen Kimsin? ◈
        </motion.button>
      </motion.div>

      {/* ── Bottom hover panel ── */}
      <AnimatePresence>
        {hovPlanet && !transitioning && (
          <motion.div key={hovPlanet.id}
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}}
            transition={{duration:.38,ease:[.25,.1,.25,1]}}
            style={{position:'fixed',bottom:0,left:0,right:0,zIndex:30,pointerEvents:'none',
              padding:'1.4rem clamp(2rem,8vw,5rem) 1.6rem',
              background:`linear-gradient(to top, rgba(${hovPlanet.glowRgb},.16) 0%, transparent 100%)`,
              borderTop:`1px solid rgba(${hovPlanet.glowRgb},.16)`,
              backdropFilter:'blur(6px)',
              display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <p style={{fontFamily:IN,fontSize:'.5rem',letterSpacing:'.32em',textTransform:'uppercase',color:`rgba(${hovPlanet.glowRgb},.5)`,marginBottom:'.28rem'}}>
                {hovPlanet.emoji} Seçili
              </p>
              <p style={{fontFamily:PF,fontSize:'clamp(1.4rem,3vw,2rem)',color:'#fff',letterSpacing:'.06em',textShadow:`0 0 32px rgba(${hovPlanet.glowRgb},.65)`}}>
                {hovPlanet.name}
              </p>
              <p style={{fontFamily:CO,fontSize:'.88rem',fontStyle:'italic',color:`rgba(${hovPlanet.glowRgb},.72)`,marginTop:'.22rem'}}>
                {hovPlanet.desc}
              </p>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.8rem'}}>
              <div style={{display:'flex',gap:'.35rem',alignItems:'flex-end',height:20}}>
                {[1,2,3,2,1].map((h,n)=>(
                  <motion.div key={n} animate={{scaleY:[h*.5,h,h*.5]}} transition={{duration:.7,delay:n*.12,repeat:Infinity,ease:'easeInOut'}}
                    style={{width:3,height:`${h*5}px`,borderRadius:2,background:hovPlanet.color,opacity:.55,transformOrigin:'bottom'}}/>
                ))}
              </div>
              <p style={{fontFamily:IN,fontSize:'.56rem',letterSpacing:'.22em',textTransform:'uppercase',color:`rgba(${hovPlanet.glowRgb},.45)`}}>
                tıkla · gir →
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
