import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconPlus, IconDatabase, IconUpload, IconX, IconRefresh } from '@tabler/icons-react'

const VECTOR_STORES = ['Pinecone', 'Qdrant', 'Weaviate', 'Chroma', 'Milvus', 'pgvector']
const EMBEDDING_MODELS = ['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002', 'text-embedding-gecko', 'bge-large-en-v1.5']
const COLORS = ['#6366F1', '#A855F7', '#10B981', '#22D3EE', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6']

export function StoreDialog({ open, onClose, onSave, initial }) {
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
                            <select value={vectorStore} onChange={(e) => setVectorStore(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {VECTOR_STORES.map((v) => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Embedding model</label>
                            <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                                {EMBEDDING_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Color</label>
                        <div className='flex gap-2 flex-wrap'>
                            {COLORS.map((c) => (
                                <button key={c} onClick={() => setColor(c)} className={cn('h-6 w-6 rounded-full border-2 transition-all', color === c ? 'border-foreground scale-110' : 'border-transparent')} style={{ background: c }} />
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

export function ManageDialog({ open, onClose, store, onReindex }) {
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
                        {[{ label: 'Documents', value: store.docCount.toLocaleString() }, { label: 'Chunks', value: store.chunkCount.toLocaleString() }, { label: 'Status', value: store.status }].map((s) => (
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
                            <input type='file' accept='.pdf,.docx,.txt,.csv,.md' className='hidden' id='doc-upload' onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            <label htmlFor='doc-upload'><Button variant='outline' size='sm' asChild><span>Browse</span></Button></label>
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
                    <Button variant='outline' size='sm' onClick={() => { onReindex(store.id); onClose() }}><IconRefresh size={13} /> Re-index</Button>
                    <Button variant='gradient' onClick={handleUpload} disabled={!file}><IconUpload size={13} /> Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
