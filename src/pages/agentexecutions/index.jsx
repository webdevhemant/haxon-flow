import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn, formatRelativeTime } from '@/lib/utils'
import executions from '@/mock/data/executions'
import { IconSearch, IconCheck, IconX, IconClock, IconFilter, IconRefresh, IconDatabase, IconBolt } from '@tabler/icons-react'

const STATUS_CONFIG = {
    success: { label: 'Success', variant: 'success', icon: IconCheck },
    error: { label: 'Error', variant: 'destructive', icon: IconX },
    running: { label: 'Running', variant: 'warning', icon: IconClock }
}

export default function AgentExecutions() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filtered = executions.filter((e) => {
        const matchSearch = e.flow.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'all' || e.status === statusFilter
        return matchSearch && matchStatus
    })

    const stats = {
        total: executions.length,
        success: executions.filter((e) => e.status === 'success').length,
        error: executions.filter((e) => e.status === 'error').length,
        avgDuration: Math.round(executions.reduce((a, e) => a + e.duration, 0) / executions.length)
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            {/* Stats */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {[
                    { label: 'Total Runs', value: stats.total, icon: IconBolt, color: 'text-primary' },
                    { label: 'Successful', value: stats.success, icon: IconCheck, color: 'text-success' },
                    { label: 'Errors', value: stats.error, icon: IconX, color: 'text-destructive' },
                    { label: 'Avg Duration', value: stats.avgDuration + 'ms', icon: IconClock, color: 'text-cyan' }
                ].map((s) => (
                    <div key={s.label} className='glass rounded-xl border border-border p-4 flex items-center gap-3'>
                        <s.icon size={18} className={s.color} />
                        <div>
                            <div className='font-display text-xl font-bold text-foreground leading-none'>{s.value}</div>
                            <div className='text-xs text-muted-foreground mt-0.5'>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className='flex flex-col sm:flex-row gap-3'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search by flow name...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className='flex gap-2'>
                    {['all', 'success', 'error', 'running'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-medium transition-all capitalize',
                                statusFilter === s
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <Button variant='ghost' size='sm' className='ml-auto' onClick={() => {}}>
                    <IconRefresh size={14} /> Refresh
                </Button>
            </div>

            {/* Table */}
            <div className='rounded-xl border border-border overflow-hidden'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='border-b border-border bg-secondary/40'>
                            <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                                Status
                            </th>
                            <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                                Flow
                            </th>
                            <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell'>
                                Duration
                            </th>
                            <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell'>
                                Tokens
                            </th>
                            <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell'>
                                Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.slice(0, 30).map((ex, i) => {
                            const cfg = STATUS_CONFIG[ex.status] || STATUS_CONFIG.success
                            const Icon = cfg.icon
                            return (
                                <tr
                                    key={ex.id}
                                    className='border-b border-border hover:bg-secondary/30 transition-colors animate-slide-up'
                                    style={{ animationDelay: `${i * 0.02}s` }}
                                >
                                    <td className='px-4 py-3'>
                                        <div
                                            className={cn(
                                                'flex h-6 w-6 items-center justify-center rounded-full',
                                                ex.status === 'success'
                                                    ? 'bg-success/15 text-success'
                                                    : ex.status === 'error'
                                                      ? 'bg-destructive/15 text-destructive'
                                                      : 'bg-warning/15 text-warning'
                                            )}
                                        >
                                            <Icon size={10} strokeWidth={3} />
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 font-medium text-foreground'>{ex.flow}</td>
                                    <td className='px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell'>
                                        {ex.duration}ms
                                    </td>
                                    <td className='px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell'>
                                        {ex.tokens.toLocaleString()}
                                    </td>
                                    <td className='px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell'>
                                        {formatRelativeTime(ex.time)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
