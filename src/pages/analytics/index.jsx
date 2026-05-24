import { useState } from 'react'
import { SkeletonStatCard } from '@/components/ui/skeleton'
import { usePageLoading } from '@/hooks/usePageLoading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { analyticsStats, executionTimeline, tokensByModel, flowTypeDistribution, recentExecutions } from '@/mock/data/analytics'
import { cn, formatRelativeTime } from '@/lib/utils'
import { useSound } from '@/hooks/useSound'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
    IconTrendingUp, IconTrendingDown, IconActivity, IconBolt,
    IconDatabase, IconClock, IconCheck, IconX, IconDownload,
    IconRefresh, IconCalendar
} from '@tabler/icons-react'

const TIME_RANGES = ['7d', '30d', '90d', '1y']

const STAT_CARDS = [
    { label: 'Total Executions', key: 'totalExecutions', delta: 'executionsDelta', icon: IconActivity, color: '#009EFF', format: (v) => v.toLocaleString() },
    { label: 'Tokens Used', key: 'totalTokens', delta: 'tokensDelta', icon: IconDatabase, color: '#A855F7', format: (v) => (v / 1_000_000).toFixed(1) + 'M' },
    { label: 'Active Flows', key: 'activeFlows', delta: 'activeFlowsDelta', icon: IconBolt, color: '#00FF6A', format: (v) => v },
    { label: 'Avg Response', key: 'avgResponseMs', delta: 'responseDelta', icon: IconClock, color: '#F59E0B', format: (v) => v + 'ms' }
]

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className='rounded-xl border border-border bg-card/95 backdrop-blur p-3 text-xs shadow-xl'>
            <p className='font-semibold mb-2 text-foreground'>{label}</p>
            {payload.map((p) => (
                <div key={p.dataKey} className='flex items-center gap-2 mb-1 last:mb-0'>
                    <div className='h-2 w-2 rounded-full shrink-0' style={{ background: p.color }} />
                    <span className='text-muted-foreground capitalize'>{p.dataKey}:</span>
                    <span className='font-mono text-foreground ml-auto pl-3'>{p.value?.toLocaleString()}</span>
                </div>
            ))}
        </div>
    )
}

