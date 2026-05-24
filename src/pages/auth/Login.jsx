import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useSound } from '@/hooks/useSound'
import { toast } from 'sonner'
import { IconArrowLeft, IconBrandGithub, IconBrandGoogle, IconEye, IconEyeOff, IconBolt } from '@tabler/icons-react'

function NeuralBg() {
    return (
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
            <div className='absolute inset-0 bg-grid opacity-20' />
            <div className='absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px]' />
            <div className='absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple/6 blur-[100px]' />
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className='absolute rounded-full border border-primary/10 animate-float'
                    style={{
                        width: `${80 + i * 40}px`,
                        height: `${80 + i * 40}px`,
                        top: `${10 + i * 12}%`,
                        left: `${5 + i * 14}%`,
                        animationDelay: `${i * 0.8}s`,
                        opacity: 0.3 - i * 0.04
                    }}
                />
            ))}
        </div>
    )
}

export default function Login() {
    const navigate = useNavigate()
    const { play } = useSound()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Please fill all fields')
            return
        }
        setLoading(true)
        play('click')
        setTimeout(() => {
            setLoading(false)
            play('success')
            toast.success('Welcome back!')
            navigate('/chatflows')
        }, 1200)
    }

    return (
        <div className='min-h-screen bg-background flex'>
            {/* Left panel — brand */}
            <div className='hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 bg-card/40 border-r border-border overflow-hidden'>
                <NeuralBg />
                <div className='relative z-10 max-w-md text-center'>
                    <div className='inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/10'>
                        <IconBolt size={14} className='text-primary' />
                        <span className='text-xs font-mono text-primary'>Haxon Flow Studio</span>
                    </div>
                    <h2 className='font-serif text-5xl text-foreground mb-4 leading-tight'>
                        Build AI workflows <em className='gradient-text not-italic'>at the speed</em> of thought
                    </h2>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                        Drag, drop, connect. Deploy to production in minutes. Join thousands of AI builders using Haxon Flow.
                    </p>
                    <div className='mt-10 grid grid-cols-3 gap-4'>
                        {[
                            ['100+', 'AI Nodes'],
                            ['20+', 'LLM Models'],
                            ['99.9%', 'Uptime']
                        ].map(([v, l]) => (
                            <div key={l} className='glass rounded-xl p-4 text-center'>
                                <div className='font-display text-2xl font-bold gradient-text'>{v}</div>
                                <div className='text-xs text-muted-foreground mt-1'>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className='flex-1 flex flex-col items-center justify-center p-8 relative'>
                <div className='absolute inset-0 bg-dot opacity-10 pointer-events-none' />
                <div className='relative w-full max-w-sm animate-slide-up'>
                    {/* Back to dashboard */}
                    <Link
                        to='/chatflows'
                        onClick={() => play('click')}
                        className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8'
                    >
                        <IconArrowLeft size={13} /> Back to Dashboard
                    </Link>

                    <div className='mb-8'>
                        <h1 className='font-display text-2xl font-bold text-foreground mb-1'>Welcome back</h1>
                        <p className='text-sm text-muted-foreground'>Sign in to your Haxon Flow account</p>
                    </div>

                    {/* Social */}
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
                            <label className='text-xs font-medium text-muted-foreground'>Email</label>
                            <Input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='you@company.com'
                                autoFocus
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <div className='flex items-center justify-between'>
                                <label className='text-xs font-medium text-muted-foreground'>Password</label>
                                <Link
                                    to='/auth/reset-password'
                                    className='text-xs text-primary hover:text-primary/80 transition-colors'
                                    onClick={() => play('click')}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className='relative'>
                                <Input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='••••••••'
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
                            {loading ? <span className='animate-pulse'>Signing in…</span> : 'Sign In'}
                        </Button>
                    </form>

                    <p className='mt-6 text-center text-xs text-muted-foreground'>
                        No account?{' '}
                        <Link
                            to='/auth/signup'
                            className='text-primary hover:text-primary/80 transition-colors font-medium'
                            onClick={() => play('click')}
                        >
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
