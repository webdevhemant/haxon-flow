import { Link } from 'react-router-dom'
import { IconArrowLeft, IconError404 } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background'>
            {/* Grid background */}
            <div className='pointer-events-none absolute inset-0 bg-dot opacity-20' />
            {/* Glow */}
            <div className='pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl' />

            <div className='relative z-10 flex flex-col items-center gap-8 text-center px-6'>
                <div className='flex h-24 w-24 items-center justify-center rounded-3xl border border-border bg-secondary/60 backdrop-blur'>
                    <IconError404 size={48} className='text-muted-foreground' />
                </div>

                <div className='space-y-2'>
                    <h1 className='font-display text-5xl font-bold text-foreground tracking-tight'>404</h1>
                    <p className='text-xl font-medium text-foreground'>Page not found</p>
                    <p className='text-sm text-muted-foreground max-w-sm'>
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <Button asChild variant='outline' className='gap-2'>
                    <Link to='/'>
                        <IconArrowLeft size={16} />
                        Back to home
                    </Link>
                </Button>
            </div>
        </div>
    )
}
