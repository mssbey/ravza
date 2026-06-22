'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

interface FPhoto {
  id: number
  file: string
  date: string
  caption: string
  gradient: string
  size: 'lg' | 'md' | 'sm'
}

interface Friend {
  id: string
  name: string
  emoji: string
  title: string
  message: string
  color: string
  colorDim: string
  photos: FPhoto[]
}

const FRIENDS: Friend[] = [
  {
    id: 'zeynep',
    name: 'Zeynep',
    emoji: '🌸',
    title: 'En Eski Dost',
    color: '#FF4D88',
    colorDim: 'rgba(255,77,136,.15)',
    message: `Seni tanıdığım günden beri hayatım daha renkli. Güldüğünde bütün oda aydınlanıyor, ağladığında ben de seninle ağlıyorum. Sen sadece bir arkadaş değilsin; sen bir yuvasın. Seninle geçirdiğimiz her anın şükranını duyuyorum. Seni çok seviyorum, her zaman yanındayım. 💕`,
    photos: [
      { id: 1, file: '/photos/friends/zeynep/1.jpg', date: 'Haziran 2021', caption: 'İlk kez beraber çıktığımız gece',   gradient: 'linear-gradient(135deg,#1a0010 0%,#4d0030 55%,#ff4d88 100%)', size: 'lg' },
      { id: 2, file: '/photos/friends/zeynep/2.jpg', date: 'Ağustos 2021', caption: 'Yazın en güzel günü',               gradient: 'linear-gradient(135deg,#1a0510 0%,#4d1535 55%,#e0406b 100%)', size: 'md' },
      { id: 3, file: '/photos/friends/zeynep/3.jpg', date: 'Ocak 2022',   caption: 'Kar altında kahve ritüeli',          gradient: 'linear-gradient(135deg,#0a0f1a 0%,#1f2f4d 55%,#4d6eff 100%)', size: 'sm' },
      { id: 4, file: '/photos/friends/zeynep/4.jpg', date: 'Temmuz 2022', caption: 'Deniz kenarında sonsuz sohbet',      gradient: 'linear-gradient(135deg,#001a2e 0%,#003052 55%,#0099cc 100%)', size: 'md' },
      { id: 5, file: '/photos/friends/zeynep/5.jpg', date: 'Aralık 2022', caption: 'Yılbaşı gecesi, ışıklar altında',   gradient: 'linear-gradient(135deg,#1a1000 0%,#4a2800 55%,#ffa84d 100%)', size: 'lg' },
    ]
  },
  {
    id: 'elif',
    name: 'Elif',
    emoji: '✨',
    title: 'İlham Kaynağım',
    color: '#c264fe',
    colorDim: 'rgba(194,100,254,.15)',
    message: `Senin güldüğünü gördüğümde içim ısınıyor. Beraber geçirdiğimiz her dakika gerçek bir hazine. Bazen seni izlerken "bu insan nasıl bu kadar ışık saçıyor" diye düşünüyorum. Sen bu dünyayı daha güzel bir yer yapıyorsun, bunu bil. 🌟`,
    photos: [
      { id: 1, file: '/photos/friends/elif/1.jpg', date: 'Mart 2022',    caption: 'Beraber gittiğimiz ilk konser',     gradient: 'linear-gradient(135deg,#0d0014 0%,#28003d 55%,#8800cc 100%)', size: 'lg' },
      { id: 2, file: '/photos/friends/elif/2.jpg', date: 'Mayıs 2022',   caption: 'Çiçekler açarken',                 gradient: 'linear-gradient(135deg,#0d1f0d 0%,#1a4020 55%,#4dff88 100%)', size: 'sm' },
      { id: 3, file: '/photos/friends/elif/3.jpg', date: 'Eylül 2022',   caption: 'Sonbaharın ilk günü',              gradient: 'linear-gradient(135deg,#1a0d00 0%,#4d2600 55%,#ffaa00 100%)', size: 'md' },
      { id: 4, file: '/photos/friends/elif/4.jpg', date: 'Kasım 2022',   caption: 'Kütüphanede saatlerce oturmuştuk', gradient: 'linear-gradient(135deg,#050a1a 0%,#0e1f40 55%,#2d5fff 100%)', size: 'lg' },
    ]
  },
  {
    id: 'selin',
    name: 'Selin',
    emoji: '🎵',
    title: 'Müzik Ruhum',
    color: '#FFD700',
    colorDim: 'rgba(255,215,0,.12)',
    message: `Seninle her konuşma bir müzik gibi. Bazen hiç söz söylemeden saatlerce oturmuşuz ve yine de her şeyi anlamışız. Sen benim için özel birisin — bir dost, bir ayna, bazen bir şarkı. Hep böyle kalmasını diliyorum. 🎶`,
    photos: [
      { id: 1, file: '/photos/friends/selin/1.jpg', date: 'Şubat 2022',  caption: 'İlk canlı müzik gecemiz',          gradient: 'linear-gradient(135deg,#1a1400 0%,#4a3a00 55%,#ffd700 100%)', size: 'md' },
      { id: 2, file: '/photos/friends/selin/2.jpg', date: 'Temmuz 2022', caption: 'Plajda neşeli anlar',              gradient: 'linear-gradient(135deg,#001a2e 0%,#003052 55%,#0099cc 100%)', size: 'lg' },
      { id: 3, file: '/photos/friends/selin/3.jpg', date: 'Ekim 2022',   caption: 'Sürpriz doğum günü partisi',       gradient: 'linear-gradient(135deg,#1a000a 0%,#4d0021 55%,#ff0055 100%)', size: 'sm' },
    ]
  },
  {
    id: 'naz',
    name: 'Naz',
    emoji: '🌙',
    title: 'Gece Yarısı Dostu',
    color: '#7ec8e3',
    colorDim: 'rgba(126,200,227,.12)',
    message: `Seninle her şeyi paylaşabiliyorum — en saçma düşüncelerimi bile. Saat kaç olursa olsun mesaj attığımda hep oradasın. Sen bir güvenliğim, bir sığınağımsın. Bunu hiç unutma. 🌙`,
    photos: [
      { id: 1, file: '/photos/friends/naz/1.jpg', date: 'Nisan 2022',   caption: 'Gece yarısı yürüyüşü',             gradient: 'linear-gradient(135deg,#050a14 0%,#101e30 55%,#7ec8e3 100%)', size: 'lg' },
      { id: 2, file: '/photos/friends/naz/2.jpg', date: 'Haziran 2022', caption: 'Yıldızları izlerken',              gradient: 'linear-gradient(135deg,#050508 0%,#0f0f1f 55%,#6655ff 100%)', size: 'md' },
      { id: 3, file: '/photos/friends/naz/3.jpg', date: 'Ağustos 2022', caption: 'Plajda sabaha kadar',              gradient: 'linear-gradient(135deg,#0a0f14 0%,#1a2530 55%,#4d99cc 100%)', size: 'sm' },
      { id: 4, file: '/photos/friends/naz/4.jpg', date: 'Ocak 2023',   caption: 'Kış gecesi, sıcak çay, sen',       gradient: 'linear-gradient(135deg,#0a0510 0%,#1f0f2e 55%,#9955cc 100%)', size: 'md' },
    ]
  },
]

