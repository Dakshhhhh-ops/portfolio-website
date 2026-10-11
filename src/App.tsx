import { MotionProvider, useMotionPref } from './context/MotionContext'
import { useLenis } from './hooks'
import { Header } from './components/Header'
import { About, Contact, Footer, Hero, Marquee, Services, UpClose, Work } from './components/sections'
import { Cursor } from './components/ui'

function Page() {
  const { motionOn } = useMotionPref()
  useLenis(motionOn)

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Work />
        <UpClose />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <Page />
    </MotionProvider>
  )
}
