import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { IconCopy, IconKey, IconCheck } from '@tabler/icons-react'

function generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return 'hxn_' + Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function CreateKeyDialog({ open, onClose, onSave }) {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [rateLimit, setRateLimit] = useState('100')
    const [generatedKey, setGeneratedKey] = useState(null)

    const handleCreate = () => {
        if (!name.trim()) { toast.error('Key name is required'); return }
        const key = generateKey()
        setGeneratedKey(key)
        onSave({ keyName: name.trim(), description: desc.trim(), keyMasked: key.slice(0, 12) + '••••••••••••', keyFull: key, rateLimit: parseInt(rateLimit) || 100, status: 'active', usageCount: 0, createdDate: new Date().toISOString() })
    }

    const handleClose = () => {
        setName(''); setDesc(''); setRateLimit('100'); setGeneratedKey(null)
        onClose()
    }

    if (generatedKey) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle className='font-display flex items-center gap-2 text-success'><IconCheck size={16} /> API Key Created</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4 py-2'>
                        <div className='rounded-lg bg-success/10 border border-success/20 p-4'>
                            <p className='text-xs text-muted-foreground mb-2'>Copy your key now — it won&apos;t be shown again.</p>
                            <code className='block font-mono text-xs text-foreground break-all'>{generatedKey}</code>
                        </div>
                        <Button variant='outline' className='w-full gap-2' onClick={() => { navigator.clipboard.writeText(generatedKey); toast.success('Copied!') }}>
                            <IconCopy size={13} /> Copy to Clipboard
                        </Button>
                    </div>
                    <DialogFooter><Button onClick={handleClose}>Done</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                    <DialogTitle className='font-display'>Create API Key</DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Key name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Production App' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description (optional)</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What will this key be used for?' />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Rate limit (requests/min)</label>
                        <Input value={rateLimit} onChange={(e) => setRateLimit(e.target.value)} type='number' min='1' max='10000' className='font-mono' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={handleClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleCreate}><IconKey size={14} /> Generate Key</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
