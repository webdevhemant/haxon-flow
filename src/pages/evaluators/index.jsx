import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { evaluators } from '@/mock/data/datasets'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconFlask, IconCpu, IconCode, IconBrain } from '@tabler/icons-react'

const TYPE_ICONS = { 'llm-judge': IconBrain, heuristic: IconCode, 'code-runner': IconFlask }
const CATEGORY_COLORS = { RAG: '#6366F1', Safety: '#EF4444', Correctness: '#10B981', Quality: '#F59E0B', Code: '#22D3EE' }

export default function Evaluators() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(evaluators)

    const filtered = items.filter(
        (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search evaluators...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Evaluator builder coming soon!')}>
                    <IconPlus size={14} /> New Evaluator
                </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((ev, i) => {
                    const color = CATEGORY_COLORS[ev.category] || '#6366F1'
                    const TypeIcon = TYPE_ICONS[ev.type] || IconBrain
                    return (
                        <Card
                            key={ev.id}
                            className={cn('card-hover overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                        >
                            <div className='h-0.5' style={{ background: color }} />
                            <CardContent className='p-5'>
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='rounded-xl p-2.5' style={{ background: color + '18', border: `1px solid ${color}28` }}>
                                        <TypeIcon size={16} style={{ color }} />
                                    </div>
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
                                                <IconEdit size={13} /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='text-destructive focus:text-destructive'
                                                onClick={() => {
                                                    setItems((p) => p.filter((x) => x.id !== ev.id))
                                                    toast.success('Deleted')
                                                }}
                                            >
                                                <IconTrash size={13} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1.5'>{ev.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{ev.description}</p>
                                <div className='flex items-center gap-2 mb-3'>
                                    <Badge style={{ background: color + '18', color }} className='border-0 text-[10px]'>
                                        {ev.category}
                                    </Badge>
                                    <Badge variant='secondary' className='text-[10px] capitalize'>
                                        {ev.type}
                                    </Badge>
                                </div>
                                {ev.model && (
                                    <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                                        <IconCpu size={11} className='text-primary' />
                                        <span className='font-mono'>{ev.model}</span>
                                    </div>
                                )}
                                <div className='mt-3 pt-3 border-t border-border flex items-center justify-between text-xs'>
                                    <span className='text-muted-foreground'>Pass threshold</span>
                                    <span className='font-mono font-semibold text-foreground'>{(ev.passThreshold * 100).toFixed(0)}%</span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
