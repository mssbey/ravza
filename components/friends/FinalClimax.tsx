'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const IN = "'Inter',sans-serif"

/* ── Canvas & photo size ─────────────────────────────────────── */
const CW = 720, CH = 640
const PSIZE = 40, GSTEP = 42

/* ── Photo pools ─────────────────────────────────────────────── */
const SEDA_P = Array.from({length:99},(_,i)=>i+1)
  .filter(n=>![18,19,29,36,66].includes(n))
  .map(n=>({src:`/photos/friends/seda/${n}.jpg`, color:'#FFD700', rgb:'255,215,0'}))

const CEMILE_P = [
  '05','05 (1)','06','06 (1)','06 (2)','07','07 (1)','08','09','09 (1)',
  '10','10 (1)','10 (2)','11','11 (1)','11 (2)','12','13','14','15',
  '16','16 (1)','17','17 (1)','17 (2)','17 (3)','17 (4)','18','18 (1)','18 (2)',
  '20','20 (1)','22','22 (1)','23','24','25','26','27','27 (1)',
  '27 (2)','28','28 (1)','29','29 (1)','30','30 (1)','30 (2)','30 (3)',
  '31','31 (1)','31 (2)','31 (3)','31 (4)','32',
].map(t=>({src:`/cemile/WhatsApp Image 2026-06-20 at 21.25.${t}.jpeg`, color:'#C4884A', rgb:'196,136,74'}))

const ILAYDA_P = [
  ...['55','55 (1)','55 (2)','55 (3)','55 (4)',
      '56','56 (1)','56 (2)','56 (3)','56 (4)','56 (5)',
      '57','57 (1)','57 (2)','57 (3)','57 (4)','57 (5)',
      '58','58 (1)','58 (2)','58 (3)','58 (4)','58 (5)',
      '59','59 (1)','59 (2)','59 (3)','59 (4)','59 (5)','59 (6)']
    .map(t=>({src:`/ilayda/WhatsApp Image 2026-06-21 at 15.49.${t}.jpeg`, color:'#FF6B9D', rgb:'255,107,157'})),
  ...['00','00 (1)','00 (2)','00 (3)','00 (4)','00 (5)',
      '01','01 (1)','01 (2)','01 (3)','01 (4)','01 (5)',
      '02','02 (1)','02 (2)','02 (3)','02 (4)','02 (5)',
      '03','03 (1)','03 (2)','03 (3)','03 (4)','03 (5)','03 (6)','03 (7)',
      '04','04 (1)','04 (2)','04 (3)','04 (4)','04 (5)',
      '05','05 (1)','05 (2)','05 (3)','05 (4)','05 (5)',
      '06','06 (1)','06 (2)','06 (3)','06 (4)','06 (5)',
      '07','07 (1)','07 (2)','07 (3)','07 (4)','07 (5)','07 (6)',
      '08','08 (1)','08 (2)','08 (3)','08 (4)','08 (5)','08 (6)',
      '09','09 (1)','09 (2)','09 (3)','09 (4)','09 (5)',
      '10','10 (1)','10 (2)','10 (3)']
    .map(t=>({src:`/ilayda/WhatsApp Image 2026-06-21 at 15.50.${t}.jpeg`, color:'#FF6B9D', rgb:'255,107,157'})),
]

const ALL_PHOTOS = (()=>{
  const r: {src:string;color:string;rgb:string}[]=[]
  const m=Math.max(SEDA_P.length,ILAYDA_P.length,CEMILE_P.length)
  for(let i=0;i<m;i++){
    if(i<SEDA_P.length)   r.push(SEDA_P[i])
    if(i<ILAYDA_P.length) r.push(ILAYDA_P[i])
    if(i<CEMILE_P.length) r.push(CEMILE_P[i])
  }
  return r
})()

