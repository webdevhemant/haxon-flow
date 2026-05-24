import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useSound } from '@/hooks/useSound'
import { toast } from 'sonner'
import { IconArrowLeft, IconEye, IconEyeOff, IconShieldCheck } from '@tabler/icons-react'

function StrengthBar({ password }) {
    const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length
    const colors = ['bg-destructive', 'bg-warning', 'bg-warning', 'bg-neon']
    const labels = ['Too short', 'Weak', 'Fair', 'Strong']
    if (!password) return null
    return (
        <div className='mt-1.5'>
            <div className='flex gap-1 mb-1'>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', i < score ? colors[score - 1] : 'bg-secondary')} />
                ))}
            </div>
            <p className={cn('text-[10px]', score <= 1 ? 'text-destructive' : score <= 2 ? 'text-warning' : 'text-neon')}>
                {labels[score - 1] || ''}
            </p>
        </div>
    )
}

export default function NewPassword() {
    const navigate = useNavigate()
    const { play } = useSound()
    const [pw, setPw] = useState('')
    const [confirm, setConfirm] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!pw || !confirm) {
            toast.error('Fill both fields')
            return
        }
        if (pw !== confirm) {
            toast.error('Passwords do not match')
            play('error')
            return
        }
        if (pw.length < 8) {
            toast.error('Password too short')
            return
        }
        setLoading(true)
        play('click')
        setTimeout(() => {
            setLoading(false)
            play('success')
            toast.success('Password updated!')
            navigate('/auth/login')
        }, 1200)
    }

    return (
        <div className='min-h-screen bg-background flex items-center justify-center p-8 relative'>
            <div className='absolute inset-0 bg-grid opacity-15 pointer-events-none' />
            <div className='absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/6 blur-[120px] pointer-events-none' />

            <div className='relative w-full max-w-sm animate-slide-up'>
                <Link
                    to='/auth/login'
                    onClick={() => play('click')}
                    className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8'
                >
                    <IconArrowLeft size={13} /> Back to Login
                </Link>

                <div className='mb-8'>
                    <div className='h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4'>
                        <IconShieldCheck size={22} className='text-primary' />
                    </div>
                    <h1 className='font-display text-2xl font-bold text-foreground mb-1'>Set new password</h1>
                    <p className='text-sm text-muted-foreground'>Choose a strong password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>New Password</label>
                        <div className='relative'>
                            <Input
                                type={show ? 'text' : 'password'}
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                placeholder='8+ characters'
                                className='pr-10'
                                autoFocus
                            />
                            <button
                                type='button'
                                onClick={() => setShow(!show)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                            >
                                {show ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                            </button>
                        </div>
                        <StrengthBar password={pw} />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Confirm Password</label>
                        <Input
                            type='password'
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder='Repeat password'
                            className={cn(confirm && pw !== confirm && 'border-destructive/60')}
                        />
                        {confirm && pw !== confirm && <p className='text-[10px] text-destructive mt-1'>Passwords don't match</p>}
                    </div>
                    <Button type='submit' variant='gradient' className='w-full' disabled={loading} onClick={() => play('click')}>
                        {loading ? <span className='animate-pulse'>Updating…</span> : 'Update Password'}
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
            </div>
        </div>
    )
}
