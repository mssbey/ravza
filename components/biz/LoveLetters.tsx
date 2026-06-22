'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"
const HW = "'Dancing Script', cursive"

interface Letter {
  id: number
  trigger: string
  icon: string
  lines: string[]
  seal: string
  color: string
  colorDim: string
  glowRgb: string
}

const LETTERS: Letter[] = [
  {
    id: 1, icon: '💌', seal: '❤', color: '#FF4D88', colorDim: 'rgba(255,77,136,.12)', glowRgb: '255,77,136',
    trigger: 'Beni özlediğinde aç',
    lines: [
      'Ravza,',
      '',
      '//Şu an beni özlediğin için',
      '//buradasın galiba.',
      '',
      'Keşke yanında olabilsem de',
      'bu yazıyı okumak zorunda kalmasan.',
      'Ama madem okuyorsun,',
      'sana şunu söylemek istiyorum:',
      '',
      '//Ben de seni özlüyorum.',
      '',
      'Bazen gün içinde bir şey oluyor,',
      'istemsizce telefona uzanıp',
      'sana buluşalım yazmak istiyorum.',
      'Bir şarkı duyuyorum,',
      'bir kahve içiyorum,',
      'komik bir şey görüyorum...',
      '//Aklıma direkt sen geliyorsun.',
      '',
      'Eğer şu an biraz üzgün hissediyorsan,',
      'bil ki seni çok seven bir şebeğin var',
      've o şebek günün sonunda',
      '//hâlâ seni düşünüyor.',
      '',
      '//Biraz daha sabret.',
      '',
      'Yanına gelip saçını seveceğim',
      '//sevgili...',
    ],
  },
  {
    id: 2, icon: '🌙', seal: '✦', color: '#c264fe', colorDim: 'rgba(194,100,254,.12)', glowRgb: '194,100,254',
    trigger: 'Kendini kötü hissettiğinde aç',
    lines: [
      'Ravza balım,',
      '',
      '//Önce derin bir nefes al.',
      '',
      'Şu an ne yaşıyorsan,',
      'neye üzüldüysen, neye kırıldıysan...',
      '//Bunların hiçbiri seni değersiz yapmıyor.',
      '',
      'Ben seni sadece güldüğün zamanlarda sevmedim.',
      '',
      'Yorgunken de sevdim.',
      'Sinirliyken de sevdim.',
      'Ağlarken de sevdim.',
      '',
      'Çünkü ben senin sadece mutlu haline değil,',
      '//sana âşık oldum.',
      '',
      'Kendine çok yükleniyorsun bazen.',
      'Çok stresleniyorsun.',
      '',
      '//Ama keşke kendine benim gözümden bakabilsen.',
      '',
      'Ne kadar güçlü olduğunu,',
      'ne kadar tatlı olduğunu,',
      've insanların seni ne kadar sevdiğini görebilirdin.',
      '',
      'Bugün kötü geçebilir.',
      '',
      '//Ama yarın her şey iyi olacak, söz veriyorum.',
      '',
      '//Ve ben hep senin yanındayım.',
    ],
  },
  {
    id: 4, icon: '🌊', seal: '◈', color: '#00c8a8', colorDim: 'rgba(0,200,168,.1)', glowRgb: '0,200,168',
    trigger: 'Bana kızgınsan aç',
    lines: [
      'Ravza aşkım ben malım eşşeğim salağım',
      '',
      'Eğer bu mektubu açtıysan büyük ihtimalle bana kızgınsın.',
      '',
      'Ve biliyor musun?',
      '',
      '//Kızgınsan büyük ihtimalle haklısındır bebeğim. 😅',
      '',
      'Çünkü bazen dünyanın en odun insanına dönüşebiliyorum.',
      '',
      'Bazen söylemem gereken şeyi söylemiyorum.',
      'Bazen söylememem gereken şeyi söylüyorum.',
      '',
      '//Bazen de beynimle kalbim arasında internet bağlantısı kopuyor.',
      '',
      'O yüzden önce şunu söyleyeyim:',
      '',
      '//Seni üzdüysem özür dilerim.',
      '',
      'Bilerek yaptığım hiçbir şey yok.',
      '',
      'Çünkü seni üzmek istesem bile beceremem,',
      'seni görünce bütün planlarım bozuluyor zaten.',
      '',
      'Şu an bana sinirli olabilirsin.',
      '"Hak ettin." de diyebilirsin.',
      'Belki de gerçekten hak etmişimdir.',
      '',
      'Ama şunu bilmeni istiyorum:',
      '',
      '//Sana olan sevgim tartıştığımız günlerde de aynı.',
      '',
      "Hatta bazen seni sinirli görünce bile",
      "//\"Allah'ım ne kadar güzel kız\" diye düşünüyorum.",
      '',
      'Evet, biraz salakça.',
      '//Ama gerçek.',
      '',
      'Kızgınlığın geçince gel konuşalım.',
      'Ben burada seni bekliyor olacağım.',
      '',
      '//Ve söz veriyorum, bu sefer beynimi yanıma alacağım.',
      '',
      '//Seni seviyorum AŞK 🤍',
    ],
  },
]

