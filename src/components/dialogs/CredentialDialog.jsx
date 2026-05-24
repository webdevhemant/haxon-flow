import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { IconPlus, IconLock } from '@tabler/icons-react'

export const PROVIDERS = [
    { value: 'openAIApi', label: 'OpenAI', color: '#10B981' },
    { value: 'anthropicApi', label: 'Anthropic', color: '#A855F7' },
    { value: 'googleVertexAI', label: 'Google Vertex AI', color: '#22D3EE' },
    { value: 'pineconeApi', label: 'Pinecone', color: '#F59E0B' },
    { value: 'postgres', label: 'PostgreSQL', color: '#6366F1' },
    { value: 'slackBot', label: 'Slack Bot', color: '#EF4444' },
    { value: 'huggingfaceApi', label: 'HuggingFace', color: '#F97316' },
    { value: 'openRouterApi', label: 'OpenRouter', color: '#8B5CF6' }
]

export function CredentialDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [type, setType] = useState(initial?.type || 'openAIApi')
    const [desc, setDesc] = useState(initial?.description || '')
    const [key, setKey] = useState('')
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        if (!isEdit && !key.trim()) { toast.error('API key is required'); return }
        onSave({ name: name.trim(), type, description: desc.trim(), apiKey: key, usedInFlows: initial?.usedInFlows || 0, lastUsed: new Date().toISOString() })
        setName('')
        setType('openAIApi')
        setDesc('')
        setKey('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconLock size={16} className='text-primary' />
                        {isEdit ? 'Edit Credential' : 'Add Credential'}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Production OpenAI Key' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Provider</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {PROVIDERS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>
                            {isEdit ? 'New API Key (leave blank to keep current)' : 'API Key'}
                        </label>
                        <Input value={key} onChange={(e) => setKey(e.target.value)} type='password' placeholder='sk-...' />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description (optional)</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What is this key used for?' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}>{isEdit ? 'Save Changes' : <><IconPlus size={14} /> Add</>}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
