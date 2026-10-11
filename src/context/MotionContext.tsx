import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'

type MotionPref = { motionOn: boolean; toggle: () => void }

const MotionContext = createContext<MotionPref>({ motionOn: true, toggle: () => {} })

const STORAGE_KEY = 'motion'

function initialMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

/** Site-wide "pause motion" switch. Starts off when the OS asks for reduced motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [motionOn, setMotionOn] = useState(initialMotion)

  useEffect(() => {
    document.documentElement.classList.toggle('motion-off', !motionOn)
  }, [motionOn])

  const toggle = useCallback(() => {
    setMotionOn((on) => {
      try {
        localStorage.setItem(STORAGE_KEY, on ? 'off' : 'on')
      } catch {
        // storage unavailable — the preference just won't persist
      }
      return !on
    })
  }, [])

  const value = useMemo(() => ({ motionOn, toggle }), [motionOn, toggle])

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionContext.Provider>
  )
}

export const useMotionPref = () => useContext(MotionContext)
