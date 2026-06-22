'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'

const FriendsLanding   = dynamic(() => import('./friends/FriendsLanding'),   { ssr: false })
const ConstellationNav = dynamic(() => import('./friends/ConstellationNav'), { ssr: false })
const FriendWorld      = dynamic(() => import('./friends/FriendWorld'),      { ssr: false })
const WhoAreYou        = dynamic(() => import('./friends/WhoAreYou'),        { ssr: false })
const TogetherSection  = dynamic(() => import('./friends/TogetherSection'),  { ssr: false })
const FinalClimax      = dynamic(() => import('./friends/FinalClimax'),      { ssr: false })

export type FriendsScene =
  | 'landing'
  | 'constellation'
  | 'seda'
  | 'ilayda'
  | 'cemile'
  | 'together'
  | 'who-are-you'
  | 'climax'

export default function FriendsUniverse({ onBack }: { onBack: () => void }) {
  const [scene, setScene] = useState<FriendsScene>('landing')
  const go = useCallback((s: FriendsScene) => setScene(s), [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {scene === 'landing' && (
          <FriendsLanding key="fl" onEnter={() => go('constellation')} onBack={onBack} />
        )}
        {scene === 'constellation' && (
          <ConstellationNav
            key="cn"
            onSelect={id => go(id as FriendsScene)}
            onBack={onBack}
            onTogether={() => go('together')}
            onWhoAreYou={() => go('who-are-you')}
          />
        )}
        {(scene === 'seda' || scene === 'ilayda' || scene === 'cemile') && (
          <FriendWorld key={scene} friend={scene} onBack={() => go('constellation')} onWhoAreYou={() => go('who-are-you')} />
        )}
        {scene === 'who-are-you' && (
          <WhoAreYou key="way" onBack={() => go('constellation')} onTogether={() => go('together')} />
        )}
        {scene === 'together' && (
          <TogetherSection key="tog" onBack={() => go('constellation')} onClimax={() => go('climax')} />
        )}
        {scene === 'climax' && (
          <FinalClimax key="cli" onBack={() => go('constellation')} />
        )}
      </AnimatePresence>
    </div>
  )
}
