import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import variablesData from '@/mock/data/variables'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconVariable, IconEye, IconEyeOff } from '@tabler/icons-react'

import { SkeletonCard, SkeletonRow, SkeletonListItem } from '@/components/ui/skeleton'
import { usePageLoading } from '@/hooks/usePageLoading'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSound } from '@/hooks/useSound'
import { VariableDialog, TYPE_COLORS } from '@/components/dialogs/VariableDialog'

export default function Variables() {
    const [search, setSearch] = useState('')
    const loading = usePageLoading()
    const { play } = useSound()
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [items, setItems] = useState(variablesData)
    const [revealed, setRevealed] = useState(new Set())
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)

    const filtered = items.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))

    const toggleReveal = (id) => {
        setRevealed((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleAdd = (data) => {
        setItems((p) => [{ ...data, id: `var-${Date.now()}` }, ...p])
        setShowAdd(false)
        toast.success('Variable added')
    }

    const handleEdit = (data) => {
        setItems((p) => p.map((v) => (v.id === editing.id ? { ...v, ...data } : v)))
        setEditing(null)
        toast.success('Variable updated')
    }

    const handleDelete = (id) => {
        setItems((p) => p.filter((v) => v.id !== id))
        toast.success('Variable deleted')
    }


    if (loading) return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div className='h-8 w-48 bg-secondary/70 animate-pulse rounded-lg' />
                <div className='h-8 w-24 bg-secondary/70 animate-pulse rounded-lg' />
            </div>
            <div className='space-y-2'>
                {Array.from({ length: 8 }, (_, i) => <SkeletonListItem key={i} />)}
            </div>
        </div>
    )
    return (
        <div className='space-y-6 animate-fade-in'>
            <VariableDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />

            <ConfirmDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete)}
                title='Delete variable?'
                description='This action cannot be undone.'
                confirmLabel='Delete'
            />            {editing && <VariableDialog key={editing.id ?? editing.name} open={true} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />}

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search variables...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
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
                                            <div
                                                className='rounded-lg p-1.5'
                                                style={{ background: color + '18', border: `1px solid ${color}28` }}
                                            >
                                                <IconVariable size={14} style={{ color }} />
                                            </div>
                                            <span className='font-mono text-sm text-foreground'>{v.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='hidden sm:table-cell'>
                                        <Badge
                                            style={{ background: color + '18', color }}
                                            className='border-0 text-[10px] font-mono capitalize'
                                        >
                                            {v.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <span
                                                className={cn(
                                                    'font-mono text-xs',
                                                    isSecret && !isRevealed ? 'text-muted-foreground' : 'text-foreground'
                                                )}
                                            >
                                                {isSecret && !isRevealed ? '••••••••••••' : (v.value?.toString().slice(0, 40) ?? '—')}
                                            </span>
                                            {isSecret && (
                                                <button
                                                    onClick={() => toggleReveal(v.id)}
                                                    className='text-muted-foreground hover:text-foreground transition-colors'
                                                >
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
                                                <Button title='More actions' variant='ghost' size='icon-sm'>
                                                    <IconDots size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => setEditing(v)}>
                                                    <IconEdit size={13} /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className='text-destructive focus:text-destructive'
                                                    onClick={() => { setConfirmDelete(v.id); play('click') }}
                                                >
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

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <IconVariable size={36} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-base font-semibold mb-2'>No variables</h3>
                    <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> Add Variable
                    </Button>
                </div>
            )}
        </div>
    )
}
