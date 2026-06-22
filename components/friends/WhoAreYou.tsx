'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

interface Word { text: string; from: string; color: string; x: string; y: string; delay: number; size: string }

const WORDS: Word[] = [
  { text:'GÜVEN',      from:'Seda',   color:'#FFD700', x:'15%',  y:'22%', delay:.4,  size:'clamp(1.2rem,2.8vw,1.8rem)' },
  { text:'KAHKAHA',    from:'İlayda', color:'#FF6B9D', x:'68%',  y:'15%', delay:.7,  size:'clamp(1.2rem,2.8vw,1.8rem)' },
  { text:'CESARET',    from:'Cemile', color:'#C4884A', x:'78%',  y:'62%', delay:1.0, size:'clamp(1.2rem,2.8vw,1.8rem)' },
  { text:'IŞIK',       from:'Seda',   color:'#FFD700', x:'8%',   y:'68%', delay:1.3, size:'clamp(.9rem,2vw,1.3rem)' },
  { text:'MACERA',     from:'İlayda', color:'#FF6B9D', x:'52%',  y:'82%', delay:1.6, size:'clamp(.9rem,2vw,1.3rem)' },
  { text:'DERINLIK',   from:'Cemile', color:'#C4884A', x:'20%',  y:'78%', delay:1.9, size:'clamp(.9rem,2vw,1.3rem)' },
  { text:'SEVGI',      from:'Hepimiz',color:'#E8C8FF', x:'82%',  y:'30%', delay:2.2, size:'clamp(1rem,2.4vw,1.5rem)' },
  { text:'ÖZGÜRLÜK',   from:'İlayda', color:'#FF6B9D', x:'38%',  y:'10%', delay:2.5, size:'clamp(.85rem,1.8vw,1.15rem)' },
  { text:'DINGINLIK',  from:'Cemile', color:'#C4884A', x:'6%',   y:'40%', delay:2.8, size:'clamp(.85rem,1.8vw,1.15rem)' },
  { text:'SICAKLIK',   from:'Seda',   color:'#FFD700', x:'62%',  y:'40%', delay:3.1, size:'clamp(.85rem,1.8vw,1.15rem)' },
  { text:'HAYAT',      from:'Hepimiz',color:'#E8C8FF', x:'30%',  y:'46%', delay:3.4, size:'clamp(1rem,2.4vw,1.5rem)' },
  { text:'NEŞE',       from:'İlayda', color:'#FF6B9D', x:'84%',  y:'80%', delay:3.7, size:'clamp(.85rem,1.8vw,1.15rem)' },
]

type Stage = 'question' | 'words' | 'gather' | 'reveal'

