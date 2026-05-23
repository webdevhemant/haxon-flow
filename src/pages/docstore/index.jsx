import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconDatabase, IconFileText, IconRefresh, IconBolt } from '@tabler/icons-react'

const MOCK_STORES = [
    {
        id: 'ds-1',
        name: 'Product Knowledge Base',
        description: 'Documentation, FAQs, and guides for the product.',
        vectorStore: 'Pinecone',
        embeddingModel: 'text-embedding-3-small',
        docCount: 842,
        chunkCount: 4210,
        status: 'ready',
        color: '#6366F1'
    },
    {
        id: 'ds-2',
        name: 'Legal Contracts Archive',
        description: 'Processed legal documents with semantic search enabled.',
        vectorStore: 'Qdrant',
        embeddingModel: 'text-embedding-3-large',
        docCount: 156,
        chunkCount: 1890,
        status: 'ready',
        color: '#A855F7'
    },
    {
        id: 'ds-3',
        name: 'Support Ticket History',
        description: 'Historical support tickets for similar-issue retrieval.',
        vectorStore: 'Weaviate',
        embeddingModel: 'text-embedding-ada-002',
        docCount: 3400,
        chunkCount: 15600,
        status: 'indexing',
        color: '#10B981'
    },
    {
        id: 'ds-4',
        name: 'Engineering Runbooks',
        description: 'On-call runbooks and incident response guides.',
        vectorStore: 'Chroma',
        embeddingModel: 'text-embedding-3-small',
        docCount: 64,
        chunkCount: 780,
        status: 'ready',
        color: '#22D3EE'
    },
    {
        id: 'ds-5',
        name: 'Marketing Copy Vault',
        description: 'Approved brand copy, campaigns, and guidelines.',
        vectorStore: 'Pinecone',
        embeddingModel: 'text-embedding-3-small',
        docCount: 290,
        chunkCount: 2100,
        status: 'draft',
        color: '#F59E0B'
    },
    {
        id: 'ds-6',
        name: 'Research Papers Index',
        description: 'Academic papers indexed for scientific Q&A.',
        vectorStore: 'Qdrant',
        embeddingModel: 'text-embedding-3-large',
        docCount: 1200,
        chunkCount: 22000,
        status: 'ready',
        color: '#EF4444'
    }
]

const STATUS_VARIANT = { ready: 'success', indexing: 'warning', draft: 'secondary', error: 'destructive' }

export default function DocumentStores() {
    const [search, setSearch] = useState('')
    const [stores, setStores] = useState(MOCK_STORES)

    const filtered = stores.filter(
        (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search stores...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Document store wizard coming soon!')}>
                    <IconPlus size={14} /> New Store
                </Button>
            </div>

            {/* Stats */}
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
                    <Card
                        key={store.id}
                        className={cn('card-hover overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                    >
                        <div className='h-0.5' style={{ background: store.color }} />
                        <CardContent className='p-5'>
                            <div className='flex items-start justify-between mb-3'>
                                <div
                                    className='rounded-xl p-2.5'
                                    style={{ background: store.color + '18', border: `1px solid ${store.color}28` }}
                                >
                                    <IconDatabase size={16} style={{ color: store.color }} />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Badge variant={STATUS_VARIANT[store.status] || 'secondary'} className='text-[10px]'>
                                        {store.status}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='ghost'
                                                size='icon-sm'
                                                className='opacity-0 group-hover:opacity-100 transition-opacity'
                                            >
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => toast.info('Coming soon!')}>
                                                <IconEdit size={13} /> Manage
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toast.info('Re-indexing...')}>
                                                <IconRefresh size={13} /> Re-index
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='text-destructive focus:text-destructive'
                                                onClick={() => {
                                                    setStores((p) => p.filter((s) => s.id !== store.id))
                                                    toast.success('Deleted')
                                                }}
                                            >
                                                <IconTrash size={13} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <h3 className='font-display text-sm font-semibold text-foreground mb-1.5'>{store.name}</h3>
                            <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{store.description}</p>
                            <div className='flex flex-wrap gap-1.5 mb-4'>
                                <Badge variant='secondary' className='text-[10px] font-mono'>
                                    {store.vectorStore}
                                </Badge>
                                <Badge variant='secondary' className='text-[10px] font-mono'>
                                    {store.embeddingModel}
                                </Badge>
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
