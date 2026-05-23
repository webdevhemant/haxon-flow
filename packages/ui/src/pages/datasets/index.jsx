import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import { datasets } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconDatabase, IconUpload, IconDownload } from '@tabler/icons-react'

const STATUS_VARIANT = { ready: 'success', processing: 'warning', draft: 'secondary', error: 'destructive' }

export default function Datasets() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(datasets)

    const filtered = items.filter(
        (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search datasets...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => toast.info('Upload coming soon!')}>
                        <IconUpload size={14} /> Upload
                    </Button>
                    <Button variant='gradient' size='sm' onClick={() => toast.info('Coming soon!')}>
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
                                            <DropdownMenuItem onClick={() => toast.info('Coming soon!')}><IconEdit size={13} /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toast.info('Downloading...')}><IconDownload size={13} /> Export</DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive' onClick={() => { setItems((p) => p.filter((x) => x.id !== d.id)); toast.success('Deleted') }}>
                                                <IconTrash size={13} /> Delete
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
