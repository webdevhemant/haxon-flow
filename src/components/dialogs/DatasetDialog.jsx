import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { IconPlus, IconDatabase, IconUpload, IconX } from '@tabler/icons-react'

export function DatasetDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [tags, setTags] = useState(initial?.tags?.join(', ') || '')
    const [rows, setRows] = useState(String(initial?.rows || ''))
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), tags: tags.split(',').map((t) => t.trim()).filter(Boolean), rows: parseInt(rows) || 0, status: initial?.status || 'draft', updatedDate: new Date().toISOString() })
        setName(''); setDesc(''); setTags(''); setRows('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconDatabase size={16} className='text-primary' /> {isEdit ? 'Edit Dataset' : 'New Dataset'}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Dataset name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Customer QA Pairs' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What is this dataset for?' />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Row count (approximate)</label>
                        <Input type='number' value={rows} onChange={(e) => setRows(e.target.value)} placeholder='e.g. 500' min={0} />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Tags (comma separated)</label>
                        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder='e.g. qa, rag, benchmark' />
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

export function UploadDialog({ open, onClose, onUpload }) {
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')

    const handleUpload = () => {
        if (!file && !name.trim()) { toast.error('Provide a name or select a file'); return }
        onUpload({ name: name.trim() || file?.name || 'Uploaded Dataset', file })
        setFile(null)
        setName('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconUpload size={16} className='text-primary' /> Upload Dataset
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors'>
                        <IconUpload size={24} className='mx-auto text-muted-foreground mb-2' />
                        <p className='text-sm text-muted-foreground mb-3'>Drop a CSV or JSON file here</p>
                        <input type='file' accept='.csv,.json,.jsonl' className='hidden' id='file-upload'
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setName(f.name.replace(/\.[^.]+$/, '')) } }} />
                        <label htmlFor='file-upload'><Button variant='outline' size='sm' asChild><span>Browse files</span></Button></label>
                        {file && (
                            <div className='mt-3 flex items-center justify-center gap-2 text-xs text-foreground'>
                                <span className='font-mono'>{file.name}</span>
                                <button onClick={() => setFile(null)}><IconX size={12} className='text-muted-foreground' /></button>
                            </div>
                        )}
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Dataset name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Auto-filled from filename' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleUpload}><IconUpload size={14} /> Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
