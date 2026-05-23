import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn, formatRelativeTime } from '@/lib/utils'
import { evaluations } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconCheck, IconX, IconClock, IconFlask, IconChartBar } from '@tabler/icons-react'

const STATUS_CONFIG = {
    passed: { variant: 'success', icon: IconCheck },
    failed: { variant: 'destructive', icon: IconX },
    running: { variant: 'warning', icon: IconClock }
}

export default function Evaluations() {
    const [search, setSearch] = useState('')

    const filtered = evaluations.filter(
        (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.dataset.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search evaluations...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Evaluation runner coming soon!')}>
                    <IconPlus size={14} /> Run Evaluation
                </Button>
            </div>

            {/* Summary cards */}
            <div className='grid grid-cols-3 gap-3'>
                {[
                    { label: 'Total Runs', value: evaluations.length, color: 'text-primary' },
                    { label: 'Passed', value: evaluations.filter((e) => e.status === 'passed').length, color: 'text-success' },
                    { label: 'Failed', value: evaluations.filter((e) => e.status === 'failed').length, color: 'text-destructive' }
                ].map((s) => (
                    <div key={s.label} className='glass rounded-xl border border-border p-4'>
                        <div className={cn('font-display text-2xl font-bold leading-none mb-1', s.color)}>{s.value}</div>
                        <div className='text-xs text-muted-foreground'>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Evaluations list */}
            <div className='space-y-3'>
                {filtered.map((ev, i) => {
                    const cfg = STATUS_CONFIG[ev.status] || STATUS_CONFIG.running
                    const Icon = cfg.icon
                    const scoreColor = ev.score >= 0.9 ? 'text-success' : ev.score >= 0.7 ? 'text-warning' : 'text-destructive'
                    return (
                        <div
                            key={ev.id}
                            className={cn(
                                'glass rounded-xl border border-border p-4 hover:border-primary/20 transition-colors animate-slide-up',
                                `stagger-${Math.min(i + 1, 8)}`
                            )}
                        >
                            <div className='flex items-start justify-between mb-3'>
                                <div className='flex items-center gap-3'>
                                    <div
                                        className={cn(
                                            'flex h-7 w-7 items-center justify-center rounded-full',
                                            ev.status === 'passed'
                                                ? 'bg-success/15 text-success'
                                                : ev.status === 'failed'
                                                  ? 'bg-destructive/15 text-destructive'
                                                  : 'bg-warning/15 text-warning'
                                        )}
                                    >
                                        <Icon size={13} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className='font-display text-sm font-semibold text-foreground'>{ev.name}</h3>
                                        <p className='text-xs text-muted-foreground mt-0.5'>{ev.dataset}</p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    {ev.score !== null ? (
                                        <div className={cn('font-display text-xl font-bold', scoreColor)}>
                                            {(ev.score * 100).toFixed(0)}%
                                        </div>
                                    ) : (
                                        <div className='text-xs text-muted-foreground font-mono'>Running…</div>
                                    )}
                                    <div className='text-xs text-muted-foreground'>
                                        {ev.passed}/{ev.total} passed
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 flex-wrap'>
                                {ev.evaluators.map((e) => (
                                    <span
                                        key={e}
                                        className='text-[9px] font-mono bg-secondary border border-border rounded px-1.5 py-0.5 text-muted-foreground'
                                    >
                                        {e}
                                    </span>
                                ))}
                                <span className='ml-auto text-xs text-muted-foreground'>{formatRelativeTime(ev.runDate)}</span>
                            </div>
                            {/* Score bar */}
                            {ev.score !== null && (
                                <div className='mt-3 h-1 bg-secondary rounded-full overflow-hidden'>
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all',
                                            ev.score >= 0.9 ? 'bg-success' : ev.score >= 0.7 ? 'bg-warning' : 'bg-destructive'
                                        )}
                                        style={{ width: `${ev.score * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
