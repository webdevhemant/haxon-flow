import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import tools from '@/mock/data/tools'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconTool, IconDots, IconEdit, IconCopy, IconTrash, IconCode, IconBolt } from '@tabler/icons-react'

const CATEGORIES = ['All', 'Search', 'Development', 'Communication', 'Data', 'Integration', 'Files', 'Utility']

export default function Tools() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [items, setItems] = useState(tools)

    const filtered = items.filter((t) => {
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All' || t.category === category
        return matchSearch && matchCat
    })

    return (
        <div className='space-y-6 animate-fade-in'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search tools...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Tool editor coming soon!')}>
                    <IconPlus size={14} /> New Tool
                </Button>
            </div>

            {/* Category filter */}
            <div className='flex flex-wrap gap-2'>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium transition-all',
                            category === cat
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                : 'bg-secondary text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground'
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {filtered.map((tool, i) => (
                    <Card
                        key={tool.id}
                        className={cn('card-hover overflow-hidden group relative animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                    >
                        {/* Glow top */}
                        <div className='absolute -top-8 -right-8 h-20 w-20 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity'
                            style={{ background: tool.iconColor }} />

                        <CardContent className='p-5'>
                            <div className='flex items-start justify-between mb-4'>
                                <div className='rounded-xl p-2.5' style={{ background: tool.iconColor + '18', border: `1px solid ${tool.iconColor}28` }}>
                                    <IconTool size={16} style={{ color: tool.iconColor }} />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' size='icon-sm' className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                            <IconDots size={14} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem onClick={() => toast.info('Editor coming soon!')}><IconEdit size={13} /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast.success('Copied!')}><IconCopy size={13} /> Duplicate</DropdownMenuItem>
                                        <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => { setItems((p) => p.filter((t) => t.id !== tool.id)); toast.success('Deleted') }}>
                                            <IconTrash size={13} /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <h3 className='font-display text-sm font-semibold mb-1.5'>{tool.name}</h3>
                            <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{tool.description}</p>

                            <div className='flex items-center gap-2 mb-4'>
                                <Badge variant='secondary' className='text-[10px]'>{tool.category}</Badge>
                            </div>

                            <div className='flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border'>
                                <span className='flex items-center gap-1'>
                                    <IconBolt size={11} className='text-primary' />
                                    <span className='font-mono'>{tool.usageCount.toLocaleString()}</span>
                                    <span>uses</span>
                                </span>
                                <span className='flex items-center gap-1'>
                                    <IconCode size={11} className='text-cyan' />
                                    <span className='font-mono'>{tool.flowCount}</span>
                                    <span>flows</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
