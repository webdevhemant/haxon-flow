import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconPlus, IconCode } from '@tabler/icons-react'

export const TOOL_CATEGORIES = ['Search', 'Development', 'Communication', 'Data', 'Integration', 'Files', 'Utility']
const COLORS = ['#6366F1', '#10B981', '#A855F7', '#22D3EE', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6']

const DEFAULT_CODE = `// Tool function — receives input and returns result
async function run(input) {
    // Your implementation here
    return { result: input }
}`

export function ToolDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [category, setCategory] = useState(initial?.category || 'Utility')
    const [color, setColor] = useState(initial?.iconColor || '#6366F1')
    const [code, setCode] = useState(initial?.code || DEFAULT_CODE)
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), category, iconColor: color, code, usageCount: initial?.usageCount || 0, flowCount: initial?.flowCount || 0 })
        setName(''); setDesc(''); setCategory('Utility'); setColor('#6366F1'); setCode(DEFAULT_CODE)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle className='font-display'>{isEdit ? 'Edit Tool' : 'New Tool'}</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-4 py-2'>
                    <div className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Tool name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Web Search' autoFocus />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Description</label>
                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this tool do?' />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {TOOL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Color</label>
                            <div className='flex gap-2 flex-wrap'>
                                {COLORS.map((c) => (
                                    <button key={c} onClick={() => setColor(c)}
                                        className={cn('h-6 w-6 rounded-full border-2 transition-all', color === c ? 'border-foreground scale-110' : 'border-transparent')}
                                        style={{ background: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground flex items-center gap-1'><IconCode size={11} /> Implementation</label>
                        <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={12}
                            className='w-full text-[11px] rounded-md border border-border bg-secondary/40 px-3 py-2 text-foreground resize-none font-mono leading-relaxed' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}>{isEdit ? 'Save Changes' : <><IconPlus size={14} /> Create Tool</>}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
