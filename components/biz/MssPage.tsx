'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"

const CORRECT  = '8181'
const ROSE     = '#ff6b8a'
const ROSE_RGB = '255,107,138'

type Block =
  | { type: 'body';       text: string }
  | { type: 'accent';     text: string }
  | { type: 'ikiki';      lines: string[] }
  | { type: 'closing';    lines: string[] }
  | { type: 'final';      text: string }
  | { type: 'postscript'; lines: string[] }

const CONTENT: Block[] = [
  { type: 'body',    text: 'Bazen düşünüyorum da, insanın hayatı gerçekten tek bir anla değişebiliyormuş. Ben bunu seninle öğrendim. Çünkü seni ilk gördüğüm günü düşündüğümde, aslında hayatımın yönünün o gün değiştiğini fark ediyorum.' },
  { type: 'body',    text: 'Belki sen o gün sıradan bir gün yaşıyordun. Belki benim seni gördüğüm anda hissettiğim şeylerden haberin bile yoktu. Ama ben o gün, kalabalığın içinde bir anda gözümün sadece sana takıldığını hatırlıyorum. Dünyada milyarlarca insan var derler ya, işte o gün bunun ne demek olduğunu anladım. Çünkü o kalabalığın içinde sadece sen vardın.' },
  { type: 'body',    text: 'Seni ilk gördüğüm andan itibaren aklımda bir sürü hayal kurmaya başladım. Belki saçma gelecek ama daha seni tanımadan bile yanında olmak istedim. Sesini merak ettim, nasıl güldüğünü merak ettim, neleri sevdiğini merak ettim. Çünkü sende tarif edemediğim bir şey vardı. İnsan bazen birine bakınca içinden "İşte bu." der ya, ben seni gördüğüm an bunu hissettim.' },
  { type: 'body',    text: 'Zaman geçtikçe seni tanıdım. Gülüşünü, heyecanlarını, bazen sustuğunda ne anlatmaya çalıştığını, bazen hiçbir şey söylemeden neler hissettiğini öğrendim. Ve seni tanıdıkça bir şey fark ettim; seni sevmemin sebebi sadece güzelliğin değildi. Evet, gözlerimi senden alamadığım zamanlar oldu. Ama beni sana bağlayan şey kalbin oldu.' },
  { type: 'body',    text: 'Senin iyi bir insan oluşun, etrafındaki insanlara verdiğin değer, bazen herkesi düşünürken kendini unutman, bazen çocuk gibi sevinmen, bazen de dünyanın yükünü omuzlarında taşıyormuş gibi hissetmen... Bunların hepsi seni sen yapan şeyler.' },
  { type: 'body',    text: 'Hayatta herkes güzel günlerde yanında olur. Ama ben sadece mutlu olduğun zamanlarda değil, zorlandığında da yanında olmak istiyorum. Ağladığında gözyaşlarını silen kişi olmak, yorulduğunda omzuna başını koyabileceğin kişi olmak, korktuğunda elini tutan kişi olmak istiyorum.' },
  { type: 'accent',  text: 'Çünkü ben seni sadece iyi günlerin için sevmedim.' },
  { type: 'accent',  text: 'Ben seni, sen olduğun için sevdim.' },
  { type: 'body',    text: 'Bazen geçmişi düşünüyorum. Birlikte yürüdüğümüz sokakları, birlikte içtiğimiz kahveleri, anlamsız şeylere güldüğümüz anları düşünüyorum. Sonra daha da ileri gidiyorum. Belki yıllar sonrasını hayal ediyorum. Yaşlanmış halimizi düşünüyorum. Saçlarımıza düşen beyazları, yüzümüzde oluşan çizgileri... Ve her hayalin sonunda yine sen varsın.' },
  { type: 'accent',  text: 'Çünkü benim kurduğum gelecekte sen yoksan hiçbir şey tam olmuyor.' },
  { type: 'body',    text: 'Hayat bazen zor olabilir. Kavga edebiliriz, kırılabiliriz, birbirimizi anlamakta zorlandığımız günler olabilir. Ama bilmeni istediğim bir şey var; ne olursa olsun seni seçmeye devam edeceğim. Çünkü sevgi sadece güzel günlerde söylenen sözlerden ibaret değil. Sevgi, zor günlerde de aynı kişiye dönüp "Ben hâlâ buradayım." diyebilmektir.' },
  { type: 'body',    text: 'Sen benim hayatıma girerek birçok şeyi değiştirdin. Bazı günler farkında olmadan yüzümü güldürdün. Bazı günler sadece varlığınla içimi rahatlattın. Bazen bir mesajın bütün günümü güzelleştirdi. Bazen sesini duymak bile yetti.' },
  { type: 'ikiki',   lines: ['İyi ki varsın.', 'İyi ki seni tanımışım.', 'İyi ki yollarımız kesişmiş.', 'İyi ki hayatımın bir parçası olmuşsun.'] },
  { type: 'body',    text: 'Ve bilmeni istiyorum ki, bu dünyada ne kadar zaman geçerse geçsin, ne kadar anı biriktirirsek biriktirelim, seni ilk gördüğüm gün hissettiğim o heyecanı hiç unutmayacağım.' },
  { type: 'accent',  text: 'Çünkü sen benim için sıradan biri olmadın hiçbir zaman.' },
  { type: 'closing', lines: ['Sen benim hayatımın anlamısın,', 'en sevdiğim hikâyemsin,', 'en değerli şeyimsin,', 've her gün yeniden seçtiğim kişisin.'] },
  { type: 'final',   text: 'Seni çok seviyorum.' },
  { type: 'postscript', lines: ['Dünden daha fazla,', 'yarından biraz daha az...'] },
]

