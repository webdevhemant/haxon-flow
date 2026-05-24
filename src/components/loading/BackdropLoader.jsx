export function BackdropLoader({ open }) {
    if (!open) return null
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm'>
            <div className='h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
        </div>
    )
}
