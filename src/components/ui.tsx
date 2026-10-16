import { useEffect, useRef, useState, type ElementType, type MouseEvent, type ReactNode } from 'react'
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type HTMLMotionProps,
} from 'motion/react'
import { useMotionPref } from '../context/MotionContext'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const

type RevealTag = 'div' | 'p' | 'h2' | 'h3' | 'li' | 'article' | 'dl' | 'ul'
type RevealProps = Omit<HTMLMotionProps<'div'>, 'ref'> & { as?: RevealTag; delay?: number }

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ as = 'div', delay = 0, ...props }: RevealProps) {
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
      {...props}
    />
  )
}

type SplitProps = {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  /** Play when this turns true; without it, plays on scroll into view */
  play?: boolean
}

/**
 * Words rise out of a mask one after another. `*wrapped*` words are set in the italic serif.
 * Screen readers get the plain sentence.
 */
export function SplitWords({ text, as: Tag = 'span', className, delay = 0, stagger = 0.05, play }: SplitProps) {
  const words = parseEmphasis(text)
  const trigger =
    play === undefined
      ? { whileInView: { y: '0%', rotate: 0 }, viewport: { once: true, margin: '0px 0px -10% 0px' } }
      : { animate: play ? { y: '0%', rotate: 0 } : undefined }

  return (
    <Tag className={className}>
      <span className="sr-only">{words.map((w) => w.word).join(' ')}</span>
      <span aria-hidden="true">
        {words.map(({ word, em }, i) => (
          <span className="mask" key={i}>
            <motion.span
              className={em ? 'em' : undefined}
              initial={{ y: '110%', rotate: 4 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: delay + i * stagger }}
              {...trigger}
            >
              {word}
            </motion.span>
          </span>
        )).flatMap((el, i) => (i ? [' ', el] : [el]))}
      </span>
    </Tag>
  )
}

/** Splits a sentence into words, flagging the ones inside `*asterisks*`. */
export function parseEmphasis(text: string) {
  let inside = false
  return text.split(/\s+/).map((raw) => {
    const opens = raw.startsWith('*')
    const closes = raw.endsWith('*') && (raw.length > 1 || !opens)
    if (opens) inside = true
    const em = inside
    if (closes) inside = false
    return { word: raw.replace(/\*/g, ''), em }
  })
}

/** Pulls its child slightly toward the pointer. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const { motionOn } = useMotionPref()
  const x = useSpring(0, { stiffness: 200, damping: 14, mass: 0.6 })
  const y = useSpring(0, { stiffness: 200, damping: 14, mass: 0.6 })

  const onMouseMove = (e: MouseEvent<HTMLSpanElement>) => {
    if (!motionOn) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength * 1.3)
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

/**
 * Trailing ring that follows the pointer. It tightens into a dot over links
 * and grows into a labelled disc over anything with a `data-cursor` attribute.
 */
export function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })
  const [state, setState] = useState<{ mode: 'idle' | 'link' | 'label' | 'hidden'; label: string }>({
    mode: 'hidden',
    label: '',
  })
  const current = useRef(state)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const set = (mode: typeof state.mode, label = current.current.label) => {
      if (current.current.mode === mode && current.current.label === label) return
      current.current = { mode, label }
      setState(current.current)
    }
    const onMove = (e: globalThis.MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target instanceof Element ? e.target : null
      const labelled = el?.closest<HTMLElement>('[data-cursor]')
      if (labelled) return set('label', labelled.dataset.cursor ?? '')
      if (el?.closest('a, button, [role="button"]')) return set('link')
      set('idle')
    }
    const onLeave = () => set('hidden')
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y])

  return (
    <motion.div className={`cursor is-${state.mode}`} style={{ x: springX, y: springY }} aria-hidden="true">
      <span>{state.label}</span>
    </motion.div>
  )
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>_'
const running = new WeakMap<HTMLElement, number>()

/** Scrambles an element's text into `to`, resolving left to right. */
export function scrambleTo(el: HTMLElement, to: string, duration = 650) {
  cancelAnimationFrame(running.get(el) ?? 0)
  const start = performance.now()
  const frame = (now: number) => {
    const p = Math.min(1, (now - start) / duration)
    let out = ''
    for (let i = 0; i < to.length; i++) {
      if (to[i] === ' ' || p >= 0.25 + (i / to.length) * 0.75) out += to[i]
      else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    }
    el.textContent = out
    if (p < 1) running.set(el, requestAnimationFrame(frame))
  }
  running.set(el, requestAnimationFrame(frame))
}

/** Text that scrambles whenever its parent link or button is hovered. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { motionOn } = useMotionPref()

  useEffect(() => {
    const el = ref.current
    const host = el?.closest<HTMLElement>('a, button') ?? el
    if (!el || !host || !motionOn) return
    const run = () => scrambleTo(el, text)
    host.addEventListener('pointerenter', run)
    return () => host.removeEventListener('pointerenter', run)
  }, [text, motionOn])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}

/** Label that rolls up to an identical copy of itself on hover. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  )
}

/** Counts the number inside a stat like "200+" or "Top 10" up from zero once it's on screen. */
export function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const { motionOn } = useMotionPref()
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/)

  useEffect(() => {
    const el = ref.current
    if (!el || !match || !inView || !motionOn) return
    const [, prefix, digits, suffix] = match
    const target = parseFloat(digits.replace(/,/g, ''))
    const decimals = (digits.split('.')[1] ?? '').length
    const format = (v: number) =>
      prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
    const controls = animate(0, target, {
      duration: 2,
      ease: EASE_OUT,
      onUpdate: (v) => (el.textContent = format(v)),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, motionOn, value])

  return <span ref={ref}>{value}</span>
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/** Endless marquee that speeds up, skews and flips direction with the scroll. */
export function VelocityMarquee({ children, speed = 3 }: { children: ReactNode; speed?: number }) {
  const { motionOn } = useMotionPref()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const skew = useTransform(velocity, [-2500, 2500], [10, -10])
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (!motionOn) return
    const f = factor.get()
    if (f < 0) direction.current = 1
    else if (f > 0) direction.current = -1
    let move = direction.current * speed * (delta / 1000)
    move += move * Math.abs(f)
    baseX.set(baseX.get() + move)
  })

  return (
    <div className="vmarquee" aria-hidden="true">
      <motion.div className="vmarquee__track" style={{ x, skewX: motionOn ? skew : 0 }}>
        <div className="vmarquee__set">{children}</div>
        <div className="vmarquee__set">{children}</div>
      </motion.div>
    </div>
  )
}

/** Small numbered section label, e.g. "(02) Selected work". */
export function Eyebrow({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="label eyebrow">
      <span>({n})</span>
      {children}
    </p>
  )
}
