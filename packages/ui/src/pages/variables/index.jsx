import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import variables from '@/mock/data/variables'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconVariable, IconEye, IconEyeOff } from '@tabler/icons-react'

const TYPE_COLORS = { string: '#6366F1', number: '#10B981', boolean: '#F59E0B', secret: '#EF4444', json: '#A855F7' }

export default function Variables() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(variables)
    const [revealed, setRevealed] = useState(new Set())

    const filtered = items.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))

    const toggleReveal = (id) => {
        setRevealed((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search variables...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Variable editor coming soon!')}>
                    <IconPlus size={14} /> Add Variable
                </Button>
            </div>

            <div className='rounded-xl border border-border overflow-hidden'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className='hidden sm:table-cell'>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className='hidden md:table-cell'>Used In</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((v, i) => {
                            const color = TYPE_COLORS[v.type] || '#6366F1'
                            const isSecret = v.type === 'secret'
                            const isRevealed = revealed.has(v.id)
                            return (
                                <TableRow key={v.id} className='animate-slide-up' style={{ animationDelay: `${i * 0.04}s` }}>
                                    <TableCell>
                                        <div className='flex items-center gap-3'>
                                            <div className='rounded-lg p-1.5' style={{ background: color + '18', border: `1px solid ${color}28` }}>
                                                <IconVariable size={14} style={{ color }} />
                                            </div>
                                            <span className='font-mono text-sm text-foreground'>{v.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='hidden sm:table-cell'>
                                        <Badge style={{ background: color + '18', color }} className='border-0 text-[10px] font-mono capitalize'>{v.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <span className={cn('font-mono text-xs', isSecret && !isRevealed ? 'text-muted-foreground' : 'text-foreground')}>
                                                {isSecret && !isRevealed ? '••••••••••••' : (v.value?.toString().slice(0, 40) ?? '—')}
                                            </span>
                                            {isSecret && (
                                                <button onClick={() => toggleReveal(v.id)} className='text-muted-foreground hover:text-foreground transition-colors'>
                                                    {isRevealed ? <IconEyeOff size={13} /> : <IconEye size={13} />}
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell text-xs text-muted-foreground'>
                                        <span className='font-mono'>{v.usedIn}</span> flows
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon-sm'><IconDots size={14} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => toast.info('Coming soon!')}><IconEdit size={13} /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className='text-destructive' onClick={() => { setItems((p) => p.filter((x) => x.id !== v.id)); toast.success('Deleted') }}>
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
