import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import assistantsData from '@/mock/data/assistants'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconCopy, IconTrash, IconRobot, IconMessage, IconCpu } from '@tabler/icons-react'

import { SkeletonCard, SkeletonRow, SkeletonListItem } from '@/components/ui/skeleton'
import { usePageLoading } from '@/hooks/usePageLoading'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSound } from '@/hooks/useSound'
import { AssistantDialog, MODEL_COLORS } from '@/components/dialogs/AssistantDialog'
import { ChatDialog } from '@/components/dialogs/ChatDialog'

export default function Assistants() {
    const [search, setSearch] = useState('')
    const loading = usePageLoading()
    const { play } = useSound()
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [confirmDuplicate, setConfirmDuplicate] = useState(null)
    const [items, setItems] = useState(assistantsData)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)
    const [chatWith, setChatWith] = useState(null)

    const filtered = items.filter(
        (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (data) => {
        setItems((p) => [{ ...data, id: `ast-${Date.now()}` }, ...p])
        setShowAdd(false)
        toast.success('Assistant created')
    }
    const handleEdit = (data) => {
        setItems((p) => p.map((a) => (a.id === editing.id ? { ...a, ...data } : a)))
        setEditing(null)
        toast.success('Updated')
    }
    const handleDelete = (id) => {
        setItems((p) => p.filter((a) => a.id !== id))
        toast.success('Deleted')
    }
    const handleDuplicate = (a) => {
        setItems((p) => [{ ...a, id: `ast-${Date.now()}`, name: a.name + ' (Copy)', conversations: 0 }, ...p])
        toast.success('Duplicated')
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
            <AssistantDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />

            <ConfirmDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete)}
                title='Delete assistant?'
                description='This action cannot be undone.'
                confirmLabel='Delete'
            />
            <ConfirmDialog
                open={!!confirmDuplicate}
                onClose={() => setConfirmDuplicate(null)}
                onConfirm={() => handleDuplicate(confirmDuplicate)}
                title='Duplicate assistant?'
                description='A copy of this assistant will be created.'
                confirmLabel='Duplicate'
                danger={false}
            />
            {editing && <AssistantDialog key={editing.id ?? editing.name} open={true} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />}
            {chatWith && <ChatDialog open={!!chatWith} onClose={() => setChatWith(null)} assistant={chatWith} />}

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
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
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
                                                title='More actions' className='opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity'
                                            >
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => setEditing(a)}>
                                                <IconEdit size={13} /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setConfirmDuplicate(a); play('click') }}>
                                                <IconCopy size={13} /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='text-destructive focus:text-destructive'
                                                onClick={() => { setConfirmDelete(a.id); play('click') }}
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
                                        <span className='font-mono'>{(a.conversations || 0).toLocaleString()}</span> chats
                                    </span>
                                    <Button variant='outline' size='sm' className='h-6 text-[10px]' onClick={() => setChatWith(a)}>
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
                    <Button variant='gradient' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> New Assistant
                    </Button>
                </div>
            )}
        </div>
    )
}
