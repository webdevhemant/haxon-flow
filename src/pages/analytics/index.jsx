import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { analyticsStats, executionTimeline, tokensByModel, flowTypeDistribution, recentExecutions } from '@/mock/data/analytics'
import { cn, formatRelativeTime } from '@/lib/utils'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import { IconTrendingUp, IconTrendingDown, IconActivity, IconBolt, IconDatabase, IconClock, IconCheck, IconX } from '@tabler/icons-react'

const STAT_CARDS = [
    {
        label: 'Total Executions',
        key: 'totalExecutions',
        delta: 'executionsDelta',
        icon: IconActivity,
        color: '#6366F1',
        format: (v) => v.toLocaleString()
    },
    {
        label: 'Tokens Used',
        key: 'totalTokens',
        delta: 'tokensDelta',
        icon: IconDatabase,
        color: '#22D3EE',
        format: (v) => (v / 1_000_000).toFixed(1) + 'M'
    },
    { label: 'Active Flows', key: 'activeFlows', delta: 'activeFlowsDelta', icon: IconBolt, color: '#A855F7', format: (v) => v },
    { label: 'Avg Response', key: 'avgResponseMs', delta: 'responseDelta', icon: IconClock, color: '#10B981', format: (v) => v + 'ms' }
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className='glass rounded-lg p-3 text-xs border border-border shadow-xl'>
                <p className='font-semibold mb-2 text-foreground'>{label}</p>
                {payload.map((p) => (
                    <div key={p.dataKey} className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full' style={{ background: p.color }} />
                        <span className='text-muted-foreground capitalize'>{p.dataKey}:</span>
                        <span className='font-mono text-foreground'>{p.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export default function Analytics() {
    const s = analyticsStats

    return (
        <div className='space-y-6 animate-fade-in'>
            {/* Stat cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {STAT_CARDS.map((c, i) => {
                    const value = s[c.key]
                    const delta = s[c.delta]
                    const isPositive = c.key === 'avgResponseMs' ? delta < 0 : delta > 0
                    return (
                        <Card key={c.key} className={cn('overflow-hidden animate-slide-up', `stagger-${i + 1}`)}>
                            <div className='h-0.5' style={{ background: c.color }} />
                            <CardContent className='p-5'>
                                <div className='flex items-center justify-between mb-3'>
                                    <div className='rounded-lg p-2' style={{ background: c.color + '15' }}>
                                        <c.icon size={16} style={{ color: c.color }} />
                                    </div>
                                    <div
                                        className={cn(
                                            'flex items-center gap-1 text-xs font-mono',
                                            isPositive ? 'text-success' : 'text-destructive'
                                        )}
                                    >
                                        {isPositive ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
                                        {Math.abs(delta)}
                                        {typeof delta === 'number' && delta < 100 ? '%' : ''}
                                    </div>
                                </div>
                                <div className='font-display text-3xl font-bold text-foreground mb-1'>{c.format(value)}</div>
                                <div className='text-xs text-muted-foreground'>{c.label}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Timeline */}
                <Card className='lg:col-span-2 animate-slide-up stagger-3'>
                    <CardHeader className='pb-0'>
                        <CardTitle className='text-sm'>Execution Timeline</CardTitle>
                        <p className='text-xs text-muted-foreground'>Last 30 days</p>
                    </CardHeader>
                    <CardContent className='pt-4'>
                        <ResponsiveContainer width='100%' height={220}>
                            <AreaChart data={executionTimeline.slice(-20)} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                                <defs>
                                    <linearGradient id='execGrad' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='0%' stopColor='#6366F1' stopOpacity={0.3} />
                                        <stop offset='100%' stopColor='#6366F1' stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id='errGrad' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='0%' stopColor='#EF4444' stopOpacity={0.2} />
                                        <stop offset='100%' stopColor='#EF4444' stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='3 3' stroke='hsl(228 25% 12%)' vertical={false} />
                                <XAxis
                                    dataKey='date'
                                    tick={{ fontSize: 10, fill: '#64748B' }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={4}
                                />
                                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type='monotone'
                                    dataKey='executions'
                                    stroke='#6366F1'
                                    fill='url(#execGrad)'
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='errors'
                                    stroke='#EF4444'
                                    fill='url(#errGrad)'
                                    strokeWidth={1.5}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie */}
                <Card className='animate-slide-up stagger-4'>
                    <CardHeader className='pb-0'>
                        <CardTitle className='text-sm'>Flow Types</CardTitle>
                        <p className='text-xs text-muted-foreground'>Distribution by type</p>
                    </CardHeader>
                    <CardContent className='pt-4 flex flex-col items-center'>
                        <ResponsiveContainer width='100%' height={140}>
                            <PieChart>
                                <Pie
                                    data={flowTypeDistribution}
                                    cx='50%'
                                    cy='50%'
                                    innerRadius={40}
                                    outerRadius={60}
                                    dataKey='value'
                                    strokeWidth={0}
                                >
                                    {flowTypeDistribution.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className='space-y-1.5 w-full mt-2'>
                            {flowTypeDistribution.map((d) => (
                                <div key={d.name} className='flex items-center justify-between text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-2 w-2 rounded-full' style={{ background: d.color }} />
                                        <span className='text-muted-foreground'>{d.name}</span>
                                    </div>
                                    <span className='font-mono text-foreground'>{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tokens by model + Recent executions */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <Card className='animate-slide-up stagger-5'>
                    <CardHeader className='pb-0'>
                        <CardTitle className='text-sm'>Tokens by Model</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-4'>
                        <ResponsiveContainer width='100%' height={160}>
                            <BarChart data={tokensByModel} layout='vertical' margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <XAxis type='number' hide />
                                <YAxis
                                    type='category'
                                    dataKey='model'
                                    tick={{ fontSize: 11, fill: '#64748B' }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={80}
                                />
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

                {/* Recent executions table */}
                <Card className='lg:col-span-2 animate-slide-up stagger-6'>
                    <CardHeader className='pb-0'>
                        <CardTitle className='text-sm'>Recent Executions</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-3 p-0'>
                        <div className='divide-y divide-border'>
                            {recentExecutions.map((ex) => (
                                <div key={ex.id} className='flex items-center gap-3 px-5 py-3 hover:bg-secondary/30 transition-colors'>
                                    <div
                                        className={cn(
                                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs',
                                            ex.status === 'success'
                                                ? 'bg-success/15 text-success'
                                                : ex.status === 'error'
                                                  ? 'bg-destructive/15 text-destructive'
                                                  : 'bg-warning/15 text-warning'
                                        )}
                                    >
                                        {ex.status === 'success' ? (
                                            <IconCheck size={10} strokeWidth={3} />
                                        ) : (
                                            <IconX size={10} strokeWidth={3} />
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-sm text-foreground truncate'>{ex.flow}</div>
                                        <div className='text-xs text-muted-foreground font-mono'>
                                            {ex.duration}ms · {ex.tokens.toLocaleString()} tokens
                                        </div>
                                    </div>
                                    <div className='text-xs text-muted-foreground hidden sm:block'>{formatRelativeTime(ex.time)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
