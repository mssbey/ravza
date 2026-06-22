'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface Props { onEnter: () => void }

export default function Landing({ onEnter }: Props) {
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const animRef       = useRef<number>(0)
  const mouseRef      = useRef({ x: 0, y: 0 })

  /* ── mutable animation state (read/written by render loop) ─── */
  const sceneRef      = useRef<THREE.Scene | null>(null)
  const cameraRef     = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef   = useRef<THREE.WebGLRenderer | null>(null)
  const bgMatRef      = useRef<THREE.PointsMaterial | null>(null)
  const glMatRef      = useRef<THREE.PointsMaterial | null>(null)
  const galaxyRef     = useRef<THREE.Points | null>(null)
  const heartGrpRef   = useRef<THREE.Group | null>(null)
  const hSurfMatRef   = useRef<THREE.PointsMaterial | null>(null)
  const hAuraMatRef   = useRef<THREE.PointsMaterial | null>(null)
  const hSurfGeoRef   = useRef<THREE.BufferGeometry | null>(null)
  const hAuraGeoRef   = useRef<THREE.BufferGeometry | null>(null)
  const beatIvRef     = useRef<ReturnType<typeof setInterval> | null>(null)
  const rippleArrRef  = useRef<Array<{ mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; geo: THREE.RingGeometry; age: number }>>([])
  const explodingRef  = useRef(false)
  const explodeVelRef = useRef<Float32Array | null>(null)
  const explodeTRef   = useRef(0)
  const onEnterRef    = useRef(onEnter)
  onEnterRef.current  = onEnter

  /* ── react state ─────────────────────────────────────────────── */
  const [starsIn,   setStarsIn]   = useState(false)
  const [textPhase, setTextPhase] = useState<'none'|'t1'|'t2'|'heart'>('none')
  const [exploded,  setExploded]  = useState(false)

  /* ══════════════════════════════════════════════════════════════
     THREE.JS INIT
  ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* ── renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    rendererRef.current = renderer

    const scene  = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 12000)
    camera.position.set(0, 0, 600)
    cameraRef.current = camera

    /* ── canvas sprite texture ────────────────────────────── */
    function makeSprite(size = 64): THREE.Texture {
      const c = document.createElement('canvas')
      c.width = c.height = size
      const ctx = c.getContext('2d')!
      const g   = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
      g.addColorStop(0,    'rgba(255,255,255,1)')
      g.addColorStop(0.12, 'rgba(255,255,255,0.9)')
      g.addColorStop(0.4,  'rgba(255,255,255,0.15)')
      g.addColorStop(1,    'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
      return new THREE.CanvasTexture(c)
    }

    function makeNebulaSprite(r: number, g2: number, b: number): THREE.Texture {
      const c   = document.createElement('canvas')
      c.width   = c.height = 128
      const ctx = c.getContext('2d')!
      const g   = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0,    `rgba(${r},${g2},${b},0.55)`)
      g.addColorStop(0.3,  `rgba(${r},${g2},${b},0.18)`)
      g.addColorStop(0.65, `rgba(${r},${g2},${b},0.04)`)
      g.addColorStop(1,    `rgba(${r},${g2},${b},0)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 128, 128)
      return new THREE.CanvasTexture(c)
    }

    const sprite = makeSprite(64)

    /* ── background stars 40k ─────────────────────────────── */
    {
      const N   = 40000
      const pos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        pos[i*3]   = (Math.random() - .5) * 10000
        pos[i*3+1] = (Math.random() - .5) * 10000
        pos[i*3+2] = (Math.random() - .5) * 6000
        const t = Math.random()
        if      (t < .52) { col[i*3]=1;   col[i*3+1]=1;   col[i*3+2]=1   }
        else if (t < .72) { col[i*3]=.68; col[i*3+1]=.78; col[i*3+2]=1   }
        else if (t < .88) { col[i*3]=1;   col[i*3+1]=.82; col[i*3+2]=.5  }
        else               { col[i*3]=1;   col[i*3+1]=.22; col[i*3+2]=.6  }
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({
        size: 1.05, sizeAttenuation: true, vertexColors: true,
        transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
        map: sprite, alphaTest: 0.001,
      })
      bgMatRef.current = mat
      scene.add(new THREE.Points(geo, mat))
    }

    /* ── galaxy spiral 22k ────────────────────────────────── */
    {
      const N       = 22000
      const ARMS    = 3
      const PER     = Math.floor(N / ARMS)
      const pos     = new Float32Array(N * 3)
      const col     = new Float32Array(N * 3)
      const galaxyGroup = new THREE.Group()
      galaxyGroup.rotation.x = 0.22
      galaxyGroup.position.z = -1200
      let gi = 0
      for (let arm = 0; arm < ARMS; arm++) {
        for (let i = 0; i < PER; i++) {
          const t    = i / PER
          const rad  = 50 + t * 2000
          const spin = rad * 0.0032
          const base = (arm / ARMS) * Math.PI * 2
          const ang  = base + spin + (Math.random() - .5) * 0.4
          const scat = Math.exp(-t * 1.1) * 100 + 18
          pos[gi*3]   = Math.cos(ang) * rad + (Math.random() - .5) * scat
          pos[gi*3+1] = (Math.random() - .5) * 22
          pos[gi*3+2] = Math.sin(ang) * rad + (Math.random() - .5) * scat
          if (Math.random() > 0.6) {
            col[gi*3]=1; col[gi*3+1]=0.28+t*0.2; col[gi*3+2]=0.55+t*0.3
          } else {
            col[gi*3]=0.65+t*0.15; col[gi*3+1]=0.78; col[gi*3+2]=1
          }
          gi++
        }
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({
        size: 1.4, sizeAttenuation: true, vertexColors: true,
        transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
        map: sprite, alphaTest: 0.001,
      })
      glMatRef.current = mat
      const pts = new THREE.Points(geo, mat)
      galaxyRef.current = pts
      galaxyGroup.add(pts)
      scene.add(galaxyGroup)
    }

    /* ── nebula clouds ────────────────────────────────────── */
    const nebulaMats: THREE.PointsMaterial[] = []
    const nebs = [
      { x: -520, y: 180,  z: -700,  r: 255, g: 48,  b: 130, n: 550 },
      { x:  420, y: -90,  z: -550,  r: 110, g: 55,  b: 230, n: 480 },
      { x:  -60, y: -280, z:-1000,  r:  50, g: 130, b: 255, n: 520 },
      { x: -320, y: 280,  z:-1200,  r: 210, g: 55,  b: 255, n: 380 },
      { x:  560, y: 110,  z: -800,  r: 255, g: 145, b:  55, n: 330 },
    ]
    for (const nb of nebs) {
      const pos = new Float32Array(nb.n * 3)
      for (let i = 0; i < nb.n; i++) {
        const r  = 80 + Math.random() * 240
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        pos[i*3]   = nb.x + r * Math.sin(ph) * Math.cos(th)
        pos[i*3+1] = nb.y + r * Math.sin(ph) * Math.sin(th) * 0.42
        pos[i*3+2] = nb.z + r * Math.cos(ph) * 0.5
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({
        size: 90, sizeAttenuation: true,
        transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
        map: makeNebulaSprite(nb.r, nb.g, nb.b), alphaTest: 0.001,
      })
      nebulaMats.push(mat)
      scene.add(new THREE.Points(geo, mat))
    }

    /* ── distant galaxy halos ─────────────────────────────── */
    const haloConfigs = [
      { x: -2200, y: 300, z: -3000, r: 255, g: 100, b: 200, n: 300 },
      { x:  2500, y:-200, z: -2500, r: 100, g: 200, b: 255, n: 280 },
    ]
    for (const hc of haloConfigs) {
      const pos = new Float32Array(hc.n * 3)
      for (let i = 0; i < hc.n; i++) {
        const r  = 40 + Math.random() * 180
        const th = Math.random() * Math.PI * 2
        pos[i*3]   = hc.x + r * Math.cos(th)
        pos[i*3+1] = hc.y + r * Math.sin(th) * 0.4
        pos[i*3+2] = hc.z + (Math.random() - .5) * 80
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({
        size: 50, sizeAttenuation: true,
        transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
        map: makeNebulaSprite(hc.r, hc.g, hc.b), alphaTest: 0.001,
      })
      nebulaMats.push(mat)
      scene.add(new THREE.Points(geo, mat))
    }

    /* ── particle heart ───────────────────────────────────── */
    const heartGroup = new THREE.Group()
    heartGroup.visible = false
    heartGrpRef.current = heartGroup
    scene.add(heartGroup)

    const SCALE   = 10
    const SURF_N  = 10000
    const AURA_N  = 7000

    // Surface particles — tight around parametric curve
    const surfPos = new Float32Array(SURF_N * 3)
    const surfCol = new Float32Array(SURF_N * 3)
    for (let i = 0; i < SURF_N; i++) {
      const t  = Math.random() * Math.PI * 2
      const hx =  16 * Math.pow(Math.sin(t), 3)
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
      const j  = Math.random() * (i < SURF_N * 0.55 ? 1.2 : 4.5)
      const ja = Math.random() * Math.PI * 2
      surfPos[i*3]   = hx * SCALE + Math.cos(ja) * j
      surfPos[i*3+1] = hy * SCALE + Math.sin(ja) * j
      surfPos[i*3+2] = (Math.random() - .5) * 7
      const dist = Math.sqrt(surfPos[i*3]**2 + surfPos[i*3+1]**2)
      const d    = Math.min(dist / (100), 1)
      if (d < 0.25)      { surfCol[i*3]=1; surfCol[i*3+1]=1; surfCol[i*3+2]=1 }
      else if (d < 0.6)  { surfCol[i*3]=1; surfCol[i*3+1]=0.52-d*0.32; surfCol[i*3+2]=0.85-d*0.6 }
      else               { surfCol[i*3]=1; surfCol[i*3+1]=0.1; surfCol[i*3+2]=0.3+Math.random()*0.28 }
    }
    const surfGeo = new THREE.BufferGeometry()
    surfGeo.setAttribute('position', new THREE.BufferAttribute(surfPos, 3))
    surfGeo.setAttribute('color',    new THREE.BufferAttribute(surfCol, 3))
    const surfMat = new THREE.PointsMaterial({
      size: 2.2, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
      map: sprite, alphaTest: 0.001,
    })
    hSurfMatRef.current = surfMat
    hSurfGeoRef.current = surfGeo
    heartGroup.add(new THREE.Points(surfGeo, surfMat))

    // Aura particles — glowing halo around heart
    const auraPos = new Float32Array(AURA_N * 3)
    const auraCol = new Float32Array(AURA_N * 3)
    for (let i = 0; i < AURA_N; i++) {
      const t  = Math.random() * Math.PI * 2
      const hx =  16 * Math.pow(Math.sin(t), 3)
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
      const j  = 18 + Math.random() * 65
      const ja = Math.random() * Math.PI * 2
      auraPos[i*3]   = hx * SCALE + Math.cos(ja) * j
      auraPos[i*3+1] = hy * SCALE + Math.sin(ja) * j * 0.85
      auraPos[i*3+2] = (Math.random() - .5) * 28
      auraCol[i*3]   = 1
      auraCol[i*3+1] = 0.08 + Math.random() * 0.15
      auraCol[i*3+2] = 0.3  + Math.random() * 0.35
    }
    const auraGeo = new THREE.BufferGeometry()
    auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPos, 3))
    auraGeo.setAttribute('color',    new THREE.BufferAttribute(auraCol, 3))
    const auraMat = new THREE.PointsMaterial({
      size: 3.8, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
      map: sprite, alphaTest: 0.001,
    })
    hAuraMatRef.current = auraMat
    hAuraGeoRef.current = auraGeo
    heartGroup.add(new THREE.Points(auraGeo, auraMat))

    /* ── fade-in stars ────────────────────────────────────── */
    let fadeOp = 0
    const fadeId = setInterval(() => {
      fadeOp = Math.min(fadeOp + 0.006, 1)
      if (bgMatRef.current)  bgMatRef.current.opacity  = fadeOp * 0.72
      if (glMatRef.current)  glMatRef.current.opacity  = fadeOp * 0.58
      nebulaMats.forEach((m, idx) => {
        const target = idx < 5 ? 0.065 : 0.045
        m.opacity = Math.min(m.opacity + 0.0008, target)
      })
      if (fadeOp >= 1) { clearInterval(fadeId); setStarsIn(true) }
    }, 16)

    /* ── render loop ──────────────────────────────────────── */
    const clock = new THREE.Clock()

    const loop = () => {
      animRef.current = requestAnimationFrame(loop)
      const elapsed = clock.getElapsedTime()

      // Camera parallax
      if (camera) {
        camera.position.x += (mouseRef.current.x * 22 - camera.position.x) * 0.022
        camera.position.y += (-mouseRef.current.y * 13 - camera.position.y) * 0.022
        camera.lookAt(0, 0, 0)
      }

      // Galaxy slow rotation
      if (galaxyRef.current && galaxyRef.current.parent) {
        const gp = galaxyRef.current.parent as THREE.Group
        gp.rotation.y = elapsed * 0.010
      }

      // Ripple rings
      const ripples = rippleArrRef.current
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.age += 0.016
        const s = rp.age * 90
        rp.mesh.scale.set(s, s, 1)
        rp.mat.opacity = Math.max(0, 0.65 * (1 - rp.age * 1.1))
        if (rp.age > 0.95) {
          scene.remove(rp.mesh)
          rp.geo.dispose()
          rp.mat.dispose()
          ripples.splice(i, 1)
        }
      }

      // Heart ambient shimmer
      if (heartGroup.visible && !explodingRef.current) {
        const shimmer = 0.05 * Math.sin(elapsed * 1.8)
        if (hSurfMatRef.current && hSurfMatRef.current.opacity > 0)
          hSurfMatRef.current.opacity = Math.min(0.92, Math.max(0, hSurfMatRef.current.opacity + shimmer * 0.008))
      }

      // Explosion
      if (explodingRef.current && explodeVelRef.current) {
        explodeTRef.current += 0.015
        const et  = explodeTRef.current
        const vel = explodeVelRef.current
        const pa  = hSurfGeoRef.current?.getAttribute('position') as THREE.BufferAttribute
        if (pa) {
          const arr = pa.array as Float32Array
          for (let i = 0; i < arr.length / 3; i++) {
            arr[i*3]   += vel[i*3]   * (et * 0.4)
            arr[i*3+1] += vel[i*3+1] * (et * 0.4)
            arr[i*3+2] += vel[i*3+2] * (et * 0.2)
          }
          pa.needsUpdate = true
        }
        const pa2 = hAuraGeoRef.current?.getAttribute('position') as THREE.BufferAttribute
        if (pa2) {
          const arr = pa2.array as Float32Array
          for (let i = 0; i < arr.length / 3; i++) {
            const vi = i % (vel.length / 3)
            arr[i*3]   += vel[vi*3]   * (et * 0.6)
            arr[i*3+1] += vel[vi*3+1] * (et * 0.6)
            arr[i*3+2] += vel[vi*3+2] * (et * 0.3)
          }
          pa2.needsUpdate = true
        }
        if (hSurfMatRef.current) hSurfMatRef.current.opacity = Math.max(0, hSurfMatRef.current.opacity - 0.014)
        if (hAuraMatRef.current) hAuraMatRef.current.opacity = Math.max(0, hAuraMatRef.current.opacity - 0.01)
        camera.position.z -= et * 10
        if (et > 1.6) {
          explodingRef.current = false
          onEnterRef.current()
        }
      }

      renderer.render(scene, camera)
    }
    loop()

    /* ── resize ───────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    /* ── mouse ────────────────────────────────────────────── */
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y:  (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('resize',    onResize)
    window.addEventListener('mousemove', onMouse)

    return () => {
      clearInterval(fadeId)
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize',    onResize)
      window.removeEventListener('mousemove', onMouse)
      if (beatIvRef.current) clearInterval(beatIvRef.current)
      renderer.dispose()
    }
  }, [])

  /* ══════════════════════════════════════════════════════════════
     TEXT SEQUENCE — fires once stars have faded in
  ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!starsIn) return

    const t1 = setTimeout(() => setTextPhase('t1'), 900)
    const t2 = setTimeout(() => setTextPhase('none'), 4200)
    const t3 = setTimeout(() => setTextPhase('t2'), 5100)
    const t4 = setTimeout(() => setTextPhase('none'), 9000)
    const t5 = setTimeout(() => {
      setTextPhase('heart')
      /* show heart */
      const grp  = heartGrpRef.current
      const smat = hSurfMatRef.current
      const amat = hAuraMatRef.current
      if (!grp || !smat || !amat) return
      grp.visible = true
      gsap.to(smat, { opacity: 0.88, duration: 1.8, ease: 'power2.inOut' })
      gsap.to(amat, { opacity: 0.38, duration: 2.2, ease: 'power2.inOut', delay: 0.3 })

      /* heartbeat */
      const beat = () => {
        if (!heartGrpRef.current) return
        const tl = gsap.timeline()
        tl.to(heartGrpRef.current.scale, { x:1.22, y:1.22, z:1.22, duration:0.11, ease:'power3.out' })
          .to(heartGrpRef.current.scale, { x:1.0,  y:1.0,  z:1.0,  duration:0.48, ease:'power2.inOut' })
          .to(heartGrpRef.current.scale, { x:1.07, y:1.07, z:1.07, duration:0.09, ease:'power3.out' })
          .to(heartGrpRef.current.scale, { x:1.0,  y:1.0,  z:1.0,  duration:0.42, ease:'power2.inOut' })

        /* ripple ring */
        const sc = sceneRef.current
        if (sc) {
          const rGeo  = new THREE.RingGeometry(0.5, 1.6, 72)
          const rMat  = new THREE.MeshBasicMaterial({ color: 0xFF4D88, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
          const rMesh = new THREE.Mesh(rGeo, rMat)
          rMesh.position.set(0, 20, 0)
          sc.add(rMesh)
          rippleArrRef.current.push({ mesh: rMesh, mat: rMat, geo: rGeo, age: 0 })
        }
      }
      beat()
      beatIvRef.current = setInterval(beat, 1820)
    }, 10000)

    return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout) }
  }, [starsIn])

  /* ══════════════════════════════════════════════════════════════
     CLICK — trigger explosion
  ══════════════════════════════════════════════════════════════ */
  const handleClick = () => {
    if (textPhase !== 'heart' || explodingRef.current) return
    setExploded(true)
    if (beatIvRef.current) { clearInterval(beatIvRef.current); beatIvRef.current = null }

    /* build velocity buffer */
    const SN = hSurfGeoRef.current?.getAttribute('position')?.count ?? 0
    const vel = new Float32Array(SN * 3)
    for (let i = 0; i < SN; i++) {
      const th  = Math.random() * Math.PI * 2
      const ph  = Math.random() * Math.PI
      const spd = 1.2 + Math.random() * 4.5
      vel[i*3]   = Math.sin(ph) * Math.cos(th) * spd
      vel[i*3+1] = Math.sin(ph) * Math.sin(th) * spd
      vel[i*3+2] = Math.cos(ph) * spd * 0.38
    }
    explodeVelRef.current    = vel
    explodeTRef.current      = 0
    explodingRef.current     = true
  }

  /* ══════════════════════════════════════════════════════════════
     JSX
  ══════════════════════════════════════════════════════════════ */
  return (
    <div
      style={{ position:'fixed', inset:0, background:'#000', cursor: textPhase === 'heart' ? 'crosshair' : 'default' }}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />

      {/* Vignette */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 48%, transparent 28%, rgba(0,0,0,.72) 100%)' }} />

      {/* Cinematic text overlay */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
        <AnimatePresence mode="wait">

          {textPhase === 't1' && (
            <motion.div
              key="t1"
              initial={{ opacity:0, y:28, letterSpacing:'0.55em' }}
              animate={{ opacity:1, y:0,  letterSpacing:'0.10em' }}
              exit={{ opacity:0, y:-22, filter:'blur(6px)' }}
              transition={{ duration:1.6, ease:[0.22,1,0.36,1] }}
              style={{ textAlign:'center', padding:'0 2rem' }}
            >
              <p style={{
                fontFamily:"'Playfair Display',Georgia,serif",
                fontSize:'clamp(1.6rem,3.8vw,2.9rem)',
                color:'#fff', lineHeight:1.35,
                textShadow:'0 0 70px rgba(255,77,136,.35), 0 0 140px rgba(255,77,136,.12)',
              }}>
                Bu evren senin için oluşturuldu.
              </p>
            </motion.div>
          )}

          {textPhase === 't2' && (
            <motion.div
              key="t2"
              initial={{ opacity:0, y:28, filter:'blur(8px)' }}
              animate={{ opacity:1, y:0,  filter:'blur(0px)' }}
              exit={{ opacity:0, y:-22, filter:'blur(6px)' }}
              transition={{ duration:1.5, ease:[0.22,1,0.36,1] }}
              style={{ textAlign:'center', padding:'0 2rem', maxWidth:660 }}
            >
              <p style={{
                fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:'clamp(1.05rem,2.3vw,1.65rem)',
                color:'rgba(255,194,209,.82)', lineHeight:1.75,
                fontStyle:'italic',
                textShadow:'0 0 50px rgba(255,77,136,.22)',
              }}>
                İçeride seni seven insanların bıraktığı izler var.
              </p>
            </motion.div>
          )}

          {textPhase === 'heart' && (
            <motion.div
              key="hint"
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:2.5, duration:2 }}
              style={{ position:'absolute', bottom:'18%', left:'50%', transform:'translateX(-50%)', textAlign:'center', pointerEvents:'none' }}
            >
              <motion.p
                animate={{ opacity:[0.12,0.38,0.12] }}
                transition={{ duration:2.8, repeat:Infinity, ease:'easeInOut' }}
                style={{ fontFamily:"'Inter',sans-serif", fontSize:'.6rem', letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,194,209,.5)' }}
              >
                Dokun
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* White flash on explosion */}
      <AnimatePresence>
        {exploded && (
          <motion.div
            key="flash"
            initial={{ opacity:0 }}
            animate={{ opacity:[0, 0.55, 0] }}
            transition={{ duration:1.2, times:[0, 0.18, 1] }}
            style={{ position:'absolute', inset:0, background:'#fff', pointerEvents:'none' }}
          />
        )}
      </AnimatePresence>

      {/* Bottom-left skip */}
      <AnimatePresence>
        {starsIn && textPhase !== 'heart' && !exploded && (
          <motion.button
            key="skip"
            initial={{ opacity:0 }}
            animate={{ opacity:0.18 }}
            exit={{ opacity:0 }}
            whileHover={{ opacity:0.55 }}
            transition={{ duration:1, delay:2 }}
            onClick={e => { e.stopPropagation(); onEnter() }}
            style={{ position:'absolute', bottom:'1.8rem', right:'2rem', background:'none', border:'none', cursor:'pointer', fontFamily:"'Inter',sans-serif", fontSize:'.55rem', letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(255,255,255,.6)' }}
          >
            Geç →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
