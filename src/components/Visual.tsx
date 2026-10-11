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
}

/**
 * Project artwork. Shows `image` when given; otherwise draws a CSS placeholder
 * (gradient, grid, and a browser/phone mock) from the project's colours.
 */
export function Visual({ colors, mock, word, flip, parallax = false, image }: VisualProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { motionOn } = useMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const active = parallax && motionOn
  const mockY = useTransform(scrollYProgress, (v) => (active ? (0.5 - v) * 110 : 0))
  const wordY = useTransform(scrollYProgress, (v) => (active ? (v - 0.5) * 90 : 0))

  const style = { '--c1': colors.c1, '--c2': colors.c2, '--ink': colors.ink } as CSSProperties

  return (
    <div className="visual" ref={ref} style={style}>
      {image ? (
        <img src={image.src} alt={image.alt} loading="lazy" />
      ) : (
        <>
          {word && (
            <motion.span className="visual__word" style={{ y: wordY }}>
              {word}
            </motion.span>
          )}
          {mock && <Mock kind={mock} flip={flip} y={mockY} />}
        </>
      )}
    </div>
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
