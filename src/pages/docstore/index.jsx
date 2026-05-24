import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconDatabase, IconFileText, IconRefresh, IconBolt, IconUpload, IconX } from '@tabler/icons-react'

const INITIAL_STORES = [
    { id: 'ds-1', name: 'Product Knowledge Base', description: 'Documentation, FAQs, and guides for the product.', vectorStore: 'Pinecone', embeddingModel: 'text-embedding-3-small', docCount: 842, chunkCount: 4210, status: 'ready', color: '#6366F1' },
    { id: 'ds-2', name: 'Legal Contracts Archive', description: 'Processed legal documents with semantic search enabled.', vectorStore: 'Qdrant', embeddingModel: 'text-embedding-3-large', docCount: 156, chunkCount: 1890, status: 'ready', color: '#A855F7' },
    { id: 'ds-3', name: 'Support Ticket History', description: 'Historical support tickets for similar-issue retrieval.', vectorStore: 'Weaviate', embeddingModel: 'text-embedding-ada-002', docCount: 3400, chunkCount: 15600, status: 'indexing', color: '#10B981' },
    { id: 'ds-4', name: 'Engineering Runbooks', description: 'On-call runbooks and incident response guides.', vectorStore: 'Chroma', embeddingModel: 'text-embedding-3-small', docCount: 64, chunkCount: 780, status: 'ready', color: '#22D3EE' },
    { id: 'ds-5', name: 'Marketing Copy Vault', description: 'Approved brand copy, campaigns, and guidelines.', vectorStore: 'Pinecone', embeddingModel: 'text-embedding-3-small', docCount: 290, chunkCount: 2100, status: 'draft', color: '#F59E0B' },
    { id: 'ds-6', name: 'Research Papers Index', description: 'Academic papers indexed for scientific Q&A.', vectorStore: 'Qdrant', embeddingModel: 'text-embedding-3-large', docCount: 1200, chunkCount: 22000, status: 'ready', color: '#EF4444' }
]

