import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { IconPlus, IconUsersGroup } from '@tabler/icons-react'

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'claude-3-opus', 'gemini-1.5-pro']

export function CreateAgentDialog({ open, onClose, onSave }) {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [model, setModel] = useState('gpt-4o')

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), model, deployed: false, nodeCount: 0, executionCount: 0, tags: [], category: 'Research', color: '#A855F7' })
        setName('')
        setDesc('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconUsersGroup size={16} className='text-primary' /> New Agent Flow
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Agent name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Research Assistant' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this agent do?' />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Base model</label>
                        <select value={model} onChange={(e) => setModel(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}><IconPlus size={14} /> Create Agent</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
