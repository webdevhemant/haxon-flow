import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatRelativeTime } from '@/lib/utils'
import credentialsData from '@/mock/data/credentials'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconLock, IconDots, IconEdit, IconTrash, IconRefresh, IconKey } from '@tabler/icons-react'

const PROVIDERS = [
    { value: 'openAIApi', label: 'OpenAI', color: '#10B981' },
    { value: 'anthropicApi', label: 'Anthropic', color: '#A855F7' },
    { value: 'googleVertexAI', label: 'Google Vertex AI', color: '#22D3EE' },
    { value: 'pineconeApi', label: 'Pinecone', color: '#F59E0B' },
    { value: 'postgres', label: 'PostgreSQL', color: '#6366F1' },
    { value: 'slackBot', label: 'Slack Bot', color: '#EF4444' },
    { value: 'huggingfaceApi', label: 'HuggingFace', color: '#F97316' },
    { value: 'openRouterApi', label: 'OpenRouter', color: '#8B5CF6' }
]

const TYPE_COLORS = Object.fromEntries(PROVIDERS.map((p) => [p.value, p.color]))
const TYPE_LABELS = Object.fromEntries(PROVIDERS.map((p) => [p.value, p.label]))

function CredentialDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [type, setType] = useState(initial?.type || 'openAIApi')
    const [desc, setDesc] = useState(initial?.description || '')
    const [key, setKey] = useState('')
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Name is required')
            return
        }
        if (!isEdit && !key.trim()) {
            toast.error('API key is required')
            return
        }
        onSave({
            name: name.trim(),
            type,
            description: desc.trim(),
            apiKey: key,
            usedInFlows: initial?.usedInFlows || 0,
            lastUsed: new Date().toISOString()
        })
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
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'
                        >
                            {PROVIDERS.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
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
                    <Button variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant='gradient' onClick={handleSave}>
                        {isEdit ? (
                            'Save Changes'
                        ) : (
                            <>
                                <IconPlus size={14} /> Add
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Credentials() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(credentialsData)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)

    const filtered = items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

    const handleAdd = (data) => {
        setItems((p) => [{ ...data, id: `cred-${Date.now()}` }, ...p])
        setShowAdd(false)
        toast.success('Credential added')
    }

    const handleEdit = (data) => {
        setItems((p) => p.map((c) => (c.id === editing.id ? { ...c, ...data } : c)))
        setEditing(null)
        toast.success('Credential updated')
    }

    const handleDelete = (id) => {
        setItems((p) => p.filter((c) => c.id !== id))
        toast.success('Credential deleted')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <CredentialDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
            <CredentialDialog open={!!editing} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search credentials...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                    <IconPlus size={14} /> Add Credential
                </Button>
            </div>

            <div className='rounded-xl border border-border overflow-hidden'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className='hidden sm:table-cell'>Provider</TableHead>
                            <TableHead className='hidden md:table-cell'>Used In</TableHead>
                            <TableHead className='hidden lg:table-cell'>Last Used</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((cred, i) => {
                            const color = TYPE_COLORS[cred.type] || '#6366F1'
                            const label = TYPE_LABELS[cred.type] || cred.type
                            return (
                                <TableRow key={cred.id} className='animate-slide-up' style={{ animationDelay: `${i * 0.05}s` }}>
                                    <TableCell>
                                        <div className='flex items-center gap-3'>
                                            <div
                                                className='rounded-lg p-1.5'
                                                style={{ background: color + '18', border: `1px solid ${color}28` }}
                                            >
                                                <IconKey size={14} style={{ color }} />
                                            </div>
                                            <div>
                                                <div className='font-medium text-sm text-foreground'>{cred.name}</div>
                                                <div className='text-xs text-muted-foreground hidden sm:block'>{cred.description}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className='hidden sm:table-cell'>
                                        <Badge style={{ background: color + '18', color }} className='border-0 text-[10px] font-mono'>
                                            {label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        <span className='font-mono text-sm text-foreground'>{cred.usedInFlows}</span>
                                        <span className='text-xs text-muted-foreground ml-1'>flows</span>
                                    </TableCell>
                                    <TableCell className='hidden lg:table-cell text-xs text-muted-foreground'>
                                        {formatRelativeTime(cred.lastUsed)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon-sm'>
                                                    <IconDots size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => setEditing(cred)}>
                                                    <IconEdit size={13} /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        navigator.clipboard.writeText('sk-***')
                                                        toast.success('Key copied')
                                                    }}
                                                >
                                                    <IconRefresh size={13} /> Rotate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className='text-destructive focus:text-destructive'
                                                    onClick={() => handleDelete(cred.id)}
                                                >
                                                    <IconTrash size={13} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <IconLock size={36} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-base font-semibold mb-2'>No credentials</h3>
                    <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> Add Credential
                    </Button>
                </div>
            )}
        </div>
    )
}
