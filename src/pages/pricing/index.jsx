import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/utils'
import { useSound } from '@/hooks/useSound'
import {
    IconCheck, IconX, IconArrowRight, IconBolt, IconInfinity,
    IconUsers, IconBuildingSkyscraper, IconSparkles
} from '@tabler/icons-react'

const PLANS = [
    {
        id: 'free',
        name: 'Starter',
        price: { monthly: 0, yearly: 0 },
        desc: 'Perfect for exploring and prototyping.',
        icon: IconSparkles,
        color: '#64748B',
        features: [
            { text: '5 active flows', included: true },
            { text: '1M tokens / month', included: true },
            { text: '10 API keys', included: true },
            { text: 'Community templates', included: true },
            { text: 'Basic analytics', included: true },
            { text: 'Custom domains', included: false },
            { text: 'Priority support', included: false },
            { text: 'SSO / SAML', included: false },
            { text: 'SLA guarantee', included: false }
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: { monthly: 49, yearly: 39 },
        desc: 'For teams shipping production AI products.',
        icon: IconBolt,
        color: '#009EFF',
        popular: true,
        features: [
            { text: 'Unlimited flows', included: true },
            { text: '10M tokens / month', included: true },
            { text: 'Unlimited API keys', included: true },
            { text: 'All templates + private', included: true },
            { text: 'Advanced analytics', included: true },
            { text: 'Custom domains', included: true },
            { text: 'Priority support', included: true },
            { text: 'SSO / SAML', included: false },
            { text: 'SLA guarantee', included: false }
        ]
    },
    {
        id: 'team',
        name: 'Team',
        price: { monthly: 149, yearly: 119 },
        desc: 'Multi-user workspaces with collaboration.',
        icon: IconUsers,
        color: '#A855F7',
        features: [
            { text: 'Unlimited flows', included: true },
            { text: '50M tokens / month', included: true },
            { text: 'Unlimited API keys', included: true },
            { text: 'All templates + private', included: true },
            { text: 'Advanced analytics', included: true },
            { text: 'Custom domains', included: true },
            { text: 'Priority support', included: true },
            { text: 'SSO / SAML', included: true },
            { text: '99.9% SLA guarantee', included: true }
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: { monthly: null, yearly: null },
        desc: 'Dedicated infra, compliance, and white-glove support.',
        icon: IconBuildingSkyscraper,
        color: '#00FF6A',
        features: [
            { text: 'Unlimited everything', included: true },
            { text: 'Custom token limits', included: true },
            { text: 'Dedicated infrastructure', included: true },
            { text: 'Private model hosting', included: true },
            { text: 'Full audit logs', included: true },
            { text: 'Custom domains', included: true },
            { text: 'Dedicated support team', included: true },
            { text: 'SSO / SAML + LDAP', included: true },
            { text: '99.99% SLA', included: true }
        ]
    }
]

const FAQS = [
    { q: 'Can I change plans at any time?', a: 'Yes. Upgrades take effect immediately and you\'ll be prorated. Downgrades apply at the end of your billing period.' },
    { q: 'What counts as a token?', a: 'Tokens are the units your LLM provider uses — roughly 4 characters. We count input + output tokens across all flow executions.' },
    { q: 'Is there a free trial for Pro?', a: 'Every new account gets a 14-day Pro trial automatically. No credit card required.' },
    { q: 'Can I self-host Haxon Flow?', a: 'An MIT-licensed self-hosted version is available on GitHub. Enterprise customers get dedicated managed deployments with SLAs.' },
    { q: 'What payment methods do you accept?', a: 'All major credit cards via Stripe, and annual invoicing for Enterprise plans.' }
]

export default function Pricing() {
    const [yearly, setYearly] = useState(false)
    const { play } = useSound()

    return (
        <div className='min-h-screen bg-background text-foreground' style={{ fontFamily: "'Manrope', sans-serif" }}>
            {/* Nav */}
            <nav className='sticky top-0 z-30 flex items-center justify-between px-5 sm:px-10 h-16 border-b border-border/25 bg-background/85 backdrop-blur-2xl'>
                <Logo />
                <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm' asChild onClick={() => play('click')}>
                        <Link to='/auth/login'>Sign In</Link>
                    </Button>
                    <Button variant='gradient' size='sm' asChild onClick={() => play('click')}>
                        <Link to='/chatflows'>Open Studio <IconArrowRight size={13} /></Link>
                    </Button>
                </div>
            </nav>

            <div className='max-w-6xl mx-auto px-5 sm:px-10 py-20'>
                {/* Header */}
                <div className='text-center mb-14'>
                    <Badge variant='outline' className='mb-4 text-xs font-mono border-primary/25 bg-primary/5 text-primary'>
                        Pricing
                    </Badge>
                    <h1 className='mb-4 leading-tight tracking-tight'
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                        Simple, honest pricing.
                    </h1>
                    <p className='text-muted-foreground text-base max-w-md mx-auto mb-8'>
                        Start free. Pay as you grow. No vendor lock-in — export your flows any time.
                    </p>

                    {/* Toggle */}
                    <div className='inline-flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-1'>
                        <button onClick={() => { setYearly(false); play('click') }}
                            className={cn('rounded-lg px-4 py-1.5 text-sm font-medium transition-all', !yearly ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>
                            Monthly
                        </button>
                        <button onClick={() => { setYearly(true); play('click') }}
                            className={cn('rounded-lg px-4 py-1.5 text-sm font-medium transition-all flex items-center gap-2', yearly ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>
                            Yearly
                            <span className='text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-full'>–20%</span>
                        </button>
                    </div>
                </div>

                {/* Plan cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20'>
                    {PLANS.map((plan) => {
                        const price = yearly ? plan.price.yearly : plan.price.monthly
                        const Icon = plan.icon
                        return (
                            <div key={plan.id}
                                className={cn('relative rounded-2xl border bg-card/60 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl',
                                    plan.popular ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02]' : 'border-border/60')}>
                                {plan.popular && (
                                    <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-cyan to-primary' />
                                )}
                                {plan.popular && (
                                    <div className='absolute top-3 right-3'>
                                        <Badge variant='cyan' className='text-[10px] font-mono px-2'>Most popular</Badge>
                                    </div>
                                )}
                                <div className='p-6 flex-1'>
                                    <div className='h-9 w-9 rounded-xl flex items-center justify-center mb-4'
                                        style={{ background: plan.color + '18', border: `1px solid ${plan.color}30` }}>
                                        <Icon size={16} style={{ color: plan.color }} />
                                    </div>
                                    <h2 className='font-display text-lg font-bold text-foreground mb-1'>{plan.name}</h2>
                                    <p className='text-xs text-muted-foreground mb-5 leading-relaxed'>{plan.desc}</p>
                                    <div className='mb-6'>
                                        {price === null ? (
                                            <div className='font-display text-3xl font-bold text-foreground'>Custom</div>
                                        ) : (
                                            <div className='flex items-end gap-1'>
                                                <span className='font-display text-3xl font-bold text-foreground'>${price}</span>
                                                <span className='text-xs text-muted-foreground mb-1'>/mo</span>
                                            </div>
                                        )}
                                        {yearly && price !== null && price > 0 && (
                                            <p className='text-[10px] text-muted-foreground mt-0.5'>Billed annually</p>
                                        )}
                                    </div>
                                    <div className='space-y-2.5'>
                                        {plan.features.map((f) => (
                                            <div key={f.text} className={cn('flex items-center gap-2 text-xs', f.included ? 'text-foreground' : 'text-muted-foreground/50')}>
                                                {f.included
                                                    ? <IconCheck size={13} className='shrink-0' style={{ color: plan.color }} />
                                                    : <IconX size={13} className='shrink-0 text-muted-foreground/30' />}
                                                {f.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='p-6 pt-0'>
                                    <Button
                                        variant={plan.popular ? 'gradient' : 'outline'}
                                        size='sm'
                                        className='w-full gap-2'
                                        asChild
                                        onClick={() => play('click')}
                                    >
                                        {plan.id === 'enterprise' ? (
                                            <a href='mailto:sales@haxon.ai'>Contact Sales <IconArrowRight size={12} /></a>
                                        ) : (
                                            <Link to='/auth/signup'>{plan.id === 'free' ? 'Start for free' : 'Get started'} <IconArrowRight size={12} /></Link>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* FAQ */}
                <div className='max-w-2xl mx-auto'>
                    <h2 className='text-center font-display text-2xl font-bold text-foreground mb-8'>Frequently asked questions</h2>
                    <div className='space-y-3'>
                        {FAQS.map((faq) => (
                            <details key={faq.q} className='group rounded-xl border border-border/60 bg-card/40 overflow-hidden'>
                                <summary className='flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-foreground select-none list-none'>
                                    {faq.q}
                                    <IconArrowRight size={14} className='shrink-0 text-muted-foreground transition-transform group-open:rotate-90' />
                                </summary>
                                <p className='px-5 pb-4 text-sm text-muted-foreground leading-relaxed'>{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className='text-center mt-20 py-12 rounded-2xl border border-border/50 bg-card/30'>
                    <h2 className='font-display text-2xl font-bold text-foreground mb-3'>Still have questions?</h2>
                    <p className='text-muted-foreground text-sm mb-6'>Talk to our team. We'll find the right plan for you.</p>
                    <Button variant='gradient' asChild onClick={() => play('click')}>
                        <a href='mailto:hello@haxon.ai'>Contact us <IconArrowRight size={14} /></a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
