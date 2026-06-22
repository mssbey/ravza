'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"
const HW = "'Dancing Script', cursive"

const MESSAGES = [
  { text: 'Seni çok seviyoruz.', from: 'Hepimiz', color: '#E8C8FF' },
  { text: 'İyi ki karşıma çıktın, iyi ki dostum oldun, iyi ki her anımda yanımdaydın.', from: 'Seda', color: '#FFD700' },
  { text: 'Sen benim sadece arkadaşım değil, kız kardeşimsin. Aramızdaki bağın hiç değişmeyeceğini biliyorum.', from: 'İlayda', color: '#FF6B9D' },
  { text: 'Senin hayatına ufacık bile dokunabiliyorsam bu benim için çok kıymetli. Seni çok seviyorum.', from: 'Cemile', color: '#C4884A' },
  { text: 'Her zaman yanındayız.', from: 'Hepimiz', color: '#E8C8FF' },
]

interface Memory {
  emoji: string
  caption: string
  gradient: string
  image?: string
}

const MEMORIES: Memory[] = [
  { emoji:'🌸', caption:'Seda ile ilk fotoğraf',    gradient:'linear-gradient(135deg,#3a2800,#FFD700)', image:'/seda 2/ilk fotoğraf.jpeg' },
  { emoji:'🌸', caption:'Seda ile bir an',           gradient:'linear-gradient(135deg,#3a2800,#FFD700)', image:'/seda 2/WhatsApp Image 2026-06-21 at 18.36.14 (1).jpeg' },
  { emoji:'✨', caption:'İlayda ile birlikte',        gradient:'linear-gradient(135deg,#500820,#FF6B9D)', image:'/ilayda/WhatsApp Image 2026-06-21 at 15.49.55.jpeg' },
  { emoji:'✨', caption:'İlayda ile macera',          gradient:'linear-gradient(135deg,#500820,#FF6B9D)', image:'/ilayda/WhatsApp Image 2026-06-21 at 15.49.55 (1).jpeg' },
  { emoji:'🌙', caption:'Cemile ile',                gradient:'linear-gradient(135deg,#2a1005,#C4884A)', image:'/cemile/WhatsApp Image 2026-06-20 at 21.25.05.jpeg' },
  { emoji:'🌙', caption:'Cemile ile gece yarısı',    gradient:'linear-gradient(135deg,#2a1005,#C4884A)', image:'/cemile/WhatsApp Image 2026-06-20 at 21.25.06.jpeg' },
  { emoji:'👭', caption:'Hepimiz birlikte',           gradient:'linear-gradient(135deg,#250038,#E8C8FF)', image:'/ilayda/WhatsApp Image 2026-06-21 at 15.49.56 (2).jpeg' },
  { emoji:'☕', caption:'Kahveli sabahlar',            gradient:'linear-gradient(135deg,#1a0a00,#c08000)',  image:'/seda 2/WhatsApp Image 2026-06-21 at 18.36.14 (5).jpeg' },
]

const SECRET_NOTES = [
  'Bu mesajı bulacağını biliyordum. Seni çok seviyorum. — Seda',
  'Eğer bunu okuyorsan, bil ki en çok senin yanında kahkaha attım. — İlayda',
  'Bu gece seni düşündük. Ve bunun için buraya bir şey bıraktık. — Cemile',
  'Sen fark ettirdin bize gerçek dost olmayı.',
  'Seninle her şey daha anlamlı hale geliyor.',
  'İyi ki yollarımız kesişmiş.',
  'Bu not sadece senin için yazıldı.',
  'Seni düşündüğümüz her gece burada bir iz bıraktık.',
]

const EPISODES = [
  { emoji:'🌸', name:'Seda Anlatıyor', ep:'1', color:'#FFD700', rgb:'255,215,0', audioSrc:'/seda ses/seda ses1.ogg' },
  { emoji:'🌸', name:'Seda — O Gün Ne Hissettim', ep:'2', color:'#FFD700', rgb:'255,215,0', audioSrc:'/seda ses/seda ses 2.mp3' },
  { emoji:'✨', name:'İlayda Anlatıyor', ep:'3', color:'#FF6B9D', rgb:'255,107,157', audioSrc:'/ilayda ses/ses.mp4' },
  { emoji:'🌙', name:'Cemile Anlatıyor', ep:'4', color:'#C4884A', rgb:'196,136,74', audioSrc:'/ses1.mp4' },
]

