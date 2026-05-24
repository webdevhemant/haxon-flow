import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import toolsData from '@/mock/data/tools'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconTool, IconDots, IconEdit, IconCopy, IconTrash, IconCode, IconBolt } from '@tabler/icons-react'

const CATEGORIES = ['All', 'Search', 'Development', 'Communication', 'Data', 'Integration', 'Files', 'Utility']
const COLORS = ['#6366F1', '#10B981', '#A855F7', '#22D3EE', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6']

const DEFAULT_CODE = `// Tool function — receives input and returns result
async function run(input) {
    // Your implementation here
    return { result: input }
}`

function ToolDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [category, setCategory] = useState(initial?.category || 'Utility')
    const [color, setColor] = useState(initial?.iconColor || '#6366F1')
    const [code, setCode] = useState(initial?.code || DEFAULT_CODE)
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Name is required')
            return
        }
        onSave({
            name: name.trim(),
            description: desc.trim(),
            category,
            iconColor: color,
            code,
            usageCount: initial?.usageCount || 0,
            flowCount: initial?.flowCount || 0
        })
        setName('')
        setDesc('')
        setCategory('Utility')
        setColor('#6366F1')
        setCode(DEFAULT_CODE)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle className='font-display'>{isEdit ? 'Edit Tool' : 'New Tool'}</DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-4 py-2'>
                    <div className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Tool name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Web Search' autoFocus />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Description</label>
                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this tool do?' />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'
                            >
                                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>Color</label>
                            <div className='flex gap-2 flex-wrap'>
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={cn(
                                            'h-6 w-6 rounded-full border-2 transition-all',
                                            color === c ? 'border-foreground scale-110' : 'border-transparent'
                                        )}
                                        style={{ background: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground flex items-center gap-1'>
                            <IconCode size={11} /> Implementation
                        </label>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            rows={12}
                            className='w-full text-[11px] rounded-md border border-border bg-secondary/40 px-3 py-2 text-foreground resize-none font-mono leading-relaxed'
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant='gradient' onClick={handleSave}>
                        {isEdit ? (
                            'Save Changes'
                        ) : (
                            <>
                                <IconPlus size={14} /> Create Tool
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Tools() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [items, setItems] = useState(toolsData)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)

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
        toast.success('Tool deleted')
    }

    const handleDuplicate = (tool) => {
        setItems((p) => [{ ...tool, id: `tool-${Date.now()}`, name: tool.name + ' (Copy)', usageCount: 0, flowCount: 0 }, ...p])
        toast.success('Tool duplicated')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <ToolDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
            <ToolDialog open={!!editing} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />

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
                                            className='opacity-0 group-hover:opacity-100 transition-opacity'
                                        >
                                            <IconDots size={14} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem onClick={() => setEditing(tool)}>
                                            <IconEdit size={13} /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDuplicate(tool)}>
                                            <IconCopy size={13} /> Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='text-destructive focus:text-destructive'
                                            onClick={() => handleDelete(tool.id)}
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
