'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

type Cat = 'Tümü' | 'İlk Anlar' | 'Özel Günler' | 'Sıradan Günler' | 'Maceralar'

interface Photo {
  id: number
  file: string
  date: string
  caption: string
  category: Cat
  size: 'lg' | 'md' | 'sm'
  gradient: string
}

const PHOTOS: Photo[] = [
  { id: 1,  file: '/photos/biz/1.jpg',  date: '14 Şubat 2023', caption: 'İlk buluşmamız — kalbim ağzımdaydı o gece.',              category: 'İlk Anlar',     size: 'lg', gradient: 'linear-gradient(135deg,#2d0a1a 0%,#6b1a2e 50%,#ff4d88 100%)' },
  { id: 2,  file: '/photos/biz/2.jpg',  date: '15 Şubat 2023', caption: 'Sabah kahvesi ve sonsuz konuşmalar.',                       category: 'İlk Anlar',     size: 'md', gradient: 'linear-gradient(135deg,#1a0d20 0%,#4a1060 60%,#c264fe 100%)' },
  { id: 3,  file: '/photos/biz/3.jpg',  date: '20 Mart 2023',  caption: 'İlk fotoğrafımız. Hâlâ en sevdiğim an.',                   category: 'İlk Anlar',     size: 'sm', gradient: 'linear-gradient(135deg,#0a1628 0%,#1e3a5f 60%,#4d88ff 100%)' },
  { id: 4,  file: '/photos/biz/4.jpg',  date: '8 Nisan 2023',  caption: 'Parkta yürürken tuttuğun el.',                             category: 'Sıradan Günler', size: 'md', gradient: 'linear-gradient(135deg,#0d1f0d 0%,#1a4020 60%,#4dff88 100%)' },
  { id: 5,  file: '/photos/biz/5.jpg',  date: '1 Mayıs 2023',  caption: 'Kaçtığımız tatil. En spontane anımız.',                    category: 'Maceralar',     size: 'lg', gradient: 'linear-gradient(135deg,#1a1000 0%,#4a2800 60%,#ffa84d 100%)' },
  { id: 6,  file: '/photos/biz/6.jpg',  date: '10 Haziran 2023','caption': 'Yağmurda ıslandık, gülüştük, unutmadık.',               category: 'Sıradan Günler', size: 'sm', gradient: 'linear-gradient(135deg,#050a1a 0%,#0e1f40 60%,#2d5fff 100%)' },
  { id: 7,  file: '/photos/biz/7.jpg',  date: '23 Haziran 2023','caption': 'Doğum günün — sana her şeyi verirdim o an.',            category: 'Özel Günler',   size: 'md', gradient: 'linear-gradient(135deg,#1a000a 0%,#4d0021 60%,#ff0055 100%)' },
  { id: 8,  file: '/photos/biz/8.jpg',  date: '15 Temmuz 2023', caption: 'Şehrin ışıkları ve sen.',                                  category: 'Maceralar',     size: 'sm', gradient: 'linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 60%,#16213e 100%)' },
  { id: 9,  file: '/photos/biz/9.jpg',  date: '3 Ağustos 2023', caption: 'Deniz kıyısında son kez bakışın.',                         category: 'Maceralar',     size: 'lg', gradient: 'linear-gradient(135deg,#001a2e 0%,#003052 60%,#0099cc 100%)' },
  { id: 10, file: '/photos/biz/10.jpg', date: '14 Şubat 2024', caption: 'Birinci yılımız. Her şeye değerdi.',                        category: 'Özel Günler',   size: 'md', gradient: 'linear-gradient(135deg,#1a0010 0%,#4d0030 60%,#ff4d88 100%)' },
  { id: 11, file: '/photos/biz/11.jpg', date: '5 Eylül 2023',  caption: 'Sabah güneşini birlikte izlediğimiz gün.',                  category: 'Sıradan Günler', size: 'sm', gradient: 'linear-gradient(135deg,#1a0d00 0%,#4d2600 60%,#ffaa00 100%)' },
  { id: 12, file: '/photos/biz/12.jpg', date: '31 Ekim 2023',  caption: 'Cadılar bayramı kostümleri — en çılgın fikrimin.',         category: 'Özel Günler',   size: 'md', gradient: 'linear-gradient(135deg,#0d0014 0%,#28003d 60%,#8800cc 100%)' },
]

const CATS: Cat[] = ['Tümü','İlk Anlar','Özel Günler','Sıradan Günler','Maceralar']

function PhotoCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const sRotX = useSpring(rotX, { stiffness: 220, damping: 18 })
  const sRotY = useSpring(rotY, { stiffness: 220, damping: 18 })

  const glowX  = useTransform(sRotY, [-15, 15], [0, 100])
  const glowY  = useTransform(sRotX, [15, -15], [0, 100])
  const glowBg = useTransform([glowX, glowY], (v: number[]) =>
    `radial-gradient(circle at ${v[0]}% ${v[1]}%, rgba(255,255,255,.14) 0%, transparent 65%)`
  )

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = (e.clientX - rect.left) / rect.width
    const cy = (e.clientY - rect.top)  / rect.height
    rotY.set((cx - .5) * 24)
    rotX.set((cy - .5) * -20)
  }
  const onLeave = () => { rotX.set(0); rotY.set(0) }

  const heightMap = { lg: '280px', md: '200px', sm: '160px' }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .55, delay: index * .04, ease: [.25,.1,.25,1] }}
      style={{ height: heightMap[photo.size], perspective: 900, cursor: 'pointer' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <motion.div
        style={{
          width: '100%', height: '100%', borderRadius: '1rem',
          overflow: 'hidden', position: 'relative',
          rotateX: sRotX, rotateY: sRotY,
          transformStyle: 'preserve-3d',
          boxShadow: '0 8px 32px rgba(0,0,0,.55)',
        }}
        whileHover={{ boxShadow: '0 16px 60px rgba(255,77,136,.35), 0 8px 32px rgba(0,0,0,.6)' }}
      >
        {/* Image or gradient placeholder */}
        <img
          src={photo.file}
          alt={photo.caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: photo.gradient, opacity: 1, transition: 'opacity .3s' }} className="photo-bg" />

        {/* Shine layer */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: glowBg,
          }}
        />

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: .22 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 100%)',
            padding: '.9rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.5rem' }}>
            <p style={{ fontFamily: CO, fontSize: '.78rem', fontStyle: 'italic', color: 'rgba(255,255,255,.88)', lineHeight: 1.4, flex: 1 }}>
              {photo.caption}
            </p>
            <span style={{ fontFamily: IN, fontSize: '.58rem', letterSpacing: '.1em', color: '#FF4D88', whiteSpace: 'nowrap', paddingTop: '.1rem' }}>
              {photo.date}
            </span>
          </div>
        </motion.div>

        {/* Category tag */}
        <div style={{ position: 'absolute', top: '.6rem', left: '.6rem', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', borderRadius: '2rem', padding: '.2rem .6rem', fontFamily: IN, fontSize: '.55rem', letterSpacing: '.12em', color: '#FF4D88', textTransform: 'uppercase' }}>
          {photo.category}
        </div>
      </motion.div>
    </motion.div>
  )
}

