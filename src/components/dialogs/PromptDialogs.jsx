import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { IconPlus, IconCheck, IconCopy } from '@tabler/icons-react'

export const PROMPT_CATEGORIES = ['All', 'Data', 'Support', 'DevTools', 'Productivity', 'Marketing', 'Legal']
export const PROMPT_CATEGORY_COLORS = {
    Data: '#A855F7', Support: '#6366F1', DevTools: '#10B981',
    Productivity: '#8B5CF6', Marketing: '#F59E0B', Legal: '#06B6D4'
}

export function extractVariables(template) {
    const matches = template.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map((m) => m.slice(2, -2)))]
}

export function PromptDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [category, setCategory] = useState(initial?.category || 'Utility')
    const [template, setTemplate] = useState(initial?.template || '')
    const [tags, setTags] = useState(initial?.tags?.join(', ') || '')
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        if (!template.trim()) { toast.error('Template is required'); return }
        const variables = extractVariables(template)
        onSave({ name: name.trim(), description: desc.trim(), category, template: template.trim(), variables, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), usageCount: initial?.usageCount || 0, bookmarked: initial?.bookmarked || false })
        setName(''); setDesc(''); setCategory('Utility'); setTemplate(''); setTags('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle className='font-display'>{isEdit ? 'Edit Prompt' : 'New Prompt'}</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-4 py-2'>
                    <div className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Code Reviewer' autoFocus />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Description</label>
                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this prompt do?' />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {PROMPT_CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Tags (comma separated)</label>
                            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder='e.g. extraction, json' />
                        </div>
                        {template && (
                            <div className='space-y-1'>
                                <label className='text-xs font-medium text-muted-foreground'>Detected variables</label>
                                <div className='flex flex-wrap gap-1'>
                                    {extractVariables(template).length === 0
                                        ? <span className='text-xs text-muted-foreground'>None — use {'{{variable}}'} syntax</span>
                                        : extractVariables(template).map((v) => <span key={v} className='text-[10px] font-mono bg-primary/10 text-primary rounded px-1.5 py-0.5'>{'{{' + v + '}}'}</span>)
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Template</label>
                        <textarea value={template} onChange={(e) => setTemplate(e.target.value)} rows={13}
                            className='w-full text-xs rounded-md border border-border bg-secondary/40 px-3 py-2 text-foreground resize-none font-mono leading-relaxed'
                            placeholder={'Use {{variable}} for dynamic values...'} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}>{isEdit ? 'Save Changes' : <><IconPlus size={14} /> Create Prompt</>}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function UsePromptDialog({ prompt, onClose }) {
    const [values, setValues] = useState(() => Object.fromEntries((prompt?.variables || []).map((v) => [v, ''])))
    const [copied, setCopied] = useState(false)

    const filled = prompt ? prompt.template.replace(/\{\{(\w+)\}\}/g, (_, k) => values[k] || `{{${k}}}`) : ''

    const handleCopy = () => {
        navigator.clipboard.writeText(filled).catch(() => {})
        setCopied(true)
        toast.success('Filled prompt copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog open={!!prompt} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle className='font-display'>Use: {prompt?.name}</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-4 py-2'>
                    <div className='space-y-3'>
                        <p className='text-xs text-muted-foreground'>Fill in the variables below to build your final prompt.</p>
                        {(prompt?.variables || []).length === 0
                            ? <p className='text-xs text-muted-foreground italic'>No variables in this template.</p>
                            : prompt.variables.map((v) => (
                                <div key={v} className='space-y-1.5'>
                                    <label className='text-xs font-medium text-foreground font-mono'>{'{{' + v + '}}'}</label>
                                    <textarea rows={3} value={values[v]} onChange={(e) => setValues((p) => ({ ...p, [v]: e.target.value }))} placeholder={`Enter ${v}…`}
                                        className='w-full text-xs rounded-md border border-border bg-secondary/40 px-3 py-2 text-foreground resize-none font-mono leading-relaxed' />
                                </div>
                            ))
                        }
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Preview</label>
                        <div className='h-full min-h-[200px] rounded-md border border-border bg-secondary/20 px-3 py-2 text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap overflow-auto'>{filled}</div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleCopy} className='gap-2'>
                        {copied ? <><IconCheck size={13} /> Copied!</> : <><IconCopy size={13} /> Copy filled prompt</>}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
