import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { nav, site } from '../data/content'
import { useReady } from '../context/ReadyContext'
import { EASE_IN_OUT, EASE_OUT, Magnetic, Roll } from './ui'

const menuLinks = [{ label: 'Home', href: '#top' }, ...nav, { label: 'Contact', href: '#contact' }]

export function Header() {
  const ready = useReady()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()

  // Hide on the way down, return on the way up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(latest > previous && latest > 200)
  })

  useEffect(() => {
    document.documentElement.classList.toggle('is-menu-open', open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <header className={`header${hidden && !open ? ' is-hidden' : ''}`}>
        <motion.div
          className="header__inner"
          initial={{ y: '-120%' }}
          animate={ready ? { y: '0%' } : undefined}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.5 }}
        >
          <a className="header__logo" href="#top" aria-label={`${site.fullName}, back to top`}>
            <Roll>{site.name}</Roll>
            <sup>®</sup>
          </a>

          <nav className="header__nav" aria-label="Primary">
            {nav.map((item, i) => (
              <a key={item.href} href={item.href}>
                <small>0{i + 1}</small>
                <Roll>{item.label}</Roll>
              </a>
            ))}
          </nav>

          <div className="header__end">
            <Magnetic>
              <a className="btn btn--small header__cta" href="#contact">
                <i className="dot" />
                <Roll>Let's talk</Roll>
              </a>
            </Magnetic>
            <button
              className={`header__burger${open ? ' is-open' : ''}`}
              type="button"
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
              <i />
              <i />
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            id="menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <nav aria-label="Mobile">
              {menuLinks.map((item, i) => (
                <div className="menu__item" key={item.href}>
                  <motion.a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.25 + i * 0.06 }}
                  >
                    <small>0{i + 1}</small>
                    {item.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <div className="menu__foot label">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
