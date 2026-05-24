import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSound } from '@/hooks/useSound'
import { Logo } from '@/components/layout/Logo'
import {
    IconArrowRight, IconBolt, IconBrain, IconShield, IconApi, IconChartBar,
    IconPlugConnected, IconDatabase, IconCheck, IconArrowUpRight, IconCode,
    IconTerminal2, IconWand, IconRocket, IconSparkles, IconPlayerPlay,
    IconHierarchy2, IconUsersGroup, IconTool, IconX, IconMenu2
} from '@tabler/icons-react'

/* ── Neural particle canvas ── */
function NeuralCanvas() {
    const ref = useRef(null)
    const mouse = useRef({ x: -999, y: -999 })
    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let raf

        const resize = () => {
            canvas.width = canvas.offsetWidth * devicePixelRatio
            canvas.height = canvas.offsetHeight * devicePixelRatio
            ctx.scale(devicePixelRatio, devicePixelRatio)
        }
        resize()
        window.addEventListener('resize', resize)
        const onMouse = (e) => { const r = canvas.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top } }
        window.addEventListener('mousemove', onMouse)

        const COLORS = ['#009EFF', '#00C8FF', '#7B83FF', '#00FF6A', '#A855F7']
        const nodes = Array.from({ length: 22 }, (_, i) => ({
            x: Math.random() * (canvas.offsetWidth || 1400),
            y: Math.random() * (canvas.offsetHeight || 700),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 1.5,
            color: COLORS[i % COLORS.length],
            pulse: Math.random() * Math.PI * 2
        }))

        const draw = () => {
            const W = canvas.offsetWidth, H = canvas.offsetHeight
            ctx.clearRect(0, 0, W, H)
            nodes.forEach((n) => {
                n.x += n.vx; n.y += n.vy; n.pulse += 0.012
                if (n.x < 0 || n.x > W) n.vx *= -1
                if (n.y < 0 || n.y > H) n.vy *= -1
                const mdx = mouse.current.x - n.x, mdy = mouse.current.y - n.y
                const md = Math.sqrt(mdx * mdx + mdy * mdy)
                if (md < 180) { n.vx += mdx * 0.00012; n.vy += mdy * 0.00012 }
                const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
                if (speed > 1) { n.vx *= 0.98; n.vy *= 0.98 }
                nodes.forEach((m) => {
                    const dx = n.x - m.x, dy = n.y - m.y, dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 160 && dist > 0) {
                        const alpha = 0.1 * (1 - dist / 160)
                        ctx.beginPath()
                        const g = ctx.createLinearGradient(n.x, n.y, m.x, m.y)
                        g.addColorStop(0, n.color + Math.round(alpha * 255).toString(16).padStart(2, '0'))
                        g.addColorStop(1, m.color + Math.round(alpha * 255).toString(16).padStart(2, '0'))
                        ctx.strokeStyle = g; ctx.lineWidth = 0.7
                        ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke()
                    }
                })
                const glow = (Math.sin(n.pulse) + 1) / 2
                const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5 + glow * 4)
                gr.addColorStop(0, n.color + 'bb'); gr.addColorStop(1, n.color + '00')
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5 + glow * 4, 0, Math.PI * 2)
                ctx.fillStyle = gr; ctx.fill()
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
                ctx.fillStyle = n.color; ctx.fill()
            })
            raf = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse) }
    }, [])
    return <canvas ref={ref} className='absolute inset-0 w-full h-full opacity-40' style={{ width: '100%', height: '100%' }} />
}

/* ── Scroll reveal ── */
function useReveal() {
    useEffect(() => {
        const reveal = () => {
            const els = document.querySelectorAll('.reveal-hidden:not(.reveal-visible)')
            const obs = new IntersectionObserver((entries) => {
                entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('reveal-visible'); obs.unobserve(e.target) } })
            }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' })
            els.forEach((el) => obs.observe(el))
            return obs
        }
        const obs = reveal()
        return () => obs.disconnect()
    }, [])
}