function Envelope({ letter, isOpen, onClick }: { letter: Letter; isOpen: boolean; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: .97 }}
      onClick={onClick}
      style={{ cursor: 'pointer', width: '100%', maxWidth: 280, margin: '0 auto' }}
    >
      {/* Envelope body */}
      <motion.div
        animate={{ boxShadow: isOpen ? `0 0 50px rgba(${letter.glowRgb},.45), 0 16px 48px rgba(0,0,0,.55)` : `0 8px 32px rgba(0,0,0,.5), 0 0 20px rgba(${letter.glowRgb},.12)` }}
        transition={{ duration: .4 }}
        style={{
          position: 'relative',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: letter.colorDim,
          border: `1px solid rgba(${letter.glowRgb},.2)`,
          backdropFilter: 'blur(12px)',
          padding: '1.8rem 1.4rem 1.4rem',
          textAlign: 'center',
        }}
      >
        {/* Wax seal */}
        <motion.div
          animate={{ rotate: isOpen ? 360 : 0, scale: isOpen ? 1.2 : 1 }}
          transition={{ duration: .6, ease: [.25,.1,.25,1] }}
          style={{
            position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: `radial-gradient(circle at 38% 36%, ${letter.color}, rgba(${letter.glowRgb},.4))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.9rem', color: '#fff',
            boxShadow: `0 0 16px rgba(${letter.glowRgb},.6)`,
          }}
        >
          {letter.seal}
        </motion.div>

        <div style={{ marginTop: '.5rem' }}>
          <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '.8rem', filter: `drop-shadow(0 0 12px rgba(${letter.glowRgb},.6))` }}>
            {letter.icon}
          </span>
          <p style={{ fontFamily: PF, fontSize: '.95rem', color: '#fff', lineHeight: 1.4 }}>{letter.trigger}</p>
        </div>

        {/* Envelope flap visual */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: `linear-gradient(to bottom, rgba(${letter.glowRgb},.06), transparent)`, borderBottom: `1px solid rgba(${letter.glowRgb},.1)` }} />
      </motion.div>
    </motion.div>
  )
}

function LetterModal({ letter, onClose }: { letter: Letter; onClose: () => void }) {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => {
      setRevealed(r => {
        if (r >= letter.lines.length) { clearInterval(iv); return r }
        return r + 1
      })
    }, 180)
    return () => clearInterval(iv)
  })

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(28px)' }}
      onClick={onClose}
    >
      {/* Envelope unfold animation → paper */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        exit={{ scaleY: 0, opacity: 0 }}
        transition={{ duration: .55, ease: [.25,.1,.25,1] }}
        style={{ transformOrigin: 'top center' }}
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ delay: .4, type: 'spring', stiffness: 180, damping: 20 }}
          style={{
            width: 'min(88vw, 440px)',
            background: 'linear-gradient(160deg, #fdf8f0, #f8f2e6)',
            borderRadius: '1rem',
            padding: 'clamp(1.5rem,5vw,2.5rem) clamp(1.5rem,5vw,2.8rem)',
            boxShadow: `0 0 80px rgba(${letter.glowRgb},.2), 0 32px 80px rgba(0,0,0,.6)`,
            border: `1px solid rgba(${letter.glowRgb},.2)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Paper lines */}
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} style={{ position: 'absolute', left: '2.5rem', right: '1.5rem', top: `${3.2 + i*2.1}rem`, height: 1, background: 'rgba(150,130,110,.1)' }} />
          ))}

          {/* Header stamp */}
          <div style={{ textAlign: 'center', marginBottom: '1.6rem', position: 'relative' }}>
            <span style={{ fontSize: '2rem', filter: `drop-shadow(0 0 8px rgba(${letter.glowRgb},.5))` }}>{letter.icon}</span>
            <div style={{ width: 40, height: 1, background: letter.color, margin: '.6rem auto 0', opacity: .5 }} />
          </div>

          {/* Letter lines */}
          <div style={{ minHeight: 200, position: 'relative', zIndex: 2 }}>
            {letter.lines.slice(0, revealed).map((line, i) => {
              const accent  = line.startsWith('//')
              const display = accent ? line.slice(2) : line
              const empty   = display.trim() === ''
              return (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: .25 }}
                style={{
                  fontFamily: HW,
                  fontSize: accent ? 'clamp(.92rem,2.1vw,1.1rem)' : 'clamp(.85rem,2vw,1rem)',
                  color: accent ? letter.color : '#2a1a12',
                  fontStyle: accent ? 'italic' : 'normal',
                  fontWeight: accent ? 600 : 400,
                  lineHeight: empty ? '1.2' : '1.78',
                  marginBottom: empty ? '.2rem' : '0',
                  textShadow: accent ? ('0 0 16px rgba(' + letter.glowRgb + ',.3)') : 'none',
                }}
              >
                {display || ' '}
              </motion.p>
            )
            })}
            {revealed < letter.lines.length && (
              <span style={{ display: 'inline-block', width: 2, height: '.9em', background: letter.color, animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom', marginLeft: 2 }} />
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        whileHover={{ rotate: 90 }} onClick={onClose}
        style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '50%', width: 40, height: 40, color: 'rgba(255,255,255,.6)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        ✕
      </motion.button>
    </motion.div>
  )
}

export default function LoveLetters({ onBack }: { onBack: () => void }) {
  const [openLetter, setOpenLetter] = useState<Letter | null>(null)
  const [opened, setOpened]         = useState<Set<number>>(new Set())

  const handleOpen = (l: Letter) => {
    setOpened(s => new Set(s).add(l.id))
    setOpenLetter(l)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .7 }}
      style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(30,0,15,.9) 0%, #000 60%)', overflow: 'hidden' }}
    >
      {/* Stars bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg...%3E")', opacity: .3 }} />

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
        whileHover={{ x: -3 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', zIndex: 10 }}
      >
        ← Geri
      </motion.button>

      {/* Scrollable content */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '5rem clamp(1rem,5vw,3rem) 5rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,77,136,.3) transparent' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}
        >
          <p style={{ fontFamily: IN, fontSize: '.62rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'rgba(255,194,209,.35)', marginBottom: '.8rem' }}>
            Sana Yazdığım
          </p>
          <h1 style={{ fontFamily: PF, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', marginBottom: '.6rem' }}>
            Mektuplar
          </h1>
          <p style={{ fontFamily: CO, fontSize: 'clamp(.85rem,1.8vw,1rem)', fontStyle: 'italic', color: 'rgba(255,194,209,.4)' }}>
            Her mühür, bir his — hazır olduğunda aç
          </p>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#FF4D88,transparent)', margin: '1.5rem auto 0' }} />
        </motion.div>

        {/* Envelope grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,80vw), 1fr))', gap: 'clamp(1rem,3vw,1.8rem)', maxWidth: 1000, margin: '0 auto', paddingBottom: '3rem' }}>
          {LETTERS.map((letter, i) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .1 + i*.1, duration: .6 }}
            >
              <Envelope
                letter={letter}
                isOpen={opened.has(letter.id)}
                onClick={() => handleOpen(letter)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openLetter && <LetterModal letter={openLetter} onClose={() => setOpenLetter(null)} />}
      </AnimatePresence>
    </motion.div>
  )
}
