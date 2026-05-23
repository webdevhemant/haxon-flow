import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import assistants from '@/mock/data/assistants'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconCopy, IconTrash, IconRobot, IconMessage, IconCpu } from '@tabler/icons-react'

const MODEL_COLORS = {
    'gpt-4o': '#10B981',
    'gpt-4o-mini': '#22D3EE',
    'claude-3-5-sonnet': '#A855F7',
    'claude-opus-4': '#6366F1',
    'gemini-pro': '#F59E0B'
}

export default function Assistants() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(assistants)

    const filtered = items.filter(
        (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search assistants...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Assistant builder coming soon!')}>
                    <IconPlus size={14} /> New Assistant
                </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((a, i) => {
                    const color = MODEL_COLORS[a.model] || '#6366F1'
                    return (
                        <Card
                            key={a.id}
                            className={cn('card-hover overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                        >
                            <div className='h-0.5' style={{ background: color }} />
                            <CardContent className='p-5'>
                                <div className='flex items-start justify-between mb-4'>
                                    <div
                                        className='h-12 w-12 rounded-xl flex items-center justify-center text-2xl'
                                        style={{ background: color + '18', border: `1px solid ${color}28` }}
                                    >
                                        {a.avatar || '🤖'}
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
                                            <DropdownMenuItem onClick={() => toast.success('Duplicated!')}>
                                                <IconCopy size={13} /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='text-destructive focus:text-destructive'
                                                onClick={() => {
                                                    setItems((p) => p.filter((x) => x.id !== a.id))
                                                    toast.success('Deleted')
                                                }}
                                            >
                                                <IconTrash size={13} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1'>{a.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{a.description}</p>
                                <div className='flex items-center gap-2 mb-4'>
                                    <Badge style={{ background: color + '18', color }} className='border-0 text-[10px] font-mono'>
                                        {a.model}
                                    </Badge>
                                    <Badge variant='secondary' className='text-[10px]'>
                                        {a.type}
                                    </Badge>
                                </div>
                                <div className='flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border'>
                                    <span className='flex items-center gap-1'>
                                        <IconMessage size={11} className='text-primary' />
                                        <span className='font-mono'>{a.conversations.toLocaleString()}</span>
                                        <span>chats</span>
                                    </span>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='h-6 text-[10px]'
                                        onClick={() => toast.info('Chat interface coming soon!')}
                                    >
                                        Try it
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <IconRobot size={40} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-lg font-semibold mb-2'>No assistants yet</h3>
                    <p className='text-muted-foreground text-sm mb-6'>Create your first AI assistant</p>
                    <Button variant='gradient' onClick={() => toast.info('Coming soon!')}>
                        <IconPlus size={14} /> New Assistant
                    </Button>
                </div>
            )}
        </div>
    )
}