/* ─────────────── Floating Memory ─────────────── */
function FloatingMemory({ m, i }: { m: Memory; i: number }) {
  const [open, setOpen] = useState(false)
  const rot = [-6, 4, -3, 8, -5, 3, -7, 5][i]
  return (
    <motion.div
      initial={{ opacity:0, scale:.7, rotate:rot }}
      animate={{ opacity:1, scale:1, rotate:rot, y:[0,-8,0] }}
      transition={{ opacity:{ delay:.06*i, duration:.5 }, scale:{ delay:.06*i, type:'spring', stiffness:180, damping:18 }, y:{ duration:3.5+i*.4, repeat:Infinity, ease:'easeInOut', delay:i*.3 } }}
      drag dragMomentum={false}
      onClick={()=>setOpen(true)}
      style={{ cursor:'pointer', width:'clamp(110px,16vw,150px)', flexShrink:0 }}
    >
      <div style={{ background:'#f5f0e8', borderRadius:'.3rem', padding:'.5rem .5rem .4rem', boxShadow:'0 4px 20px rgba(0,0,0,.55)' }}>
        <div style={{ height:'clamp(80px,12vw,105px)', borderRadius:'.15rem', background:m.gradient, marginBottom:'.4rem', overflow:'hidden', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem' }}>
          {m.image
            ? <img src={m.image} alt={m.caption} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            : m.emoji
          }
        </div>
        <p style={{ fontFamily:HW, fontSize:'.68rem', color:'#2a1a1a', textAlign:'center' }}>{m.caption}</p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.85)', backdropFilter:'blur(20px)' }}
            onClick={e=>{ e.stopPropagation(); setOpen(false) }}>
            <motion.div initial={{ scale:.7, rotate:rot }} animate={{ scale:1, rotate:0 }} exit={{ scale:.7 }} transition={{ type:'spring', stiffness:200, damping:20 }}
              onClick={e=>e.stopPropagation()}
              style={{ background:'#f5f0e8', borderRadius:'.5rem', padding:'1.2rem', maxWidth:'min(88vw,380px)', boxShadow:'0 0 60px rgba(232,200,255,.2)' }}>
              <div style={{ height:240, background:m.gradient, borderRadius:'.25rem', marginBottom:'.8rem', overflow:'hidden', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem' }}>
                {m.image
                  ? <img src={m.image} alt={m.caption} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  : m.emoji
                }
              </div>
              <p style={{ fontFamily:HW, fontSize:'1.1rem', color:'#2a1a1a', textAlign:'center' }}>{m.caption}</p>
            </motion.div>
            <button onClick={()=>setOpen(false)} style={{ position:'fixed', top:'1.5rem', right:'1.5rem', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'50%', width:40, height:40, color:'rgba(255,255,255,.6)', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────── Secret Note ─────────────── */
function SecretNote({ note, i }: { note: string; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity:0, scale:.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
      transition={{ delay:i*.08, type:'spring', stiffness:180, damping:18 }}
      onClick={()=>setOpen(v=>!v)}
      style={{ cursor:'pointer', padding:'.9rem 1.2rem', background:'rgba(232,200,255,.05)', border:'1px solid rgba(232,200,255,.12)', borderRadius:'1rem', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', gap:'.8rem' }}
    >
      <motion.div animate={{ rotate:[0,360] }} transition={{ duration:8, repeat:Infinity, ease:'linear' }} style={{ flexShrink:0, fontSize:'1.1rem' }}>✦</motion.div>
      <p style={{ fontFamily:CO, fontSize:'.85rem', fontStyle:'italic', color:'rgba(255,255,255,.35)' }}>
        {open ? note : '• • • • • •'}
      </p>
    </motion.div>
  )
}

/* ─────────────── Episode Player ─────────────── */
function EpisodePlayer({ ep, i }: { ep: typeof EPISODES[0]; i: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const bars = Array.from({ length: 24 }, (_, j) => 4 + Math.sin(j * .8) * 8)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ delay:i*.1, duration:.5 }}
      whileHover={{ x:4, background:`rgba(${ep.rgb},.1)` }}
      onClick={toggle}
      style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem', borderRadius:'1rem', border:`1px solid rgba(${ep.rgb},.15)`, background:`rgba(${ep.rgb},.05)`, marginBottom:'.75rem', cursor:'pointer', transition:'background .2s, transform .2s' }}
    >
      <audio ref={audioRef} src={ep.audioSrc} preload="none" onEnded={() => setPlaying(false)} />

      <motion.div
        animate={{ scale:playing?[1,1.1,1]:1, background:playing?`rgba(${ep.rgb},.8)`:`radial-gradient(circle at 35% 30%, rgba(${ep.rgb},.6), rgba(${ep.rgb},.2))` }}
        transition={{ duration:.6, repeat:playing?Infinity:0 }}
        style={{ width:54, height:54, borderRadius:'.75rem', border:`1px solid rgba(${ep.rgb},.3)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}
      >
        {playing ? '⏸' : ep.emoji}
      </motion.div>

      <div style={{ flex:1 }}>
        <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.12em', color:`rgba(${ep.rgb},.55)`, marginBottom:'.2rem', textTransform:'uppercase' }}>Bölüm {ep.ep}</p>
        <p style={{ fontFamily:PF, fontSize:'.95rem', color:'#fff', marginBottom:'.15rem' }}>{ep.name}</p>
        <div style={{ display:'flex', gap:'.3rem', alignItems:'center' }}>
          {bars.map((h, j) => (
            <motion.div key={j}
              animate={playing ? { scaleY:[1, .3+Math.random()*.7, 1], opacity:[.5, 1, .5] } : { scaleY:1 }}
              transition={{ duration:.35+Math.random()*.3, repeat:playing?Infinity:0, delay:j*.02 }}
              style={{ width:3, height:h, borderRadius:2, background:`rgba(${ep.rgb},.5)`, transformOrigin:'center' }}
            />
          ))}
        </div>
      </div>

      <p style={{ fontFamily:IN, fontSize:'.7rem', color:`rgba(${ep.rgb},.5)`, flexShrink:0 }}>
        {playing ? '▶ Çalıyor' : '▶'}
      </p>
    </motion.div>
  )
}

/* ─────────────── Main ─────────────── */
export default function TogetherSection({ onBack, onClimax }: { onBack: () => void; onClimax: () => void }) {
  const [msgIdx, setMsgIdx] = useState(0)

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:.8 }}
      style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse at 50% 0%, rgba(30,10,55,.98) 0%, #000 65%)', overflow:'hidden' }}
    >
      {/* Stars bg */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(255,255,255,.28) 1px, transparent 1px)', backgroundSize:'88px 88px', opacity:.22, pointerEvents:'none' }} />

      <motion.button initial={{ opacity:0 }} animate={{ opacity:.28 }} whileHover={{ opacity:.8 }} onClick={onBack}
        style={{ position:'absolute', top:'1.4rem', left:'1.4rem', background:'none', border:'none', cursor:'pointer', fontFamily:IN, fontSize:'.65rem', letterSpacing:'.22em', textTransform:'uppercase', color:'#fff', zIndex:20 }}>
        ← Geri
      </motion.button>

      <div style={{ position:'absolute', inset:0, overflowY:'auto', scrollbarWidth:'thin', scrollbarColor:'rgba(232,200,255,.3) transparent' }}>

        {/* HERO */}
        <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'2rem', position:'relative' }}>
          <motion.div initial={{ opacity:0, scale:.75 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.2, type:'spring', stiffness:140, damping:16 }}>
            <motion.div
              animate={{ scale:[1,1.08,1], filter:['drop-shadow(0 0 40px rgba(232,200,255,.8))','drop-shadow(0 0 70px rgba(232,200,255,.95))','drop-shadow(0 0 40px rgba(232,200,255,.8))'] }}
              transition={{ duration:3, repeat:Infinity }}
              style={{ fontSize:'clamp(4rem,10vw,7rem)', marginBottom:'1.5rem', display:'block' }}
            >
              ⭐
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }} style={{ marginBottom:'2rem' }}>
            <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.4em', textTransform:'uppercase', color:'rgba(232,200,255,.45)', marginBottom:'.8rem' }}>Birlikte</p>
            <h1 style={{ fontFamily:PF, fontSize:'clamp(3rem,8vw,5.5rem)', color:'#fff', marginBottom:'.6rem', textShadow:'0 0 60px rgba(232,200,255,.4)' }}>Hepimiz</h1>
            <p style={{ fontFamily:CO, fontSize:'clamp(.9rem,2vw,1.15rem)', fontStyle:'italic', color:'rgba(232,200,255,.45)' }}>
              Seda, İlayda ve Cemile — bir arada
            </p>
          </motion.div>

          {/* Messages carousel */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.8 }}
            style={{ maxWidth:480, width:'100%', minHeight:100, display:'flex', alignItems:'center', justifyContent:'center' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={msgIdx}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
                transition={{ duration:.6 }}
                style={{ textAlign:'center', padding:'.8rem 1.6rem', background:'rgba(232,200,255,.05)', border:'1px solid rgba(232,200,255,.12)', borderRadius:'1rem', backdropFilter:'blur(8px)' }}
              >
                <p style={{ fontFamily:PF, fontSize:'clamp(.9rem,2.4vw,1.3rem)', color:'#fff', marginBottom:'.3rem', lineHeight:1.5 }}>
                  "{MESSAGES[msgIdx].text}"
                </p>
                <p style={{ fontFamily:CO, fontSize:'.75rem', fontStyle:'italic', color:MESSAGES[msgIdx].color }}>
                  — {MESSAGES[msgIdx].from}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div style={{ display:'flex', gap:'.6rem', marginTop:'1.2rem' }}>
            {MESSAGES.map((_,i)=>(
              <motion.button key={i} onClick={()=>setMsgIdx(i)}
                style={{ width:i===msgIdx?20:6, height:6, borderRadius:3, background:i===msgIdx?'#E8C8FF':'rgba(255,255,255,.2)', border:'none', cursor:'pointer', padding:0, transition:'all .3s' }}
              />
            ))}
          </div>
        </section>

        {/* FLOATING MEMORIES */}
        <section style={{ padding:'3rem clamp(1rem,5vw,3rem) 4rem' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ width:50, height:1, background:'linear-gradient(90deg,transparent,#E8C8FF,transparent)', margin:'0 auto 1rem' }} />
            <p style={{ fontFamily:CO, fontSize:'.88rem', fontStyle:'italic', color:'rgba(232,200,255,.35)' }}>Birlikte yaşanan her an</p>
          </motion.div>
          <div style={{ display:'flex', gap:'clamp(.8rem,2vw,1.4rem)', overflowX:'auto', paddingBottom:'1rem', scrollbarWidth:'none', justifyContent:'center', flexWrap:'wrap' }}>
            {MEMORIES.map((m,i)=><FloatingMemory key={i} m={m} i={i} />)}
          </div>
        </section>

        {/* SES KAYITLARI */}
        <section style={{ maxWidth:640, margin:'0 auto', padding:'2rem clamp(1rem,5vw,2.5rem) 4rem' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'1.8rem' }}>
            <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.25em', textTransform:'uppercase', color:'rgba(232,200,255,.4)', marginBottom:'.5rem' }}>Ses Kayıtları</p>
            <div style={{ width:30, height:1, background:'#E8C8FF', opacity:.4 }} />
            <p style={{ fontFamily:CO, fontSize:'.82rem', fontStyle:'italic', color:'rgba(255,255,255,.2)', marginTop:'.5rem' }}>
              Tıkla ve dinle
            </p>
          </motion.div>
          {EPISODES.map((ep, i) => <EpisodePlayer key={i} ep={ep} i={i} />)}
        </section>

        {/* SECRET NOTES */}
        <section style={{ maxWidth:640, margin:'0 auto', padding:'2rem clamp(1rem,5vw,2.5rem) 4rem' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'1.5rem' }}>
            <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.25em', textTransform:'uppercase', color:'rgba(232,200,255,.4)', marginBottom:'.5rem' }}>Gizli Notlar</p>
            <div style={{ width:30, height:1, background:'#E8C8FF', opacity:.4 }} />
            <p style={{ fontFamily:CO, fontSize:'.8rem', fontStyle:'italic', color:'rgba(255,255,255,.2)', marginTop:'.5rem' }}>Notlara tıkla ve aç</p>
          </motion.div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {SECRET_NOTES.map((n,i)=><SecretNote key={i} note={n} i={i} />)}
          </div>
        </section>

        {/* CTA TO CLIMAX */}
        <section style={{ textAlign:'center', padding:'3rem 2rem 6rem' }}>
          <div style={{ width:60, height:1, background:'linear-gradient(90deg,transparent,#E8C8FF,transparent)', margin:'0 auto 2.5rem' }} />
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p style={{ fontFamily:CO, fontSize:'clamp(.9rem,2vw,1.1rem)', fontStyle:'italic', color:'rgba(255,255,255,.3)', marginBottom:'2rem' }}>
              Hikayenin finali seni bekliyor…
            </p>
            <motion.button
              whileHover={{ scale:1.06, boxShadow:'0 0 60px rgba(232,200,255,.4), 0 0 120px rgba(232,200,255,.15)' }}
              whileTap={{ scale:.97 }}
              onClick={onClimax}
              style={{ background:'transparent', border:'1px solid rgba(232,200,255,.45)', borderRadius:'3rem', padding:'1rem 3.2rem', color:'#fff', fontFamily:IN, fontSize:'.78rem', letterSpacing:'.3em', textTransform:'uppercase', cursor:'pointer', boxShadow:'0 0 30px rgba(232,200,255,.15)', backdropFilter:'blur(4px)', position:'relative' }}
            >
              Son Sahne
              {[1,2].map(i=>(
                <motion.div key={i} animate={{ scale:[1,2.2], opacity:[.4,0] }} transition={{ duration:2.2, delay:i*.7, repeat:Infinity, ease:'easeOut' }}
                  style={{ position:'absolute', inset:0, borderRadius:'3rem', border:'1px solid rgba(232,200,255,.25)', pointerEvents:'none' }} />
              ))}
            </motion.button>
          </motion.div>
        </section>
      </div>

      <div style={{ position:'absolute', top:0, left:0, right:0, height:70, background:'linear-gradient(to bottom,#000,transparent)', pointerEvents:'none', zIndex:5 }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:70, background:'linear-gradient(to top,#000,transparent)', pointerEvents:'none', zIndex:5 }} />
    </motion.div>
  )
}
