import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import toolsData from '@/mock/data/tools'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconTool, IconDots, IconEdit, IconCopy, IconTrash, IconCode, IconBolt } from '@tabler/icons-react'

import { SkeletonCard, SkeletonRow, SkeletonListItem } from '@/components/ui/skeleton'
import { usePageLoading } from '@/hooks/usePageLoading'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useSound } from '@/hooks/useSound'
import { ToolDialog } from '@/components/dialogs/ToolDialog'

const CATEGORIES = ['All', 'Search', 'Development', 'Communication', 'Data', 'Integration', 'Files', 'Utility']

export default function Tools() {
    const { play } = useSound()
    const [search, setSearch] = useState('')
    const loading = usePageLoading()
    const [category, setCategory] = useState('All')
    const [items, setItems] = useState(toolsData)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [confirmDuplicate, setConfirmDuplicate] = useState(null)

    const filtered = items.filter((t) => {
        const matchSearch =
            t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All' || t.category === category
        return matchSearch && matchCat
    })

    const handleAdd = (data) => {
        setItems((p) => [{ ...data, id: `tool-${Date.now()}` }, ...p])
        setShowAdd(false)
        toast.success('Tool created')
    }

    const handleEdit = (data) => {
        setItems((p) => p.map((t) => (t.id === editing.id ? { ...t, ...data } : t)))
        setEditing(null)
        toast.success('Tool updated')
    }

    const handleDelete = (id) => {
        setItems((p) => p.filter((t) => t.id !== id))
        play('error')
        toast.success('Tool deleted')
    }

    const handleExport = (tool) => {
        const blob = new Blob([JSON.stringify(tool, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${tool.name.replace(/\s+/g, '-').toLowerCase()}.json`
        a.click()
        URL.revokeObjectURL(url)
        play('click')
        toast.success('Tool exported')
    }

    const handleDuplicate = (tool) => {
        setItems((p) => [{ ...tool, id: `tool-${Date.now()}`, name: tool.name + ' (Copy)', usageCount: 0, flowCount: 0 }, ...p])
        toast.success('Tool duplicated')
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
            <ToolDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
            {editing && <ToolDialog key={editing.id ?? editing.name} open={true} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />}
            <ConfirmDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete)}
                title='Delete tool?'
                description='This will permanently delete this tool and remove it from all flows that use it.'
                confirmLabel='Delete tool'
            />
            <ConfirmDialog
                open={!!confirmDuplicate}
                onClose={() => setConfirmDuplicate(null)}
                onConfirm={() => handleDuplicate(confirmDuplicate)}
                title='Duplicate tool?'
                description='A copy of this tool will be created.'
                confirmLabel='Duplicate'
                danger={false}
            />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search tools...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                    <IconPlus size={14} /> New Tool
                </Button>
            </div>

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

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {filtered.map((tool, i) => (
                    <Card
                        key={tool.id}
                        className={cn('card-hover overflow-hidden group relative animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                    >
                        <div
                            className='absolute -top-8 -right-8 h-20 w-20 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity'
                            style={{ background: tool.iconColor }}
                        />
                        <CardContent className='p-5'>
                            <div className='flex items-start justify-between mb-4'>
                                <div
                                    className='rounded-xl p-2.5'
                                    style={{ background: tool.iconColor + '18', border: `1px solid ${tool.iconColor}28` }}
                                >
                                    <IconTool size={16} style={{ color: tool.iconColor }} />
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
                                        <DropdownMenuItem onClick={() => { setEditing(tool); play('click') }}>
                                            <IconEdit size={13} /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setConfirmDuplicate(tool); play('click') }}>
                                            <IconCopy size={13} /> Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleExport(tool)}>
                                            Export JSON
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='text-destructive focus:text-destructive'
                                            onClick={() => { setConfirmDelete(tool.id); play('click') }}
                                        >
                                            <IconTrash size={13} /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <h3 className='font-display text-sm font-semibold mb-1.5'>{tool.name}</h3>
                            <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{tool.description}</p>
                            <div className='flex items-center gap-2 mb-4'>
                                <Badge variant='secondary' className='text-[10px]'>
                                    {tool.category}
                                </Badge>
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

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <IconTool size={36} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-base font-semibold mb-2'>No tools found</h3>
                    <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> New Tool
                    </Button>
                </div>
            )}
        </div>
    )
}
