import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { evaluators, datasets } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconFlask } from '@tabler/icons-react'

export function RunEvaluationDialog({ open, onClose, onRun }) {
    const [name, setName] = useState('')
    const [selectedDataset, setSelectedDataset] = useState(datasets[0]?.id || '')
    const [selectedEvaluators, setSelectedEvaluators] = useState([])

    const toggleEvaluator = (id) => setSelectedEvaluators((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])

    const handleRun = () => {
        if (!name.trim()) { toast.error('Run name is required'); return }
        if (!selectedDataset) { toast.error('Select a dataset'); return }
        if (selectedEvaluators.length === 0) { toast.error('Select at least one evaluator'); return }
        const ds = datasets.find((d) => d.id === selectedDataset)
        const evNames = selectedEvaluators.map((id) => evaluators.find((e) => e.id === id)?.name).filter(Boolean)
        onRun({ name: name.trim(), dataset: ds?.name || selectedDataset, evaluators: evNames, status: 'running', score: null, passed: 0, total: ds?.rows || 0, runDate: new Date().toISOString() })
        setName(''); setSelectedDataset(datasets[0]?.id || ''); setSelectedEvaluators([])
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
                        <select value={selectedDataset} onChange={(e) => setSelectedDataset(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {datasets.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.rows.toLocaleString()} rows)</option>)}
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Evaluators</label>
                        <div className='space-y-2 max-h-48 overflow-y-auto'>
                            {evaluators.map((ev) => (
                                <label key={ev.id} className={cn('flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors', selectedEvaluators.includes(ev.id) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30')}>
                                    <input type='checkbox' checked={selectedEvaluators.includes(ev.id)} onChange={() => toggleEvaluator(ev.id)} className='accent-primary' />
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-xs font-medium text-foreground truncate'>{ev.name}</div>
                                        <div className='text-[10px] text-muted-foreground capitalize'>{ev.type} · {ev.category}</div>
                                    </div>
                                    <Badge variant='secondary' className='text-[9px] shrink-0'>{(ev.passThreshold * 100).toFixed(0)}% threshold</Badge>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleRun}><IconFlask size={14} /> Run Evaluation</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
