'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SECTIONS = [
  { id: 'hub',        label: 'Evren'      },
  { id: 'friends',    label: 'Arkadaşlar' },
  { id: 'our-story',  label: 'Hikayemiz'  },
  { id: 'who-you-are',label: 'Sen'        },
  { id: 'stars',      label: 'Yıldızlar'  },
  { id: 'vault',      label: 'Kasam'      },
  { id: 'letters',    label: 'Mektuplar'  },
  { id: 'final',      label: 'Son'        },
]

export default function NavigationDots() {
  const [active, setActive] = useState('hub')

  useEffect(() => {
    const obs = SECTIONS.map(s => {
      const el = document.getElementById(s.id)
      if (!el) return null
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(s.id) },
        { threshold: .35 }
      )
      o.observe(el)
      return o
    })
    return () => obs.forEach(o => o?.disconnect())
  }, [])

  return (
    <nav
      aria-label="Bölüm navigasyonu"
      style={{
        position: 'fixed', right: '1.2rem', top: '50%', transform: 'translateY(-50%)',
        zIndex: 40, display: 'flex', flexDirection: 'column', gap: '.75rem',
      }}
    >
      {SECTIONS.map(s => {
        const isActive = active === s.id
        return (
          <motion.button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
            title={s.label}
            whileHover={{ scale: 1.3 }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '.5rem',
              padding: 0,
            }}
          >
            <motion.span
              initial={{ opacity: 0, x: 6 }}
              whileHover={{ opacity: 1, x: 0 }}
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase',
                color: 'rgba(255,194,209,.5)', whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </motion.span>
            <motion.div
              animate={{
                width:      isActive ? 10 : 6,
                height:     isActive ? 10 : 6,
                background: isActive ? '#FF4D88' : 'rgba(255,255,255,.28)',
                boxShadow:  isActive ? '0 0 12px rgba(255,77,136,.8)' : 'none',
              }}
              transition={{ duration: .25 }}
              style={{ borderRadius: '50%', flexShrink: 0 }}
            />
          </motion.button>
        )
      })}
    </nav>
  )
}
