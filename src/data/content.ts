/**
 * Everything the site says lives in this file.
 * Edit the values below — no need to touch the components.
 */

export type Colors = { c1: string; c2: string; ink: string }

export type Project = {
  title: string
  year: string
  kind: string
  description: string
  href: string
  /** Placeholder artwork style, used until `image` is set */
  mock: 'browser' | 'phone'
  colors: Colors
  /** Real screenshot, e.g. import shot from '../assets/nimbus.jpg' */
  image?: { src: string; alt: string }
}

export type CloseUp = {
  project: string
  caption: string
  size: 'tall' | 'wide'
  colors: Colors
  mock?: 'browser' | 'phone'
  word?: string
  image?: { src: string; alt: string }
}

export const site = {
  name: 'Daksh',
  role: 'Developer & Designer',
  location: 'India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  available: true,
  // TODO: replace with your real email
  email: 'your@email.com',
  intro: {
    text: 'I design and build websites and apps that feel',
    highlight: 'fast, clear and alive.',
  },
  tags: ['Design', 'Front-end', 'Motion', 'React', 'Next.js', 'UI / UX'],
  marquee: ['Interfaces', 'Interaction', 'Web apps', 'Design systems', 'Motion', 'Prototypes'],
  about: {
    lead: "I'm Daksh — a developer and designer who likes the part where an idea becomes something you can click. I sketch in Figma, build in code, and sweat the small details that make a product feel good to use.",
    facts: [
      { label: 'Currently', text: 'Building side projects and taking on freelance work.' },
      { label: 'Focus', text: 'Front-end, interaction design, and interfaces with real motion in them.' },
      { label: 'Stack', text: 'TypeScript, React, Next.js, Node, Motion, Figma.' },
    ],
  },
  contactNote: 'Open to freelance projects, internships and good ideas. I usually reply within a day.',
  // TODO: add your real profile links
  socials: [
    { label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
  ],
}

const blue: Colors = { c1: '#2b3cff', c2: '#080b33', ink: '#dfe3ff' }
const orange: Colors = { c1: '#ff6a3d', c2: '#3a0f02', ink: '#ffe9df' }
const lime: Colors = { c1: '#d9ff5a', c2: '#33400a', ink: '#10140a' }
const sand: Colors = { c1: '#e9e3d6', c2: '#8d8674', ink: '#141310' }
const coal: Colors = { c1: '#1c1b19', c2: '#0f0e0d', ink: '#edeae3' }

// TODO: these four are SAMPLE projects — replace them with your own work
export const projects: Project[] = [
  {
    title: 'Nimbus',
    year: '2026',
    kind: 'Web app',
    description: 'A weather dashboard that turns raw forecasts into something you can read at a glance.',
    href: '#',
    mock: 'browser',
    colors: blue,
  },
  {
    title: 'Ledger',
    year: '2025',
    kind: 'Mobile app',
    description: 'Expense tracking for students — split bills, set budgets, see where it all went.',
    href: '#',
    mock: 'phone',
    colors: orange,
  },
  {
    title: 'Pulse',
    year: '2025',
    kind: 'Dashboard',
    description: 'Real-time analytics for small teams, with charts that explain themselves.',
    href: '#',
    mock: 'browser',
    colors: lime,
  },
  {
    title: 'Atlas',
    year: '2024',
    kind: 'Brand site',
    description: 'A scroll-led site for a travel studio — big type, bigger photographs.',
    href: '#',
    mock: 'phone',
    colors: sand,
  },
]

export const closeUps: CloseUp[] = [
  { project: 'Nimbus', caption: 'Mobile', size: 'tall', colors: blue, mock: 'phone' },
  { project: 'Ledger', caption: 'Type system', size: 'wide', colors: orange, word: 'Aa' },
  { project: 'Pulse', caption: 'Mobile', size: 'tall', colors: lime, mock: 'phone' },
  { project: 'Atlas', caption: 'Detail', size: 'wide', colors: sand, mock: 'browser' },
  { project: 'Nimbus', caption: 'Icon set', size: 'tall', colors: coal, word: '✳' },
  { project: 'Ledger', caption: 'Web', size: 'wide', colors: { c1: '#2b3cff', c2: '#ff6a3d', ink: '#ffffff' }, mock: 'browser' },
]

export const services = [
  { title: 'Websites', description: 'Fast, responsive marketing sites and portfolios, designed and built from scratch.' },
  { title: 'Web apps', description: 'Dashboards, tools and products in React and Next.js, with clean, maintainable code.' },
  { title: 'UI design', description: 'Interfaces and design systems in Figma that are ready to hand off — or for me to build.' },
  { title: 'Motion', description: 'Scroll effects, transitions and micro-interactions that give a product its personality.' },
]

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
]