/* ── Heart geometry ──────────────────────────────────────────── */
const HEART_POLY = Array.from({length:900},(_,i)=>{
  const t=(i/900)*Math.PI*2
  return {x:16*Math.pow(Math.sin(t),3), y:-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))}
})

function inHeart(px:number,py:number):boolean{
  let inside=false
  for(let i=0,j=HEART_POLY.length-1;i<HEART_POLY.length;j=i++){
    const{x:xi,y:yi}=HEART_POLY[i],{x:xj,y:yj}=HEART_POLY[j]
    if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi)) inside=!inside
  }
  return inside
}

const HX_MIN=-16.2,HX_MAX=16.2,HY_MIN=-17.6,HY_MAX=13.1
const SC=Math.min((CW-PSIZE*2)/(HX_MAX-HX_MIN),(CH-PSIZE*2)/(HY_MAX-HY_MIN))
const HCX=(HX_MIN+HX_MAX)/2,HCY=(HY_MIN+HY_MAX)/2

/* Build grid of heart positions */
const HEART_CELLS=(()=>{
  const cols=Math.floor((CW-PSIZE*2)/GSTEP)
  const rows=Math.floor((CH-PSIZE*2)/GSTEP)
  const sx=PSIZE+((CW-PSIZE*2)-cols*GSTEP)/2
  const sy=PSIZE+((CH-PSIZE*2)-rows*GSTEP)/2
  const cells:{x:number;y:number;photo:{src:string;color:string;rgb:string}}[]=[]
  let pi=0
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const cx=sx+c*GSTEP+GSTEP/2,cy=sy+r*GSTEP+GSTEP/2
      const hx=(cx-CW/2)/SC+HCX, hy=-(cy-CH/2)/SC+HCY
      if(inHeart(hx,hy)){
        cells.push({x:cx-PSIZE/2,y:cy-PSIZE/2,photo:ALL_PHOTOS[pi%ALL_PHOTOS.length]})
        pi++
      }
    }
  }
  return cells
})()

