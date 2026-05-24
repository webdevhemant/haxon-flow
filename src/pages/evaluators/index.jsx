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

import { SkeletonCard, SkeletonRow, SkeletonListItem } from '@/components/ui/skeleton'
import { usePageLoading } from '@/hooks/usePageLoading'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSound } from '@/hooks/useSound'
import { EvaluatorDialog } from '@/components/dialogs/EvaluatorDialog'

const TYPE_ICONS = { 'llm-judge': IconBrain, heuristic: IconCode, 'code-runner': IconFlask }
const CATEGORY_COLORS = { RAG: '#6366F1', Safety: '#EF4444', Correctness: '#10B981', Quality: '#F59E0B', Code: '#22D3EE' }

export default function Evaluators() {
    const [search, setSearch] = useState('')
    const loading = usePageLoading()
    const { play } = useSound()
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [items, setItems] = useState(evaluators)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)

    const filtered = items.filter(
        (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (data) => {
        setItems((p) => [{ ...data, id: `ev-${Date.now()}` }, ...p])
        setShowAdd(false)
        toast.success('Evaluator created')
    }
    const handleEdit = (data) => {
        setItems((p) => p.map((x) => (x.id === editing.id ? { ...x, ...data } : x)))
        setEditing(null)
        toast.success('Updated')
    }
    const handleDelete = (id) => {
        setItems((p) => p.filter((x) => x.id !== id))
        toast.success('Deleted')
    }


    if (loading) return (
        <div className='space-y-5'>
            <div className='flex items-center justify-between'>
                <div className='h-8 w-48 bg-secondary/70 animate-pulse rounded-lg' />
                <div className='h-8 w-24 bg-secondary/70 animate-pulse rounded-lg' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    )
    return (
        <div className='space-y-6 animate-fade-in'>
            <EvaluatorDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />

            <ConfirmDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete)}
                title='Delete evaluator?'
                description='This action cannot be undone.'
                confirmLabel='Delete'
            />
            {editing && <EvaluatorDialog key={editing.id ?? editing.name} open={true} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />}

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
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
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
                                                title='More actions' className='opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity'
                                            >
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => setEditing(ev)}>
                                                <IconEdit size={13} /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='text-destructive focus:text-destructive'
                                                onClick={() => { setConfirmDelete(ev.id); play('click') }}
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
                                    <div className='flex items-center gap-1.5 text-xs text-muted-foreground mb-3'>
                                        <IconCpu size={11} className='text-primary' />
                                        <span className='font-mono'>{ev.model}</span>
                                    </div>
                                )}
                                <div className='mt-3 pt-3 border-t border-border'>
                                    <div className='flex items-center justify-between text-xs mb-1.5'>
                                        <span className='text-muted-foreground'>Pass threshold</span>
                                        <span className='font-mono font-semibold text-foreground'>
                                            {(ev.passThreshold * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className='h-1 bg-secondary rounded-full overflow-hidden'>
                                        <div className='h-full bg-primary rounded-full' style={{ width: `${ev.passThreshold * 100}%` }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <IconFlask size={40} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-lg font-semibold mb-2'>No evaluators found</h3>
                    <Button variant='gradient' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> New Evaluator
                    </Button>
                </div>
            )}
        </div>
    )
}
