import { useEffect, useRef, useState } from 'react'
import { animate, motion } from 'motion/react'
import { site } from '../data/content'
import { EASE_IN_OUT, EASE_OUT } from './ui'

const STEPS = ['Booting', 'Provisioning', 'Securing', 'Shipping']

/** Counts to 100, then lifts away like a curtain. Rendered inside AnimatePresence by the app. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    let finish = 0
    const controls = animate(0, 100, {
      duration: 2.2,
      ease: [0.7, 0, 0.3, 1],
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, '0')
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`
        setStep(Math.min(STEPS.length - 1, Math.floor((v / 100) * STEPS.length)))
      },
      onComplete: () => {
        finish = window.setTimeout(onDone, 250)
      },
    })
    return () => {
      controls.stop()
      clearTimeout(finish)
    }
  }, [onDone])

  return (
    <motion.div
      className="preloader"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 1.1, ease: EASE_IN_OUT }}
      aria-hidden="true"
    >
      <div className="preloader__top label">
        <span>{site.fullName}</span>
        <span>Portfolio ©{new Date().getFullYear()}</span>
      </div>

      <div className="preloader__name">
        {[...site.name].map((letter, i) => (
          <span className="mask" key={i}>
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </div>

      <div className="preloader__bottom">
        <span className="preloader__count" ref={countRef}>
          000
        </span>
        <span className="label preloader__step">
          {STEPS[step]}
          <i>_</i>
        </span>
      </div>
      <div className="preloader__bar">
        <i ref={barRef} />
      </div>
    </motion.div>
  )
}
