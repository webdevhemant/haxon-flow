import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatRelativeTime } from '@/lib/utils'
import apikeys from '@/mock/data/apikeys'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconCopy, IconTrash, IconRefresh, IconKey, IconShieldCheck } from '@tabler/icons-react'

export default function APIKey() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(apikeys)

    const filtered = items.filter((k) => k.keyName.toLowerCase().includes(search.toLowerCase()))

    const handleCopy = (key) => {
        navigator.clipboard.writeText(key).catch(() => {})
        toast.success('Key copied to clipboard')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search API keys...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Key generation coming soon!')}>
                    <IconPlus size={14} /> Create Key
                </Button>
            </div>

            {/* Security banner */}
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
                                    <Badge variant={key.status === 'active' ? 'success' : 'secondary'} className='text-[10px]'>
                                        {key.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon-sm'><IconDots size={14} /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => handleCopy(key.keyMasked)}><IconCopy size={13} /> Copy Key</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toast.info('Regenerating...')}><IconRefresh size={13} /> Regenerate</DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive' onClick={() => { setItems((p) => p.filter((k) => k.id !== key.id)); toast.success('Key revoked') }}>
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
        </div>
    )
}
