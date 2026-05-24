import { cn } from '@/lib/utils'

export function Logo({ collapsed = false, className }) {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            {/* Hexagon mark */}
            <div className='relative shrink-0'>
                <svg width='32' height='36' viewBox='0 0 32 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <defs>
                        <linearGradient id='hexGrad' x1='0' y1='0' x2='32' y2='36' gradientUnits='userSpaceOnUse'>
                            <stop stopColor='#6366F1' />
                            <stop offset='0.5' stopColor='#A855F7' />
                            <stop offset='1' stopColor='#22D3EE' />
                        </linearGradient>
                        <filter id='hexGlow'>
                            <feGaussianBlur stdDeviation='2' result='glow' />
                            <feMerge>
                                <feMergeNode in='glow' />
                                <feMergeNode in='SourceGraphic' />
                            </feMerge>
                        </filter>
                    </defs>
                    <path d='M16 1L30 9V27L16 35L2 27V9L16 1Z' fill='url(#hexGrad)' filter='url(#hexGlow)' opacity='0.9' />
                    <path d='M16 1L30 9V27L16 35L2 27V9L16 1Z' stroke='url(#hexGrad)' strokeWidth='0.5' fill='none' opacity='0.6' />
                    <text
                        x='16'
                        y='23'
                        textAnchor='middle'
                        fill='white'
                        fontSize='14'
                        fontWeight='800'
                        fontFamily='Syne, sans-serif'
                        letterSpacing='-0.5'
                    >
                        H
                    </text>
                </svg>
            </div>

            {!collapsed && (
                <div className='flex flex-col leading-none'>
                    <span className='font-display text-[15px] font-800 tracking-tight text-foreground'>
                        Haxon
                        <span className='gradient-text'>Flow</span>
                    </span>
                </div>
            )}
        </div>
    )
}
