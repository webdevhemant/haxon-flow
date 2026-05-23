import { Toaster as Sonner } from 'sonner'

const Toaster = ({ ...props }) => {
    return (
        <Sonner
            theme='dark'
            className='toaster group'
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton: 'group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground',
                    success: 'group-[.toaster]:border-success/30',
                    error: 'group-[.toaster]:border-destructive/30'
                }
            }}
            {...props}
        />
    )
}

export { Toaster }