/* ── Counter ── */
function Counter({ target, suffix = '' }) {
    const [val, setVal] = useState(0)
    const ref = useRef(null)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return
            obs.disconnect()
            const num = parseFloat(target.replace(/[^0-9.]/g, ''))
            const hasDecimal = target.includes('.')
            let cur = 0
            const step = () => {
                cur += num / 55
                if (cur >= num) { setVal(num); return }
                setVal(hasDecimal ? +cur.toFixed(1) : Math.floor(cur))
                requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
        }, { threshold: 0.5 })
        obs.observe(ref.current)
        return () => obs.disconnect()
    }, [target])
    return <span ref={ref}>{typeof val === 'number' && !isNaN(val) ? (val % 1 === 0 ? val : val.toFixed(1)) : 0}{suffix}</span>
}

/* ── Marquee ── */
const MARQUEE_ITEMS = ['GPT-4o', 'Claude 3.7', 'Gemini 2.5', 'Llama 4', 'Mistral', 'Pinecone', 'Chroma', 'Weaviate', 'LangChain', 'HuggingFace', 'Anthropic', 'OpenAI', 'Groq', 'Cohere', 'Together AI', 'Deepseek']

function Marquee() {
    const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
    return (
        <div className='relative overflow-hidden py-5 border-y border-border/50'>
            <div className='absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
            <div className='absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />
            <div className='flex gap-10 animate-marquee whitespace-nowrap'>
                {items.map((item, i) => (
                    <span key={i} className='inline-flex items-center gap-2 text-xs text-muted-foreground font-mono tracking-wider uppercase'>
                        <span className='h-1 w-1 rounded-full bg-primary/50' />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    )
}

/* ── Feature card ── */
function FeatureCard({ title, desc, icon: Icon, color, accent, className }) {
    const { play } = useSound()
    return (
        <div onMouseEnter={() => play('hover')}
            className={cn('reveal-hidden group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 transition-all duration-300 hover:border-opacity-60 hover:shadow-2xl', className)}
            style={{ '--accent-col': color }}>
            <div className='absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500' style={{ background: color }} />
            <div className='relative'>
                <div className='mb-5 h-10 w-10 rounded-xl flex items-center justify-center' style={{ background: color + '18', border: `1px solid ${color}30` }}>
                    <Icon size={18} style={{ color }} />
                </div>
                <h3 className='font-display font-bold text-base text-foreground mb-2 leading-snug'>{title}</h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
            </div>
        </div>
    )
}

/* ── Step card ── */
function StepCard({ num, title, desc, icon: Icon, color, delay }) {
    return (
        <div className='animate-slide-up flex flex-col' style={{ animationDelay: `${delay + 0.1}s` }}>
            <div className='mb-6 relative'>
                <div className='h-12 w-12 rounded-full flex items-center justify-center shrink-0'
                    style={{ border: `2px solid ${color}`, background: `${color}18` }}>
                    <Icon size={20} style={{ color }} strokeWidth={1.8} />
                </div>
                <span className='absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold'
                    style={{ background: color, color: '#fff' }}>{num}</span>
            </div>
            <span className='font-display font-bold text-base text-foreground mb-2'>{title}</span>
            <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
        </div>
    )
}

/* ── Data ── */
const FEATURES = [
    { icon: IconHierarchy2, title: 'Canvas Flow Builder', desc: 'An infinite drag-and-drop workspace with 100+ pre-built nodes. LLMs, tools, memory, parsers — wired together in minutes.', color: '#009EFF' },
    { icon: IconUsersGroup, title: 'Multi-Agent Orchestration', desc: 'Spawn, route, and coordinate multiple AI agents. Set conditions, loops, and parallel branches — no code required.', color: '#A855F7' },
    { icon: IconBrain, title: 'Universal Model Hub', desc: 'GPT-4o, Claude 3.7, Gemini 2.5, Llama 4, Mistral and 20+ providers. Swap models in one click without rewiring your flow.', color: '#00C8FF' },
    { icon: IconDatabase, title: 'RAG Knowledge Base', desc: 'Ingest PDFs, URLs, Notion pages, and code repos. Embed, chunk, and power semantic search over your own data.', color: '#00FF6A' },
    { icon: IconApi, title: 'Instant API Deployment', desc: 'Every flow becomes a production REST endpoint with auth, rate limiting, versioning, and real-time monitoring baked in.', color: '#F59E0B' },
    { icon: IconChartBar, title: 'Deep Observability', desc: 'Track token usage, latency, cost, and errors across every node, every run, every deployment — in real time.', color: '#EF4444' }
]

const STEPS = [
    { n: '01', title: 'Compose', desc: 'Drag nodes onto the canvas. Connect LLMs, tools, memory, and data. Every link is a live data path.', icon: IconWand, color: '#009EFF', delay: 0 },
    { n: '02', title: 'Test & Refine', desc: 'Run your flow end-to-end, inspect every node\'s output, adjust parameters until it\'s exactly right.', icon: IconPlayerPlay, color: '#A855F7', delay: 0.1 },
    { n: '03', title: 'Deploy', desc: 'One click publishes a hardened REST endpoint. Embed it, call it, monitor it — from anywhere.', icon: IconRocket, color: '#00FF6A', delay: 0.2 }
]

const TESTIMONIALS = [
    { quote: 'Haxon Flow collapsed our AI prototyping cycle from weeks to a single afternoon. We shipped a production agent before the weekend.', author: 'Arjun Mehra', role: 'CTO, Cascada Systems', color: '#009EFF', initials: 'AM' },
    { quote: "Our product team now builds AI features independently. Haxon's canvas gives non-engineers real power without hiding the technical layer.", author: 'Lena Fischer', role: 'VP Product, Relyance', color: '#A855F7', initials: 'LF' },
    { quote: 'We replaced three brittle microservices with one Haxon pipeline. Cost dropped 55%, reliability shot up. We\'ve never looked back.', author: 'Chris Park', role: 'Staff Engineer, Vanta', color: '#00FF6A', initials: 'CP' }
]

/* ── Main ── */
export default function Landing() {
    useReveal()
    const { play } = useSound()
    const navigate = useNavigate()
    const [mobileMenu, setMobileMenu] = useState(false)

    const click = useCallback(() => play('click'), [play])

    const NAV_LINKS = [
        { label: 'Features', action: () => { click(); document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }) } },
        { label: 'Templates', action: () => { click(); navigate('/marketplaces') } },
        { label: 'Docs', action: () => { click(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }) } },
        { label: 'Pricing', action: () => { click(); navigate('/pricing') } }
    ]

    return (
        <div className='min-h-screen bg-background text-foreground overflow-x-hidden' style={{ fontFamily: "'Manrope', sans-serif" }}>

            {/* ── Nav ── */}
            <nav className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 h-16 border-b border-border/25 bg-background/85 backdrop-blur-2xl'>
                <Logo />
                <div className='hidden md:flex items-center gap-7 text-sm text-muted-foreground'>
                    {NAV_LINKS.map(({ label, action }) => (
                        <button key={label} onClick={action}
                            className='hover:text-foreground transition-colors duration-150 relative group'>
                            {label}
                            <span className='absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-[width] duration-200 group-hover:w-full' />
                        </button>
                    ))}
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' asChild onClick={click} className='hidden sm:flex'>
                        <Link to='/auth/login'>Sign In</Link>
                    </Button>
                    <Button variant='gradient' size='sm' asChild onClick={click}>
                        <Link to='/chatflows'>Launch Studio <IconArrowRight size={13} /></Link>
                    </Button>
                    <button onClick={() => setMobileMenu(!mobileMenu)} className='md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors'>
                        {mobileMenu ? <IconX size={18} /> : <IconMenu2 size={18} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenu && (
                <div className='fixed inset-0 z-40 bg-background/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 text-lg'>
                    {NAV_LINKS.map(({ label, action }) => (
                        <button key={label} onClick={() => { action(); setMobileMenu(false) }}
                            className='text-muted-foreground hover:text-foreground transition-colors font-display font-semibold'>
                            {label}
                        </button>
                    ))}
                    <div className='flex flex-col gap-3 mt-4'>
                        <Button variant='outline' size='lg' asChild onClick={click}>
                            <Link to='/auth/login' onClick={() => setMobileMenu(false)}>Sign In</Link>
                        </Button>
                        <Button variant='gradient' size='lg' asChild onClick={click}>
                            <Link to='/chatflows' onClick={() => setMobileMenu(false)}>Launch Studio</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Hero ── */}
            <section className='relative min-h-screen flex flex-col lg:flex-row items-center px-5 sm:px-10 lg:px-16 pt-24 pb-16 gap-12 overflow-hidden'>
                <NeuralCanvas />
                <div className='absolute inset-0 bg-grid opacity-[0.08] pointer-events-none' />
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-primary/5 blur-[180px] pointer-events-none' />

                {/* Left: text */}
                <div className='relative z-10 flex-1 max-w-2xl'>
                    <h1 className='animate-slide-up stagger-1 leading-[0.9] tracking-tight mb-6'
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
                        <span className='text-foreground'>Ship AI</span>
                        <br />
                        <span className='gradient-text'>workflows.</span>
                        <br />
                        <span className='text-foreground/40' style={{ fontWeight: 700, fontSize: '0.72em' }}>Not infrastructure.</span>
                    </h1>

                    <p className='animate-slide-up stagger-2 text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg'>
                        Haxon Flow is a canvas-first AI workflow studio. Drag in models, tools, and data. Connect the dots. Deploy a production API — all from one screen.
                    </p>

                    <div className='animate-slide-up stagger-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12'>
                        <Button variant='gradient' size='xl' asChild className='glow-primary gap-2' onClick={click}>
                            <Link to='/chatflows'>Open Studio <IconArrowRight size={16} /></Link>
                        </Button>
                        <Button variant='outline' size='xl' asChild className='gap-2' onClick={click}>
                            <Link to='/auth/signup'>Start for free <IconSparkles size={14} /></Link>
                        </Button>
                    </div>

                    <div className='animate-slide-up stagger-4 flex items-center gap-6 text-xs text-muted-foreground'>
                        {['No credit card', '100+ AI nodes', 'Deploy in minutes'].map((t, i) => (
                            <span key={t} className='flex items-center gap-1.5'>
                                <IconCheck size={11} className='text-success' /> {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: product preview */}
                <div className='relative z-10 flex-1 max-w-xl w-full animate-slide-up stagger-4'>
                    <div className='border-gradient rounded-2xl p-px shadow-2xl shadow-primary/10'>
                        <div className='rounded-[calc(1rem-1px)] bg-background/95 overflow-hidden'>
                            {/* Toolbar */}
                            <div className='flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-card/50'>
                                <div className='flex gap-1.5'>
                                    {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} className='h-2.5 w-2.5 rounded-full' style={{ background: c }} />)}
                                </div>
                                <div className='flex-1 mx-4 h-5 rounded bg-secondary/60 text-[10px] font-mono text-muted-foreground flex items-center px-3'>
                                    haxon-flow · customer-support-agent
                                </div>
                                <div className='text-[10px] font-mono text-success flex items-center gap-1.5'>
                                    <span className='h-1.5 w-1.5 rounded-full bg-success animate-pulse' /> live
                                </div>
                            </div>
                            {/* Canvas */}
                            <div className='relative h-60 sm:h-80 overflow-hidden bg-background/90'>
                                <div className='absolute inset-0 bg-dot opacity-10' />
                                {[
                                    { x: '3%', y: '18%', label: 'HTTP Trigger', color: '#009EFF', type: 'Trigger' },
                                    { x: '25%', y: '8%', label: 'Claude 3.7', color: '#A855F7', type: 'LLM' },
                                    { x: '25%', y: '52%', label: 'Buffer Memory', color: '#00C8FF', type: 'Memory' },
                                    { x: '50%', y: '25%', label: 'Web Search', color: '#F59E0B', type: 'Tool' },
                                    { x: '50%', y: '64%', label: 'JSON Parser', color: '#00FF6A', type: 'Parser' },
                                    { x: '76%', y: '40%', label: 'API Response', color: '#009EFF', type: 'Output' }
                                ].map((node, i) => (
                                    <div key={i} className='absolute animate-slide-up' style={{ left: node.x, top: node.y, animationDelay: `${0.5 + i * 0.08}s` }}>
                                        <div className='rounded-lg border px-2.5 py-1.5 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform cursor-default'
                                            style={{ borderColor: node.color + '40', background: node.color + '10', minWidth: 90 }}>
                                            <div className='text-[7px] uppercase tracking-widest mb-0.5 opacity-50 font-mono' style={{ color: node.color }}>{node.type}</div>
                                            <div className='text-[10px] font-semibold' style={{ color: node.color }}>{node.label}</div>
                                        </div>
                                    </div>
                                ))}
                                <svg className='absolute inset-0 w-full h-full pointer-events-none' style={{ opacity: 0.3 }}>
                                    <defs>
                                        <marker id='arr2' markerWidth='5' markerHeight='5' refX='2.5' refY='2.5' orient='auto'>
                                            <path d='M0,0 L0,5 L5,2.5 z' fill='#009EFF' opacity='0.7' />
                                        </marker>
                                        <linearGradient id='lg2' x1='0' y1='0' x2='1' y2='0'>
                                            <stop offset='0%' stopColor='#009EFF' stopOpacity='0.6' />
                                            <stop offset='100%' stopColor='#A855F7' stopOpacity='0.6' />
                                        </linearGradient>
                                    </defs>
                                    {[['9%','30%','25%','22%'],['9%','30%','25%','65%'],['41%','22%','50%','37%'],['41%','65%','50%','74%'],['66%','37%','76%','52%'],['66%','74%','76%','54%']].map(([x1,y1,x2,y2],i) => (
                                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke='url(#lg2)' strokeWidth='1.5' strokeDasharray='6 3' markerEnd='url(#arr2)' />
                                    ))}
                                </svg>
                            </div>
                            {/* Bottom status bar */}
                            <div className='flex items-center gap-4 px-4 py-2 border-t border-border/60 bg-card/30 text-[10px] font-mono text-muted-foreground'>
                                <span className='text-success'>▲ 99.8% uptime</span>
                                <span>6 nodes · 5 edges</span>
                                <span className='ml-auto text-primary'>deployed to api.haxon.dev</span>
                            </div>
                        </div>
                    </div>
                    <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-primary/15 blur-3xl rounded-full pointer-events-none' />
                </div>
            </section>

            {/* ── Marquee ── */}
            <Marquee />

            {/* ── Stats ── */}
            <section className='py-20 px-5 sm:px-10'>
                <div className='max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    {[
                        { value: '100', suffix: '+', label: 'AI Nodes built-in', icon: IconHierarchy2 },
                        { value: '20', suffix: '+', label: 'Model providers', icon: IconBrain },
                        { value: '50', suffix: '+', label: 'Native integrations', icon: IconPlugConnected },
                        { value: '99.9', suffix: '%', label: 'Uptime SLA', icon: IconBolt }
                    ].map((s) => (
                        <div key={s.label} className='reveal-hidden group text-center px-4 py-8 rounded-2xl border border-border/50 bg-card/30 hover:border-primary/25 hover:bg-card/60 transition-all duration-300'>
                            <div className='font-display text-4xl sm:text-5xl font-bold gradient-text leading-none mb-2'>
                                <Counter target={s.value + s.suffix} />{s.suffix}
                            </div>
                            <div className='text-xs text-muted-foreground tracking-wide'>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section id='features' className='py-20 px-5 sm:px-10'>
                <div className='max-w-6xl mx-auto'>
                    <div className='mb-14 reveal-hidden'>
                        <Badge variant='outline' className='mb-4 text-xs font-mono border-primary/25 bg-primary/5 text-primary'>Platform</Badge>
                        <h2 className='text-foreground leading-tight tracking-tight'
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                            Every piece your <span className='gradient-text'>AI stack needs.</span>
                        </h2>
                        <p className='text-muted-foreground max-w-sm text-sm mt-4'>From prototype to production — no gaps, no glue code, no surprises.</p>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {FEATURES.map((f, i) => (
                            <FeatureCard key={f.title} {...f} className={cn('stagger-' + (i + 1))} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section id='how-it-works' className='py-24 px-5 sm:px-10 relative overflow-hidden'>
                <div className='absolute inset-0 bg-grid opacity-[0.06] pointer-events-none' />
                <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent' />
                <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent' />
                <div className='relative max-w-5xl mx-auto'>
                    <div className='mb-16 reveal-hidden'>
                        <Badge variant='outline' className='mb-4 text-xs font-mono border-purple/25 bg-purple/5 text-purple'>How it works</Badge>
                        <h2 className='text-foreground leading-tight tracking-tight'
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                            From idea to live API —{' '}
                            <span className='gradient-text-purple'>in a single session.</span>
                        </h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8'>
                        {STEPS.map((s) => <StepCard key={s.n} {...s} />)}
                    </div>
                </div>
            </section>

            {/* ── Code/Visual split ── */}
            <section className='py-20 px-5 sm:px-10'>
                <div className='max-w-5xl mx-auto'>
                    <div className='reveal-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-2xl border border-border/50 bg-card/30 p-8 lg:p-12'>
                        <div>
                            <Badge variant='outline' className='mb-4 text-xs font-mono border-neon/25 bg-neon/5 text-neon'>For engineers</Badge>
                            <h2 className='mb-4 leading-tight text-foreground'
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                                Code when you want to.
                            </h2>
                            <p className='text-sm text-muted-foreground leading-relaxed mb-6'>
                                Every deployed flow exposes a typed REST API. Call it from any language, any framework. Hook in custom functions, write your own nodes, or extend with the SDK.
                            </p>
                            <div className='flex flex-col gap-2'>
                                {['REST + WebSocket APIs', 'Custom node SDK', 'Environment variables', 'Webhook triggers'].map((f) => (
                                    <div key={f} className='flex items-center gap-2 text-sm text-foreground'>
                                        <IconCheck size={13} className='text-neon shrink-0' /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='rounded-xl border border-border bg-background/60 p-4 font-mono text-xs overflow-hidden'>
                            <div className='flex items-center gap-2 mb-3 text-muted-foreground'>
                                <IconTerminal2 size={12} /> <span>terminal</span>
                            </div>
                            {[
                                { pre: '$ ', text: 'curl https://api.haxon.dev/v1/flows/csupport', color: 'text-foreground' },
                                { pre: '  ', text: '-H "Authorization: Bearer $HAXON_KEY" \\', color: 'text-muted-foreground' },
                                { pre: '  ', text: '-d \'{"message": "How do I reset my password?"}\'' , color: 'text-muted-foreground' },
                                { pre: '', text: '', color: '' },
                                { pre: '{ ', text: '"reply": "To reset your password, click..."', color: 'text-neon' },
                                { pre: '  ', text: '"tokens": 142,', color: 'text-cyan' },
                                { pre: '  ', text: '"latency_ms": 380 }', color: 'text-cyan' },
                            ].map((line, i) => (
                                <div key={i} className='leading-6'>
                                    <span className='text-primary/60'>{line.pre}</span>
                                    <span className={line.color}>{line.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className='py-20 px-5 sm:px-10'>
                <div className='max-w-5xl mx-auto'>
                    <div className='text-center mb-14 reveal-hidden'>
                        <Badge variant='outline' className='mb-4 text-xs font-mono border-primary/25 bg-primary/5 text-primary'>What teams say</Badge>
                        <h2 className='text-foreground leading-tight tracking-tight'
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                            Trusted by teams that <span className='gradient-text'>ship fast.</span>
                        </h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={t.author} className='reveal-hidden flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-card/40 hover:border-primary/20 hover:bg-card/70 transition-all duration-300'
                                style={{ transitionDelay: `${i * 0.08}s` }}>
                                <p className='text-sm text-foreground/80 leading-relaxed flex-1'>"{t.quote}"</p>
                                <div className='flex items-center gap-3'>
                                    <div className='h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold font-mono'
                                        style={{ background: t.color + '20', color: t.color, border: `1px solid ${t.color}30` }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className='text-xs font-semibold text-foreground'>{t.author}</div>
                                        <div className='text-[11px] text-muted-foreground'>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section id='pricing' className='py-24 px-5 sm:px-10 relative overflow-hidden'>
                <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent' />
                <div className='absolute inset-0 bg-grid opacity-[0.06] pointer-events-none' />
                <div className='absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-primary/8 blur-[120px] pointer-events-none' />
                <div className='relative max-w-3xl mx-auto text-center reveal-hidden'>
                    <h2 className='mb-6 leading-tight tracking-tight'
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                        Your next AI feature — <span className='gradient-text'>ships today.</span>
                    </h2>
                    <p className='text-muted-foreground text-base mb-10 max-w-md mx-auto'>
                        Stop building scaffolding. Start shipping outcomes. Haxon Flow is free to try — no credit card, no lock-in.
                    </p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                        <Button variant='gradient' size='xl' asChild className='glow-primary gap-2 w-full sm:w-auto' onClick={click}>
                            <Link to='/chatflows'>Open Studio <IconArrowRight size={16} /></Link>
                        </Button>
                        <Button variant='outline' size='xl' asChild className='w-full sm:w-auto' onClick={click}>
                            <Link to='/auth/signup'>Create free account</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className='border-t border-border/50 px-5 sm:px-10 py-10'>
                <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
                    <div>
                        <Logo />
                        <p className='text-xs text-muted-foreground mt-2 max-w-xs'>
                            Canvas-first AI workflow studio. Build, test, deploy — all in one place.
                        </p>
                        <p className='text-[10px] text-muted-foreground/50 mt-3'>
                            Inspired by <a href='https://flowiseai.com' target='_blank' rel='noopener noreferrer' className='underline hover:text-muted-foreground'>FlowiseAI</a>. Built for learning and exploration.
                        </p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-8 text-xs text-muted-foreground'>
                        <div className='space-y-2'>
                            <p className='font-semibold text-foreground text-[11px] uppercase tracking-widest mb-3'>Product</p>
                            {['Features', 'Templates', 'Pricing', 'Changelog'].map((l) => (
                                <a key={l} href='#' onClick={click} className='block hover:text-foreground transition-colors'>{l}</a>
                            ))}
                        </div>
                        <div className='space-y-2'>
                            <p className='font-semibold text-foreground text-[11px] uppercase tracking-widest mb-3'>Resources</p>
                            {['Docs', 'API Reference', 'Blog', 'Status'].map((l) => (
                                <a key={l} href='#' onClick={click} className='block hover:text-foreground transition-colors'>{l}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