export default function WhoAreYou({ onBack, onTogether }: { onBack: () => void; onTogether: () => void }) {
  const [stage,   setStage]   = useState<Stage>('question')
  const [visible, setVisible] = useState<number>(0)
  const [gathered,setGathered]= useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setStage('words'), 2200)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (stage !== 'words') return
    let idx = 0
    const iv = setInterval(() => {
      idx++
      setVisible(idx)
      if (idx >= WORDS.length) {
        clearInterval(iv)
        setTimeout(() => setStage('gather'), 1800)
      }
    }, 320)
    return () => clearInterval(iv)
  }, [stage])

  useEffect(() => {
    if (stage !== 'gather') return
    setGathered(true)
    const t = setTimeout(() => setStage('reveal'), 2000)
    return () => clearTimeout(t)
  }, [stage])

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:.8 }}
      style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 50% 30%, rgba(20,10,40,.98) 0%, #000 70%)', overflow:'hidden' }}
    >
      {/* Back */}
      <motion.button initial={{ opacity:0 }} animate={{ opacity:.28 }} whileHover={{ opacity:.8 }} onClick={onBack}
        style={{ position:'absolute', top:'1.4rem', left:'1.4rem', background:'none', border:'none', cursor:'pointer', fontFamily:IN, fontSize:'.65rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#fff', zIndex:20 }}>
        ← Geri
      </motion.button>

      {/* The question */}
      <AnimatePresence>
        {stage === 'question' && (
          <motion.div
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-30, scale:.92 }}
            transition={{ duration:.9 }}
            style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', zIndex:10 }}
          >
            <motion.p animate={{ opacity:[.4,.85,.4] }} transition={{ duration:2.5, repeat:Infinity }}
              style={{ fontFamily:IN, fontSize:'.62rem', letterSpacing:'.4em', textTransform:'uppercase', color:'rgba(232,200,255,.4)', marginBottom:'1.5rem' }}>
              Onların gözünden
            </motion.p>
            <h1 style={{ fontFamily:PF, fontSize:'clamp(3rem,10vw,7rem)', color:'#fff', lineHeight:1, textShadow:'0 0 60px rgba(232,200,255,.35)' }}>
              Sen Kimsin?
            </h1>
            <motion.div animate={{ opacity:[0,.5,0] }} transition={{ duration:1.5, delay:1, repeat:Infinity }}>
              <p style={{ fontFamily:CO, fontSize:'clamp(.9rem,2vw,1.1rem)', fontStyle:'italic', color:'rgba(255,255,255,.25)', marginTop:'2rem' }}>
                Kelimeleri izle…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating words */}
      <AnimatePresence>
        {(stage === 'words' || stage === 'gather') && WORDS.slice(0, visible).map((word, i) => (
          <motion.div
            key={word.text}
            initial={{ opacity:0, scale:0.4, x: word.x, y: word.y }}
            animate={gathered
              ? { opacity:0, x:'50%', y:'50%', scale:.5, transition:{ duration:.9, delay:i*.04, ease:[.4,0,.2,1] } }
              : { opacity:1, scale:1, x: word.x, y: word.y, transition:{ delay:i*.08, type:'spring', stiffness:160, damping:18 } }
            }
            style={{ position:'absolute', left:0, top:0, transform:'translate(-50%,-50%)', zIndex:8, cursor:'default', pointerEvents:'none' }}
          >
            <div style={{ padding:'.4rem .9rem', borderRadius:'3rem', border:`1px solid rgba(${word.color.replace('#','').match(/.{2}/g)!.map(h=>parseInt(h,16)).join(',')},0.35)`, background:`rgba(${word.color.replace('#','').match(/.{2}/g)!.map(h=>parseInt(h,16)).join(',')},0.08)`, backdropFilter:'blur(4px)' }}>
              <p style={{ fontFamily:PF, fontSize:word.size, color:word.color, letterSpacing:'.05em', whiteSpace:'nowrap', textShadow:`0 0 20px ${word.color}88` }}>
                {word.text}
              </p>
              <p style={{ fontFamily:IN, fontSize:'.5rem', color:'rgba(255,255,255,.22)', textAlign:'center', letterSpacing:'.12em', marginTop:'.15rem' }}>
                {word.from}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* BIG REVEAL */}
      <AnimatePresence>
        {stage === 'reveal' && (
          <motion.div
            initial={{ opacity:0, scale:.4 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
            transition={{ duration:1.2, ease:[.25,.1,.25,1] }}
            style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', zIndex:15, padding:'2rem' }}
          >
            {/* Explosion rings */}
            {[1,2,3,4].map(i=>(
              <motion.div key={i}
                initial={{ scale:.2, opacity:.8 }} animate={{ scale:i*2.5, opacity:0 }}
                transition={{ duration:1.4, delay:i*.12, ease:'easeOut' }}
                style={{ position:'absolute', width:120, height:120, borderRadius:'50%', border:'2px solid rgba(232,200,255,.4)', pointerEvents:'none' }}
              />
            ))}

            <motion.div
              initial={{ opacity:0, scale:.5, rotate:-15 }}
              animate={{ opacity:1, scale:1, rotate:0 }}
              transition={{ delay:.3, duration:1, type:'spring', stiffness:140, damping:14 }}
            >
              <span style={{ fontSize:'clamp(3rem,8vw,5.5rem)', filter:'drop-shadow(0 0 40px rgba(255,77,136,.8))' }}>❤️</span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:30, scale:.8 }} animate={{ opacity:1, y:0, scale:1 }}
              transition={{ delay:.6, duration:1, ease:[.25,.1,.25,1] }}
              style={{ fontFamily:PF, fontSize:'clamp(4rem,15vw,10rem)', color:'#fff', letterSpacing:'.12em', marginBottom:'.3rem', textShadow:'0 0 80px rgba(255,77,136,.5), 0 0 160px rgba(232,200,255,.25)' }}
            >
              SEN
            </motion.h1>

            <motion.p
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
              style={{ fontFamily:CO, fontSize:'clamp(.9rem,2vw,1.15rem)', fontStyle:'italic', color:'rgba(255,255,255,.4)', marginBottom:'2.5rem' }}
            >
              Seda, İlayda ve Cemile'nin gözünden sen:
            </motion.p>

            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
              style={{ display:'flex', gap:'.6rem', flexWrap:'wrap', justifyContent:'center', maxWidth:500, marginBottom:'3rem' }}
            >
              {WORDS.map(w=>(
                <motion.span key={w.text}
                  initial={{ opacity:0, scale:.6 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay:1.6+WORDS.indexOf(w)*.05, type:'spring', stiffness:200, damping:16 }}
                  style={{ fontFamily:PF, fontSize:'clamp(.8rem,1.6vw,1rem)', color:w.color, padding:'.3rem .8rem', border:`1px solid rgba(255,255,255,.1)`, borderRadius:'2rem', letterSpacing:'.04em' }}>
                  {w.text}
                </motion.span>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:2.2 }}
              whileHover={{ scale:1.06, boxShadow:'0 0 50px rgba(232,200,255,.35)' }}
              whileTap={{ scale:.97 }}
              onClick={onTogether}
              style={{ background:'rgba(232,200,255,.08)', border:'1px solid rgba(232,200,255,.3)', borderRadius:'3rem', padding:'.9rem 2.8rem', color:'#fff', fontFamily:IN, fontSize:'.75rem', letterSpacing:'.25em', textTransform:'uppercase', cursor:'pointer', backdropFilter:'blur(8px)' }}
            >
              Hepimiz Birlikte →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
