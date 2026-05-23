import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
    IconArrowRight, IconBolt, IconBrain, IconShield, IconApi, IconChartBar,
    IconPlugConnected, IconStar, IconHierarchy2, IconUsersGroup,
    IconTool, IconDatabase, IconCheck
} from '@tabler/icons-react'
import { Logo } from '@/components/layout/Logo'

/* ── Animated node graph canvas ── */
function NodeCanvas() {
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animFrame
        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const nodes = Array.from({ length: 14 }, (_, i) => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 3 + 2,
            color: ['#6366F1', '#22D3EE', '#A855F7', '#10B981'][i % 4],
            pulse: Math.random() * Math.PI * 2,
        }))

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            nodes.forEach((n) => {
                n.x += n.vx; n.y += n.vy; n.pulse += 0.02
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1

                nodes.forEach((m) => {
                    const dx = n.x - m.x, dy = n.y - m.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 160) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 160)})`
                        ctx.lineWidth = 0.8
                        ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y)
                        ctx.stroke()
                    }
                })

                const glow = (Math.sin(n.pulse) + 1) / 2
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3 + glow * 4)
                grad.addColorStop(0, n.color + 'cc')
                grad.addColorStop(1, n.color + '00')
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.r * 3 + glow * 4, 0, Math.PI * 2)
                ctx.fillStyle = grad; ctx.fill()

                ctx.beginPath()
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
                ctx.fillStyle = n.color; ctx.fill()
            })
            animFrame = requestAnimationFrame(animate)
        }
        animate()
        return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize) }
    }, [])
    return <canvas ref={canvasRef} className='absolute inset-0 w-full h-full opacity-60' />
}

const FEATURES = [
    { icon: IconHierarchy2, title: 'Visual Flow Builder', desc: 'Drag-and-drop canvas with 100+ AI nodes. No code required.', color: '#6366F1' },
    { icon: IconUsersGroup, title: 'Multi-Agent Orchestration', desc: 'Coordinate multiple AI agents with conditional logic and parallel execution.', color: '#A855F7' },
    { icon: IconBrain, title: 'Model Hub', desc: 'Connect GPT-4o, Claude, Gemini, Llama and 20+ models in one interface.', color: '#22D3EE' },
    { icon: IconDatabase, title: 'Vector Knowledge Base', desc: 'Ingest PDFs, docs, and URLs. Power RAG pipelines with semantic search.', color: '#10B981' },
    { icon: IconApi, title: 'One-Click Deploy', desc: 'Publish any flow as a REST API endpoint with auth and rate limiting.', color: '#F59E0B' },
    { icon: IconChartBar, title: 'Real-time Analytics', desc: 'Monitor token usage, latency, errors and cost across all deployed flows.', color: '#EF4444' },
]

const STATS = [
    { value: '100+', label: 'AI Nodes' },
    { value: '20+', label: 'LLM Providers' },
    { value: '50+', label: 'Integrations' },
    { value: '99.9%', label: 'Uptime SLA' },
]

const TESTIMONIALS = [
    { quote: 'Haxon Flow cut our AI feature development time by 70%. We shipped a customer support agent in two days.', author: 'Sarah Chen', role: 'CTO, Meridian Labs', initials: 'SC', color: '#6366F1' },
    { quote: "The visual canvas makes it incredibly easy for non-engineers to build complex workflows. It's genuinely revolutionary.", author: 'Marcus Williams', role: 'Head of Product, Nexus AI', initials: 'MW', color: '#A855F7' },
    { quote: 'We replaced 3 separate ML services with one Haxon Flow pipeline. Costs down 60%, reliability up.', author: 'Priya Nair', role: 'Data Engineering Lead, Stackr', initials: 'PN', color: '#22D3EE' },
]

export default function Landing() {
    return (
        <div className='min-h-screen bg-background text-foreground font-body overflow-x-hidden'>

            {/* ── Nav ── */}
            <nav className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/70 backdrop-blur-xl'>
                <Logo />
                <div className='hidden md:flex items-center gap-8 text-sm text-muted-foreground'>
                    {['Features', 'Templates', 'Docs', 'Pricing'].map((item) => (
                        <a key={item} href='#' className='hover:text-foreground transition-colors'>{item}</a>
                    ))}
                </div>
                <div className='flex items-center gap-3'>
                    <Button variant='ghost' size='sm' asChild>
                        <Link to='/chatflows'>Sign In</Link>
                    </Button>
                    <Button variant='gradient' size='sm' asChild>
                        <Link to='/chatflows'>Start Free <IconArrowRight size={14} /></Link>
                    </Button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className='relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center overflow-hidden'>
                <NodeCanvas />

                {/* Grid bg */}
                <div className='absolute inset-0 bg-grid opacity-30' />

                {/* Radial glow */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none' />
                <div className='absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan/6 blur-[100px] pointer-events-none' />

                {/* Content */}
                <div className='relative z-10 max-w-4xl mx-auto'>
                    <div className='animate-slide-up'>
                        <Badge variant='cyan' className='mb-6 px-4 py-1.5 text-xs font-mono gap-2'>
                            <span className='h-1.5 w-1.5 rounded-full bg-cyan animate-pulse' />
                            AI Workflow Studio — Now in Beta
                        </Badge>
                    </div>

                    <h1 className='animate-slide-up stagger-1 font-display text-5xl sm:text-6xl md:text-7xl font-800 tracking-tight leading-none mb-6'>
                        Build{' '}
                        <span className='gradient-text'>AI Workflows</span>
                        <br />
                        <span className='text-foreground/70'>Visually. Ship Fast.</span>
                    </h1>

                    <p className='animate-slide-up stagger-2 max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed mb-10'>
                        Connect LLMs, tools, and data sources in a drag-and-drop canvas.
                        No infrastructure. No boilerplate. Just outcomes.
                    </p>

                    <div className='animate-slide-up stagger-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'>
                        <Button variant='glow' size='xl' asChild className='w-full sm:w-auto'>
                            <Link to='/chatflows'>
                                Open Studio
                                <IconArrowRight size={18} />
                            </Link>
                        </Button>
                        <Button variant='outline' size='xl' asChild className='w-full sm:w-auto'>
                            <Link to='/marketplaces'>
                                Browse Templates
                            </Link>
                        </Button>
                    </div>

                    {/* Floating node preview */}
                    <div className='animate-slide-up stagger-4 relative mx-auto max-w-3xl'>
                        <div className='border-gradient rounded-2xl p-4 glass shadow-2xl shadow-primary/10'>
                            {/* Mock canvas preview */}
                            <div className='relative rounded-xl bg-background/80 overflow-hidden h-52 sm:h-64 border border-border/50'>
                                <div className='absolute inset-0 bg-dot opacity-20' />
                                {/* Fake node cards */}
                                {[
                                    { x: '8%', y: '20%', label: 'HTTP Trigger', color: '#6366F1', type: 'Trigger' },
                                    { x: '32%', y: '15%', label: 'GPT-4o', color: '#A855F7', type: 'LLM' },
                                    { x: '32%', y: '58%', label: 'Memory', color: '#22D3EE', type: 'Memory' },
                                    { x: '57%', y: '30%', label: 'Web Search', color: '#F59E0B', type: 'Tool' },
                                    { x: '57%', y: '62%', label: 'Parser', color: '#10B981', type: 'Chain' },
                                    { x: '80%', y: '42%', label: 'Response', color: '#6366F1', type: 'Output' },
                                ].map((node, i) => (
                                    <div
                                        key={i}
                                        className='absolute flex flex-col gap-0.5'
                                        style={{ left: node.x, top: node.y, animationDelay: `${i * 0.1}s` }}
                                    >
                                        <div className={cn('rounded-lg border px-2 py-1.5 text-[9px] font-mono shadow-lg backdrop-blur-sm animate-slide-up')}
                                            style={{
                                                borderColor: node.color + '40',
                                                background: node.color + '12',
                                                color: node.color,
                                                animationDelay: `${0.5 + i * 0.08}s`
                                            }}>
                                            <div className='text-[8px] text-muted-foreground uppercase tracking-wider mb-0.5'>{node.type}</div>
                                            {node.label}
                                        </div>
                                    </div>
                                ))}
                                {/* SVG connector lines */}
                                <svg className='absolute inset-0 w-full h-full pointer-events-none opacity-40'>
                                    <defs>
                                        <linearGradient id='lineGrad' x1='0' y1='0' x2='1' y2='0'>
                                            <stop offset='0%' stopColor='#6366F1' stopOpacity='0.6'/>
                                            <stop offset='100%' stopColor='#22D3EE' stopOpacity='0.6'/>
                                        </linearGradient>
                                    </defs>
                                    <line x1='14%' y1='35%' x2='32%' y2='28%' stroke='url(#lineGrad)' strokeWidth='1.5' strokeDasharray='4 3'/>
                                    <line x1='14%' y1='35%' x2='32%' y2='68%' stroke='url(#lineGrad)' strokeWidth='1.5' strokeDasharray='4 3'/>
                                    <line x1='47%' y1='28%' x2='57%' y2='38%' stroke='url(#lineGrad)' strokeWidth='1.5' strokeDasharray='4 3'/>
                                    <line x1='47%' y1='68%' x2='57%' y2='68%' stroke='url(#lineGrad)' strokeWidth='1.5' strokeDasharray='4 3'/>
                                    <line x1='70%' y1='38%' x2='80%' y2='50%' stroke='url(#lineGrad)' strokeWidth='1.5' strokeDasharray='4 3'/>
                                    <line x1='70%' y1='68%' x2='80%' y2='54%' stroke='url(#lineGrad)' strokeWidth='1.5' strokeDasharray='4 3'/>
                                </svg>
                            </div>
                        </div>
                        {/* Bottom glow */}
                        <div className='absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-primary/20 blur-2xl rounded-full' />
                    </div>
                </div>
            </section>

            {/* ── Stats bar ── */}
            <section className='relative border-y border-border py-12 px-6 overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent' />
                <div className='relative max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center'>
                    {STATS.map(({ value, label }) => (
                        <div key={label} className='animate-slide-up'>
                            <div className='font-display text-4xl font-800 gradient-text mb-1'>{value}</div>
                            <div className='text-sm text-muted-foreground'>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ── */}
            <section className='py-24 px-6'>
                <div className='max-w-5xl mx-auto'>
                    <div className='text-center mb-16'>
                        <Badge variant='default' className='mb-4 text-xs font-mono'>Everything you need</Badge>
                        <h2 className='font-display text-4xl font-700 tracking-tight mb-4'>
                            The complete AI workflow platform
                        </h2>
                        <p className='text-muted-foreground max-w-md mx-auto'>
                            From rapid prototyping to production deployment — every tool you need, in one place.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon
                            return (
                                <div
                                    key={f.title}
                                    className={cn('card-hover glass rounded-xl p-6 border border-border relative overflow-hidden group animate-slide-up', `stagger-${i + 1}`)}
                                >
                                    {/* Corner glow */}
                                    <div className='absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity'
                                        style={{ background: f.color }} />
                                    {/* Icon */}
                                    <div className='mb-4 inline-flex rounded-xl p-2.5' style={{ background: f.color + '18', border: `1px solid ${f.color}28` }}>
                                        <Icon size={20} style={{ color: f.color }} />
                                    </div>
                                    <h3 className='font-display text-base font-semibold mb-2'>{f.title}</h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>{f.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className='py-24 px-6 border-y border-border relative overflow-hidden'>
                <div className='absolute inset-0 bg-grid opacity-20' />
                <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent' />
                <div className='relative max-w-4xl mx-auto text-center'>
                    <Badge variant='purple' className='mb-4 text-xs font-mono'>How it works</Badge>
                    <h2 className='font-display text-4xl font-700 tracking-tight mb-16'>
                        From idea to production in minutes
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {[
                            { step: '01', title: 'Design the flow', desc: 'Drag nodes onto the canvas, connect them with edges, configure each step.', icon: IconHierarchy2 },
                            { step: '02', title: 'Test & evaluate', desc: 'Run the flow interactively, inspect every step, adjust until perfect.', icon: IconBolt },
                            { step: '03', title: 'Deploy as API', desc: 'One click to publish. Get a REST endpoint you can call from anywhere.', icon: IconApi },
                        ].map((s, i) => (
                            <div key={s.step} className={cn('relative animate-slide-up', `stagger-${i + 2}`)}>
                                <div className='text-[80px] font-display font-800 text-border/40 leading-none mb-4'>{s.step}</div>
                                <s.icon size={28} className='text-primary mb-3 mx-auto' />
                                <h3 className='font-display text-lg font-semibold mb-2'>{s.title}</h3>
                                <p className='text-sm text-muted-foreground'>{s.desc}</p>
                                {i < 2 && (
                                    <div className='hidden md:block absolute top-16 right-0 translate-x-1/2 text-border/40'>
                                        <IconArrowRight size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className='py-24 px-6'>
                <div className='max-w-5xl mx-auto'>
                    <div className='text-center mb-14'>
                        <Badge variant='warning' className='mb-4 text-xs font-mono'>Loved by builders</Badge>
                        <h2 className='font-display text-4xl font-700 tracking-tight'>
                            Teams shipping faster with Haxon Flow
                        </h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className={cn('card-hover glass rounded-xl p-6 border border-border animate-slide-up', `stagger-${i + 1}`)}>
                                <div className='flex gap-1 mb-4'>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <IconStar key={j} size={12} className='text-warning fill-warning' />
                                    ))}
                                </div>
                                <p className='text-sm text-foreground/80 leading-relaxed mb-6 italic'>"{t.quote}"</p>
                                <div className='flex items-center gap-3'>
                                    <div className='h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white'
                                        style={{ background: t.color }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className='text-sm font-semibold'>{t.author}</div>
                                        <div className='text-xs text-muted-foreground'>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className='py-24 px-6 text-center relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent' />
                <div className='absolute inset-0 bg-grid opacity-20' />
                <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent' />
                <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent' />

                <div className='relative max-w-2xl mx-auto'>
                    <h2 className='font-display text-5xl font-800 tracking-tight mb-6'>
                        Start building with <span className='gradient-text'>AI, visually.</span>
                    </h2>
                    <p className='text-muted-foreground mb-10 text-lg'>
                        No signup required. Open the studio and start dragging nodes in seconds.
                    </p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                        <Button variant='glow' size='xl' asChild>
                            <Link to='/chatflows'>
                                Open Studio for Free
                                <IconArrowRight size={18} />
                            </Link>
                        </Button>
                        <Button variant='outline' size='xl' asChild>
                            <Link to='/marketplaces'>
                                Browse Templates
                            </Link>
                        </Button>
                    </div>
                    <div className='flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground'>
                        {['No credit card', 'No backend required', 'Open source friendly'].map((t) => (
                            <div key={t} className='flex items-center gap-1.5'>
                                <IconCheck size={12} className='text-success' />
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className='border-t border-border py-10 px-6'>
                <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <Logo />
                    <p className='text-xs text-muted-foreground'>
                        © 2026 Haxon Flow. AI Workflow Studio.
                    </p>
                    <div className='flex items-center gap-6 text-xs text-muted-foreground'>
                        <a href='#' className='hover:text-foreground transition-colors'>Privacy</a>
                        <a href='#' className='hover:text-foreground transition-colors'>Terms</a>
                        <a href='#' className='hover:text-foreground transition-colors'>Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
