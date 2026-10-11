import { Fragment, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useMotionPref } from '../context/MotionContext'
import { closeUps, nav, projects, services, site } from '../data/content'
import { useClock, useDragScroll, useFitText } from '../hooks'
import { EASE_OUT, Magnetic, Reveal } from './ui'
import { Visual } from './Visual'

const pad = (n: number) => String(n).padStart(2, '0')

/* ---------- Hero ---------- */

export function Hero() {
  const nameRef = useFitText<HTMLHeadingElement>()

  return (
    <section className="hero" id="top">
      <div className="hero__top label">
        <span>(Portfolio — {new Date().getFullYear()})</span>
        <span className="hero__role">{site.role}</span>
        {site.available && (
          <span className="status">
            <i />
            Available for work
          </span>
        )}
      </div>

      <h1 className="hero__name" ref={nameRef} aria-label={site.name}>
        <span className="hero__name-inner" aria-hidden="true">
          {[...site.name].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 + i * 0.07 }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </h1>

      <div className="hero__bottom">
        <Reveal as="p" className="hero__intro" delay={0.5}>
          {site.intro.text} <em>{site.intro.highlight}</em>
        </Reveal>
        <Reveal className="hero__side" delay={0.62}>
          <ul className="tags" aria-label="Capabilities">
            {site.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <div className="hero__links">
            <span className="label hero__scroll">
              <b>↓</b> Scroll
            </span>
            <a className="link" href="#work">
              See the work <span>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Marquee ---------- */

export function Marquee() {
  // Rendered twice so the CSS animation can loop without a seam
  const items = [...site.marquee, ...site.marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <Fragment key={i}>
            <span>{item}</span>
            <i>✳</i>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

/* ---------- Selected work ---------- */

export function Work() {
  const { motionOn, toggle } = useMotionPref()
  const years = projects.map((p) => Number(p.year))

  return (
    <section className="section" id="work">
      <header className="section__head">
        <Reveal as="h2" className="section__title">
          Selected work <sup>({pad(projects.length)})</sup>
        </Reveal>
        <Reveal className="section__aside label">
          <span>
            {Math.min(...years)} — {Math.max(...years)}
          </span>
          <button className="textbtn" type="button" aria-pressed={!motionOn} onClick={toggle}>
            ({motionOn ? 'Pause' : 'Play'} motion)
          </button>
        </Reveal>
      </header>

      <div className="works">
        {projects.map((project, i) => (
          <Reveal
            as="a"
            className="work"
            key={project.title}
            href={project.href}
            data-cursor="View"
            delay={i % 2 ? 0.12 : 0}
          >
            <Visual
              colors={project.colors}
              mock={project.mock}
              word={project.title}
              flip={i >= 2}
              image={project.image}
              parallax
            />
            <div className="work__meta label">
              <span>
                ({pad(i + 1)} / {pad(projects.length)})
              </span>
              <span>{project.year}</span>
              <span>{project.kind}</span>
            </div>
            <h3 className="work__title">{project.title}</h3>
            <p className="work__desc">{project.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- Up close (draggable strip) ---------- */

export function UpClose() {
  const { motionOn } = useMotionPref()
  const barRef = useRef<HTMLElement>(null)
  const stripRef = useDragScroll<HTMLDivElement>(motionOn, (progress) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${0.1 + 0.9 * progress})`
  })

  return (
    <section className="section section--flush" aria-labelledby="close-title">
      <header className="section__head section__head--pad">
        <h2 className="label" id="close-title">
          (Up close)
        </h2>
        <span className="label">Drag or scroll →</span>
      </header>
      <div className="strip" ref={stripRef} tabIndex={0} role="group" aria-label="Project details, scroll horizontally">
        {closeUps.map((item, i) => (
          <figure className={`strip__card strip__card--${item.size}`} key={i}>
            <Visual colors={item.colors} mock={item.mock} word={item.word} flip={i % 4 === 2} image={item.image} />
            <figcaption className="label">
              <span>{item.project}</span>
              <span>{item.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="strip__progress" aria-hidden="true">
        <i ref={barRef} />
      </div>
    </section>
  )
}

/* ---------- About ---------- */

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

export function About() {
  const leadRef = useRef<HTMLParagraphElement>(null)
  // Words light up one by one as the paragraph travels up the viewport
  const { scrollYProgress } = useScroll({ target: leadRef, offset: ['start 0.85', 'end 0.45'] })
  const words = site.about.lead.split(/\s+/)

  return (
    <section className="section about" id="about">
      <Reveal as="h2" className="label">
        (Hello)
      </Reveal>
      <div className="about__body">
        <p className="about__lead" ref={leadRef}>
          {words.map((word, i) => (
            <Fragment key={i}>
              <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {word}
              </Word>{' '}
            </Fragment>
          ))}
        </p>

        <Reveal as="dl" className="facts">
          {site.about.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="label">{fact.label}</dt>
              <dd>{fact.text}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Services ---------- */

export function Services() {
  return (
    <section className="section" id="services">
      <header className="section__head">
        <Reveal as="h2" className="section__title">
          What I do <sup>({pad(services.length)})</sup>
        </Reveal>
      </header>
      <ol className="services">
        {services.map((service, i) => (
          <Reveal as="li" className="service" key={service.title} delay={i * 0.06}>
            <span className="label">{pad(i + 1)}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span className="service__arrow" aria-hidden="true">
              ↗
            </span>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ---------- Contact ---------- */

export function Contact() {
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
    <section className="section cta" id="contact">
      <Reveal as="p" className="label">
        (Got something in mind?)
      </Reveal>
      <Reveal>
        <a className="cta__big" href={`mailto:${site.email}`} data-cursor="Email">
          Let's talk<span aria-hidden="true">↗</span>
        </a>
      </Reveal>
      <Reveal className="cta__row" delay={0.1}>
        <Magnetic>
          <button className="btn" type="button" onClick={copyEmail} aria-live="polite">
            {copied ? 'Copied ✓' : site.email}
          </button>
        </Magnetic>
        <p className="cta__note">{site.contactNote}</p>
      </Reveal>
    </section>
  )
}

/* ---------- Footer ---------- */

export function Footer() {
  const time = useClock(site.timeZone)

  return (
    <footer className="footer">
      <div className="footer__cols">
        <div>
          <p className="label">Elsewhere</p>
          <ul>
            {site.socials.map((social) => (
              <li key={social.label}>
                <a className="link" href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label} <span>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label">Sitemap</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a className="link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label">Local time</p>
          <p className="footer__time">
            {time} {site.timeZoneLabel}
          </p>
        </div>
      </div>
      <div className="footer__base label">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
