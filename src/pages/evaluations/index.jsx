import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn, formatRelativeTime } from '@/lib/utils'
import { evaluations, evaluators, datasets } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconCheck, IconX, IconClock, IconFlask, IconTrash } from '@tabler/icons-react'

const STATUS_CONFIG = {
    passed: { variant: 'success', icon: IconCheck },
    failed: { variant: 'destructive', icon: IconX },
    running: { variant: 'warning', icon: IconClock }
}

function RunEvaluationDialog({ open, onClose, onRun }) {
    const [name, setName] = useState('')
    const [selectedDataset, setSelectedDataset] = useState(datasets[0]?.id || '')
    const [selectedEvaluators, setSelectedEvaluators] = useState([])

    const toggleEvaluator = (id) => {
        setSelectedEvaluators((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
    }

    const handleRun = () => {
        if (!name.trim()) {
            toast.error('Run name is required')
            return
        }
        if (!selectedDataset) {
            toast.error('Select a dataset')
            return
        }
        if (selectedEvaluators.length === 0) {
            toast.error('Select at least one evaluator')
            return
        }
        const ds = datasets.find((d) => d.id === selectedDataset)
        const evNames = selectedEvaluators.map((id) => evaluators.find((e) => e.id === id)?.name).filter(Boolean)
        onRun({
            name: name.trim(),
            dataset: ds?.name || selectedDataset,
            evaluators: evNames,
            status: 'running',
            score: null,
            passed: 0,
            total: ds?.rows || 0,
            runDate: new Date().toISOString()
        })
        setName('')
        setSelectedDataset(datasets[0]?.id || '')
        setSelectedEvaluators([])
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconFlask size={16} className='text-primary' /> Run Evaluation
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Run name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. RAG Accuracy v2' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Dataset</label>
                        <select
                            value={selectedDataset}
                            onChange={(e) => setSelectedDataset(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'
                        >
                            {datasets.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} ({d.rows.toLocaleString()} rows)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Evaluators</label>
                        <div className='space-y-2 max-h-48 overflow-y-auto'>
                            {evaluators.map((ev) => (
                                <label
                                    key={ev.id}
                                    className={cn(
                                        'flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors',
                                        selectedEvaluators.includes(ev.id)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/30'
                                    )}
                                >
                                    <input
                                        type='checkbox'
                                        checked={selectedEvaluators.includes(ev.id)}
                                        onChange={() => toggleEvaluator(ev.id)}
                                        className='accent-primary'
                                    />
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-xs font-medium text-foreground truncate'>{ev.name}</div>
                                        <div className='text-[10px] text-muted-foreground capitalize'>
                                            {ev.type} · {ev.category}
                                        </div>
                                    </div>
                                    <Badge variant='secondary' className='text-[9px] shrink-0'>
                                        {(ev.passThreshold * 100).toFixed(0)}% threshold
                                    </Badge>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant='gradient' onClick={handleRun}>
                        <IconFlask size={14} /> Run Evaluation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Evaluations() {
    const [search, setSearch] = useState('')
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

    return (
        <div className='space-y-6 animate-fade-in'>
            <RunEvaluationDialog open={showRun} onClose={() => setShowRun(false)} onRun={handleRun} />

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
                                        className='opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive'
                                        onClick={() => handleDelete(ev.id)}
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
