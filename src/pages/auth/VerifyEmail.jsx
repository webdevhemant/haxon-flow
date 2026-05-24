import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSound } from '@/hooks/useSound'
import { toast } from 'sonner'
import { IconArrowLeft, IconMailCheck, IconRefresh } from '@tabler/icons-react'

function OTPInput({ value, onChange }) {
    const inputs = useRef([])
    const digits = value.padEnd(6, '').split('')

    const handleKey = (i, e) => {
        if (e.key === 'Backspace') {
            const next = value.slice(0, i) + value.slice(i + 1)
            onChange(next)
            if (i > 0) inputs.current[i - 1]?.focus()
        } else if (/^\d$/.test(e.key)) {
            const next = (value.slice(0, i) + e.key + value.slice(i + 1)).slice(0, 6)
            onChange(next)
            if (i < 5) inputs.current[i + 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted) {
            onChange(pasted)
            inputs.current[Math.min(pasted.length, 5)]?.focus()
        }
        e.preventDefault()
    }

    return (
        <div className='flex gap-2 justify-center'>
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digits[i] === ' ' ? '' : digits[i]}
                    onKeyDown={(e) => handleKey(i, e)}
                    onPaste={handlePaste}
                    onChange={() => {}}
                    onClick={() => inputs.current[i]?.focus()}
                    className={cn(
                        'h-12 w-11 rounded-lg border text-center text-lg font-mono font-bold transition-all bg-background text-foreground focus:outline-none',
                        digits[i] && digits[i] !== ' ' ? 'border-primary bg-primary/8 text-primary' : 'border-border focus:border-primary'
                    )}
                />
            ))}
        </div>
    )
}

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

export default function VerifyEmail() {
    const navigate = useNavigate()
    const { play } = useSound()
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [countdown, setCountdown] = useState(60)

    useEffect(() => {
        const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
        return () => clearInterval(t)
    }, [])

    const handleVerify = () => {
        if (otp.length < 6) {
            toast.error('Enter the 6-digit code')
            return
        }
        setLoading(true)
        play('click')
        setTimeout(() => {
            setLoading(false)
            play('success')
            toast.success('Email verified! Welcome to Haxon Flow.')
            navigate('/chatflows')
        }, 1200)
    }

    const handleResend = () => {
        if (countdown > 0) return
        setResending(true)
        play('click')
        setTimeout(() => {
            setResending(false)
            setCountdown(60)
            toast.success('Code resent!')
        }, 1000)
    }

    return (
        <div className='min-h-screen bg-background flex items-center justify-center p-8 relative'>
            <NeuralBg />

            <div className='relative w-full max-w-sm animate-slide-up'>
                <Link
                    to='/auth/signup'
                    onClick={() => play('click')}
                    className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8'
                >
                    <IconArrowLeft size={13} /> Back
                </Link>

                <div className='text-center mb-8'>
                    <div className='h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 animate-float'>
                        <IconMailCheck size={28} className='text-primary' />
                    </div>
                    <h1 className='font-display text-2xl font-bold text-foreground mb-2'>Verify your email</h1>
                    <p className='text-sm text-muted-foreground'>
                        We sent a 6-digit code to your email.
                        <br />
                        Enter it below to continue.
                    </p>
                </div>

                <div className='space-y-6'>
                    <OTPInput value={otp} onChange={setOtp} />

                    <Button variant='gradient' className='w-full' onClick={handleVerify} disabled={loading || otp.length < 6}>
                        {loading ? (
                            <span className='animate-pulse'>Verifying…</span>
                        ) : (
                            <>
                                <IconMailCheck size={15} /> Verify Email
                            </>
                        )}
                    </Button>

                    <div className='text-center'>
                        <button
                            onClick={handleResend}
                            disabled={countdown > 0 || resending}
                            className={cn(
                                'inline-flex items-center gap-1.5 text-xs transition-colors',
                                countdown > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:text-primary/80'
                            )}
                        >
                            <IconRefresh size={12} className={resending ? 'animate-spin' : ''} />
                            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                        </button>
                    </div>
                </div>

                <div className='mt-8 text-center'>
                    <Link
                        to='/chatflows'
                        onClick={() => play('click')}
                        className='text-xs text-muted-foreground hover:text-foreground transition-colors'
                    >
                        ← Skip for now — Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