function FriendPhotoCard({ photo, index, onClick, accent }: { photo: FPhoto; index: number; onClick: () => void; accent: string }) {
  const ref  = useRef<HTMLDivElement>(null)
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const sX   = useSpring(rotX, { stiffness: 220, damping: 18 })
  const sY   = useSpring(rotY, { stiffness: 220, damping: 18 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rotY.set(((e.clientX - rect.left) / rect.width  - .5) * 22)
    rotX.set(((e.clientY - rect.top)  / rect.height - .5) * -18)
  }
  const onLeave = () => { rotX.set(0); rotY.set(0) }

  const heights = { lg: '240px', md: '180px', sm: '140px' }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, delay: index * .05, ease: [.25,.1,.25,1] }}
      style={{ height: heights[photo.size], perspective: 800, cursor: 'pointer' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <motion.div
        style={{ width: '100%', height: '100%', borderRadius: '.9rem', overflow: 'hidden', position: 'relative', rotateX: sX, rotateY: sY, transformStyle: 'preserve-3d', boxShadow: '0 8px 28px rgba(0,0,0,.5)' }}
        whileHover={{ boxShadow: `0 16px 50px ${accent}44, 0 8px 28px rgba(0,0,0,.6)` }}
      >
        <img src={photo.file} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: photo.gradient }} />
        <motion.div initial={{ opacity: 0, y: 8 }} whileHover={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,.82) 0%,transparent 100%)', padding: '.8rem' }}>
          <p style={{ fontFamily: CO, fontSize: '.75rem', fontStyle: 'italic', color: 'rgba(255,255,255,.9)' }}>{photo.caption}</p>
          <p style={{ fontFamily: IN, fontSize: '.55rem', letterSpacing: '.1em', color: accent, marginTop: '.25rem' }}>{photo.date}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function FriendView({ friend, onBack }: { friend: Friend; onBack: () => void }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const lbIdx = lightbox !== null ? friend.photos.findIndex(p => p.id === lightbox) : -1

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: .45, ease: [.25,.1,.25,1] }}
      style={{ minHeight: '100vh' }}
    >
      {/* Friend hero */}
      <div style={{ padding: '2.5rem clamp(1rem,5vw,3rem) 1.5rem', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          ← Arkadaşlar
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: friend.colorDim, border: `2px solid ${friend.color}44`, boxShadow: `0 0 24px ${friend.color}33` }}>
            {friend.emoji}
          </div>
          <div>
            <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.3rem,3vw,1.8rem)', color: '#fff' }}>{friend.name}</h2>
            <p style={{ fontFamily: CO, fontSize: '.82rem', fontStyle: 'italic', color: friend.color }}>{friend.title}</p>
          </div>
        </div>

        {/* Message card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .3 }}
          style={{ background: friend.colorDim, border: `1px solid ${friend.color}22`, borderRadius: '1.1rem', padding: '1.4rem 1.6rem', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', fontSize: '3rem', opacity: .07, fontFamily: PF }}>❝</div>
          <p style={{ fontFamily: CO, fontSize: 'clamp(.88rem,1.6vw,1rem)', lineHeight: 1.75, color: 'rgba(255,255,255,.72)', fontStyle: 'italic' }}>
            {friend.message}
          </p>
        </motion.div>
      </div>

      {/* Photos header */}
      <div style={{ padding: '1.4rem clamp(1rem,5vw,3rem) .6rem' }}>
        <p style={{ fontFamily: IN, fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)' }}>
          {friend.photos.length} Fotoğraf
        </p>
      </div>

      {/* Photo masonry */}
      <div style={{ padding: '0 clamp(1rem,5vw,3rem)', columns: 'clamp(150px,28vw,240px) 3', columnGap: '1rem' }}>
        {friend.photos.map((photo, i) => (
          <div key={photo.id} style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
            <FriendPhotoCard photo={photo} index={i} onClick={() => setLightbox(photo.id)} accent={friend.color} />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lbIdx !== -1 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.93)', backdropFilter: 'blur(20px)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .92, opacity: 0 }}
              transition={{ duration: .35 }}
              style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: '1.2rem', overflow: 'hidden', position: 'relative', boxShadow: `0 0 80px ${friend.color}33` }}
              onClick={e => e.stopPropagation()}
            >
              <img src={friend.photos[lbIdx].file} alt={friend.photos[lbIdx].caption} style={{ maxWidth: '80vw', maxHeight: '72vh', objectFit: 'contain', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <div style={{ position: 'absolute', inset: 0, background: friend.photos[lbIdx].gradient }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 100%)', padding: '1.2rem 1.6rem .9rem' }}>
                <p style={{ fontFamily: PF, fontSize: '.95rem', color: '#fff', marginBottom: '.3rem' }}>{friend.photos[lbIdx].caption}</p>
                <p style={{ fontFamily: IN, fontSize: '.62rem', letterSpacing: '.12em', color: friend.color }}>{friend.photos[lbIdx].date}</p>
              </div>
            </motion.div>
            {lbIdx > 0 && (
              <motion.button whileHover={{ scale: 1.12, x: -3 }} onClick={e => { e.stopPropagation(); setLightbox(friend.photos[lbIdx - 1].id) }}
                style={{ position: 'fixed', left: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 48, height: 48, color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ‹
              </motion.button>
            )}
            {lbIdx < friend.photos.length - 1 && (
              <motion.button whileHover={{ scale: 1.12, x: 3 }} onClick={e => { e.stopPropagation(); setLightbox(friend.photos[lbIdx + 1].id) }}
                style={{ position: 'fixed', right: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 48, height: 48, color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ›
              </motion.button>
            )}
            <motion.button whileHover={{ rotate: 90 }} onClick={() => setLightbox(null)}
              style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', width: 40, height: 40, color: 'rgba(255,255,255,.6)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FriendsAlbum({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  const friend = selected ? FRIENDS.find(f => f.id === selected) ?? null : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .6 }}
      style={{ minHeight: '100vh', background: '#050505', paddingBottom: '4rem' }}
    >
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(5,5,5,.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,.05)', padding: '1.1rem clamp(1rem,5vw,3rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.button whileHover={{ x: -3 }} onClick={selected ? () => setSelected(null) : onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.4rem', color: 'rgba(255,255,255,.3)', fontFamily: IN, fontSize: '.7rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>
          ← {selected ? 'Arkadaşlar' : 'Hub'}
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: PF, fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', color: '#fff' }}>
            {friend ? friend.name : 'Arkadaşların Gözünden Sen'}
          </h1>
          <p style={{ fontFamily: CO, fontSize: '.78rem', color: 'rgba(255,194,209,.5)', fontStyle: 'italic' }}>
            {friend ? friend.title : `${FRIENDS.length} özel insan`}
          </p>
        </div>
        <div style={{ width: 60 }} />
      </div>

      <AnimatePresence mode="wait">
        {!selected ? (
          /* Friend selector grid */
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: .4 }}
            style={{ padding: 'clamp(1.5rem,4vw,3rem) clamp(1rem,5vw,3rem)' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .2 }}
              style={{ fontFamily: CO, fontSize: '.9rem', fontStyle: 'italic', color: 'rgba(255,255,255,.18)', marginBottom: '2.5rem' }}
            >
              Seni gözlemleyenlerin gözünden senin hikâyen…
            </motion.p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1.2rem' }}>
              {FRIENDS.map((f, i) => (
                <motion.button
                  key={f.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .1 + i * .08, duration: .5 }}
                  whileHover={{ y: -6, boxShadow: `0 20px 60px ${f.color}33` }}
                  whileTap={{ scale: .97 }}
                  onClick={() => setSelected(f.id)}
                  style={{
                    background: f.colorDim,
                    border: `1px solid ${f.color}22`,
                    borderRadius: '1.4rem',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'box-shadow .3s',
                  }}
                >
                  <div style={{ fontSize: '2.8rem', marginBottom: '1rem', filter: `drop-shadow(0 0 12px ${f.color}66)` }}>{f.emoji}</div>
                  <p style={{ fontFamily: PF, fontSize: '1.1rem', color: '#fff', marginBottom: '.3rem' }}>{f.name}</p>
                  <p style={{ fontFamily: CO, fontSize: '.78rem', fontStyle: 'italic', color: f.color, marginBottom: '1rem' }}>{f.title}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '.35rem' }}>
                    {f.photos.slice(0, 3).map(p => (
                      <div key={p.id} style={{ width: 28, height: 28, borderRadius: '.35rem', background: p.gradient, opacity: .7 }} />
                    ))}
                    {f.photos.length > 3 && (
                      <div style={{ width: 28, height: 28, borderRadius: '.35rem', background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: IN, fontSize: '.55rem', color: 'rgba(255,255,255,.35)' }}>
                        +{f.photos.length - 3}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : friend ? (
          <FriendView key={selected} friend={friend} onBack={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
