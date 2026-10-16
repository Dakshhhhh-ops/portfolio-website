import { useRef, type CSSProperties } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useMotionPref } from '../context/MotionContext'
import type { Colors } from '../data/content'

type MockKind = 'browser' | 'phone'

type VisualProps = {
  colors: Colors
  mock?: MockKind
  /** Large word set behind (or instead of) the mock */
  word?: string
  /** Swap the order of the mock's skeleton blocks, for variety */
  flip?: boolean
  /** Drift the layers against the scroll */
  parallax?: boolean
  image?: { src: string; alt: string }
  /** Draw a terminal session instead of the skeleton mock */
  terminal?: string[]
}

/**
 * Project artwork. Shows `image` when given; otherwise draws a CSS placeholder
 * (gradient, grid, and a terminal or browser/phone mock) from the project's colours.
 */
export function Visual({ colors, mock, word, flip, parallax = false, image, terminal }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { motionOn } = useMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const active = parallax && motionOn
  const mockY = useTransform(scrollYProgress, (v) => (active ? (0.5 - v) * 90 : 0))
  const wordY = useTransform(scrollYProgress, (v) => (active ? (v - 0.5) * 90 : 0))
  const imageScale = useTransform(scrollYProgress, (v) => (active ? 1.12 - v * 0.12 : 1))

  const style = { '--c1': colors.c1, '--c2': colors.c2, '--ink': colors.ink } as CSSProperties

  return (
    <div className="visual" ref={ref} style={style}>
      {image ? (
        <motion.img src={image.src} alt={image.alt} loading="lazy" style={{ scale: imageScale }} />
      ) : (
        <>
          {word && (
            <motion.span className="visual__word" style={{ y: wordY }}>
              {word}
            </motion.span>
          )}
          {terminal ? (
            <Terminal lines={terminal} y={mockY} />
          ) : (
            mock && <Mock kind={mock} flip={flip} y={mockY} />
          )}
        </>
      )}
    </div>
  )
}

const KIND: Record<string, string> = { $: 'in', '>': 'in', '+': 'ok', '!': 'warn', '-': 'dim' }

/** A terminal window whose lines print one after another when it scrolls into view. */
function Terminal({ lines, y }: { lines: string[]; y: MotionValue<number> }) {
  return (
    <motion.div className="term" style={{ y }} aria-hidden="true">
      <div className="mock__bar">
        <i />
        <i />
        <i />
        <span>zsh — 80×24</span>
      </div>
      <motion.ol
        className="term__body"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        transition={{ staggerChildren: 0.32, delayChildren: 0.5 }}
      >
        {lines.map((line, i) => {
          const kind = KIND[line[0]] ?? 'dim'
          const text = KIND[line[0]] ? line.slice(1).trimStart() : line
          return (
            <motion.li
              key={i}
              className={`term__line is-${kind}`}
              variants={{ hidden: { opacity: 0, x: -8 }, shown: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.35 }}
            >
              <b>{kind === 'in' ? line[0] : kind === 'ok' ? '✓' : kind === 'warn' ? '✗' : '·'}</b>
              {text}
            </motion.li>
          )
        })}
        <motion.li className="term__line is-in" variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}>
          <b>$</b>
          <i className="term__caret" />
        </motion.li>
      </motion.ol>
    </motion.div>
  )
}

function Mock({ kind, flip, y }: { kind: MockKind; flip?: boolean; y: MotionValue<number> }) {
  const phone = kind === 'phone'
  const grid = (
    <div className="mock__grid">
      {Array.from({ length: phone ? 2 : 3 }, (_, i) => (
        <u key={i} />
      ))}
    </div>
  )

  return (
    <motion.div className={`mock${phone ? ' mock--phone' : ''}`} style={{ y, rotate: phone ? 5 : -3 }}>
      {!phone && (
        <div className="mock__bar">
          <i />
          <i />
          <i />
        </div>
      )}
      <div className="mock__body">
        {flip && grid}
        <b />
        <b />
        <b />
        {!flip && grid}
      </div>
    </motion.div>
  )
}
