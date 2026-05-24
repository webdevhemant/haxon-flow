import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-secondary/70', className)}
            {...props}
        />
    )
}

/* Pre-built skeleton patterns */

export function SkeletonCard() {
    return (
        <div className='rounded-xl border border-border bg-card/40 overflow-hidden'>
            <div className='h-1 w-full bg-secondary/80' />
            <div className='p-4 space-y-3'>
                <div className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-6 rounded-lg' />
                    <Skeleton className='h-4 w-16 rounded-full' />
                </div>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-5/6' />
                <div className='flex gap-1 pt-1'>
                    <Skeleton className='h-4 w-12 rounded' />
                    <Skeleton className='h-4 w-10 rounded' />
                </div>
                <div className='flex gap-2 pt-2 border-t border-border/50'>
                    <Skeleton className='h-7 flex-1 rounded-lg' />
                    <Skeleton className='h-7 w-7 rounded-lg' />
                </div>
            </div>
        </div>
    )
}

export function SkeletonRow() {
    return (
        <tr className='border-b border-border'>
            <td className='px-4 py-3'>
                <div className='flex items-center gap-3'>
                    <Skeleton className='h-8 w-8 rounded-lg shrink-0' />
                    <div className='space-y-1.5 flex-1'>
                        <Skeleton className='h-3.5 w-40' />
                        <Skeleton className='h-2.5 w-56' />
                    </div>
                </div>
            </td>
            <td className='px-4 py-3 hidden sm:table-cell'><Skeleton className='h-5 w-14 rounded-full' /></td>
            <td className='px-4 py-3 hidden md:table-cell'><Skeleton className='h-3.5 w-8' /></td>
            <td className='px-4 py-3 hidden lg:table-cell'><Skeleton className='h-3.5 w-16' /></td>
            <td className='px-4 py-3 hidden lg:table-cell'><Skeleton className='h-3.5 w-20' /></td>
            <td className='px-4 py-3'><Skeleton className='h-7 w-7 rounded-lg' /></td>
        </tr>
    )
}

export function SkeletonStatCard() {
    return (
        <div className='rounded-xl border border-border bg-card/40 p-4 flex items-center gap-3'>
            <Skeleton className='h-10 w-10 rounded-xl shrink-0' />
            <div className='space-y-2 flex-1'>
                <Skeleton className='h-5 w-12' />
                <Skeleton className='h-3 w-20' />
            </div>
        </div>
    )
}

export function SkeletonListItem() {
    return (
        <div className='flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/60 bg-card/30'>
            <Skeleton className='h-6 w-6 rounded-md shrink-0' />
            <Skeleton className='h-4 flex-1 max-w-xs' />
            <Skeleton className='h-4 w-12 rounded-full ml-auto' />
            <Skeleton className='h-3 w-6' />
        </div>
    )
}
