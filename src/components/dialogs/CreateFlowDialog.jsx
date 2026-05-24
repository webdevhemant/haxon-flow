import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { IconPlus } from '@tabler/icons-react'

export function CreateFlowDialog({ open, onClose, onSave }) {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), deployed: false, nodeCount: 0, executionCount: 0, tags: [], color: '#6366F1' })
        setName('')
        setDesc('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display'>New Chatflow</DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Flow name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Customer Support Bot' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this flow do?' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}><IconPlus size={14} /> Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
