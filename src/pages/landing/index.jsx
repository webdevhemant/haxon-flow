import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSound } from '@/hooks/useSound'
import { Logo } from '@/components/layout/Logo'
import {
    IconArrowRight, IconBolt, IconBrain, IconShield, IconApi, IconChartBar,
    IconPlugConnected, IconStar, IconHierarchy2, IconUsersGroup, IconTool,
    IconDatabase, IconCheck, IconArrowUpRight, IconCode, IconTerminal2,
    IconWand, IconRocket, IconSparkles, IconPlayerPlay
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

        const resize = () => { canvas.width = canvas.offsetWidth * devicePixelRatio; canvas.height = canvas.offsetHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio) }
        resize()
        window.addEventListener('resize', resize)

        const onMouse = (e) => { const r = canvas.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top } }
        window.addEventListener('mousemove', onMouse)

        const COLORS = ['#009EFF', '#00C8FF', '#7B83FF', '#00FF6A', '#A855F7']
        const nodes = Array.from({ length: 20 }, (_, i) => ({
            x: Math.random() * (canvas.offsetWidth || 1200),
            y: Math.random() * (canvas.offsetHeight || 700),
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 2.5 + 1.5,
            color: COLORS[i % COLORS.length],
            pulse: Math.random() * Math.PI * 2
        }))

        const draw = () => {
            const W = canvas.offsetWidth, H = canvas.offsetHeight
            ctx.clearRect(0, 0, W, H)

            nodes.forEach((n) => {
                n.x += n.vx; n.y += n.vy; n.pulse += 0.015
                if (n.x < 0 || n.x > W) n.vx *= -1
                if (n.y < 0 || n.y > H) n.vy *= -1

                // Mouse attraction
                const mdx = mouse.current.x - n.x, mdy = mouse.current.y - n.y
                const md = Math.sqrt(mdx * mdx + mdy * mdy)
                if (md < 200) { n.vx += mdx * 0.00015; n.vy += mdy * 0.00015 }
                const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
                if (speed > 1.2) { n.vx *= 0.98; n.vy *= 0.98 }

                nodes.forEach((m) => {
                    const dx = n.x - m.x, dy = n.y - m.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 180 && dist > 0) {
                        const alpha = 0.12 * (1 - dist / 180)
                        ctx.beginPath()
                        const grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y)
                        grad.addColorStop(0, n.color + Math.round(alpha * 255).toString(16).padStart(2, '0'))
                        grad.addColorStop(1, m.color + Math.round(alpha * 255).toString(16).padStart(2, '0'))
                        ctx.strokeStyle = grad
                        ctx.lineWidth = 0.8
                        ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke()
                    }
                })

                const glow = (Math.sin(n.pulse) + 1) / 2
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4 + glow * 5)
                grad.addColorStop(0, n.color + 'cc'); grad.addColorStop(1, n.color + '00')
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4 + glow * 5, 0, Math.PI * 2)
                ctx.fillStyle = grad; ctx.fill()
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
                ctx.fillStyle = n.color; ctx.fill()
            })
            raf = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse) }
    }, [])
    return <canvas ref={ref} className='absolute inset-0 w-full h-full opacity-50' style={{ width: '100%', height: '100%' }} />
}

/* ── Scroll reveal hook ── */
function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal-hidden')
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('reveal-visible'); obs.unobserve(e.target) } })
        }, { threshold: 0.12 })
        els.forEach((el) => obs.observe(el))
        return () => obs.disconnect()
    }, [])
}

