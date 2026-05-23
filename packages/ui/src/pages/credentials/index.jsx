import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import credentials from '@/mock/data/credentials'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconLock, IconDots, IconEdit, IconTrash, IconRefresh, IconKey, IconEye } from '@tabler/icons-react'

const TYPE_COLORS = {
    openAIApi: '#10B981', anthropicApi: '#A855F7', googleVertexAI: '#22D3EE',
    pineconeApi: '#F59E0B', postgres: '#6366F1', slackBot: '#EF4444',
}
const TYPE_LABELS = {
    openAIApi: 'OpenAI', anthropicApi: 'Anthropic', googleVertexAI: 'Google',
    pineconeApi: 'Pinecone', postgres: 'PostgreSQL', slackBot: 'Slack',
}

export default function Credentials() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(credentials)

    const filtered = items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search credentials...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Credential form coming soon!')}>
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
                                            <div className='rounded-lg p-1.5' style={{ background: color + '18', border: `1px solid ${color}28` }}>
                                                <IconKey size={14} style={{ color }} />
                                            </div>
                                            <div>
                                                <div className='font-medium text-sm text-foreground'>{cred.name}</div>
                                                <div className='text-xs text-muted-foreground hidden sm:block'>{cred.description}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className='hidden sm:table-cell'>
                                        <Badge style={{ background: color + '18', color }} className='border-0 text-[10px] font-mono'>{label}</Badge>
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        <span className='font-mono text-sm text-foreground'>{cred.usedInFlows}</span>
                                        <span className='text-xs text-muted-foreground ml-1'>flows</span>
                                    </TableCell>
                                    <TableCell className='hidden lg:table-cell text-xs text-muted-foreground'>{formatRelativeTime(cred.lastUsed)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon-sm'><IconDots size={14} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem><IconEdit size={13} /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem><IconRefresh size={13} /> Rotate</DropdownMenuItem>
                                                <DropdownMenuItem className='text-destructive' onClick={() => { setItems((p) => p.filter((c) => c.id !== cred.id)); toast.success('Deleted') }}>
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
        </div>
    )
}
