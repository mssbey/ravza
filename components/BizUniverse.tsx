'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'

const CosmicLanding  = dynamic(() => import('./biz/CosmicLanding'),   { ssr: false })
const GalaxyNav      = dynamic(() => import('./biz/GalaxyNav'),        { ssr: false })
const FloatingAlbum  = dynamic(() => import('./biz/FloatingAlbum'),    { ssr: false })
const LoveLetters    = dynamic(() => import('./biz/LoveLetters'),      { ssr: false })
const FutureDreams   = dynamic(() => import('./biz/FutureDreams'),     { ssr: false })
const FinalExperience= dynamic(() => import('./biz/FinalExperience'),  { ssr: false })
const ChapterShell   = dynamic(() => import('./biz/ChapterShell'),     { ssr: false })
const IlkMesajlar    = dynamic(() => import('./biz/IlkMesajlar'),      { ssr: false })
const IlkTanisma     = dynamic(() => import('./biz/IlkTanisma'),       { ssr: false })
const MssPage        = dynamic(() => import('./biz/MssPage'),          { ssr: false })
const ZamanTuneli    = dynamic(() => import('./biz/ZamanTuneli'),       { ssr: false })

export type BizScene =
  | 'landing'
  | 'galaxy'
  | 'chapter-ilk-tanisma'
  | 'chapter-ilk-mesajlar'
  | 'chapter-album'
  | 'chapter-sesli'
  | 'chapter-mss'
  | 'chapter-mektuplar'
  | 'chapter-timeline'
  | 'chapter-gelecek'
  | 'finale'

const CHAPTER_SHELLS: Record<string, { title: string; subtitle: string; emoji: string; color: string }> = {
  'chapter-sesli': { title: 'Sesli Anılar', subtitle: 'Sesin hâlâ kulağımda', emoji: '🎙', color: '#c264fe' },
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

        {scene === 'chapter-album' && (
          <FloatingAlbum key="album" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-ilk-tanisma' && (
          <IlkTanisma key="ilk-tanisma" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-ilk-mesajlar' && (
          <IlkMesajlar key="ilk-mesajlar" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-mss' && (
          <MssPage key="mss" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-mektuplar' && (
          <LoveLetters key="mektuplar" onBack={() => go('galaxy')} />
        )}

        {scene === 'chapter-timeline' && (
          <ZamanTuneli key="timeline" onBack={() => go('galaxy')} />
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