/* ── Animated counter ── */
function Counter({ target, suffix = '' }) {
    const [val, setVal] = useState(0)
    const ref = useRef(null)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return
            obs.disconnect()
            const num = parseFloat(target.replace(/[^0-9.]/g, ''))
            const hasDecimal = target.includes('.')
            let start = 0
            const step = () => {
                start += num / 60
                if (start >= num) { setVal(num); return }
                setVal(hasDecimal ? +start.toFixed(1) : Math.floor(start))
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
const MARQUEE_ITEMS = ['GPT-4o', 'Claude 3.5', 'Gemini 2.0', 'Llama 3.3', 'Mistral', 'Pinecone', 'Chroma', 'Qdrant', 'Weaviate', 'LangChain', 'HuggingFace', 'Anthropic', 'OpenAI', 'Groq', 'Cohere', 'Together AI']

function Marquee() {
    const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
    return (
        <div className='relative overflow-hidden py-6 border-y border-border/60'>
            <div className='absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
            <div className='absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />
            <div className='flex gap-8 animate-marquee whitespace-nowrap'>
                {items.map((item, i) => (
                    <span key={i} className='inline-flex items-center gap-2 text-sm text-muted-foreground font-mono'>
                        <span className='h-1.5 w-1.5 rounded-full bg-primary/60' />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    )
}

/* ── Bento feature card ── */
function BentoCard({ title, desc, icon: Icon, color, className, children }) {
    const { play } = useSound()
    return (
        <div onMouseEnter={() => play('hover')}
            className={cn('reveal-hidden group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5', className)}>
            <div className='absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity' style={{ background: color }} />
            <div className='relative z-10'>
                <div className='mb-4 inline-flex rounded-xl p-2.5' style={{ background: color + '15', border: `1px solid ${color}25` }}>
                    <Icon size={20} style={{ color }} />
                </div>
                <h3 className='font-display text-base font-semibold mb-2 text-foreground'>{title}</h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
                {children}
            </div>
        </div>
    )
}

/* ── Main landing ── */
const FEATURES = [
    { icon: IconHierarchy2, title: 'Visual Flow Builder', desc: 'Drag-and-drop canvas with 100+ AI nodes. Build complex pipelines without touching code.', color: '#009EFF' },
    { icon: IconUsersGroup, title: 'Multi-Agent Orchestration', desc: 'Coordinate multiple AI agents with conditional logic and parallel execution.', color: '#A855F7' },
    { icon: IconBrain, title: 'Universal Model Hub', desc: 'GPT-4o, Claude, Gemini, Llama, Mistral and 20+ models. Switch with one click.', color: '#00C8FF' },
    { icon: IconDatabase, title: 'Vector Knowledge Base', desc: 'Ingest PDFs, URLs, and docs. Power semantic RAG pipelines in minutes.', color: '#00FF6A' },
    { icon: IconApi, title: 'One-Click Deploy', desc: 'Publish any flow as a REST API endpoint. Auth, rate limiting and monitoring included.', color: '#F59E0B' },
    { icon: IconChartBar, title: 'Real-time Observability', desc: 'Monitor tokens, latency, errors, and cost across every deployed flow in real time.', color: '#EF4444' }
]

const STEPS = [
    { n: '01', title: 'Design', desc: 'Drop nodes onto the infinite canvas, configure each step, connect with edges.', icon: IconWand, color: '#009EFF' },
    { n: '02', title: 'Test', desc: 'Run interactively, inspect every node output, tweak until perfect.', icon: IconPlayerPlay, color: '#A855F7' },
    { n: '03', title: 'Deploy', desc: 'One click publishes a production REST endpoint, ready to call from anywhere.', icon: IconRocket, color: '#00FF6A' }
]

const TESTIMONIALS = [
    { quote: 'Haxon Flow cut our AI feature development time by 70%. We shipped a full customer support agent in two days.', author: 'Sarah Chen', role: 'CTO, Meridian Labs', color: '#009EFF', initials: 'SC' },
    { quote: "The canvas makes it easy for non-engineers to build complex workflows. It's genuinely revolutionary for our team.", author: 'Marcus Williams', role: 'Head of Product, Nexus AI', color: '#A855F7', initials: 'MW' },
    { quote: 'We replaced 3 separate ML microservices with one Haxon Flow pipeline. Costs down 60%, reliability dramatically up.', author: 'Priya Nair', role: 'Data Engineering Lead, Stackr', color: '#00FF6A', initials: 'PN' }
]

export default function Landing() {
    useReveal()
    const { play } = useSound()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleCTA = useCallback(() => { play('click') }, [play])

    return (
        <div className='min-h-screen bg-background text-foreground overflow-x-hidden font-body'>

            {/* ── Nav ── */}
            <nav className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-border/30 bg-background/80 backdrop-blur-2xl'>
                <Logo />
                <div className='hidden md:flex items-center gap-8 text-sm text-muted-foreground'>
                    {['Features', 'Docs', 'Templates', 'Pricing'].map((item) => (
                        <a key={item} href='#' onClick={() => play('hover')}
                            className='hover:text-foreground transition-colors relative group'>
                            {item}
                            <span className='absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all group-hover:w-full' />
                        </a>
                    ))}
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' asChild onClick={handleCTA}>
                        <Link to='/auth/login'>Sign In</Link>
                    </Button>
                    <Button variant='gradient' size='sm' asChild onClick={handleCTA}>
                        <Link to='/chatflows'>Open Studio <IconArrowRight size={13} /></Link>
                    </Button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className='relative flex flex-col items-center justify-center min-h-screen px-5 sm:px-8 pt-28 pb-20 text-center overflow-hidden'>
                <NeuralCanvas />
                <div className='absolute inset-0 bg-grid opacity-20 pointer-events-none' />
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/6 blur-[150px] pointer-events-none' />
                <div className='absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-purple/4 blur-[100px] pointer-events-none' />

                <div className='relative z-10 max-w-5xl mx-auto'>
                    <div className='animate-slide-up flex justify-center mb-6'>
                        <Badge variant='outline' className='gap-2 px-4 py-1.5 text-xs font-mono border-primary/30 bg-primary/5 text-primary'>
                            <span className='h-1.5 w-1.5 rounded-full bg-primary animate-pulse' />
                            AI Workflow Studio · Now in Beta
                            <IconArrowUpRight size={11} />
                        </Badge>
                    </div>

                    <h1 className='animate-slide-up stagger-1 font-serif text-6xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight mb-6'>
                        <span className='text-foreground'>Build AI</span>
                        <br />
                        <em className='gradient-text not-italic'>Workflows</em>
                        <br />
                        <span className='text-foreground/50 text-5xl sm:text-6xl md:text-7xl font-display font-normal'>Visually. Ship Fast.</span>
                    </h1>

                    <p className='animate-slide-up stagger-2 max-w-lg mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-10'>
                        Connect LLMs, tools, and data in a drag-and-drop canvas. No infrastructure. No boilerplate. Just outcomes.
                    </p>

                    <div className='animate-slide-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-3 mb-16'>
                        <Button variant='glow' size='xl' asChild className='glow-primary w-full sm:w-auto' onClick={handleCTA}>
                            <Link to='/chatflows'>
                                Open Studio <IconArrowRight size={16} />
                            </Link>
                        </Button>
                        <Button variant='outline' size='xl' asChild className='w-full sm:w-auto' onClick={handleCTA}>
                            <Link to='/auth/signup'>
                                Start Free <IconSparkles size={14} />
                            </Link>
                        </Button>
                    </div>

                    {/* Product preview */}
                    <div className='animate-slide-up stagger-4 relative mx-auto max-w-4xl'>
                        <div className='border-gradient rounded-2xl p-1 shadow-2xl shadow-primary/10'>
                            <div className='rounded-xl bg-background/90 overflow-hidden border border-border/50'>
                                {/* Toolbar */}
                                <div className='flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-card/40'>
                                    <div className='flex gap-1.5'>
                                        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} className='h-3 w-3 rounded-full' style={{ background: c }} />)}
                                    </div>
                                    <div className='flex-1 mx-4 h-5 rounded bg-secondary/60 text-[10px] font-mono text-muted-foreground flex items-center px-3'>
                                        canvas · untitled-flow-1
                                    </div>
                                    <div className='text-[10px] font-mono text-success flex items-center gap-1'>
                                        <span className='h-1.5 w-1.5 rounded-full bg-success animate-pulse' /> saved
                                    </div>
                                </div>
                                {/* Canvas */}
                                <div className='relative h-52 sm:h-72 overflow-hidden bg-background/80'>
                                    <div className='absolute inset-0 bg-dot opacity-15' />
                                    {[
                                        { x: '4%', y: '22%', label: 'HTTP Trigger', color: '#009EFF', type: 'Trigger' },
                                        { x: '26%', y: '12%', label: 'GPT-4o', color: '#A855F7', type: 'LLM' },
                                        { x: '26%', y: '55%', label: 'Buffer Memory', color: '#00C8FF', type: 'Memory' },
                                        { x: '52%', y: '28%', label: 'Web Search', color: '#F59E0B', type: 'Tool' },
                                        { x: '52%', y: '64%', label: 'Output Parser', color: '#00FF6A', type: 'Parser' },
                                        { x: '78%', y: '42%', label: 'API Response', color: '#009EFF', type: 'Output' }
                                    ].map((node, i) => (
                                        <div key={i} className='absolute animate-slide-up' style={{ left: node.x, top: node.y, animationDelay: `${0.6 + i * 0.1}s` }}>
                                            <div className='rounded-lg border px-2.5 py-1.5 text-[9px] font-mono shadow-lg backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer'
                                                style={{ borderColor: node.color + '45', background: node.color + '12', color: node.color }}>
                                                <div className='text-[7px] uppercase tracking-widest mb-0.5 opacity-60'>{node.type}</div>
                                                <div className='font-semibold'>{node.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <svg className='absolute inset-0 w-full h-full pointer-events-none' style={{ opacity: 0.35 }}>
                                        <defs>
                                            <marker id='arr' markerWidth='6' markerHeight='6' refX='3' refY='3' orient='auto'>
                                                <path d='M0,0 L0,6 L6,3 z' fill='#009EFF' opacity='0.6' />
                                            </marker>
                                            <linearGradient id='lg1' x1='0' y1='0' x2='1' y2='0'>
                                                <stop offset='0%' stopColor='#009EFF' stopOpacity='0.5' />
                                                <stop offset='100%' stopColor='#A855F7' stopOpacity='0.5' />
                                            </linearGradient>
                                        </defs>
                                        {[
                                            ['10%', '35%', '26%', '25%'],
                                            ['10%', '35%', '26%', '68%'],
                                            ['43%', '25%', '52%', '40%'],
                                            ['43%', '68%', '52%', '74%'],
                                            ['68%', '40%', '78%', '54%'],
                                            ['68%', '74%', '78%', '56%'],
                                        ].map(([x1, y1, x2, y2], i) => (
                                            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                                stroke='url(#lg1)' strokeWidth='1.5' strokeDasharray='5 3'
                                                markerEnd='url(#arr)' />
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/15 blur-3xl rounded-full pointer-events-none' />
                    </div>
                </div>
            </section>

            {/* ── Marquee ── */}
            <Marquee />

            {/* ── Stats ── */}
            <section className='py-20 px-5 sm:px-8'>
                <div className='max-w-5xl mx-auto'>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
                        {[
                            { value: '100', suffix: '+', label: 'AI Nodes' },
                            { value: '20', suffix: '+', label: 'LLM Providers' },
                            { value: '50', suffix: '+', label: 'Integrations' },
                            { value: '99.9', suffix: '%', label: 'Uptime SLA' }
                        ].map((s) => (
                            <div key={s.label} className='reveal-hidden text-center p-6 glass rounded-2xl border-gradient'>
                                <div className='font-display text-4xl sm:text-5xl font-bold gradient-text leading-none mb-2'>
                                    <Counter target={s.value + s.suffix} />{s.suffix}
                                </div>
                                <div className='text-sm text-muted-foreground'>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features bento ── */}
            <section className='py-20 px-5 sm:px-8'>
                <div className='max-w-6xl mx-auto'>
                    <div className='text-center mb-16 reveal-hidden'>
                        <Badge variant='outline' className='mb-4 text-xs font-mono border-primary/30 bg-primary/5 text-primary'>Platform</Badge>
                        <h2 className='font-serif text-4xl sm:text-5xl text-foreground mb-4 leading-tight'>
                            Everything you need to<br /><em className='gradient-text not-italic'>build AI, fast.</em>
                        </h2>
                        <p className='text-muted-foreground max-w-md mx-auto text-sm'>From rapid prototyping to production deployment — every tool in one place.</p>
                    </div>

                    {/* Bento grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {FEATURES.map((f, i) => (
                            <BentoCard key={f.title} {...f} className={cn('stagger-' + (i + 1), i === 0 && 'sm:col-span-2 lg:col-span-1')}>
                                {i === 0 && (
                                    <div className='mt-4 flex gap-2 flex-wrap'>
                                        {['Drag & Drop', 'No Code', '100+ Nodes'].map((t) => (
                                            <span key={t} className='text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/20 bg-primary/8 text-primary'>{t}</span>
                                        ))}
                                    </div>
                                )}
                            </BentoCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className='py-24 px-5 sm:px-8 relative overflow-hidden'>
                <div className='absolute inset-0 bg-grid opacity-15 pointer-events-none' />
                <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent' />
                <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent' />
                <div className='relative max-w-5xl mx-auto'>
                    <div className='text-center mb-16 reveal-hidden'>
                        <Badge variant='outline' className='mb-4 text-xs font-mono border-purple/30 bg-purple/5 text-purple'>How it works</Badge>
                        <h2 className='font-serif text-4xl sm:text-5xl text-foreground leading-tight'>
                            Idea to production<br /><em className='gradient-text-purple not-italic'>in minutes, not months.</em>
                        </h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 relative'>
                        {/* Connector lines */}
                        <div className='hidden md:block absolute top-14 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary/30 to-purple/30' />
                        <div className='hidden md:block absolute top-14 left-2/3 right-0 h-px bg-gradient-to-r from-purple/30 to-neon/30' />
                        {STEPS.map((s, i) => (
                            <div key={s.n} className='reveal-hidden flex flex-col items-center text-center group' style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className='relative mb-6'>
                                    <div className='h-16 w-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110'
                                        style={{ background: s.color + '15', border: `1px solid ${s.color}30` }}>
                                        <s.icon size={26} style={{ color: s.color }} />
                                    </div>
                                    <div className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center'>
                                        <span className='font-mono text-[9px] font-bold text-muted-foreground'>{s.n}</span>
                                    </div>
                                </div>
                                <h3 className='font-display text-lg font-semibold mb-2' style={{ color: s.color }}>{s.title}</h3>
                                <p className='text-sm text-muted-foreground leading-relaxed max-w-xs'>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className='mt-12 text-center reveal-hidden'>
                        <Button variant='outline' size='lg' asChild onClick={handleCTA}>
                            <Link to='/chatflows'>See it in action <IconArrowRight size={15} /></Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Code / Visual split ── */}
            <section className='py-24 px-5 sm:px-8'>
                <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
                    <div className='reveal-hidden'>
                        <Badge variant='outline' className='mb-4 text-xs font-mono border-neon/30 bg-neon/5 text-neon'>Developer First</Badge>
                        <h2 className='font-serif text-4xl text-foreground mb-4 leading-tight'>
                            Visual canvas,<br /><em className='gradient-text-neon not-italic'>API-first output.</em>
                        </h2>
                        <p className='text-muted-foreground text-sm leading-relaxed mb-6'>Every flow you build becomes a production REST API endpoint. Your team gets the visual interface, your engineers get a clean API. Everyone wins.</p>
                        <div className='space-y-3'>
                            {['One-click deployment with auth + rate limiting', 'OpenAPI spec auto-generated', 'WebSocket streaming support', 'SDK for Python, TypeScript & REST'].map((f) => (
                                <div key={f} className='flex items-center gap-3 text-sm text-muted-foreground'>
                                    <IconCheck size={14} className='text-neon shrink-0' /> {f}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='reveal-hidden'>
                        <div className='glass rounded-2xl border border-border overflow-hidden'>
                            <div className='flex items-center gap-2 px-4 py-2.5 bg-secondary/30 border-b border-border'>
                                <IconTerminal2 size={13} className='text-muted-foreground' />
                                <span className='text-xs font-mono text-muted-foreground'>bash</span>
                            </div>
                            <pre className='p-5 text-xs font-mono leading-relaxed overflow-auto scrollbar-hidden'><code>
                                <span className='text-muted-foreground'># Call your flow as a REST API</span>{'\n'}
                                <span className='text-neon'>curl</span> <span className='text-primary'>-X POST</span> \{'\n'}
                                {'  '}<span className='text-foreground'>https://api.haxon.io/v1/flows/</span><span className='text-warning'>support-bot</span> \{'\n'}
                                {'  '}<span className='text-primary'>-H</span> <span className='text-foreground'>"Authorization: Bearer <span className='text-warning'>hxn_...</span>"</span> \{'\n'}
                                {'  '}<span className='text-primary'>-d</span> <span className='text-cyan'>'{"{"}"message":"Help with billing{"}"}'</span>{'\n'}{'\n'}
                                <span className='text-muted-foreground'># Response</span>{'\n'}
                                <span className='text-foreground'>{'{'}</span>{'\n'}
                                {'  '}<span className='text-primary'>"response"</span><span className='text-foreground'>: </span><span className='text-cyan'>"I'd be happy to help..."</span><span className='text-foreground'>,</span>{'\n'}
                                {'  '}<span className='text-primary'>"tokens"</span><span className='text-foreground'>: </span><span className='text-neon'>142</span><span className='text-foreground'>,</span>{'\n'}
                                {'  '}<span className='text-primary'>"latency_ms"</span><span className='text-foreground'>: </span><span className='text-neon'>312</span>{'\n'}
                                <span className='text-foreground'>{'}'}</span>
                            </code></pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className='py-24 px-5 sm:px-8 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent pointer-events-none' />
                <div className='relative max-w-6xl mx-auto'>
                    <div className='text-center mb-16 reveal-hidden'>
                        <Badge variant='outline' className='mb-4 text-xs font-mono border-warning/30 bg-warning/5 text-warning'>Testimonials</Badge>
                        <h2 className='font-serif text-4xl sm:text-5xl text-foreground leading-tight'>
                            Builders who ship<br /><em className='gradient-text not-italic'>faster with Haxon.</em>
                        </h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className={cn('reveal-hidden card-hover glass rounded-2xl p-6 border border-border', `stagger-${i + 1}`)}>
                                <div className='flex gap-0.5 mb-4'>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <IconStar key={j} size={13} className='text-warning fill-warning' />
                                    ))}
                                </div>
                                <p className='text-sm text-foreground/80 leading-relaxed mb-6 font-serif italic'>"{t.quote}"</p>
                                <div className='flex items-center gap-3 pt-4 border-t border-border'>
                                    <div className='h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-white font-display'
                                        style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className='text-sm font-semibold text-foreground'>{t.author}</div>
                                        <div className='text-xs text-muted-foreground'>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className='py-32 px-5 sm:px-8 text-center relative overflow-hidden'>
                <div className='absolute inset-0 bg-grid opacity-15 pointer-events-none' />
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/4 to-transparent pointer-events-none' />
                <div className='absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent' />
                <div className='absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent' />
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none' />

                <div className='relative max-w-3xl mx-auto reveal-hidden'>
                    <Badge variant='outline' className='mb-6 text-xs font-mono border-primary/30 bg-primary/8 text-primary gap-2'>
                        <IconSparkles size={11} /> No credit card · No backend
                    </Badge>
                    <h2 className='font-serif text-5xl sm:text-6xl md:text-7xl text-foreground leading-[0.95] mb-6'>
                        Start building<br /><em className='gradient-text not-italic'>AI, visually.</em>
                    </h2>
                    <p className='text-muted-foreground text-lg mb-10'>Open the studio and drag your first node in 30 seconds. No setup required.</p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-8'>
                        <Button variant='glow' size='xl' asChild className='glow-primary w-full sm:w-auto' onClick={handleCTA}>
                            <Link to='/chatflows'>Open Studio Free <IconArrowRight size={16} /></Link>
                        </Button>
                        <Button variant='outline' size='xl' asChild className='w-full sm:w-auto' onClick={handleCTA}>
                            <Link to='/auth/signup'>Create Account</Link>
                        </Button>
                    </div>
                    <div className='flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground'>
                        {['No credit card', 'Open source friendly', '2-minute setup'].map((t) => (
                            <span key={t} className='flex items-center gap-1.5'>
                                <IconCheck size={11} className='text-neon' /> {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className='border-t border-border py-10 px-5 sm:px-8'>
                <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5'>
                    <Logo />
                    <p className='text-xs text-muted-foreground'>© 2026 Haxon Flow · AI Workflow Studio</p>
                    <div className='flex items-center gap-6 text-xs text-muted-foreground'>
                        {['Privacy', 'Terms', 'Docs', 'GitHub'].map((t) => (
                            <a key={t} href='#' className='hover:text-foreground transition-colors'>{t}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
