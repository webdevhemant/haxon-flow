import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn, formatRelativeTime } from '@/lib/utils'
import { useFlowStore } from '@/store/useFlowStore'
import { toast } from 'sonner'
import {
    IconPlus,
    IconSearch,
    IconApi,
    IconBolt,
    IconExternalLink,
    IconCopy,
    IconChartBar,
    IconShield,
    IconTrash,
    IconPlayerPause,
    IconPlayerPlay
} from '@tabler/icons-react'

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1']

function DeployDialog({ open, onClose, onDeploy }) {
    const { chatflows, agentflows } = useFlowStore()
    const allFlows = [...chatflows, ...agentflows]
    const [selectedFlow, setSelectedFlow] = useState(allFlows[0]?.id || '')
    const [name, setName] = useState('')
    const [region, setRegion] = useState('us-east-1')

    const handleDeploy = () => {
        if (!name.trim()) { toast.error('Deployment name is required'); return }
        if (!selectedFlow) { toast.error('Select a flow to deploy'); return }
        const flow = allFlows.find((f) => f.id === selectedFlow)
        onDeploy({
            name: name.trim(),
            flowName: flow?.name || selectedFlow,
            endpoint: `https://api.haxon.io/v1/flows/${name.trim().toLowerCase().replace(/\s+/g, '-')}`,
            method: 'POST',
            status: 'live',
            requestsToday: 0,
            avgLatency: null,
            uptime: 100,
            region,
            deployedAt: new Date().toISOString()
        })
        setName(''); setRegion('us-east-1')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconApi size={16} className='text-primary' /> Deploy Flow
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Deployment name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Support Bot API' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Flow</label>
                        <select value={selectedFlow} onChange={(e) => setSelectedFlow(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {allFlows.length === 0
                                ? <option value=''>No flows available</option>
                                : allFlows.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)
                            }
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Region</label>
                        <select value={region} onChange={(e) => setRegion(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    {name && (
                        <div className='rounded-lg border border-border bg-secondary/40 p-3'>
                            <p className='text-[10px] text-muted-foreground mb-1'>Endpoint preview</p>
                            <code className='text-[10px] font-mono text-primary/80'>POST https://api.haxon.io/v1/flows/{name.toLowerCase().replace(/\s+/g, '-')}</code>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleDeploy}><IconApi size={14} /> Deploy</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const MOCK_DEPLOYMENTS = [
    {
        id: 'dep-1',
        name: 'Support Bot API',
        flowName: 'Customer Support Orchestrator',
        endpoint: 'https://api.haxon.io/v1/flows/support-bot',
        method: 'POST',
        status: 'live',
        requestsToday: 4820,
        avgLatency: 340,
        uptime: 99.9,
        region: 'us-east-1',
        deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
    },
    {
        id: 'dep-2',
        name: 'Research Agent Endpoint',
        flowName: 'Research & Summarize Agent',
        endpoint: 'https://api.haxon.io/v1/flows/research',
        method: 'POST',
        status: 'live',
        requestsToday: 1240,
        avgLatency: 1200,
        uptime: 99.5,
        region: 'eu-west-1',
        deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
    },
    {
        id: 'dep-3',
        name: 'Data Pipeline Trigger',
        flowName: 'Data Pipeline Monitor',
        endpoint: 'https://api.haxon.io/v1/flows/data-pipeline',
        method: 'POST',
        status: 'live',
        requestsToday: 9800,
        avgLatency: 85,
        uptime: 100,
        region: 'us-west-2',
        deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
        id: 'dep-4',
        name: 'Lead Scorer Webhook',
        flowName: 'Lead Qualification Pipeline',
        endpoint: 'https://api.haxon.io/v1/flows/lead-score',
        method: 'POST',
        status: 'paused',
        requestsToday: 0,
        avgLatency: 290,
        uptime: 98.2,
        region: 'us-east-1',
        deployedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
    },
    {
        id: 'dep-5',
        name: 'Code Review Bot',
        flowName: 'Code Review Bot',
        endpoint: 'https://api.haxon.io/v1/flows/code-review',
        method: 'POST',
        status: 'draft',
        requestsToday: 0,
        avgLatency: null,
        uptime: null,
        region: 'us-east-1',
        deployedAt: null
    }
]

const STATUS_CONFIG = {
    live: { variant: 'success', label: 'Live' },
    paused: { variant: 'warning', label: 'Paused' },
    draft: { variant: 'secondary', label: 'Draft' }
}

export default function Deployments() {
    const [search, setSearch] = useState('')
    const [deps, setDeps] = useState(MOCK_DEPLOYMENTS)
    const [showDeploy, setShowDeploy] = useState(false)

    const filtered = deps.filter(
        (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.flowName.toLowerCase().includes(search.toLowerCase())
    )

    const handleCopyEndpoint = (endpoint) => {
        navigator.clipboard.writeText(endpoint).catch(() => {})
        toast.success('Endpoint copied!')
    }

    const handleDeploy = (data) => { setDeps((p) => [{ ...data, id: `dep-${Date.now()}` }, ...p]); setShowDeploy(false); toast.success('Deployed!') }
    const handleToggle = (id) => {
        setDeps((p) => p.map((d) => d.id === id ? { ...d, status: d.status === 'live' ? 'paused' : 'live' } : d))
        const dep = deps.find((d) => d.id === id)
        toast.success(dep?.status === 'live' ? 'Paused' : 'Resumed')
    }
    const handleDelete = (id) => { setDeps((p) => p.filter((d) => d.id !== id)); toast.success('Removed') }

    return (
        <div className='space-y-6 animate-fade-in'>
            <DeployDialog open={showDeploy} onClose={() => setShowDeploy(false)} onDeploy={handleDeploy} />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search deployments...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowDeploy(true)}>
                    <IconPlus size={14} /> Deploy Flow
                </Button>
            </div>

            {/* Summary */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {[
                    { label: 'Live Endpoints', value: deps.filter((d) => d.status === 'live').length, color: 'text-success' },
                    {
                        label: "Today's Requests",
                        value: deps.reduce((a, d) => a + d.requestsToday, 0).toLocaleString(),
                        color: 'text-primary'
                    },
                    {
                        label: 'Avg Latency',
                        value:
                            Math.round(
                                deps.filter((d) => d.avgLatency).reduce((a, d) => a + d.avgLatency, 0) /
                                    deps.filter((d) => d.avgLatency).length
                            ) + 'ms',
                        color: 'text-cyan'
                    },
                    {
                        label: 'Avg Uptime',
                        value:
                            (deps.filter((d) => d.uptime).reduce((a, d) => a + d.uptime, 0) / deps.filter((d) => d.uptime).length).toFixed(
                                1
                            ) + '%',
                        color: 'text-success'
                    }
                ].map((s) => (
                    <div key={s.label} className='glass rounded-xl border border-border p-4'>
                        <div className={cn('font-display text-2xl font-bold leading-none mb-1', s.color)}>{s.value}</div>
                        <div className='text-xs text-muted-foreground'>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className='space-y-3'>
                {filtered.map((dep, i) => {
                    const cfg = STATUS_CONFIG[dep.status] || STATUS_CONFIG.draft
                    return (
                        <div
                            key={dep.id}
                            className={cn(
                                'glass rounded-xl border border-border p-5 hover:border-primary/20 transition-colors animate-slide-up group',
                                `stagger-${Math.min(i + 1, 8)}`
                            )}
                        >
                            <div className='flex items-start justify-between mb-3'>
                                <div className='flex items-center gap-3'>
                                    <div
                                        className={cn(
                                            'rounded-xl p-2.5',
                                            dep.status === 'live'
                                                ? 'bg-success/10 border border-success/20'
                                                : 'bg-secondary border border-border'
                                        )}
                                    >
                                        <IconApi size={16} className={dep.status === 'live' ? 'text-success' : 'text-muted-foreground'} />
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <h3 className='font-display text-sm font-semibold text-foreground'>{dep.name}</h3>
                                            <Badge variant={cfg.variant} className='text-[10px]'>
                                                {cfg.label}
                                            </Badge>
                                        </div>
                                        <p className='text-xs text-muted-foreground mt-0.5'>{dep.flowName}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <Button variant='ghost' size='icon-sm' onClick={() => handleCopyEndpoint(dep.endpoint)}>
                                        <IconCopy size={13} />
                                    </Button>
                                    <Button variant='ghost' size='icon-sm' onClick={() => toast.info('Opening logs...')}>
                                        <IconExternalLink size={13} />
                                    </Button>
                                    <Button variant='ghost' size='icon-sm' onClick={() => handleToggle(dep.id)}>
                                        {dep.status === 'live' ? <IconPlayerPause size={13} /> : <IconPlayerPlay size={13} />}
                                    </Button>
                                    <Button variant='ghost' size='icon-sm' className='text-destructive hover:text-destructive' onClick={() => handleDelete(dep.id)}>
                                        <IconTrash size={13} />
                                    </Button>
                                </div>
                            </div>
                            <code className='text-[10px] font-mono text-primary/70 bg-primary/5 rounded px-2 py-1 block mb-3 truncate'>
                                {dep.method} {dep.endpoint}
                            </code>
                            <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                                {dep.requestsToday > 0 && (
                                    <span className='flex items-center gap-1'>
                                        <IconChartBar size={11} className='text-primary' />
                                        <span className='font-mono'>{dep.requestsToday.toLocaleString()}</span> today
                                    </span>
                                )}
                                {dep.avgLatency && (
                                    <span className='flex items-center gap-1'>
                                        <IconBolt size={11} className='text-cyan' />
                                        <span className='font-mono'>{dep.avgLatency}ms</span>
                                    </span>
                                )}
                                {dep.uptime && (
                                    <span className='flex items-center gap-1'>
                                        <IconShield size={11} className='text-success' />
                                        <span className='font-mono'>{dep.uptime}%</span>
                                    </span>
                                )}
                                <span className='ml-auto'>{dep.region}</span>
                                {dep.deployedAt && <span>{formatRelativeTime(dep.deployedAt)}</span>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