/* ── PIN Screen ── */
function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pin,   setPin]   = useState('')
  const [shake, setShake] = useState(false)

  const handleKey = (k: string) => {
    if (k === '⌫') { setPin(p => p.slice(0, -1)); return }
    if (pin.length >= 4) return
    const next = pin + k
    setPin(next)
    if (next.length === 4) {
      if (next === CORRECT) {
        onSuccess()
      } else {
        setShake(true)
        setTimeout(() => { setShake(false); setPin('') }, 650)
      }
    }
  }

  const KEYS = ['1','2','3','4','5','6','7','8','9','⌫','0','']

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 40%, rgba(80,0,30,0.45) 0%, #04020a 70%)',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '65px 65px', opacity: 0.22, pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: '2.2rem', marginBottom: '1rem', filter: `drop-shadow(0 0 22px rgba(${ROSE_RGB},0.8))` }}
        >
          💌
        </motion.div>
        <h2 style={{ fontFamily: PF, fontSize: 'clamp(1.1rem,3vw,1.5rem)', color: '#fff', marginBottom: '0.4rem' }}>
          Sadece Sana Özel
        </h2>
        <p style={{ fontFamily: CO, fontSize: '0.9rem', fontStyle: 'italic', color: `rgba(${ROSE_RGB},0.5)` }}>
          Şifreyi gir
        </p>
      </motion.div>

      {/* PIN dots */}
      <motion.div
        animate={{ x: shake ? [-12, 12, -10, 10, -6, 6, 0] : 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', gap: '1.1rem', marginBottom: '2.8rem' }}
      >
        {[0,1,2,3].map(i => (
          <motion.div
            key={i}
            animate={{
              scale: i < pin.length ? 1 : 0.65,
              background: shake ? '#ff4455' : (i < pin.length ? ROSE : 'transparent'),
              borderColor: shake ? 'rgba(255,68,85,0.6)' : (i < pin.length ? ROSE : `rgba(${ROSE_RGB},0.28)`),
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              width: 15, height: 15, borderRadius: '50%',
              border: `2px solid rgba(${ROSE_RGB},0.28)`,
              boxShadow: i < pin.length ? `0 0 14px rgba(${ROSE_RGB},0.65)` : 'none',
            }}
          />
        ))}
      </motion.div>

      {/* Numpad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
        {KEYS.map((k, i) => (
          k === '' ? <div key={i} /> : (
            <motion.button
              key={k + i}
              whileHover={{ scale: 1.08, background: `rgba(${ROSE_RGB},0.14)` }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleKey(k)}
              style={{
                width: 66, height: 66, borderRadius: '50%',
                background: k === '⌫' ? 'transparent' : 'rgba(255,255,255,0.045)',
                border: k === '⌫' ? 'none' : `1px solid rgba(255,255,255,0.09)`,
                color: '#fff', cursor: 'pointer',
                fontFamily: IN, fontSize: k === '⌫' ? '1.2rem' : '1.25rem',
                backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {k}
            </motion.button>
          )
        ))}
      </div>
    </div>
  )
}

/* ── Content ── */
function Content({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.25,0.1,0.25,1] }}
      style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(60,0,20,0.65) 0%, #030208 65%)', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)', backgroundSize: '80px 80px', opacity: 0.16, pointerEvents: 'none' }} />

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        whileHover={{ opacity: 0.8, x: -3 }} onClick={onBack}
        style={{ position: 'absolute', top: '1.4rem', left: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: IN, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', zIndex: 50 }}
      >
        ← Geri
      </motion.button>

      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
        paddingTop: '5rem', paddingBottom: '8rem',
        paddingLeft: 'clamp(1.5rem,8vw,5rem)',
        paddingRight: 'clamp(1.5rem,8vw,5rem)',
        scrollbarWidth: 'none',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '2.2rem', marginBottom: '1.4rem', filter: `drop-shadow(0 0 26px rgba(${ROSE_RGB},0.75))` }}
          >
            💌
          </motion.div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', justifyContent: 'center' }}>
            <div style={{ width: 45, height: 1, background: `rgba(${ROSE_RGB},0.22)` }} />
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: `rgba(${ROSE_RGB},0.42)` }} />
            <div style={{ width: 45, height: 1, background: `rgba(${ROSE_RGB},0.22)` }} />
          </div>
        </motion.div>

        {/* Blocks */}
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {CONTENT.map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.055, duration: 0.85, ease: [0.25,0.1,0.25,1] }}
            >
              {block.type === 'body' && (
                <p style={{ fontFamily: CO, fontSize: 'clamp(1rem,2.2vw,1.18rem)', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 2, marginBottom: '2rem', textAlign: 'justify' }}>
                  {block.text}
                </p>
              )}

              {block.type === 'accent' && (
                <p style={{
                  fontFamily: PF, fontSize: 'clamp(1rem,2.5vw,1.22rem)',
                  color: '#fff', lineHeight: 1.7, marginBottom: '2rem',
                  textAlign: 'center',
                  textShadow: `0 0 28px rgba(${ROSE_RGB},0.55), 0 0 55px rgba(${ROSE_RGB},0.2)`,
                  padding: '0.4rem 0',
                }}>
                  {block.text}
                </p>
              )}

              {block.type === 'ikiki' && (
                <div style={{
                  textAlign: 'center', margin: '2.5rem 0 2.5rem',
                  padding: '1.8rem 0',
                  borderTop: `1px solid rgba(${ROSE_RGB},0.14)`,
                  borderBottom: `1px solid rgba(${ROSE_RGB},0.14)`,
                }}>
                  {block.lines.map((line, j) => (
                    <p key={j} style={{
                      fontFamily: PF, fontSize: 'clamp(1rem,2.2vw,1.12rem)',
                      color: ROSE, lineHeight: 2.1,
                      textShadow: `0 0 18px rgba(${ROSE_RGB},0.35)`,
                    }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {block.type === 'closing' && (
                <div style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem' }}>
                  {block.lines.map((line, j) => (
                    <p key={j} style={{ fontFamily: CO, fontSize: 'clamp(1.05rem,2.4vw,1.28rem)', fontStyle: 'italic', color: 'rgba(255,255,255,0.82)', lineHeight: 1.95 }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {block.type === 'final' && (
                <p style={{
                  fontFamily: PF, fontSize: 'clamp(1.4rem,3.5vw,2.1rem)',
                  color: '#fff', textAlign: 'center', letterSpacing: '0.02em',
                  textShadow: `0 0 40px rgba(${ROSE_RGB},0.65), 0 0 80px rgba(${ROSE_RGB},0.25)`,
                  margin: '2.5rem 0 1.2rem',
                }}>
                  {block.text}
                </p>
              )}

              {block.type === 'postscript' && (
                <div style={{ textAlign: 'center', marginTop: '0.5rem', paddingBottom: '2rem' }}>
                  {block.lines.map((line, j) => (
                    <p key={j} style={{ fontFamily: CO, fontSize: 'clamp(0.9rem,2vw,1.05rem)', fontStyle: 'italic', color: `rgba(${ROSE_RGB},0.5)`, lineHeight: 1.85 }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5rem', background: 'linear-gradient(to bottom, #030208, transparent)', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5rem', background: 'linear-gradient(to top, #030208, transparent)', pointerEvents: 'none', zIndex: 10 }} />
    </motion.div>
  )
}

/* ── Main ── */
export default function MssPage({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<'pin' | 'content'>('pin')

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <AnimatePresence mode="wait">
        {screen === 'pin' ? (
          <motion.div key="pin" exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.5 }}>
            <PinScreen onSuccess={() => setScreen('content')} />
          </motion.div>
        ) : (
          <Content key="content" onBack={onBack} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
