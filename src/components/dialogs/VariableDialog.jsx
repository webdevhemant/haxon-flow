import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconPlus } from '@tabler/icons-react'

export const TYPE_COLORS = { string: '#6366F1', number: '#10B981', boolean: '#F59E0B', secret: '#EF4444', json: '#A855F7' }
export const TYPES = ['string', 'number', 'boolean', 'secret', 'json']

export function VariableDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [type, setType] = useState(initial?.type || 'string')
    const [value, setValue] = useState(initial?.value?.toString() || '')
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        const trimmedName = name.trim().replace(/\s+/g, '_').toUpperCase()
        onSave({ name: trimmedName, type, value, usedIn: initial?.usedIn || 0 })
        setName('')
        setType('string')
        setValue('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                    <DialogTitle className='font-display'>{isEdit ? 'Edit Variable' : 'Add Variable'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Variable name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='API_BASE_URL' className='font-mono' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Type</label>
                        <div className='flex gap-2 flex-wrap'>
                            {TYPES.map((t) => (
                                <button key={t} onClick={() => setType(t)}
                                    className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all', type === t ? 'border-transparent text-white' : 'border-border text-muted-foreground hover:text-foreground')}
                                    style={type === t ? { background: TYPE_COLORS[t] } : {}}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Value</label>
                        <Input value={value} onChange={(e) => setValue(e.target.value)} type={type === 'secret' ? 'password' : 'text'}
                            placeholder={type === 'boolean' ? 'true or false' : type === 'number' ? '42' : 'value...'} className='font-mono' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}>{isEdit ? 'Save' : <><IconPlus size={14} /> Add</>}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
