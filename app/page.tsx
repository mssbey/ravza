'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'

const CustomCursor  = dynamic(() => import('@/components/CustomCursor'),  { ssr: false })
const Landing       = dynamic(() => import('@/components/Landing'),       { ssr: false })
const MainHub       = dynamic(() => import('@/components/MainHub'),       { ssr: false })
const LoginGate     = dynamic(() => import('@/components/LoginGate'),     { ssr: false })
const BizUniverse   = dynamic(() => import('@/components/BizUniverse'),   { ssr: false })
const FriendsUniverse = dynamic(() => import('@/components/FriendsUniverse'), { ssr: false })

export type Scene =
  | 'landing'
  | 'hub'
  | 'login-biz'
  | 'login-friends'
  | 'album-biz'
  | 'album-friends'

export default function Home() {
  const [scene, setScene] = useState<Scene>('landing')

  return (
    <main style={{ background: '#050505', color: '#fff', overflowX: 'hidden', minHeight: '100vh' }}>
      <CustomCursor />

      <AnimatePresence mode="wait">
        {scene === 'landing' && (
          <Landing key="landing" onEnter={() => setScene('hub')} />
        )}

        {scene === 'hub' && (
          <MainHub
            key="hub"
            onSelectBiz={() => setScene('album-biz')}
            onSelectFriends={() => setScene('album-friends')}
          />
        )}

        {scene === 'login-biz' && (
          <LoginGate
            key="login-biz"
            section="biz"
            onSuccess={() => setScene('album-biz')}
            onBack={() => setScene('hub')}
          />
        )}

        {scene === 'login-friends' && (
          <LoginGate
            key="login-friends"
            section="friends"
            onSuccess={() => setScene('album-friends')}
            onBack={() => setScene('hub')}
          />
        )}

        {scene === 'album-biz' && (
          <BizUniverse key="album-biz" onBack={() => setScene('hub')} />
        )}

        {scene === 'album-friends' && (
          <FriendsUniverse key="album-friends" onBack={() => setScene('hub')} />
        )}
      </AnimatePresence>
    </main>
  )
}
