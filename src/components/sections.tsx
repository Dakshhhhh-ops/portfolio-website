import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react'
import { useMotionPref } from '../context/MotionContext'
import { useReady } from '../context/ReadyContext'
import { archive, highlights, nav, projects, roles, site, toolkit, type Project } from '../data/content'
import { useClock, useFitText, useMediaQuery } from '../hooks'
import {
  Counter,
  EASE_OUT,
  Eyebrow,
  Magnetic,
  Reveal,
  Roll,
  Scramble,
  SplitWords,
  VelocityMarquee,
  parseEmphasis,
  scrambleTo,
} from './ui'
import { Shader } from './Shader'
import { Visual } from './Visual'

const pad = (n: number) => String(n).padStart(2, '0')
const external = { target: '_blank', rel: 'noopener noreferrer' }

/* ---------- Hero ---------- */

function FocusCycle() {
  const ref = useRef<HTMLSpanElement>(null)
  const { motionOn } = useMotionPref()

  useEffect(() => {
    if (!motionOn) return
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % site.focus.length
      if (ref.current) scrambleTo(ref.current, site.focus[i], 900)
    }, 2600)
    return () => clearInterval(id)
  }, [motionOn])

  return (
    <span className="hero__focus" ref={ref} aria-live="off">
      {site.focus[0]}
    </span>
  )
}

