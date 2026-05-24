import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import { datasets } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconDatabase, IconUpload, IconDownload, IconX } from '@tabler/icons-react'

const STATUS_VARIANT = { ready: 'success', processing: 'warning', draft: 'secondary', error: 'destructive' }

function DatasetDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [tags, setTags] = useState(initial?.tags?.join(', ') || '')
    const [rows, setRows] = useState(String(initial?.rows || ''))
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({
            name: name.trim(), description: desc.trim(),
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            rows: parseInt(rows) || 0, status: initial?.status || 'draft',
            updatedDate: new Date().toISOString()
        })
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

function UploadDialog({ open, onClose, onUpload }) {
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')

    const handleUpload = () => {
        if (!file && !name.trim()) { toast.error('Provide a name or select a file'); return }
        onUpload({ name: name.trim() || file?.name || 'Uploaded Dataset', file })
        setFile(null); setName('')
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
                        <label htmlFor='file-upload'>
                            <Button variant='outline' size='sm' asChild><span>Browse files</span></Button>
                        </label>
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

export default function Datasets() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(datasets)
    const [showAdd, setShowAdd] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [editing, setEditing] = useState(null)

    const filtered = items.filter(
        (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (data) => { setItems((p) => [{ ...data, id: `ds-${Date.now()}` }, ...p]); setShowAdd(false); toast.success('Dataset created') }
    const handleEdit = (data) => { setItems((p) => p.map((x) => x.id === editing.id ? { ...x, ...data } : x)); setEditing(null); toast.success('Updated') }
    const handleDelete = (id) => { setItems((p) => p.filter((x) => x.id !== id)); toast.success('Deleted') }
    const handleUpload = (data) => {
        setItems((p) => [{ ...data, id: `ds-${Date.now()}`, rows: data.file ? Math.floor(Math.random() * 2000) + 100 : 0, tags: [], status: 'processing', updatedDate: new Date().toISOString() }, ...p])
        setShowUpload(false)
        toast.success('Upload started — processing...')
    }
    const handleExport = (d) => { toast.success(`Exporting ${d.name}...`) }

    return (
        <div className='space-y-6 animate-fade-in'>
            <DatasetDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
            <DatasetDialog open={!!editing} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />
            <UploadDialog open={showUpload} onClose={() => setShowUpload(false)} onUpload={handleUpload} />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search datasets...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => setShowUpload(true)}>
                        <IconUpload size={14} /> Upload
                    </Button>
                    <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> New Dataset
                    </Button>
                </div>
            </div>

            <div className='rounded-xl border border-border overflow-hidden'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className='hidden sm:table-cell'>Rows</TableHead>
                            <TableHead className='hidden md:table-cell'>Tags</TableHead>
                            <TableHead className='hidden lg:table-cell'>Updated</TableHead>
                            <TableHead className='hidden sm:table-cell'>Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((d, i) => (
                            <TableRow key={d.id} className='animate-slide-up' style={{ animationDelay: `${i * 0.05}s` }}>
                                <TableCell>
                                    <div className='flex items-center gap-3'>
                                        <div className='rounded-lg p-1.5 bg-primary/10 border border-primary/20'>
                                            <IconDatabase size={14} className='text-primary' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-sm text-foreground'>{d.name}</div>
                                            <div className='text-xs text-muted-foreground hidden sm:block line-clamp-1'>{d.description}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    <span className='font-mono text-sm text-foreground'>{d.rows.toLocaleString()}</span>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    <div className='flex gap-1 flex-wrap'>
                                        {d.tags?.map((t) => (
                                            <span key={t} className='text-[9px] font-mono bg-secondary border border-border rounded px-1.5 py-0.5 text-muted-foreground'>{t}</span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className='hidden lg:table-cell text-xs text-muted-foreground'>{formatRelativeTime(d.updatedDate)}</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    <Badge variant={STATUS_VARIANT[d.status] || 'secondary'} className='text-[10px]'>{d.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon-sm'><IconDots size={14} /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => setEditing(d)}><IconEdit size={13} /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleExport(d)}><IconDownload size={13} /> Export</DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive' onClick={() => handleDelete(d.id)}><IconTrash size={13} /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className='text-center py-16 text-muted-foreground'>
                                    <IconDatabase size={32} className='mx-auto mb-3 opacity-30' />
                                    <p className='text-sm'>No datasets found</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
