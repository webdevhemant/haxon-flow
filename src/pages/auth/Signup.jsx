import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSound } from '@/hooks/useSound'
import { toast } from 'sonner'
import { IconArrowLeft, IconBrandGithub, IconBrandGoogle, IconEye, IconEyeOff, IconCheck } from '@tabler/icons-react'

const PERKS = ['Free forever plan', 'No credit card required', 'Deploy unlimited flows', 'All LLM models included']

export default function Signup() {
    const navigate = useNavigate()
    const { play } = useSound()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.password) {
            toast.error('Fill all fields')
            return
        }
        if (form.password.length < 8) {
            toast.error('Password must be 8+ characters')
            return
        }
        setLoading(true)
        play('click')
        setTimeout(() => {
            setLoading(false)
            play('success')
            toast.success('Account created! Check your email.')
            navigate('/auth/verify-email')
        }, 1400)
    }

    return (
        <div className='min-h-screen bg-background flex'>
            {/* Left */}
            <div className='hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 bg-card/40 border-r border-border overflow-hidden'>
                <div className='absolute inset-0 bg-grid opacity-20 pointer-events-none' />
                <div className='absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-neon/6 blur-[100px] pointer-events-none' />
                <div className='absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-primary/8 blur-[80px] pointer-events-none' />
                <div className='relative z-10 max-w-sm'>
                    <h2 className='font-serif text-4xl text-foreground mb-6 leading-tight'>
                        Everything you need to
                        <br />
                        <em className='gradient-text-neon not-italic'>ship AI faster.</em>
                    </h2>
                    <div className='space-y-3'>
                        {PERKS.map((p) => (
                            <div key={p} className='flex items-center gap-3 text-sm text-muted-foreground'>
                                <div className='h-5 w-5 rounded-full bg-neon/15 border border-neon/30 flex items-center justify-center shrink-0'>
                                    <IconCheck size={11} className='text-neon' />
                                </div>
                                {p}
                            </div>
                        ))}
                    </div>
                    <div className='mt-10 glass rounded-xl p-4 border-gradient'>
                        <p className='text-xs text-muted-foreground italic leading-relaxed'>
                            "We shipped a production AI support agent in 2 days. Haxon Flow is genuinely magical."
                        </p>
                        <div className='flex items-center gap-2 mt-3'>
                            <div className='h-7 w-7 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-xs font-bold text-white'>
                                S
                            </div>
                            <div className='text-xs'>
                                <span className='font-semibold text-foreground'>Sarah C.</span>{' '}
                                <span className='text-muted-foreground'>· CTO, Meridian Labs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className='flex-1 flex flex-col items-center justify-center p-8 relative'>
                <div className='absolute inset-0 bg-dot opacity-10 pointer-events-none' />
                <div className='relative w-full max-w-sm animate-slide-up'>
                    <Link
                        to='/chatflows'
                        onClick={() => play('click')}
                        className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8'
                    >
                        <IconArrowLeft size={13} /> Back to Dashboard
                    </Link>
                    <div className='mb-8'>
                        <h1 className='font-display text-2xl font-bold text-foreground mb-1'>Create your account</h1>
                        <p className='text-sm text-muted-foreground'>Start building AI workflows for free</p>
                    </div>

                    <div className='grid grid-cols-2 gap-3 mb-6'>
                        {[
                            { icon: IconBrandGithub, label: 'GitHub' },
                            { icon: IconBrandGoogle, label: 'Google' }
                        ].map(({ icon: Icon, label }) => (
                            <Button
                                key={label}
                                variant='outline'
                                size='sm'
                                className='gap-2'
                                onClick={() => {
                                    play('click')
                                    toast.info(`${label} OAuth coming soon`)
                                }}
                            >
                                <Icon size={15} /> {label}
                            </Button>
                        ))}
                    </div>
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='flex-1 h-px bg-border' />
                        <span className='text-xs text-muted-foreground'>or</span>
                        <div className='flex-1 h-px bg-border' />
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Full Name</label>
                            <Input value={form.name} onChange={update('name')} placeholder='Jane Doe' autoFocus />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Email</label>
                            <Input type='email' value={form.email} onChange={update('email')} placeholder='you@company.com' />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Password</label>
                            <div className='relative'>
                                <Input
                                    type={showPw ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={update('password')}
                                    placeholder='8+ characters'
                                    className='pr-10'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPw(!showPw)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                >
                                    {showPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                                </button>
                            </div>
                        </div>
                        <Button type='submit' variant='gradient' className='w-full' disabled={loading} onClick={() => play('click')}>
                            {loading ? <span className='animate-pulse'>Creating account…</span> : 'Create Free Account'}
                        </Button>
                        <p className='text-center text-[10px] text-muted-foreground'>
                            By signing up you agree to our{' '}
                            <a href='#' className='underline hover:text-foreground'>
                                Terms
                            </a>{' '}
                            and{' '}
                            <a href='#' className='underline hover:text-foreground'>
                                Privacy Policy
                            </a>
                        </p>
                    </form>

                    <p className='mt-6 text-center text-xs text-muted-foreground'>
                        Already have an account?{' '}
                        <Link
                            to='/auth/login'
                            className='text-primary font-medium hover:text-primary/80 transition-colors'
                            onClick={() => play('click')}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
