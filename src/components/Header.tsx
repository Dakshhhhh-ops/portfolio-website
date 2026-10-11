import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { nav, site } from '../data/content'
import { useClock } from '../hooks'
import { EASE_OUT, Magnetic } from './ui'

const menuLinks = [{ label: 'Home', href: '#top' }, ...nav, { label: 'Contact', href: '#contact' }]

export function Header() {
  const time = useClock(site.timeZone)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  // Hide on the way down, return on the way up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(latest > previous && latest > 200)
  })

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`header${hidden && !open ? ' is-hidden' : ''}`}>
        <a className="header__logo" href="#top" aria-label={`${site.name}, back to top`}>
          {site.name}
          <span>®</span>
        </a>
        <p className="header__meta">
          {time} · {site.location}
        </p>
        <nav className="header__nav" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <Magnetic>
            <a className="btn btn--small" href="#contact">
              Get in touch
            </a>
          </Magnetic>
        </nav>
        <button
          className="header__burger"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <i />
          <i />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            id="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile">
              {menuLinks.map((item, i) => (
                <div className="menu__item" key={item.href}>
                  <motion.a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.05 + i * 0.05 }}
                  >
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    {item.label}
                  </motion.a>
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
