import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatRelativeTime } from '@/lib/utils'
import apikeysData from '@/mock/data/apikeys'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconCopy, IconTrash, IconRefresh, IconKey, IconShieldCheck, IconCheck } from '@tabler/icons-react'

function generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return 'hxn_' + Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function CreateKeyDialog({ open, onClose, onSave }) {
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
                        <DialogTitle className='font-display flex items-center gap-2 text-success'>
                            <IconCheck size={16} /> API Key Created
                        </DialogTitle>
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
                    <DialogFooter>
                        <Button onClick={handleClose}>Done</Button>
                    </DialogFooter>
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

export default function APIKey() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(apikeysData)
    const [showCreate, setShowCreate] = useState(false)

    const filtered = items.filter((k) => k.keyName.toLowerCase().includes(search.toLowerCase()))

    const handleCopy = (val) => { navigator.clipboard.writeText(val).catch(() => {}); toast.success('Key copied to clipboard') }

    const handleCreate = (data) => {
        setItems((p) => [{ ...data, id: `key-${Date.now()}` }, ...p])
        toast.success('API key created')
    }

    const handleRevoke = (id) => {
        setItems((p) => p.filter((k) => k.id !== id))
        toast.success('Key revoked')
    }

    const handleToggle = (id, status) => {
        setItems((p) => p.map((k) => k.id === id ? { ...k, status: status === 'active' ? 'disabled' : 'active' } : k))
        toast.success(status === 'active' ? 'Key disabled' : 'Key enabled')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <CreateKeyDialog open={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search API keys...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowCreate(true)}>
                    <IconPlus size={14} /> Create Key
                </Button>
            </div>

            <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3'>
                <IconShieldCheck size={18} className='text-primary shrink-0' />
                <div>
                    <p className='text-sm font-medium text-foreground'>Treat API keys like passwords</p>
                    <p className='text-xs text-muted-foreground mt-0.5'>Never expose them in client-side code or public repositories. Rotate keys regularly.</p>
                </div>
            </div>

            <div className='rounded-xl border border-border overflow-hidden'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Key Name</TableHead>
                            <TableHead className='hidden sm:table-cell'>Key</TableHead>
                            <TableHead className='hidden md:table-cell'>Usage</TableHead>
                            <TableHead className='hidden lg:table-cell'>Rate Limit</TableHead>
                            <TableHead className='hidden sm:table-cell'>Status</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((key, i) => (
                            <TableRow key={key.id} className='animate-slide-up' style={{ animationDelay: `${i * 0.05}s` }}>
                                <TableCell>
                                    <div className='flex items-center gap-3'>
                                        <div className='rounded-lg p-1.5 bg-primary/10 border border-primary/20'>
                                            <IconKey size={14} className='text-primary' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-sm text-foreground'>{key.keyName}</div>
                                            {key.description && <div className='text-xs text-muted-foreground hidden sm:block'>{key.description}</div>}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    <div className='flex items-center gap-2'>
                                        <code className='font-mono text-xs text-muted-foreground bg-secondary rounded px-2 py-0.5'>{key.keyMasked}</code>
                                        <button onClick={() => handleCopy(key.keyMasked)} className='text-muted-foreground hover:text-foreground transition-colors'>
                                            <IconCopy size={13} />
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    <span className='font-mono text-sm text-foreground'>{key.usageCount.toLocaleString()}</span>
                                    <span className='text-xs text-muted-foreground ml-1'>calls</span>
                                </TableCell>
                                <TableCell className='hidden lg:table-cell text-xs text-muted-foreground font-mono'>{key.rateLimit}/min</TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    <Badge variant={key.status === 'active' ? 'success' : 'secondary'} className='text-[10px]'>{key.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon-sm'><IconDots size={14} /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => handleCopy(key.keyMasked)}>
                                                <IconCopy size={13} /> Copy Key
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleToggle(key.id, key.status)}>
                                                <IconRefresh size={13} /> {key.status === 'active' ? 'Disable' : 'Enable'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => handleRevoke(key.id)}>
                                                <IconTrash size={13} /> Revoke
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <IconKey size={36} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-base font-semibold mb-2'>No API keys</h3>
                    <Button variant='gradient' size='sm' onClick={() => setShowCreate(true)}>
                        <IconPlus size={14} /> Create Key
                    </Button>
                </div>
            )}
        </div>
    )
}
