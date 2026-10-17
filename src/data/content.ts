/**
 * Everything the site says lives in this file.
 * Edit the values below — no need to touch the components.
 */
import drishtiShot from '../assets/drishti.webp'
import nwisShot from '../assets/nwis.webp'
import sifTraceShot from '../assets/sif-trace.webp'
import spamShieldShot from '../assets/spamshield.webp'
import underpassShot from '../assets/underpass.webp'

export type Colors = { c1: string; c2: string; ink: string }

export type Project = {
  title: string
  /** Short word set large behind the placeholder artwork (defaults to the title) */
  word?: string
  kind: string
  /** Optional line shown beside the kind, e.g. the event it was built for */
  context?: string
  description: string
  metrics?: { value: string; label: string }[]
  stack: string[]
  links: { label: string; href: string }[]
  /** Placeholder artwork style, used until `image` is set */
  mock: 'browser' | 'phone'
  /**
   * Illustrative terminal session drawn over the placeholder artwork (used until `image` is set).
   * Lines starting with `$` or `>` are input; `+` success, `!` warning, `-` muted output.
   */
  terminal?: string[]
  colors: Colors
  /** Real screenshot: drop the file in src/assets, import it above, and set it here */
  image?: { src: string; alt: string }
}

export type Highlight = {
  /** Numbers in the stat count up from zero, e.g. "200+" or "Top 10" */
  stat: string
  title: string
  detail: string
  colors: Colors
}

export const site = {
  name: 'Daksh',
  fullName: 'Daksh Wadhwa',
  role: 'Software Engineer',
  location: 'NIT Hamirpur, IN',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  status: 'Open to internships',
  email: 'dakshwadhwa2007@gmail.com',
  /** `*wrapped*` words are set in the italic serif */
  intro: 'Secure, cloud-native software and applied-AI systems that *actually ship.*',
  /** Cycles under the role in the hero */
  focus: ['Agentic AI', 'Cloud & serverless', 'Security-first', 'Verified AI', 'Hackathon winner'],
  tags: ['AI agents', 'Verified AI', 'AWS', 'Serverless', 'Security', 'Python', 'TypeScript'],
  marquee: ['Agentic AI', 'Verified, not guessed', 'Cloud-native', 'Security-first', 'Human in the loop', 'Hackathon winner'],
  /** Lights up word by word as you scroll. `*wrapped*` words are set in the italic serif. */
  statement:
    "I'm Daksh, a third-year engineer at NIT Hamirpur building *secure, cloud-native software* and *AI agents that check their own work.* I work across backend systems and AWS, and I like shipping real products against tight deadlines. That habit has won me *two hackathons* so far.",
  about: {
    title: 'Engineer by training, *builder by habit.*',
    facts: [
      { label: 'Education', text: 'B.Tech in Electrical Engineering, NIT Hamirpur. 2024 – 2028 · CGPA 8.78 / 10.' },
      { label: 'Focus', text: 'Agentic and verified AI, cloud security and backend systems.' },
      { label: 'Core CS', text: 'Data structures & algorithms, OOP, DBMS, operating systems, computer networks.' },
    ],
  },
  contactNote: 'Open to internships, collaborations and hackathon teams. The fastest way to reach me is email.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daksh-wadhwa-1a322722a/' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/daksh120/' },
  ],
}

const blue: Colors = { c1: '#2b3cff', c2: '#080b33', ink: '#dfe3ff' }
const orange: Colors = { c1: '#ff6a3d', c2: '#3a0f02', ink: '#ffe9df' }
const lime: Colors = { c1: '#d9ff5a', c2: '#33400a', ink: '#10140a' }
const sand: Colors = { c1: '#e9e3d6', c2: '#8d8674', ink: '#141310' }
const coal: Colors = { c1: '#24221f', c2: '#0f0e0d', ink: '#edeae3' }
const violet: Colors = { c1: '#8b5cff', c2: '#1a0b3d', ink: '#efe8ff' }
const mint: Colors = { c1: '#5fe3b3', c2: '#0b3b2c', ink: '#06140f' }
const yellow: Colors = { c1: '#ffd60a', c2: '#4a3a00', ink: '#141100' }

