import { Fragment, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useMotionPref } from '../context/MotionContext'
import { highlights, nav, projects, roles, site, toolkit } from '../data/content'
import { useClock, useDragScroll, useFitText } from '../hooks'
import { EASE_OUT, Magnetic, Reveal } from './ui'
import { Visual } from './Visual'

const pad = (n: number) => String(n).padStart(2, '0')
const external = { target: '_blank', rel: 'noopener noreferrer' }

/* ---------- Hero ---------- */

export function Hero() {
  const nameRef = useFitText<HTMLHeadingElement>()

  return (
    <section className="hero" id="top">
      <div className="hero__top label">
        <span>
          ({site.fullName} — {new Date().getFullYear()})
        </span>
        <span className="hero__role">{site.role}</span>
        <span className="status">
          <i />
          {site.status}
        </span>
      </div>

      <h1 className="hero__name" ref={nameRef} aria-label={`${site.fullName}, ${site.role}`}>
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
          <ul className="tags" aria-label="Focus areas">
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

  return (
    <section className="section" id="work">
      <header className="section__head">
        <Reveal as="h2" className="section__title">
          Selected work <sup>({pad(projects.length)})</sup>
        </Reveal>
        <Reveal className="section__aside label">
          <button className="textbtn" type="button" aria-pressed={!motionOn} onClick={toggle}>
            ({motionOn ? 'Pause' : 'Play'} motion)
          </button>
        </Reveal>
      </header>

      <div className="works">
        {projects.map((project, i) => {
          const featured = i === 0
          // After the full-width featured card, every second card sits lower for a staggered grid
          const dropped = !featured && i % 2 === 0
          const primary = project.links[0]
          return (
            <Reveal
              as="article"
              className={`work${featured ? ' work--feature' : ''}${dropped ? ' work--drop' : ''}`}
              key={project.title}
              delay={dropped ? 0.12 : 0}
            >
              <a
                className="work__media"
                href={primary.href}
                {...external}
                data-cursor={primary.label === 'Live demo' ? 'Open' : 'Code'}
                aria-label={`${project.title} — ${primary.label}`}
              >
                <Visual
                  colors={project.colors}
                  mock={project.mock}
                  word={project.word ?? project.title}
                  flip={i % 2 === 1}
                  image={project.image}
                  parallax
                />
              </a>

              <div className="work__info">
                <div className="work__head">
                  <div className="work__meta label">
                    <span>
                      ({pad(i + 1)} / {pad(projects.length)})
                    </span>
                    {project.context && <span>{project.context}</span>}
                  </div>
                  <h3 className="work__title">{project.title}</h3>
                  <p className="work__kind">{project.kind}</p>
                </div>

                <div className="work__body">
                  <p className="work__desc">{project.description}</p>

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

                  <div className="work__links">
                    {project.links.map((link) => (
                      <a className="link" key={link.label} href={link.href} {...external}>
                        {link.label} <span>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Highlights (draggable strip) ---------- */

export function Highlights() {
  const { motionOn } = useMotionPref()
  const barRef = useRef<HTMLElement>(null)
  const stripRef = useDragScroll<HTMLDivElement>(motionOn, (progress) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${0.1 + 0.9 * progress})`
  })

  return (
    <section className="section section--flush" aria-labelledby="highlights-title">
      <header className="section__head section__head--pad">
        <h2 className="label" id="highlights-title">
          (Highlights)
        </h2>
        <span className="label">Drag or scroll →</span>
      </header>
      <div className="strip" ref={stripRef} tabIndex={0} role="group" aria-label="Highlights, scroll horizontally">
        {highlights.map((item) => (
          <figure className={`strip__card strip__card--${item.size}`} key={item.title}>
            <Visual colors={item.colors} word={item.stat} />
            <figcaption>
              <span className="label">{item.title}</span>
              <p>{item.detail}</p>
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

        <div className="roles">
          <Reveal as="h3" className="label">
            (Leadership)
          </Reveal>
          <ul>
            {roles.map((role, i) => (
              <Reveal as="li" className="role" key={role.title} delay={i * 0.08}>
                <span className="label">{role.period}</span>
                <div>
                  <h4>{role.title}</h4>
                  <p className="role__org">{role.org}</p>
                </div>
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
    <section className="section" id="toolkit">
      <header className="section__head">
        <Reveal as="h2" className="section__title">
          Toolkit <sup>({pad(toolkit.length)})</sup>
        </Reveal>
      </header>
      <ol className="services">
        {toolkit.map((item, i) => (
          <Reveal as="li" className="service" key={item.title} delay={i * 0.06}>
            <span className="label">{pad(i + 1)}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
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
                <a className="link" href={social.href} {...external}>
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
          © {new Date().getFullYear()} {site.fullName}
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
