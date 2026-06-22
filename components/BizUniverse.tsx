'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'

const CosmicLanding  = dynamic(() => import('./biz/CosmicLanding'),   { ssr: false })
const GalaxyNav      = dynamic(() => import('./biz/GalaxyNav'),        { ssr: false })
const SevgiliGun     = dynamic(() => import('./biz/SevgiliGun'),       { ssr: false })
const FloatingAlbum  = dynamic(() => import('./biz/FloatingAlbum'),    { ssr: false })
const LoveLetters    = dynamic(() => import('./biz/LoveLetters'),      { ssr: false })
const FutureDreams   = dynamic(() => import('./biz/FutureDreams'),     { ssr: false })
const FinalExperience= dynamic(() => import('./biz/FinalExperience'),  { ssr: false })
const ChapterShell   = dynamic(() => import('./biz/ChapterShell'),     { ssr: false })

export type BizScene =
  | 'landing'
  | 'galaxy'
  | 'chapter-ilk-tanisma'
  | 'chapter-ilk-mesajlar'
  | 'chapter-sevgili'
  | 'chapter-album'
  | 'chapter-sesli'
  | 'chapter-harita'
  | 'chapter-mektuplar'
  | 'chapter-timeline'
  | 'chapter-gelecek'
  | 'chapter-gizli'
  | 'finale'

const CHAPTER_SHELLS: Record<string, { title: string; subtitle: string; emoji: string; color: string }> = {
  'chapter-ilk-tanisma':  { title: 'İlk Tanışma',      subtitle: 'Her şeyin başladığı o an',            emoji: '🌍', color: '#4a9eff' },
  'chapter-ilk-mesajlar': { title: 'İlk Mesajlar',      subtitle: 'Kelimeler arasında gizlenen his',     emoji: '🌙', color: '#e0e0c0' },
  'chapter-sesli':        { title: 'Sesli Anılar',      subtitle: 'Sesin hâlâ kulağımda',                emoji: '🎙', color: '#c264fe' },
  'chapter-harita':       { title: 'Aşk Haritası',      subtitle: 'Birlikte iz bıraktığımız yerler',     emoji: '📍', color: '#00c8a8' },
  'chapter-timeline':     { title: 'Zaman Tüneli',      subtitle: 'Geçmişimizin izleri',                 emoji: '⏳', color: '#c0c8d8' },
  'chapter-gizli':        { title: 'Gizli Sürprizler',  subtitle: 'Sakladıklarım, seni bekliyor',        emoji: '⭐', color: '#8888ff' },
}

export default function BizUniverse({ onBack }: { onBack: () => void }) {
  const [scene, setScene] = useState<BizScene>('landing')

  const go = useCallback((s: BizScene) => setScene(s), [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {scene === 'landing' && (
          <CosmicLanding key="landing" onEnter={() => go('galaxy')} onBack={onBack} />
        )}

        {scene === 'galaxy' && (
          <GalaxyNav
            key="galaxy"
            onSelect={id => go(`chapter-${id}` as BizScene)}
            onBack={onBack}
            onFinale={() => go('finale')}
          />
        )}

        {scene === 'chapter-sevgili' && (
          <SevgiliGun key="sevgili" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-album' && (
          <FloatingAlbum key="album" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-mektuplar' && (
          <LoveLetters key="mektuplar" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-gelecek' && (
          <FutureDreams key="gelecek" onBack={() => go('galaxy')} />
        )}

        {scene === 'finale' && (
          <FinalExperience key="finale" onBack={() => go('galaxy')} />
        )}

        {Object.keys(CHAPTER_SHELLS).includes(scene) && (
          <ChapterShell
            key={scene}
            {...CHAPTER_SHELLS[scene]}
            onBack={() => go('galaxy')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
