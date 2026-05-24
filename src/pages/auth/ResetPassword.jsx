import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSound } from '@/hooks/useSound'
import { toast } from 'sonner'
import { IconArrowLeft, IconMailForward } from '@tabler/icons-react'

function NeuralBg() {
    return (
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
            <div className='absolute inset-0 bg-grid opacity-20' />
            <div className='absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[120px]' />
            <div className='absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple/6 blur-[100px]' />
            {[...Array(6)].map((_, i) => (
                <div key={i} className='absolute rounded-full border border-primary/10 animate-float'
                    style={{ width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
                        top: `${10 + i * 12}%`, left: `${5 + i * 14}%`,
                        animationDelay: `${i * 0.8}s`, opacity: 0.3 - i * 0.04 }} />
            ))}
        </div>
    )
}

export default function ResetPassword() {
    const navigate = useNavigate()
    const { play } = useSound()
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email) {
            toast.error('Enter your email')
            return
        }
        setLoading(true)
        play('click')
        setTimeout(() => {
            setLoading(false)
            play('success')
            setSent(true)
        }, 1200)
    }

    return (
        <div className='min-h-screen bg-background flex items-center justify-center p-8 relative'>
            <NeuralBg />

            <div className='relative w-full max-w-sm animate-slide-up'>
                <Link
                    to='/auth/login'
                    onClick={() => play('click')}
                    className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8'
                >
                    <IconArrowLeft size={13} /> Back to Login
                </Link>

                {!sent ? (
                    <>
                        <div className='mb-8'>
                            <div className='h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4'>
                                <IconMailForward size={22} className='text-primary' />
                            </div>
                            <h1 className='font-display text-2xl font-bold text-foreground mb-1'>Reset password</h1>
                            <p className='text-sm text-muted-foreground'>Enter your email and we'll send you a reset link</p>
                        </div>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='space-y-1.5'>
                                <label className='text-xs font-medium text-muted-foreground'>Email address</label>
                                <Input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='you@company.com'
                                    autoFocus
                                />
                            </div>
                            <Button type='submit' variant='gradient' className='w-full' disabled={loading} onClick={() => play('click')}>
                                {loading ? <span className='animate-pulse'>Sending…</span> : 'Send Reset Link'}
                            </Button>
                        </form>
                        <div className='mt-6 text-center'>
                            <Link
                                to='/chatflows'
                                onClick={() => play('click')}
                                className='text-xs text-muted-foreground hover:text-foreground transition-colors'
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className='text-center animate-slide-up'>
                        <div className='h-16 w-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-6'>
                            <IconMailForward size={28} className='text-success' />
                        </div>
                        <h1 className='font-display text-2xl font-bold text-foreground mb-2'>Check your inbox</h1>
                        <p className='text-sm text-muted-foreground mb-6'>
                            We sent a reset link to <span className='text-foreground font-medium'>{email}</span>. It expires in 15 minutes.
                        </p>
                        <Button
                            variant='outline'
                            className='w-full mb-3'
                            onClick={() => {
                                play('click')
                                setSent(false)
                            }}
                        >
                            Resend email
                        </Button>
                        <Link
                            to='/chatflows'
                            onClick={() => play('click')}
                            className='text-xs text-muted-foreground hover:text-foreground transition-colors'
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
