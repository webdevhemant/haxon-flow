import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconPlus } from '@tabler/icons-react'

export const ASSISTANT_MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-opus-4-5', 'claude-sonnet-4-5', 'gemini-2.0-flash', 'llama-3.3-70b']
export const MODEL_COLORS = {
    'gpt-4o': '#10B981', 'gpt-4o-mini': '#22D3EE', 'claude-opus-4-5': '#6366F1',
    'claude-sonnet-4-5': '#A855F7', 'gemini-2.0-flash': '#F59E0B', 'llama-3.3-70b': '#EF4444'
}
const AVATARS = ['🤖', '🧠', '💡', '⚡', '🎯', '🔮', '🦾', '🌟']

export function AssistantDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [model, setModel] = useState(initial?.model || 'gpt-4o')
    const [avatar, setAvatar] = useState(initial?.avatar || '🤖')
    const [sysPrompt, setSysPrompt] = useState(initial?.systemPrompt || 'You are a helpful AI assistant.')
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), model, avatar, systemPrompt: sysPrompt, type: 'custom', conversations: initial?.conversations || 0 })
        setName('')
        setDesc('')
        setModel('gpt-4o')
        setAvatar('🤖')
        setSysPrompt('You are a helpful AI assistant.')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='font-display'>{isEdit ? 'Edit Assistant' : 'New Assistant'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Avatar</label>
                        <div className='flex gap-2'>
                            {AVATARS.map((a) => (
                                <button key={a} onClick={() => setAvatar(a)}
                                    className={cn('h-9 w-9 rounded-lg text-xl transition-all', avatar === a ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary hover:bg-secondary/80')}>
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Customer Support Bot' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this assistant do?' />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Model</label>
                        <select value={model} onChange={(e) => setModel(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {ASSISTANT_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>System Prompt</label>
                        <textarea value={sysPrompt} onChange={(e) => setSysPrompt(e.target.value)} rows={4}
                            className='w-full text-xs rounded-md border border-border bg-background px-3 py-2 text-foreground resize-none' placeholder='You are a helpful assistant...' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}>{isEdit ? 'Save Changes' : <><IconPlus size={14} /> Create</>}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