function Lightbox({ photo, photos, onClose, onPrev, onNext }: { photo: Photo; photos: Photo[]; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .3 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      {/* Image */}
      <motion.div
        initial={{ scale: .88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: .92, opacity: 0 }}
        transition={{ duration: .38, ease: [.25,.1,.25,1] }}
        style={{ position: 'relative', maxWidth: '82vw', maxHeight: '80vh', borderRadius: '1.2rem', overflow: 'hidden', boxShadow: '0 0 80px rgba(255,77,136,.2)' }}
        onClick={e => e.stopPropagation()}
      >
        <img src={photo.file} alt={photo.caption} style={{ maxWidth: '82vw', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: photo.gradient, opacity: 1 }} className="lb-bg" />

        {/* Caption overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 100%)', padding: '1.5rem 1.8rem .9rem' }}>
          <p style={{ fontFamily: PF, fontSize: '1rem', color: '#fff', marginBottom: '.35rem' }}>{photo.caption}</p>
          <p style={{ fontFamily: IN, fontSize: '.65rem', letterSpacing: '.14em', color: '#FF4D88', textTransform: 'uppercase' }}>{photo.date} · {photo.category}</p>
        </div>
      </motion.div>

      {/* Prev/Next */}
      <motion.button whileHover={{ scale: 1.12, x: -3 }} onClick={e => { e.stopPropagation(); onPrev() }}
        style={{ position: 'fixed', left: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 48, height: 48, color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ‹
      </motion.button>
      <motion.button whileHover={{ scale: 1.12, x: 3 }} onClick={e => { e.stopPropagation(); onNext() }}
        style={{ position: 'fixed', right: '2rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 48, height: 48, color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ›
      </motion.button>

      {/* Close */}
      <motion.button whileHover={{ rotate: 90, scale: 1.1 }} onClick={onClose}
        style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', width: 40, height: 40, color: 'rgba(255,255,255,.6)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        ✕
      </motion.button>

      {/* Film strip */}
      <div style={{ position: 'fixed', bottom: '1.8rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '.5rem', padding: '.6rem', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(12px)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,.06)' }}>
        {photos.slice(0, 8).map(p => (
          <div key={p.id} onClick={e => { e.stopPropagation() }}
            style={{ width: 40, height: 40, borderRadius: '.4rem', overflow: 'hidden', border: p.id === photo.id ? '2px solid #FF4D88' : '2px solid transparent', opacity: p.id === photo.id ? 1 : .45, transition: 'all .2s', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '100%', background: p.gradient }} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function BizAlbum({ onBack }: { onBack: () => void }) {
  const [cat,      setCat]      = useState<Cat>('Tümü')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = cat === 'Tümü' ? PHOTOS : PHOTOS.filter(p => p.category === cat)
  const lbIdx    = lightbox !== null ? filtered.findIndex(p => p.id === lightbox) : -1

  const prev = () => { if (lbIdx > 0) setLightbox(filtered[lbIdx - 1].id) }
  const next = () => { if (lbIdx < filtered.length - 1) setLightbox(filtered[lbIdx + 1].id) }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .6 }}
      style={{ minHeight: '100vh', background: '#050505', paddingBottom: '5rem' }}
    >
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(5,5,5,.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,.05)', padding: '1.1rem clamp(1rem,5vw,3rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.button whileHover={{ x: -3 }} onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.4rem', color: 'rgba(255,255,255,.3)', fontFamily: IN, fontSize: '.7rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>
          ← Hub
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: PF, fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', color: '#fff' }}>Bizim Albümümüz</h1>
          <p style={{ fontFamily: CO, fontSize: '.78rem', color: 'rgba(255,77,136,.6)', fontStyle: 'italic' }}>{PHOTOS.length} anı</p>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Category filter */}
      <div style={{ padding: '1.4rem clamp(1rem,5vw,3rem) .8rem', display: 'flex', gap: '.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATS.map(c => (
          <motion.button
            key={c}
            whileTap={{ scale: .95 }}
            onClick={() => setCat(c)}
            style={{
              fontFamily: IN, fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase',
              padding: '.45rem 1.1rem', borderRadius: '2rem', whiteSpace: 'nowrap', cursor: 'pointer',
              border: `1px solid ${cat === c ? '#FF4D88' : 'rgba(255,255,255,.1)'}`,
              background: cat === c ? 'rgba(255,77,136,.12)' : 'transparent',
              color: cat === c ? '#FF4D88' : 'rgba(255,255,255,.35)',
              transition: 'all .2s',
            }}
          >
            {c}
          </motion.button>
        ))}
      </div>

      {/* Hero text */}
      <motion.div
        key={cat}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '.5rem clamp(1rem,5vw,3rem) 1.5rem' }}
      >
        <p style={{ fontFamily: CO, fontSize: '.9rem', color: 'rgba(255,194,209,.3)', fontStyle: 'italic' }}>
          {cat === 'Tümü' ? 'Seninle geçirdiğimiz her an, burada yaşıyor.' :
           cat === 'İlk Anlar' ? 'Her şey bu anlarda başladı.' :
           cat === 'Özel Günler' ? 'Kutladığımız her an, kalbimizde.' :
           cat === 'Sıradan Günler' ? 'En güzel anlar, sıradan anlardı zaten.' :
           'Birlikte keşfettiğimiz dünyalar.'}
        </p>
      </motion.div>

      {/* Masonry grid */}
      <div style={{ padding: '0 clamp(1rem,5vw,3rem)', columns: 'clamp(180px,30vw,280px) 3', columnGap: '1rem' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((photo, i) => (
            <div key={photo.id} style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
              <PhotoCard photo={photo} index={i} onClick={() => setLightbox(photo.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lbIdx !== -1 && (
          <Lightbox
            photo={filtered[lbIdx]}
            photos={filtered}
            onClose={() => setLightbox(null)}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>

      {/* Footer quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .8 }}
        style={{ textAlign: 'center', padding: '3rem 2rem 1rem' }}
      >
        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#FF4D88,transparent)', margin: '0 auto 1.2rem' }} />
        <p style={{ fontFamily: PF, fontSize: 'clamp(.9rem,1.8vw,1.1rem)', fontStyle: 'italic', color: 'rgba(255,255,255,.18)' }}>
          "Her fotoğraf, yaşanan bir mucizedir."
        </p>
      </motion.div>
    </motion.div>
  )
}
