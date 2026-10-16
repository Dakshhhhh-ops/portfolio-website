import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

let lenis: Lenis | null = null

/** Smooth scrolling (and smooth in-page anchor links) while motion is enabled. `locked` freezes the page. */
export function useLenis(enabled: boolean, locked: boolean) {
  useEffect(() => {
    if (!enabled) return
    lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
    return () => {
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', locked)
    if (locked) lenis?.stop()
    else lenis?.start()
  }, [locked, enabled])
}

/**
 * Scales an element's font-size so its first child spans the element's full width.
 * Used for the giant hero name and the contact line.
 */
export function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const inner = el?.firstElementChild as HTMLElement | null
    if (!el || !inner) return

    const fit = () => {
      el.style.fontSize = '100px'
      // offsetWidth ignores transforms, so a scaled-down parent doesn't skew the result
      const width = inner.offsetWidth
      if (width) el.style.fontSize = `${(98 * el.clientWidth) / width}px`
    }

    fit()
    // Refit once the display font has actually arrived
    document.fonts.load('extra-expanded 800 100px Archivo').then(fit)
    document.fonts.addEventListener('loadingdone', fit)
    window.addEventListener('resize', fit)
    return () => {
      document.fonts.removeEventListener('loadingdone', fit)
      window.removeEventListener('resize', fit)
    }
  }, [])

  return ref
}

/** Current HH:MM in the given IANA time zone. */
export function useClock(timeZone: string) {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone })
    const tick = () => setTime(format.format(new Date()))
    tick()
    const id = setInterval(tick, 20_000)
    return () => clearInterval(id)
  }, [timeZone])

  return time
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}