/** Shown as stacking cards, in this order. */
export const projects: Project[] = [
  {
    title: 'Arcade',
    kind: 'Security-focused agent development environment',
    description:
      'A multi-agent pipeline that scans AI-generated code against security rules, auto-fixes what it finds, and opens a pull request only after tests pass and a human approves. Clients hold zero cloud credentials: every bit of cloud access is brokered through a serverless AWS backend deployed with CDK. Ships as a web app, an Electron IDE, a mobile app, and a CLI + MCP server.',
    metrics: [
      { value: '14', label: 'security rules' },
      { value: '70+', label: 'Jest tests' },
      { value: '0', label: 'client-held credentials' },
    ],
    stack: ['TypeScript', 'Next.js', 'Electron', 'AWS Lambda', 'DynamoDB', 'Cognito', 'CDK', 'Bedrock', 'Docker', 'Jest'],
    // The live demo (https://d20wyf3rpbds1d.cloudfront.net/) currently returns 404 — add it back here once it's up
    links: [{ label: 'GitHub', href: 'https://github.com/ayushagarwalhere/arcade' }],
    mock: 'browser',
    terminal: [
      '$ arcade scan ./src --rules all',
      '- loading 14 security rules',
      '! hardcoded-secret   api/client.ts:12',
      '! open-cors          lambda/handler.ts:41',
      '+ fixes generated by agent',
      '+ jest: all tests passing',
      '- waiting for human approval…',
      '+ approved · pull request opened',
    ],
    colors: blue,
  },
  {
    title: 'OptiAgent',
    kind: 'Natural language to verified optimisation',
    description:
      'Turns a plain-English planning problem and your spreadsheet into a linear program, solves it, and proves the answer. The LLM only fills typed structures: every number is grounded in your text or data, you approve the exact formulation, and the plan is verified twice, including a duality certificate, before it is shown. Then it explains shadow prices, ranges and what-ifs.',
    metrics: [
      { value: '100%', label: 'correct optima · qwen3:8b' },
      { value: '4%', label: 'same LLM, unverified' },
      { value: '204/204', label: 'injected errors caught' },
    ],
    stack: ['Python', 'FastAPI', 'OR-Tools', 'HiGHS', 'Ollama', 'SQLite', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops/Optiagent' }],
    mock: 'browser',
    terminal: [
      '> ship from 3 plants to 4 stores at least cost',
      '- extracted: transportation problem',
      '+ grounding: every number found in your text',
      '- you approved the formulation',
      '+ solved · OR-Tools GLOP · optimal',
      '+ verified against data · duality certificate',
      '- shadow price: plant B capacity',
    ],
    colors: violet,
  },
  {
    title: 'Underpass Sentinel',
    word: 'Sentinel',
    kind: 'Monsoon flood alerts for Delhi dispatchers',
    context: 'Environmental Hacks · WeMakeDevs × AWS',
    description:
      "Watches 26 flood-prone underpasses and low roads in Delhi, compares the rain forecast and the rain already falling against each spot's own limit, and has a Strands agent draft the alert. A human dispatcher approves before anything reaches the bilingual driver page. Backtested against two monsoons and deployed serverless on AWS.",
    metrics: [
      { value: '26', label: 'low points watched' },
      { value: '5,616', label: 'spot-days backtested' },
      { value: '2', label: 'languages · Hindi + English' },
    ],
    stack: ['Python', 'FastAPI', 'Strands Agents', 'Bedrock', 'Lambda', 'API Gateway', 'DynamoDB', 'SNS', 'AWS SAM', 'Three.js'],
    links: [
      { label: 'Live demo', href: 'https://ssainw9s4c.execute-api.us-east-1.amazonaws.com' },
      { label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops/Environmental-hacks' },
    ],
    mock: 'browser',
    colors: mint,
    image: { src: underpassShot, alt: 'Underpass Sentinel landing page: "Know which underpass floods. Before the bus leaves."' },
  },
  {
    title: 'SIF-Trace',
    kind: 'AI / NLP engine for SIF precursor detection',
    context: 'Smart India Hackathon 2026 · Oil India Ltd.',
    description:
      'A hybrid NLP and rule-engine pipeline that flags safety reports with serious-injury potential and maps them to IOGP life-saving rules, using outcome masking to avoid label leakage. Comes with a React + FastAPI dashboard for site risk ranking and a review queue.',
    metrics: [
      { value: '0.919', label: 'ROC-AUC' },
      { value: '12,864', label: 'reports analysed' },
      { value: '28s → 2.6s', label: 'cold start' },
    ],
    stack: ['Python', 'scikit-learn', 'TF-IDF', 'FastAPI', 'React', 'Tailwind CSS'],
    links: [
      { label: 'Live demo', href: 'https://sif-trace.onrender.com/dashboard' },
      { label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops/SIF-Trace' },
    ],
    mock: 'browser',
    colors: sand,
    image: { src: sifTraceShot, alt: 'SIF-Trace safety intelligence dashboard showing report counts, risk overview and site risk ranking' },
  },
  {
    title: 'DrishtiAI',
    kind: 'Offline sight assistant for blind and low-vision people',
    context: 'Hacktoberfest Hack Day · built solo',
    description:
      'Point a webcam and it says what is in front of you, hazards first, in English or Hindi. A local vision-language model returns validated JSON, a fast object detector adds people and vehicles it missed, and everything, including speech in and out, runs on your own machine. No image, text or audio ever leaves the computer.',
    metrics: [
      { value: '100%', label: 'on-device · no cloud' },
      { value: '1.5–3s', label: 'per scene · 6 GB GPU' },
      { value: '2', label: 'languages · Hindi + English' },
    ],
    stack: ['Python', 'FastAPI', 'Qwen3-VL', 'Ollama', 'YOLOX', 'ONNX Runtime', 'Whisper', 'Piper TTS', 'Pydantic'],
    links: [{ label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops/hacktober' }],
    mock: 'browser',
    colors: yellow,
    image: { src: drishtiShot, alt: 'DrishtiAI describing a street scene with an open manhole and a traffic cone' },
  },
  {
    title: 'Financial Document RAG',
    word: 'RAG',
    kind: 'Retrieval-augmented Q&A for financial reports',
    description:
      'A RAG backend for 10-Ks and annual reports with table-aware chunking, hybrid lexical-semantic search and citation-aware answers that point back to the source page. Includes retrieval evaluation metrics to measure answer quality.',
    stack: ['Python', 'LangChain', 'Groq', 'FAISS', 'HuggingFace embeddings', 'FastAPI', 'Streamlit'],
    links: [{ label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops/financial-document-rag' }],
    mock: 'browser',
    terminal: [
      '> how did operating margin change year on year?',
      '- chunking 10-K · tables kept intact',
      '- hybrid search · bm25 + faiss',
      '+ top passages re-ranked',
      '+ answer drafted with citations',
      '- [1] 10-K, Item 7 · MD&A',
      '- [2] 10-K, Item 8 · income statement',
    ],
    colors: orange,
  },
  {
    title: 'SpamShield',
    word: 'Spam',
    kind: 'SMS spam detection, taken all the way to production',
    context: 'MLOps · end to end',
    description:
      'An SMS spam classifier built as a real MLOps project. NLTK preprocessing and TF-IDF feed a scikit-learn model through modular ingestion, transformation and training pipelines; a FastAPI service on Render returns a verdict with confidence scores to a Streamlit front end. A companion five-stage DVC pipeline versions the data and models on S3.',
    metrics: [
      { value: '2', label: 'deployed services' },
      { value: '5', label: 'DVC pipeline stages' },
      { value: 'S3', label: 'data + model versions' },
    ],
    stack: ['Python', 'NLTK', 'scikit-learn', 'FastAPI', 'Streamlit', 'Pydantic', 'DVC', 'MLflow', 'AWS S3', 'Render'],
    links: [
      { label: 'Live demo', href: 'https://sms-spam-classifier-qpnp2zesr287tny2mmidfa.streamlit.app/' },
      { label: 'GitHub', href: 'https://github.com/Dakshhhhh-ops/sms-spam-classifier' },
      { label: 'DVC pipeline', href: 'https://github.com/Dakshhhhh-ops/Mlops-completeML-pipeline' },
    ],
    mock: 'browser',
    colors: mint,
    image: { src: spamShieldShot, alt: 'SpamShield web app with a sample spam message ready to analyse' },
  },
]

export type ArchiveItem = {
  title: string
  kind: string
  year: string
  stack: string[]
  href: string
  colors: Colors
  image?: { src: string; alt: string }
}

/** Shorter list under the featured work. Hovering a row shows its preview. */
export const archive: ArchiveItem[] = [
  {
    title: 'NWIS',
    kind: 'Offset-well risk radar for drilling engineers · SIH 2026',
    year: '2026',
    stack: ['FastAPI', 'scikit-learn', 'OCR / NLP'],
    href: 'https://github.com/Dakshhhhh-ops/nwis',
    colors: blue,
    image: { src: nwisShot, alt: 'NWIS dashboard with well risk index, field map and depth-ahead risk radar' },
  },
  {
    title: 'ResumeAgent',
    kind: 'Finds jobs you are eligible for, then fills the form',
    year: '2026',
    stack: ['Groq', 'Playwright', 'React'],
    href: 'https://github.com/Dakshhhhh-ops/resume-browser-agent',
    colors: orange,
  },
  {
    title: 'AgentGuard',
    kind: 'Runtime security control plane for AI agents',
    year: '2026',
    stack: ['FastAPI', 'React', 'TypeScript'],
    href: 'https://github.com/Dakshhhhh-ops/agentguard',
    colors: lime,
  },
  {
    title: 'IncidentPilot',
    kind: 'Autonomous SRE agent: reproduce, prove, patch, verify',
    year: '2026',
    stack: ['Python', 'FastAPI', 'React'],
    href: 'https://github.com/Dakshhhhh-ops/incidentpilot',
    colors: violet,
  },
]

export const highlights: Highlight[] = [
  {
    stat: '1st',
    title: 'Electrothon 8.0 · IQAI Track',
    detail: 'Won the $400 prize for the best AI/ML solution among 120+ teams.',
    colors: orange,
  },
  {
    stat: 'Top 10',
    title: 'Smart India Hackathon 2026',
    detail: 'SIF-Trace was selected in the college top 10 out of 200+ submissions.',
    colors: blue,
  },
  {
    stat: '1st',
    title: 'Slab Hackathon',
    detail: 'First among 100+ teams. Hosted by GDG on Campus NIT Hamirpur with WebCMD.',
    colors: lime,
  },
  {
    stat: '54',
    title: 'Public repositories',
    detail: 'On GitHub, from MLOps pipelines and RAG to agent safety and verified optimisation.',
    colors: violet,
  },
  {
    stat: '200+',
    title: 'LeetCode',
    detail: 'Problems solved across data structures, algorithms and dynamic programming.',
    colors: sand,
  },
  {
    stat: '8.78',
    title: 'CGPA · NIT Hamirpur',
    detail: 'Out of 10 in Electrical Engineering — department rank 13 of 125.',
    colors: coal,
  },
]

export const toolkit = [
  { title: 'Applied AI', description: 'Agents with LangGraph, Strands and MCP. RAG with LangChain and FAISS. Local and hosted LLMs via Ollama, Groq and Bedrock, including vision models.' },
  { title: 'Verified AI', description: 'LLMs fill typed structures, code does the maths. Grounding checks, OR-Tools solvers, evaluation suites and human approval gates.' },
  { title: 'Cloud', description: 'AWS Lambda, API Gateway, DynamoDB, SNS, S3, CloudFront, Cognito, CDK and SAM. Serverless by default.' },
  { title: 'Security', description: 'Secure code scanning, agent runtime guardrails, Cognito auth and zero-credential clients.' },
  { title: 'Full-stack', description: 'FastAPI and REST APIs behind React, Next.js, Electron and Tailwind CSS. Three.js when a map needs a third axis.' },
  { title: 'ML & MLOps', description: 'scikit-learn, TensorFlow, NLP. MLflow, DVC, Docker and GitHub Actions CI/CD. Python, C++, TypeScript, SQL.' },
]

export const roles = [
  {
    title: 'Co-Convener',
    org: 'In4mals, NIT Hamirpur',
    period: 'Present',
    description: 'Led 50+ volunteers to run Campus Star — 600+ attendees and 20+ performances — owning scheduling and on-ground logistics.',
  },
  {
    title: 'Executive',
    org: 'Team .EXE & GDG on Campus, NIT Hamirpur',
    period: 'Aug 2024 – Present',
    description: 'Led technical projects across dev and design teams, mentored 30+ participants at campus tech events, and organised AI/ML and model-deployment workshops for 50+ students.',
  },
]

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'About', href: '#about' },
  { label: 'Toolkit', href: '#toolkit' },
]