export function Hero() {
  const ready = useReady()
  const { motionOn, toggle } = useMotionPref()
  const time = useClock(site.timeZone)
  const ref = useRef<HTMLElement>(null)
  const nameRef = useFitText<HTMLHeadingElement>()
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [covered, setCovered] = useState(false)

  // Letters near the pointer squeeze and thin out along the variable font's width and weight axes
  useEffect(() => {
    if (!motionOn || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let raf = 0
    let mx = -1e4
    let my = -1e4
    const update = () => {
      for (const el of letterRefs.current) {
        if (!el) continue
        const r = el.getBoundingClientRect()
        const dx = (mx - (r.left + r.width / 2)) / r.width
        const dy = (my - (r.top + r.height / 2)) / (r.height * 1.4)
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / 1.5)
        el.style.fontStretch = `${125 - f * 60}%`
        el.style.fontWeight = String(Math.round(800 - f * 550))
      }
    }
    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      for (const el of letterRefs.current) el?.removeAttribute('style')
    }
  }, [motionOn])

  // As the next section slides over, the hero sinks back into a rounded card.
  // Progress is read from the page scroll directly: the hero is sticky, so its own offset never changes.
  const { scrollY } = useScroll()
  const scrollYProgress = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / window.innerHeight)))
  const scale = useTransform(scrollYProgress, [0, 1], [1, motionOn ? 0.88 : 1])
  const radius = useTransform(scrollYProgress, [0, 0.4], [0, motionOn ? 28 : 0])
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.7])
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', motionOn ? '40%' : '0%'])
  useMotionValueEvent(scrollYProgress, 'change', (v) => setCovered(v >= 1))

  const intro = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE_OUT, delay },
  })

  return (
    <section className={`hero${covered ? ' is-covered' : ''}`} id="top" ref={ref}>
      <motion.div className="hero__frame" style={{ scale, borderRadius: radius }}>
        <Shader className="hero__canvas" />
        <motion.div className="hero__shade" style={{ opacity: shade }} />

        <div className="hero__grid label">
          <motion.p {...intro(0.6)}>
            <span className="muted">({site.fullName})</span>
            <br />
            {site.role}
          </motion.p>
          <motion.p {...intro(0.68)}>
            <span className="muted">(Focus)</span>
            <br />
            <FocusCycle />
          </motion.p>
          <motion.p {...intro(0.76)}>
            <span className="muted">({site.location})</span>
            <br />
            {time} {site.timeZoneLabel}
          </motion.p>
          <motion.p className="hero__status" {...intro(0.84)}>
            <span className="status">
              <i />
              {site.status}
            </span>
            <br />
            <button className="textbtn" type="button" aria-pressed={!motionOn} onClick={toggle}>
              ({motionOn ? 'Pause' : 'Play'} motion)
            </button>
          </motion.p>
        </div>

        <div className="hero__middle">
          <SplitWords as="p" className="hero__intro" text={site.intro} play={ready} delay={0.45} stagger={0.04} />
          <motion.a className="hero__scroll label" href="#work" {...intro(1)}>
            <span className="hero__scroll-line" />
            Scroll to explore
          </motion.a>
        </div>

        <motion.h1
          className="hero__name"
          ref={nameRef}
          style={{ y: nameY }}
          aria-label={`${site.fullName}, ${site.role}`}
        >
          <span className="hero__name-inner" aria-hidden="true">
            {[...site.name].map((letter, i) => (
              <span className="mask" key={i} ref={(el) => void (letterRefs.current[i] = el)}>
                <motion.span
                  initial={{ y: '105%' }}
                  animate={ready ? { y: '0%' } : undefined}
                  transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.1 + i * 0.07 }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </span>
        </motion.h1>
      </motion.div>
    </section>
  )
}

/* ---------- Statement ---------- */

function LitWord({ children, em, progress, range }: { children: string; em: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span className={em ? 'em' : undefined} style={{ opacity }}>
      {children}
    </motion.span>
  )
}

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = parseEmphasis(site.statement)

  return (
    <section className="panel statement">
      <div className="statement__head">
        <Eyebrow n="01">Intro</Eyebrow>
        <Reveal as="ul" className="tags" aria-label="Focus areas">
          {site.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </Reveal>
      </div>
      <p className="statement__text" ref={ref}>
        {words.map(({ word, em }, i) => (
          <Fragment key={i}>
            <LitWord em={em} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </LitWord>{' '}
          </Fragment>
        ))}
      </p>

      <VelocityMarquee>
        {site.marquee.map((item, i) => (
          <Fragment key={item}>
            <span className={i % 2 ? 'is-outline' : undefined}>{item}</span>
            <i>✳</i>
          </Fragment>
        ))}
      </VelocityMarquee>
    </section>
  )
}

/* ---------- Selected work (stacking cards) ---------- */

export function Work() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section className="panel work" id="work">
      <header className="section-head">
        <Eyebrow n="02">Selected work</Eyebrow>
        <SplitWords as="h2" className="display" text="Things I've *built*" />
        <Reveal as="p" className="section-head__note">
          {pad(projects.length)} featured builds across agentic AI, cloud, security, retrieval and MLOps. Each one shipped and
          open source, and several are live.
        </Reveal>
      </header>

      <div className="stack" ref={ref}>
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index, progress }: { project: Project; index: number; progress: MotionValue<number> }) {
  const { motionOn } = useMotionPref()
  // Cards only stack (and so only shrink and dim) on wider screens
  const stacked = useMediaQuery('(min-width: 901px)') && motionOn
  const total = projects.length
  const steps = Math.max(1, total - 1)
  const last = index === total - 1
  // Card i settles at progress i / steps; from there it shrinks and dims as the next ones stack on top
  const scale = useTransform(progress, [Math.min(index / steps, 0.99), 1], [1, stacked ? 1 - (total - 1 - index) * 0.05 : 1])
  const dim = useTransform(progress, [Math.min(index / steps, 0.99), Math.min((index + 1) / steps, 1)], [0, last || !stacked ? 0 : 0.6])
  const primary = project.links[0]

  return (
    <div className="stack__item" style={{ '--i': index } as CSSProperties}>
      <motion.article className="card" style={{ scale }}>
        <motion.div className="card__dim" style={{ opacity: dim }} aria-hidden="true" />
        <div className="card__top label">
          <span>
            ({pad(index + 1)} / {pad(total)})
          </span>
          <span>{project.context ?? project.kind}</span>
          <span className="card__stack-count">{project.stack.length} technologies</span>
        </div>

        <div className="card__body">
          <div className="card__info">
            <h3 className="card__title">{project.title}</h3>
            <p className="card__kind">{project.kind}</p>
            <p className="card__desc">{project.description}</p>

            {project.metrics && (
              <dl className="metrics">
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dd>{metric.value}</dd>
                    <dt className="label">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            <ul className="chips" aria-label="Built with">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>

            <div className="card__links">
              {project.links.map((link, i) => (
                <Magnetic key={link.label} strength={0.2}>
                  <a className={`btn btn--small${i === 0 ? ' btn--fill' : ''}`} href={link.href} {...external}>
                    <Roll>{link.label}</Roll>
                    <span aria-hidden="true">↗</span>
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <motion.a
            className="card__media"
            href={primary.href}
            {...external}
            data-cursor={primary.label === 'Live demo' ? 'Open ↗' : 'Code ↗'}
            aria-label={`${project.title} — ${primary.label}`}
            initial={{ clipPath: 'inset(100% 0% 0% 0% round 14px)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 14px)' }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
          >
            <Visual
              colors={project.colors}
              mock={project.mock}
              word={project.word ?? project.title}
              flip={index % 2 === 1}
              image={project.image}
              terminal={project.terminal}
              parallax
            />
          </motion.a>
        </div>
      </motion.article>
    </div>
  )
}

/* ---------- More work (index list with a cursor-following preview) ---------- */

export function Archive() {
  const { motionOn } = useMotionPref()
  const [active, setActive] = useState<number | null>(null)
  const x = useSpring(0, { stiffness: 160, damping: 22, mass: 0.6 })
  const y = useSpring(0, { stiffness: 160, damping: 22, mass: 0.6 })
  // The preview leans into the direction it is being dragged
  const rotate = useTransform(useVelocity(x), [-2000, 2000], motionOn ? [-14, 14] : [0, 0])
  const shown = active !== null

  const onMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse') return
    x.set(e.clientX)
    y.set(e.clientY)
  }

  return (
    <section className="panel archive" aria-labelledby="archive-title">
      <header className="archive__head">
        <Eyebrow n="03">More work</Eyebrow>
        <h2 className="label muted" id="archive-title">
          Smaller builds and experiments · {pad(archive.length)}
        </h2>
      </header>

      <ul className="archive__list" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
        {archive.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 0.05}>
            <a
              className={`archive__row${active === i ? ' is-active' : ''}`}
              href={item.href}
              {...external}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className="label archive__n">({pad(i + 1)})</span>
              <h3 className="archive__title">{item.title}</h3>
              <p className="archive__kind">{item.kind}</p>
              <span className="label archive__stack">{item.stack.join(' · ')}</span>
              <span className="archive__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </Reveal>
        ))}
      </ul>

      <motion.div
        className="archive__preview"
        style={{ x, y, rotate }}
        initial={false}
        animate={{ scale: shown ? 1 : 0.3, opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        aria-hidden="true"
      >
        <div className="archive__reel" style={{ transform: `translateY(${-(active ?? 0) * 100}%)` }}>
          {archive.map((item) => (
            <div className="archive__slide" key={item.title}>
              {item.image ? (
                <img src={item.image.src} alt="" loading="lazy" />
              ) : (
                <Visual colors={item.colors} word={item.title} />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

/* ---------- Highlights (pinned horizontal scroll) ---------- */

export function Highlights() {
  const { motionOn } = useMotionPref()
  const wide = useMediaQuery('(min-width: 900px)')
  const pinned = wide && motionOn
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!pinned || !track) return
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => (pinned ? -v * distance : 0))

  return (
    <section
      className={`panel highlights${pinned ? ' is-pinned' : ''}`}
      id="highlights"
      ref={sectionRef}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      aria-labelledby="highlights-title"
    >
      <div className="highlights__sticky">
        <motion.div className="highlights__track" ref={trackRef} style={{ x }}>
          <div className="highlights__intro">
            <Eyebrow n="04">Highlights</Eyebrow>
            <h2 className="display" id="highlights-title">
              Proof, <em>not promises.</em>
            </h2>
            <p className="highlights__note">
              Hackathon wins, ranks and numbers from the last two years.{' '}
              <span className="label">{pinned ? 'Keep scrolling →' : 'Swipe →'}</span>
            </p>
          </div>

          {highlights.map((item, i) => (
            <article
              className="hl"
              key={item.title}
              style={{ '--c1': item.colors.c1, '--c2': item.colors.c2, '--ink': item.colors.ink } as CSSProperties}
            >
              <div className="hl__top label">
                <span>({pad(i + 1)})</span>
                <span>✳</span>
              </div>
              <p className="hl__stat">
                <Counter value={item.stat} />
              </p>
              <div className="hl__text">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="highlights__progress" aria-hidden="true">
          <motion.i style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  )
}

/* ---------- About ---------- */

export function About() {
  return (
    <section className="panel about" id="about">
      <header className="section-head">
        <Eyebrow n="05">Background</Eyebrow>
        <SplitWords as="h2" className="display display--md" text={site.about.title} />
      </header>

      <div className="about__grid">
        <Reveal as="dl" className="facts">
          {site.about.facts.map((fact, i) => (
            <div key={fact.label}>
              <dt className="label">
                ({pad(i + 1)}) {fact.label}
              </dt>
              <dd>{fact.text}</dd>
            </div>
          ))}
        </Reveal>

        <div className="roles">
          <Reveal as="h3" className="label">
            Leadership
          </Reveal>
          <ul>
            {roles.map((role, i) => (
              <Reveal as="li" className="role" key={role.title} delay={i * 0.1}>
                <div className="role__head">
                  <h4>{role.title}</h4>
                  <span className="label">{role.period}</span>
                </div>
                <p className="role__org">{role.org}</p>
                <p className="role__desc">{role.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- Toolkit ---------- */

export function Toolkit() {
  return (
    <section className="panel toolkit" id="toolkit">
      <header className="section-head">
        <Eyebrow n="06">Toolkit</Eyebrow>
        <SplitWords as="h2" className="display" text="What I *work with*" />
      </header>
      <ol className="tk">
        {toolkit.map((item, i) => (
          <Reveal as="li" className="tk__row" key={item.title} delay={i * 0.05}>
            <span className="label tk__n">({pad(i + 1)})</span>
            <h3 className="tk__title">{item.title}</h3>
            <p className="tk__desc">{item.description}</p>
            <span className="tk__arrow" aria-hidden="true">
              ↗
            </span>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ---------- Contact / footer (revealed from underneath the page) ---------- */

export function Footer() {
  const time = useClock(site.timeZone)
  const lineRef = useFitText<HTMLAnchorElement>()
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <div className="footer-wrap" id="contact">
      <footer className="footer">
        <div className="footer__top">
          <Eyebrow n="07">Contact</Eyebrow>
          <p className="footer__note">{site.contactNote}</p>
        </div>

        <a className="footer__line" href={`mailto:${site.email}`} ref={lineRef} data-cursor="Say hi ✳">
          <span>
            Let's talk<em>↗</em>
          </span>
        </a>

        <div className="footer__row">
          <Magnetic>
            <button className="btn btn--fill btn--big" type="button" onClick={copyEmail} aria-live="polite">
              {copied ? 'Copied to clipboard ✓' : site.email}
            </button>
          </Magnetic>

          <div className="footer__cols">
            <div>
              <p className="label muted">Elsewhere</p>
              <ul>
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a className="link" href={social.href} {...external}>
                      <Scramble text={social.label} /> <span>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label muted">Sitemap</p>
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <a className="link" href={item.href}>
                      <Scramble text={item.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label muted">Local time</p>
              <p className="footer__time">
                {time} {site.timeZoneLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="footer__base label">
          <span>
            © {new Date().getFullYear()} {site.fullName}
          </span>
          <span className="muted">Designed & built from scratch — React, WebGL, Motion</span>
          <a href="#top">
            <Roll>Back to top ↑</Roll>
          </a>
        </div>
      </footer>
    </div>
  )
}
