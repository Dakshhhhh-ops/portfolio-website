import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

/** Smooth scrolling (and smooth in-page anchor links) while motion is enabled. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 })
    return () => lenis.destroy()
  }, [enabled])
}

/**
 * Scales an element's font-size so its first child spans the element's full width.
 * Used for the giant hero name.
 */
export function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const inner = el?.firstElementChild
    if (!el || !inner) return

    const fit = () => {
      el.style.fontSize = '100px'
      const width = inner.getBoundingClientRect().width
      if (width) el.style.fontSize = `${(100 * el.clientWidth) / width}px`
    }

    fit()
    // Refit once the display font has actually arrived
    document.fonts.load('800 100px "Bricolage Grotesque"').then(fit)
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

/**
 * Click-and-drag scrolling with a little inertia for a horizontally scrollable element.
 * Touch, trackpad and keyboard keep using native scrolling.
 */
export function useDragScroll<T extends HTMLElement>(inertia: boolean, onProgress?: (progress: number) => void) {
  const ref = useRef<T>(null)
  const inertiaRef = useRef(inertia)
  const onProgressRef = useRef(onProgress)

  useEffect(() => {
    inertiaRef.current = inertia
    onProgressRef.current = onProgress
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let down = false
    let startX = 0
    let startLeft = 0
    let lastX = 0
    let velocity = 0
    let raf = 0

    const report = () => {
      const max = el.scrollWidth - el.clientWidth
      onProgressRef.current?.(max > 0 ? el.scrollLeft / max : 1)
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return
      down = true
      cancelAnimationFrame(raf)
      startX = lastX = e.clientX
      startLeft = el.scrollLeft
      velocity = 0
      el.classList.add('is-dragging')
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      velocity = e.clientX - lastX
      lastX = e.clientX
      el.scrollLeft = startLeft - (e.clientX - startX)
    }
    const onUp = () => {
      if (!down) return
      down = false
      el.classList.remove('is-dragging')
      const glide = () => {
        velocity *= 0.94
        el.scrollLeft -= velocity
        if (Math.abs(velocity) > 0.4) raf = requestAnimationFrame(glide)
      }
      if (inertiaRef.current) glide()
    }

    report()
    el.addEventListener('scroll', report, { passive: true })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    window.addEventListener('resize', report)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', report)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      window.removeEventListener('resize', report)
    }
  }, [])

  return ref
}
