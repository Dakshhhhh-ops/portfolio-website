import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react'
import { useMotionPref } from '../context/MotionContext'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

type RevealTag = 'div' | 'p' | 'h2' | 'li' | 'a' | 'dl'
type RevealProps = Omit<HTMLMotionProps<'div'>, 'ref'> & { as?: RevealTag; delay?: number; href?: string }

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ as = 'div', delay = 0, ...props }: RevealProps) {
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      {...props}
    />
  )
}

/** Pulls its child slightly toward the pointer. */
export function Magnetic({ children }: { children: ReactNode }) {
  const { motionOn } = useMotionPref()
  const x = useSpring(0, { stiffness: 220, damping: 16 })
  const y = useSpring(0, { stiffness: 220, damping: 16 })

  const onMouseMove = (e: MouseEvent<HTMLSpanElement>) => {
    if (!motionOn) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span className="magnetic" style={{ x, y }} onMouseMove={onMouseMove} onMouseLeave={reset}>
      {children}
    </motion.span>
  )
}

/** Round label that trails the pointer over any element with a `data-cursor` attribute. */
export function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 })
  const [label, setLabel] = useState<string | null>(null)
  const lastLabel = useRef('')

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = (e: globalThis.MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-cursor]') : null
      setLabel(target?.dataset.cursor ?? null)
    }
    const onLeave = () => setLabel(null)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y])

  // Keep showing the previous label while the circle shrinks away
  if (label) lastLabel.current = label

  return (
    <motion.div className={`cursor${label ? ' is-active' : ''}`} style={{ x: springX, y: springY }} aria-hidden="true">
      <span>{lastLabel.current}</span>
    </motion.div>
  )
}
