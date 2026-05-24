import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn, formatRelativeTime } from '@/lib/utils'
import { evaluations } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconCheck, IconX, IconClock, IconFlask, IconTrash } from '@tabler/icons-react'

import { SkeletonCard, SkeletonRow, SkeletonListItem } from '@/components/ui/skeleton'
import { usePageLoading } from '@/hooks/usePageLoading'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSound } from '@/hooks/useSound'
import { RunEvaluationDialog } from '@/components/dialogs/RunEvaluationDialog'

const STATUS_CONFIG = {
    passed: { variant: 'success', icon: IconCheck },
    failed: { variant: 'destructive', icon: IconX },
    running: { variant: 'warning', icon: IconClock }
}

export default function Evaluations() {
    const [search, setSearch] = useState('')
    const loading = usePageLoading()
    const { play } = useSound()
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [items, setItems] = useState(evaluations)
    const [showRun, setShowRun] = useState(false)

    const filtered = items.filter(
        (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.dataset.toLowerCase().includes(search.toLowerCase())
    )

    const handleRun = (data) => {
        const newItem = { ...data, id: `eval-${Date.now()}` }
        setItems((p) => [newItem, ...p])
        setShowRun(false)
        toast.success('Evaluation started!')
        setTimeout(() => {
            const score = Math.random() * 0.4 + 0.6
            setItems((p) =>
                p.map((x) =>
                    x.id === newItem.id
                        ? { ...x, status: score >= 0.7 ? 'passed' : 'failed', score, passed: Math.round(x.total * score) }
                        : x
                )
            )
        }, 3000)
    }

    const handleDelete = (id) => {
        setItems((p) => p.filter((x) => x.id !== id))
        toast.success('Deleted')
    }


    if (loading) return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div className='h-8 w-48 bg-secondary/70 animate-pulse rounded-lg' />
                <div className='h-8 w-24 bg-secondary/70 animate-pulse rounded-lg' />
            </div>
            <div className='rounded-xl border border-border overflow-hidden'>
                <table className='w-full'>
                    <tbody>{Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)}</tbody>
                </table>
            </div>
        </div>
    )
    return (
        <div className='space-y-6 animate-fade-in'>
            <RunEvaluationDialog open={showRun} onClose={() => setShowRun(false)} onRun={handleRun} />

            <ConfirmDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete)}
                title='Delete evaluation?'
                description='This action cannot be undone.'
                confirmLabel='Delete'
            />
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
                <Button variant='gradient' size='sm' onClick={() => setShowRun(true)}>
                    <IconFlask size={14} /> Run Evaluation
                </Button>
            </div>

            <div className='grid grid-cols-3 gap-3'>
                {[
                    { label: 'Total Runs', value: items.length, color: 'text-primary' },
                    { label: 'Passed', value: items.filter((e) => e.status === 'passed').length, color: 'text-success' },
                    { label: 'Failed', value: items.filter((e) => e.status === 'failed').length, color: 'text-destructive' }
                ].map((s) => (
                    <div key={s.label} className='glass rounded-xl border border-border p-4'>
                        <div className={cn('font-display text-2xl font-bold leading-none mb-1', s.color)}>{s.value}</div>
                        <div className='text-xs text-muted-foreground'>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className='space-y-3'>
                {filtered.map((ev, i) => {
                    const cfg = STATUS_CONFIG[ev.status] || STATUS_CONFIG.running
                    const Icon = cfg.icon
                    const scoreColor =
                        ev.score === null ? '' : ev.score >= 0.9 ? 'text-success' : ev.score >= 0.7 ? 'text-warning' : 'text-destructive'
                    return (
                        <div
                            key={ev.id}
                            className={cn(
                                'glass rounded-xl border border-border p-4 hover:border-primary/20 transition-colors animate-slide-up group',
                                `stagger-${Math.min(i + 1, 8)}`
                            )}
                        >
                            <div className='flex items-start justify-between mb-3'>
                                <div className='flex items-center gap-3'>
                                    <div
                                        className={cn(
                                            'flex h-7 w-7 items-center justify-center rounded-full shrink-0',
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
                                <div className='flex items-center gap-3'>
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
                                    <Button
                                        variant='ghost'
                                        size='icon-sm'
                                        className='opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity text-destructive hover:text-destructive'
                                        onClick={() => { setConfirmDelete(ev.id); play('click') }}
                                    >
                                        <IconTrash size={13} />
                                    </Button>
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
                            {ev.score !== null && (
                                <div className='mt-3 h-1 bg-secondary rounded-full overflow-hidden'>
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all duration-700',
                                            ev.score >= 0.9 ? 'bg-success' : ev.score >= 0.7 ? 'bg-warning' : 'bg-destructive'
                                        )}
                                        style={{ width: `${ev.score * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <IconFlask size={40} className='text-muted-foreground/30 mb-4' />
                        <h3 className='font-display text-lg font-semibold mb-2'>No evaluations yet</h3>
                        <Button variant='gradient' onClick={() => setShowRun(true)}>
                            <IconFlask size={14} /> Run Evaluation
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