/* ── Component ───────────────────────────────────────────────── */
export default function FinalClimax({onBack}:{onBack:()=>void}){
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const [textShow, setTextShow] = useState(false)
  const [vw, setVw] = useState(800)
  const [vh, setVh] = useState(700)

  useEffect(()=>{
    const upd=()=>{setVw(window.innerWidth);setVh(window.innerHeight)}
    upd()
    window.addEventListener('resize',upd)
    return ()=>window.removeEventListener('resize',upd)
  },[])

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return
    const ctx=canvas.getContext('2d')!
    const dpr=Math.min(window.devicePixelRatio||1,2)
    canvas.width =CW*dpr
    canvas.height=CH*dpr
    ctx.scale(dpr,dpr)

    /* revealed flags — Uint8 array is very lightweight */
    const revealed=new Uint8Array(HEART_CELLS.length)

    /* Draw one cell to canvas */
    function drawCell(i:number, img?:HTMLImageElement){
      const cell=HEART_CELLS[i]
      const cx=cell.x+PSIZE/2, cy=cell.y+PSIZE/2, r=PSIZE/2-1.5
      ctx.save()
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip()
      if(img&&img.complete&&img.naturalWidth>0){
        ctx.drawImage(img,cell.x+1.5,cell.y+1.5,PSIZE-3,PSIZE-3)
      } else {
        ctx.fillStyle=cell.photo.color+'33'; ctx.fill()
      }
      ctx.restore()
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
      ctx.strokeStyle=cell.photo.color+'88'; ctx.lineWidth=1.5; ctx.stroke()
    }

    /* Pre-load images; onload redraws the cell with actual photo */
    const imgs=HEART_CELLS.map((cell,i)=>{
      const img=new Image()
      img.src=cell.photo.src
      img.onload=()=>{ if(revealed[i]) drawCell(i,img) }
      return img
    })

    /* Progressive reveal via rAF */
    let idx=0, last=0
    const MS=14   // ms between each photo reveal
    let alive=true

    const tick=(t:number)=>{
      if(!alive) return
      if(idx<HEART_CELLS.length){
        if(t-last>=MS){ drawCell(idx,imgs[idx]); revealed[idx]=1; idx++; last=t }
        animRef.current=requestAnimationFrame(tick)
      } else {
        setTimeout(()=>setTextShow(true),700)
      }
    }
    animRef.current=requestAnimationFrame(tick)
    return ()=>{ alive=false; cancelAnimationFrame(animRef.current) }
  },[])

  const scale=Math.min(1,Math.min(vw-20,vh-160)/Math.max(CW,CH))

  /* Deterministic stars — no Math.random() in render */
  const stars=useMemo(()=>Array.from({length:55},(_,i)=>({
    l:((i*137.5)%100).toFixed(1),
    t:((i*97.3) %100).toFixed(1),
    s:1+(i%3)*.5,
    o:(.1+(i%5)*.04).toFixed(2),
  })),[])

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      transition={{duration:1}}
      style={{position:'fixed',inset:0,background:'#050505',overflow:'hidden',
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}
    >
      {/* Stars — static divs, no animation = zero runtime cost */}
      {stars.map((s,i)=>(
        <div key={i} style={{position:'absolute',left:`${s.l}%`,top:`${s.t}%`,
          width:s.s,height:s.s,borderRadius:'50%',background:'#fff',opacity:Number(s.o),pointerEvents:'none'}}/>
      ))}

      {/* Back */}
      <motion.button initial={{opacity:0}} animate={{opacity:.22}} whileHover={{opacity:.7}} onClick={onBack}
        style={{position:'absolute',top:'1.4rem',left:'1.4rem',background:'none',border:'none',
                cursor:'pointer',fontFamily:IN,fontSize:'.65rem',letterSpacing:'.22em',
                textTransform:'uppercase',color:'#fff',zIndex:20}}>
        ← Geri
      </motion.button>

      {/* Single canvas — GPU composited, zero DOM overhead */}
      <canvas
        ref={canvasRef}
        style={{
          width:  CW*scale,
          height: CH*scale,
          display:'block',
          flexShrink:0,
          imageRendering:'auto',
        }}
      />

      {/* Text after reveal */}
      <AnimatePresence>
        {textShow&&(
          <motion.div
            initial={{opacity:0,y:22}} animate={{opacity:1,y:0}}
            transition={{duration:1,ease:[.25,.1,.25,1]}}
            style={{textAlign:'center',padding:'1rem 2rem 0',zIndex:10}}
          >
            <motion.p
              animate={{textShadow:[
                '0 0 28px rgba(255,140,180,.4)',
                '0 0 56px rgba(255,140,180,.7)',
                '0 0 28px rgba(255,140,180,.4)',
              ]}}
              transition={{duration:3,repeat:Infinity}}
              style={{fontFamily:PF,fontSize:'clamp(1.2rem,3.5vw,1.9rem)',color:'#fff',
                      letterSpacing:'.1em',marginBottom:'.6rem'}}
            >
              Sonsuza Kadar Arkadaşız
            </motion.p>
            <div style={{display:'flex',justifyContent:'center',gap:'.5rem'}}>
              {['🌸','✨','🌙'].map((e,i)=>(
                <motion.span key={i}
                  animate={{y:[0,-7,0]}}
                  transition={{duration:2.2,delay:i*.3,repeat:Infinity,ease:'easeInOut'}}
                  style={{fontSize:'clamp(1.3rem,3vw,1.7rem)',
                          filter:'drop-shadow(0 0 10px rgba(255,200,230,.5))'}}>
                  {e}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{position:'absolute',inset:0,
        background:'radial-gradient(ellipse 65% 55% at 50% 48%,rgba(255,100,150,.03) 0%,transparent 70%)',
        pointerEvents:'none'}}/>
    </motion.div>
  )
}
