import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatRelativeTime } from '@/lib/utils'
import credentialsData from '@/mock/data/credentials'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconLock, IconDots, IconEdit, IconTrash, IconRefresh, IconKey } from '@tabler/icons-react'

import { SkeletonCard, SkeletonRow, SkeletonListItem } from '@/components/ui/skeleton'
import { usePageLoading } from '@/hooks/usePageLoading'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSound } from '@/hooks/useSound'
import { CredentialDialog, PROVIDERS } from '@/components/dialogs/CredentialDialog'

const TYPE_COLORS = Object.fromEntries(PROVIDERS.map((p) => [p.value, p.color]))
const TYPE_LABELS = Object.fromEntries(PROVIDERS.map((p) => [p.value, p.label]))

export default function Credentials() {
    const [search, setSearch] = useState('')
    const loading = usePageLoading()
    const { play } = useSound()
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [items, setItems] = useState(credentialsData)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)

    const filtered = items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

    const handleAdd = (data) => {
        setItems((p) => [{ ...data, id: `cred-${Date.now()}` }, ...p])
        setShowAdd(false)
        toast.success('Credential added')
    }

    const handleEdit = (data) => {
        setItems((p) => p.map((c) => (c.id === editing.id ? { ...c, ...data } : c)))
        setEditing(null)
        toast.success('Credential updated')
    }

    const handleDelete = (id) => {
        setItems((p) => p.filter((c) => c.id !== id))
        toast.success('Credential deleted')
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
            <CredentialDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />

            <ConfirmDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete)}
                title='Delete credential?'
                description='This action cannot be undone.'
                confirmLabel='Delete'
            />            {editing && <CredentialDialog key={editing.id ?? editing.name} open={true} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />}

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search credentials...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
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
                                            <div
                                                className='rounded-lg p-1.5'
                                                style={{ background: color + '18', border: `1px solid ${color}28` }}
                                            >
                                                <IconKey size={14} style={{ color }} />
                                            </div>
                                            <div>
                                                <div className='font-medium text-sm text-foreground'>{cred.name}</div>
                                                <div className='text-xs text-muted-foreground hidden sm:block'>{cred.description}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className='hidden sm:table-cell'>
                                        <Badge style={{ background: color + '18', color }} className='border-0 text-[10px] font-mono'>
                                            {label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        <span className='font-mono text-sm text-foreground'>{cred.usedInFlows}</span>
                                        <span className='text-xs text-muted-foreground ml-1'>flows</span>
                                    </TableCell>
                                    <TableCell className='hidden lg:table-cell text-xs text-muted-foreground'>
                                        {formatRelativeTime(cred.lastUsed)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button title='More actions' variant='ghost' size='icon-sm'>
                                                    <IconDots size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => setEditing(cred)}>
                                                    <IconEdit size={13} /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        navigator.clipboard.writeText('sk-***')
                                                        toast.success('Key copied')
                                                    }}
                                                >
                                                    <IconRefresh size={13} /> Rotate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className='text-destructive focus:text-destructive'
                                                    onClick={() => { setConfirmDelete(cred.id); play('click') }}
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
                    <IconLock size={36} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-base font-semibold mb-2'>No credentials</h3>
                    <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> Add Credential
                    </Button>
                </div>
            )}
        </div>
    )
}
