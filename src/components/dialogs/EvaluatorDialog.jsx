import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { IconPlus } from '@tabler/icons-react'

export const EVALUATOR_TYPES = ['llm-judge', 'heuristic', 'code-runner']
export const EVALUATOR_CATEGORIES = ['RAG', 'Safety', 'Correctness', 'Quality', 'Code']
export const EVALUATOR_MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-sonnet-4-5', 'claude-opus-4-5', 'gemini-2.0-flash']

const DEFAULT_CRITERIA = `You are an evaluator. Given the question and AI response, score the response on a scale of 0 to 1.

Question: {{question}}
Response: {{response}}

Return JSON: { "score": 0.0-1.0, "reason": "..." }`

export function EvaluatorDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [type, setType] = useState(initial?.type || 'llm-judge')
    const [category, setCategory] = useState(initial?.category || 'Correctness')
    const [model, setModel] = useState(initial?.model || 'gpt-4o')
    const [threshold, setThreshold] = useState(String(initial?.passThreshold ?? 0.7))
    const [criteria, setCriteria] = useState(initial?.criteria || DEFAULT_CRITERIA)
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), type, category, model: type === 'llm-judge' ? model : null, passThreshold: parseFloat(threshold) || 0.7, criteria: criteria.trim() })
        setName(''); setDesc(''); setType('llm-judge'); setCategory('Correctness'); setModel('gpt-4o'); setThreshold('0.7'); setCriteria(DEFAULT_CRITERIA)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle className='font-display'>{isEdit ? 'Edit Evaluator' : 'New Evaluator'}</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-4 py-2'>
                    <div className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Factual Accuracy Judge' autoFocus />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Description</label>
                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this evaluator check?' />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {EVALUATOR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {EVALUATOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {type === 'llm-judge' && (
                            <div className='space-y-1.5'>
                                <label className='text-xs font-medium text-muted-foreground'>Judge model</label>
                                <select value={model} onChange={(e) => setModel(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                    {EVALUATOR_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        )}
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Pass threshold ({(parseFloat(threshold) * 100 || 0).toFixed(0)}%)</label>
                            <input type='range' min={0} max={1} step={0.05} value={threshold} onChange={(e) => setThreshold(e.target.value)} className='w-full accent-primary' />
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>
                            {type === 'llm-judge' ? 'Judge prompt / criteria' : type === 'code-runner' ? 'Evaluation code' : 'Heuristic rules'}
                        </label>
                        <textarea value={criteria} onChange={(e) => setCriteria(e.target.value)} rows={14}
                            className='w-full text-xs rounded-md border border-border bg-secondary/40 px-3 py-2 text-foreground resize-none font-mono leading-relaxed' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}>{isEdit ? 'Save Changes' : <><IconPlus size={14} /> Create Evaluator</>}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