const STATUS_VARIANT = { ready: 'success', indexing: 'warning', draft: 'secondary', error: 'destructive' }
const VECTOR_STORES = ['Pinecone', 'Qdrant', 'Weaviate', 'Chroma', 'Milvus', 'pgvector']
const EMBEDDING_MODELS = ['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002', 'text-embedding-gecko', 'bge-large-en-v1.5']
const COLORS = ['#6366F1', '#A855F7', '#10B981', '#22D3EE', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6']

function StoreDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [vectorStore, setVectorStore] = useState(initial?.vectorStore || 'Pinecone')
    const [embeddingModel, setEmbeddingModel] = useState(initial?.embeddingModel || 'text-embedding-3-small')
    const [color, setColor] = useState(initial?.color || '#6366F1')
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), vectorStore, embeddingModel, color, docCount: initial?.docCount || 0, chunkCount: initial?.chunkCount || 0, status: initial?.status || 'draft' })
        setName(''); setDesc(''); setVectorStore('Pinecone'); setEmbeddingModel('text-embedding-3-small'); setColor('#6366F1')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconDatabase size={16} className='text-primary' /> {isEdit ? 'Edit Document Store' : 'New Document Store'}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Store name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Product Knowledge Base' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What documents does this store contain?' />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Vector store</label>
                            <select value={vectorStore} onChange={(e) => setVectorStore(e.target.value)}
                                className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {VECTOR_STORES.map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Embedding model</label>
                            <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}
                                className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {EMBEDDING_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
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
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}>{isEdit ? 'Save Changes' : <><IconPlus size={14} /> Create Store</>}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ManageDialog({ open, onClose, store, onReindex }) {
    const [file, setFile] = useState(null)

    if (!store) return null

    const handleUpload = () => {
        if (!file) { toast.error('Select a file to upload'); return }
        toast.success(`Uploading ${file.name}...`)
        setFile(null)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <span className='text-lg'>📂</span> {store.name}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='grid grid-cols-3 gap-3'>
                        {[
                            { label: 'Documents', value: store.docCount.toLocaleString() },
                            { label: 'Chunks', value: store.chunkCount.toLocaleString() },
                            { label: 'Status', value: store.status }
                        ].map((s) => (
                            <div key={s.label} className='rounded-lg border border-border bg-secondary/40 p-3 text-center'>
                                <div className='font-display text-lg font-bold text-foreground'>{s.value}</div>
                                <div className='text-[10px] text-muted-foreground mt-0.5'>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className='flex items-center gap-2'>
                        <Badge variant='secondary' className='text-xs font-mono'>{store.vectorStore}</Badge>
                        <Badge variant='secondary' className='text-xs font-mono'>{store.embeddingModel}</Badge>
                    </div>
                    <div className='border-t border-border pt-4'>
                        <p className='text-xs font-medium text-muted-foreground mb-3'>Upload documents</p>
                        <div className='border-2 border-dashed border-border rounded-lg p-5 text-center hover:border-primary/40 transition-colors'>
                            <IconUpload size={20} className='mx-auto text-muted-foreground mb-2' />
                            <p className='text-xs text-muted-foreground mb-2'>PDF, DOCX, TXT, CSV</p>
                            <input type='file' accept='.pdf,.docx,.txt,.csv,.md' className='hidden' id='doc-upload'
                                onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            <label htmlFor='doc-upload'>
                                <Button variant='outline' size='sm' asChild><span>Browse</span></Button>
                            </label>
                            {file && (
                                <div className='mt-2 flex items-center justify-center gap-2 text-xs text-foreground'>
                                    <span className='font-mono truncate max-w-[150px]'>{file.name}</span>
                                    <button onClick={() => setFile(null)}><IconX size={12} className='text-muted-foreground' /></button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter className='gap-2'>
                    <Button variant='outline' size='sm' onClick={() => { onReindex(store.id); onClose() }}>
                        <IconRefresh size={13} /> Re-index
                    </Button>
                    <Button variant='gradient' onClick={handleUpload} disabled={!file}>
                        <IconUpload size={13} /> Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function DocumentStores() {
    const [search, setSearch] = useState('')
    const [stores, setStores] = useState(INITIAL_STORES)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)
    const [managing, setManaging] = useState(null)

    const filtered = stores.filter(
        (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (data) => { setStores((p) => [{ ...data, id: `ds-${Date.now()}` }, ...p]); setShowAdd(false); toast.success('Document store created') }
    const handleEdit = (data) => { setStores((p) => p.map((x) => x.id === editing.id ? { ...x, ...data } : x)); setEditing(null); toast.success('Updated') }
    const handleDelete = (id) => { setStores((p) => p.filter((x) => x.id !== id)); toast.success('Deleted') }
    const handleReindex = (id) => {
        setStores((p) => p.map((x) => x.id === id ? { ...x, status: 'indexing' } : x))
        toast.success('Re-indexing started...')
        setTimeout(() => setStores((p) => p.map((x) => x.id === id ? { ...x, status: 'ready' } : x)), 3000)
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <StoreDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
            <StoreDialog open={!!editing} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />
            <ManageDialog open={!!managing} onClose={() => setManaging(null)} store={managing} onReindex={handleReindex} />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search stores...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                    <IconPlus size={14} /> New Store
                </Button>
            </div>

            <div className='grid grid-cols-3 gap-3'>
                {[
                    { label: 'Total Stores', value: stores.length, icon: IconDatabase },
                    { label: 'Total Documents', value: stores.reduce((a, s) => a + s.docCount, 0).toLocaleString(), icon: IconFileText },
                    { label: 'Total Chunks', value: stores.reduce((a, s) => a + s.chunkCount, 0).toLocaleString(), icon: IconBolt }
                ].map((s) => (
                    <div key={s.label} className='glass rounded-xl border border-border p-4 flex items-center gap-3'>
                        <s.icon size={16} className='text-primary shrink-0' />
                        <div>
                            <div className='font-display text-lg font-bold text-foreground leading-none'>{s.value}</div>
                            <div className='text-xs text-muted-foreground mt-0.5'>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((store, i) => (
                    <Card key={store.id} className={cn('card-hover overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}>
                        <div className='h-0.5' style={{ background: store.color }} />
                        <CardContent className='p-5'>
                            <div className='flex items-start justify-between mb-3'>
                                <div className='rounded-xl p-2.5' style={{ background: store.color + '18', border: `1px solid ${store.color}28` }}>
                                    <IconDatabase size={16} style={{ color: store.color }} />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Badge variant={STATUS_VARIANT[store.status] || 'secondary'} className='text-[10px]'>{store.status}</Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon-sm' className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => setManaging(store)}><IconFileText size={13} /> Manage</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setEditing(store)}><IconEdit size={13} /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleReindex(store.id)}><IconRefresh size={13} /> Re-index</DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => handleDelete(store.id)}><IconTrash size={13} /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <h3 className='font-display text-sm font-semibold text-foreground mb-1.5'>{store.name}</h3>
                            <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{store.description}</p>
                            <div className='flex flex-wrap gap-1.5 mb-4'>
                                <Badge variant='secondary' className='text-[10px] font-mono'>{store.vectorStore}</Badge>
                                <Badge variant='secondary' className='text-[10px] font-mono'>{store.embeddingModel}</Badge>
                            </div>
                            <div className='flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border'>
                                <span className='flex items-center gap-1'>
                                    <IconFileText size={11} />
                                    <span className='font-mono'>{store.docCount.toLocaleString()}</span> docs
                                </span>
                                <span className='flex items-center gap-1'>
                                    <IconBolt size={11} className='text-primary' />
                                    <span className='font-mono'>{store.chunkCount.toLocaleString()}</span> chunks
                                </span>
                            </div>
                            <Button variant='outline' size='sm' className='w-full text-xs h-7 mt-3' onClick={() => setManaging(store)}>
                                <IconFileText size={11} /> Manage Documents
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <IconDatabase size={40} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-lg font-semibold mb-2'>No document stores found</h3>
                    <Button variant='gradient' onClick={() => setShowAdd(true)}><IconPlus size={14} /> New Store</Button>
                </div>
            )}
        </div>
    )
}