export default function Analytics() {
    const s = analyticsStats
    const loading = usePageLoading()
    const [range, setRange] = useState('30d')
    const [refreshing, setRefreshing] = useState(false)
    const { play } = useSound()

    const handleRefresh = () => {
        setRefreshing(true)
        play('click')
        setTimeout(() => setRefreshing(false), 1200)
    }

    if (loading) return (
        <div className='space-y-5'>
            <div className='h-8 w-64 bg-secondary/70 animate-pulse rounded-lg' />
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                {Array.from({ length: 4 }, (_, i) => <SkeletonStatCard key={i} />)}
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className='lg:col-span-2 rounded-xl border border-border bg-card/40 h-64 animate-pulse' />
                <div className='rounded-xl border border-border bg-card/40 h-64 animate-pulse' />
            </div>
        </div>
    )

    const sliceCount = range === '7d' ? 7 : range === '30d' ? 20 : range === '90d' ? 30 : 52
    const timelineData = executionTimeline.slice(-sliceCount)

    return (
        <div className='space-y-5 animate-fade-in'>
            {/* Toolbar */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <IconCalendar size={13} />
                    <span>Last updated: just now</span>
                </div>
                <div className='flex items-center gap-2'>
                    {/* Time range */}
                    <div className='flex items-center gap-1 rounded-lg border border-border bg-secondary/30 p-0.5'>
                        {TIME_RANGES.map((r) => (
                            <button key={r} onClick={() => { setRange(r); play('click') }}
                                className={cn('rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                                    range === r ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                                {r}
                            </button>
                        ))}
                    </div>
                    <Button variant='outline' size='sm' onClick={handleRefresh} className='gap-1.5 h-7 text-xs'>
                        <IconRefresh size={12} className={cn('transition-transform', refreshing && 'animate-spin')} />
                        Refresh
                    </Button>
                    <Button variant='outline' size='sm' className='gap-1.5 h-7 text-xs' onClick={() => play('click')}>
                        <IconDownload size={12} /> Export
                    </Button>
                </div>
            </div>

            {/* Stat cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                {STAT_CARDS.map((c, i) => {
                    const value = s[c.key]
                    const delta = s[c.delta]
                    const isPositive = c.key === 'avgResponseMs' ? delta < 0 : delta > 0
                    return (
                        <Card key={c.key} className={cn('overflow-hidden animate-slide-up', `stagger-${i + 1}`)}>
                            <div className='h-0.5' style={{ background: c.color }} />
                            <CardContent className='p-4'>
                                <div className='flex items-center justify-between mb-3'>
                                    <div className='rounded-lg p-1.5' style={{ background: c.color + '15' }}>
                                        <c.icon size={14} style={{ color: c.color }} />
                                    </div>
                                    <span className={cn('flex items-center gap-1 text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-md',
                                        isPositive ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10')}>
                                        {isPositive ? <IconTrendingUp size={10} /> : <IconTrendingDown size={10} />}
                                        {Math.abs(delta)}{typeof delta === 'number' && Math.abs(delta) < 100 ? '%' : ''}
                                    </span>
                                </div>
                                <div className='font-display text-2xl font-bold text-foreground mb-0.5'>{c.format(value)}</div>
                                <div className='text-[11px] text-muted-foreground'>{c.label}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Main charts row */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Execution timeline */}
                <Card className='lg:col-span-2 animate-slide-up stagger-3'>
                    <CardHeader className='pb-2 flex-row items-center justify-between space-y-0'>
                        <div>
                            <CardTitle className='text-sm font-semibold'>Execution Timeline</CardTitle>
                            <p className='text-[11px] text-muted-foreground mt-0.5'>Executions vs errors over time</p>
                        </div>
                        <div className='flex items-center gap-3 text-[10px] text-muted-foreground'>
                            <span className='flex items-center gap-1.5'><span className='h-2 w-3 rounded bg-primary/70 inline-block' /> Executions</span>
                            <span className='flex items-center gap-1.5'><span className='h-2 w-3 rounded bg-destructive/70 inline-block' /> Errors</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={200}>
                            <AreaChart data={timelineData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                                <defs>
                                    <linearGradient id='execGrad' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='0%' stopColor='#009EFF' stopOpacity={0.35} />
                                        <stop offset='100%' stopColor='#009EFF' stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id='errGrad' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='0%' stopColor='#EF4444' stopOpacity={0.25} />
                                        <stop offset='100%' stopColor='#EF4444' stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.04)' vertical={false} />
                                <XAxis dataKey='date' tick={{ fontSize: 9, fill: '#64748B' }} tickLine={false} axisLine={false} interval={Math.floor(sliceCount / 6)} />
                                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type='monotone' dataKey='executions' stroke='#009EFF' fill='url(#execGrad)' strokeWidth={2} dot={false} />
                                <Area type='monotone' dataKey='errors' stroke='#EF4444' fill='url(#errGrad)' strokeWidth={1.5} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Flow type donut */}
                <Card className='animate-slide-up stagger-4'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-semibold'>Flow Types</CardTitle>
                        <p className='text-[11px] text-muted-foreground'>Distribution by type</p>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center'>
                        <ResponsiveContainer width='100%' height={130}>
                            <PieChart>
                                <Pie data={flowTypeDistribution} cx='50%' cy='50%' innerRadius={38} outerRadius={56} dataKey='value' strokeWidth={0}>
                                    {flowTypeDistribution.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className='space-y-1.5 w-full mt-1'>
                            {flowTypeDistribution.map((d) => (
                                <div key={d.name} className='flex items-center justify-between text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-2 w-2 rounded-full shrink-0' style={{ background: d.color }} />
                                        <span className='text-muted-foreground'>{d.name}</span>
                                    </div>
                                    <span className='font-mono text-foreground font-medium'>{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Second row */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Tokens by model */}
                <Card className='animate-slide-up stagger-5'>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-semibold'>Tokens by Model</CardTitle>
                        <p className='text-[11px] text-muted-foreground'>Total consumption per provider</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={160}>
                            <BarChart data={tokensByModel} layout='vertical' margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
                                <XAxis type='number' hide />
                                <YAxis type='category' dataKey='model' tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} width={75} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey='tokens' radius={[0, 4, 4, 0]}>
                                    {tokensByModel.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent executions */}
                <Card className='lg:col-span-2 animate-slide-up stagger-6'>
                    <CardHeader className='pb-2 flex-row items-center justify-between space-y-0'>
                        <div>
                            <CardTitle className='text-sm font-semibold'>Recent Executions</CardTitle>
                            <p className='text-[11px] text-muted-foreground mt-0.5'>Latest flow runs</p>
                        </div>
                        <Badge variant='secondary' className='text-[10px] font-mono'>{recentExecutions.length} runs</Badge>
                    </CardHeader>
                    <CardContent className='p-0'>
                        <div className='divide-y divide-border'>
                            {recentExecutions.map((ex) => (
                                <div key={ex.id} className='flex items-center gap-3 px-5 py-2.5 hover:bg-secondary/30 transition-colors'>
                                    <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                                        ex.status === 'success' ? 'bg-success/15 text-success' : ex.status === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-warning/15 text-warning')}>
                                        {ex.status === 'success' ? <IconCheck size={9} strokeWidth={3} /> : <IconX size={9} strokeWidth={3} />}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-xs text-foreground truncate font-medium'>{ex.flow}</div>
                                        <div className='text-[10px] text-muted-foreground font-mono mt-0.5'>
                                            {ex.duration}ms · {ex.tokens.toLocaleString()} tokens
                                        </div>
                                    </div>
                                    <div className='text-[10px] text-muted-foreground font-mono hidden sm:block shrink-0'>{formatRelativeTime(ex.time)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
