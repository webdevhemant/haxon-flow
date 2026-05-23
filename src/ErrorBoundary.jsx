import { IconAlertTriangle, IconCopy } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

const ErrorBoundary = ({ error }) => {
    const message = error?.message || error?.response?.data?.message || 'An unexpected error occurred'

    const copy = () => {
        navigator.clipboard.writeText(message).catch(() => {})
    }

    return (
        <div className='flex min-h-[400px] flex-col items-center justify-center gap-6 p-8 text-center'>
            <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10'>
                <IconAlertTriangle size={32} className='text-destructive' />
            </div>
            <div>
                <h2 className='font-display text-xl font-semibold text-foreground mb-1'>Something went wrong</h2>
                <p className='text-sm text-muted-foreground'>An error occurred while loading this page.</p>
            </div>
            <div className='relative w-full max-w-lg rounded-xl border border-border bg-secondary/50 px-5 py-4'>
                <Button variant='ghost' size='icon-sm' onClick={copy} className='absolute right-2 top-2 text-muted-foreground'>
                    <IconCopy size={13} />
                </Button>
                <pre className='whitespace-pre-wrap break-words text-left text-xs font-mono text-muted-foreground'>{message}</pre>
            </div>
            <Button variant='outline' onClick={() => window.location.reload()}>
                Reload page
            </Button>
        </div>
    )
}

export default ErrorBoundary
