import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { evaluators } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconFlask, IconCpu, IconCode, IconBrain } from '@tabler/icons-react'

const TYPE_ICONS = { 'llm-judge': IconBrain, heuristic: IconCode, 'code-runner': IconFlask }
const CATEGORY_COLORS = { RAG: '#6366F1', Safety: '#EF4444', Correctness: '#10B981', Quality: '#F59E0B', Code: '#22D3EE' }
const TYPES = ['llm-judge', 'heuristic', 'code-runner']
const CATEGORIES = ['RAG', 'Safety', 'Correctness', 'Quality', 'Code']
const MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-sonnet-4-5', 'claude-opus-4-5', 'gemini-2.0-flash']

const DEFAULT_CRITERIA = `You are an evaluator. Given the question and AI response, score the response on a scale of 0 to 1.

Question: {{question}}
Response: {{response}}

Return JSON: { "score": 0.0-1.0, "reason": "..." }`

function EvaluatorDialog({ open, onClose, onSave, initial }) {
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
        onSave({
            name: name.trim(), description: desc.trim(), type, category,
            model: type === 'llm-judge' ? model : null,
            passThreshold: parseFloat(threshold) || 0.7,
            criteria: criteria.trim()
        })
        setName(''); setDesc(''); setType('llm-judge'); setCategory('Correctness')
        setModel('gpt-4o'); setThreshold('0.7'); setCriteria(DEFAULT_CRITERIA)
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
                            <select value={type} onChange={(e) => setType(e.target.value)}
                                className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {type === 'llm-judge' && (
                            <div className='space-y-1.5'>
                                <label className='text-xs font-medium text-muted-foreground'>Judge model</label>
                                <select value={model} onChange={(e) => setModel(e.target.value)}
                                    className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                    {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        )}
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Pass threshold ({(parseFloat(threshold) * 100 || 0).toFixed(0)}%)</label>
                            <input type='range' min={0} max={1} step={0.05} value={threshold}
                                onChange={(e) => setThreshold(e.target.value)}
                                className='w-full accent-primary' />
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

export default function Evaluators() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(evaluators)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)

    const filtered = items.filter(
        (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (data) => { setItems((p) => [{ ...data, id: `ev-${Date.now()}` }, ...p]); setShowAdd(false); toast.success('Evaluator created') }
    const handleEdit = (data) => { setItems((p) => p.map((x) => x.id === editing.id ? { ...x, ...data } : x)); setEditing(null); toast.success('Updated') }
    const handleDelete = (id) => { setItems((p) => p.filter((x) => x.id !== id)); toast.success('Deleted') }

    return (
        <div className='space-y-6 animate-fade-in'>
            <EvaluatorDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
            <EvaluatorDialog open={!!editing} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search evaluators...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                    <IconPlus size={14} /> New Evaluator
                </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((ev, i) => {
                    const color = CATEGORY_COLORS[ev.category] || '#6366F1'
                    const TypeIcon = TYPE_ICONS[ev.type] || IconBrain
                    return (
                        <Card key={ev.id} className={cn('card-hover overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}>
                            <div className='h-0.5' style={{ background: color }} />
                            <CardContent className='p-5'>
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='rounded-xl p-2.5' style={{ background: color + '18', border: `1px solid ${color}28` }}>
                                        <TypeIcon size={16} style={{ color }} />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon-sm' className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => setEditing(ev)}><IconEdit size={13} /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => handleDelete(ev.id)}><IconTrash size={13} /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1.5'>{ev.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{ev.description}</p>
                                <div className='flex items-center gap-2 mb-3'>
                                    <Badge style={{ background: color + '18', color }} className='border-0 text-[10px]'>{ev.category}</Badge>
                                    <Badge variant='secondary' className='text-[10px] capitalize'>{ev.type}</Badge>
                                </div>
                                {ev.model && (
                                    <div className='flex items-center gap-1.5 text-xs text-muted-foreground mb-3'>
                                        <IconCpu size={11} className='text-primary' />
                                        <span className='font-mono'>{ev.model}</span>
                                    </div>
                                )}
                                <div className='mt-3 pt-3 border-t border-border'>
                                    <div className='flex items-center justify-between text-xs mb-1.5'>
                                        <span className='text-muted-foreground'>Pass threshold</span>
                                        <span className='font-mono font-semibold text-foreground'>{(ev.passThreshold * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className='h-1 bg-secondary rounded-full overflow-hidden'>
                                        <div className='h-full bg-primary rounded-full' style={{ width: `${ev.passThreshold * 100}%` }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <IconFlask size={40} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-lg font-semibold mb-2'>No evaluators found</h3>
                    <Button variant='gradient' onClick={() => setShowAdd(true)}><IconPlus size={14} /> New Evaluator</Button>
                </div>
            )}
        </div>
    )
}
