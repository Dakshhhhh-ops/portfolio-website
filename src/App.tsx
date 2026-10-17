import { useCallback, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { MotionProvider, useMotionPref } from './context/MotionContext'
import { ReadyContext } from './context/ReadyContext'
import { useLenis } from './hooks'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { About, Archive, Footer, Hero, Highlights, Statement, Toolkit, Work } from './components/sections'
import { Cursor } from './components/ui'

const SEEN_KEY = 'preloaded'

/** The preloader plays once per browser session, and never when motion is off. */
function shouldPreload(motionOn: boolean) {
  if (!motionOn) return false
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

function Page() {
  const { motionOn } = useMotionPref()
  const [loading, setLoading] = useState(() => shouldPreload(motionOn))
  useLenis(motionOn, loading)

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // storage unavailable — the preloader will just play again next visit
    }
    setLoading(false)
  }, [])

  return (
    <ReadyContext.Provider value={!loading}>
      <AnimatePresence>{loading && <Preloader key="preloader" onDone={finish} />}</AnimatePresence>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <div className="content">
          <Statement />
          <Work />
          <Archive />
          <Highlights />
          <About />
          <Toolkit />
        </div>
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </ReadyContext.Provider>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <Page />
    </MotionProvider>
  )
}
