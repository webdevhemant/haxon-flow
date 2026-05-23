import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import { useFlowStore } from '@/store/useFlowStore'
import { toast } from 'sonner'
import {
    IconPlus, IconSearch, IconDots, IconHierarchy2, IconPlayerPlay,
    IconEdit, IconCopy, IconTrash, IconDownload, IconShare, IconBolt,
    IconFilter, IconGridDots, IconList, IconExternalLink
} from '@tabler/icons-react'

function CreateFlowDialog({ open, onClose, onSave }) {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')

    const handleSave = () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        onSave({ name: name.trim(), description: desc.trim(), deployed: false, nodeCount: 0, executionCount: 0, tags: [], color: '#6366F1' })
        setName('')
        setDesc('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display'>New Chatflow</DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Flow name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Customer Support Bot' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this flow do?' />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleSave}><IconPlus size={14} /> Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Chatflows() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [view, setView] = useState('grid')
    const [showCreate, setShowCreate] = useState(false)
    const { chatflows, addChatflow, deleteChatflow, updateChatflow } = useFlowStore()

    const filtered = chatflows.filter(
        (f) => f.name.toLowerCase().includes(search.toLowerCase()) || (f.description || '').toLowerCase().includes(search.toLowerCase())
    )

    const handleCreate = (data) => {
        addChatflow(data)
        setShowCreate(false)
        toast.success('Flow created')
    }

    const handleDelete = (id) => {
        deleteChatflow(id)
        toast.success('Flow deleted')
    }

    const handleDuplicate = (flow) => {
        addChatflow({ ...flow, name: flow.name + ' (Copy)', deployed: false })
        toast.success('Flow duplicated')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <CreateFlowDialog open={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} />

            {/* Header row */}
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='flex-1 flex items-center gap-3'>
                    <div className='relative flex-1 max-w-xs'>
                        <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                        <Input placeholder='Search flows...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <Button variant='ghost' size='icon-sm' className='text-muted-foreground'>
                        <IconFilter size={14} />
                    </Button>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex rounded-lg border border-border p-0.5'>
                        <button onClick={() => setView('grid')} className={cn('rounded-md p-1.5 transition-colors', view === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                            <IconGridDots size={14} />
                        </button>
                        <button onClick={() => setView('list')} className={cn('rounded-md p-1.5 transition-colors', view === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                            <IconList size={14} />
                        </button>
                    </div>
                    <Button variant='gradient' size='sm' onClick={() => setShowCreate(true)}>
                        <IconPlus size={14} /> New Flow
                    </Button>
                </div>
            </div>

            {/* Stats row */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {[
                    { label: 'Total Flows', value: chatflows.length, icon: IconHierarchy2, color: 'text-primary' },
                    { label: 'Deployed', value: chatflows.filter((f) => f.deployed).length, icon: IconBolt, color: 'text-success' },
                    { label: 'Total Runs', value: chatflows.reduce((a, f) => a + (f.executionCount || 0), 0).toLocaleString(), icon: IconPlayerPlay, color: 'text-cyan' },
                    { label: 'Avg Nodes', value: chatflows.length ? Math.round(chatflows.reduce((a, f) => a + (f.nodeCount || 0), 0) / chatflows.length) : 0, icon: IconHierarchy2, color: 'text-accent' },
                ].map((s) => (
                    <Card key={s.label} className='p-4 flex items-center gap-3'>
                        <s.icon size={18} className={s.color} />
                        <div>
                            <div className='font-display text-xl font-bold text-foreground leading-none'>{s.value}</div>
                            <div className='text-xs text-muted-foreground mt-0.5'>{s.label}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Grid */}
            {view === 'grid' ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {filtered.map((flow, i) => (
                        <div key={flow.id} className={cn('card-hover glass rounded-xl border border-border overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}>
                            <div className='h-1' style={{ background: `linear-gradient(90deg, ${flow.color}, ${flow.color}60)` }} />
                            <div className='p-4'>
                                <div className='flex items-start justify-between mb-3'>
                                    <div className='flex items-center gap-2'>
                                        <div className='rounded-lg p-1.5' style={{ background: flow.color + '18' }}>
                                            <IconHierarchy2 size={14} style={{ color: flow.color }} />
                                        </div>
                                        <Badge variant={flow.deployed ? 'success' : 'secondary'} className='text-[10px]'>
                                            {flow.deployed ? 'Live' : 'Draft'}
                                        </Badge>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='icon-sm' className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => navigate(`/canvas/${flow.id}`)}>
                                                <IconEdit size={13} /> Open in Canvas
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(flow)}>
                                                <IconCopy size={13} /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { updateChatflow(flow.id, { deployed: !flow.deployed }); toast.success(flow.deployed ? 'Unpublished' : 'Deployed!') }}>
                                                <IconBolt size={13} /> {flow.deployed ? 'Unpublish' : 'Deploy'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <IconDownload size={13} /> Export JSON
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <IconShare size={13} /> Share
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => handleDelete(flow.id)}>
                                                <IconTrash size={13} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1 truncate'>{flow.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{flow.description}</p>
                                <div className='flex items-center justify-between text-xs text-muted-foreground mb-3'>
                                    <span className='font-mono'>{flow.nodeCount || 0} nodes</span>
                                    <span className='font-mono'>{(flow.executionCount || 0).toLocaleString()} runs</span>
                                </div>
                                <div className='flex flex-wrap gap-1 mb-4'>
                                    {(flow.tags || []).slice(0, 2).map((t) => (
                                        <span key={t} className='text-[9px] font-mono bg-secondary border border-border rounded px-1.5 py-0.5 text-muted-foreground'>{t}</span>
                                    ))}
                                </div>
                                <div className='flex items-center gap-2 pt-3 border-t border-border'>
                                    <Button variant='outline' size='sm' className='flex-1 text-xs h-7' onClick={() => navigate(`/canvas/${flow.id}`)}>
                                        <IconEdit size={11} /> Edit in Canvas
                                    </Button>
                                    <Button variant='ghost' size='icon-sm' className='h-7 w-7' onClick={() => { updateChatflow(flow.id, { deployed: !flow.deployed }); toast.success(flow.deployed ? 'Unpublished' : 'Deployed!') }}>
                                        <IconExternalLink size={12} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='rounded-xl border border-border overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='border-b border-border bg-secondary/40'>
                                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Name</th>
                                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell'>Status</th>
                                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell'>Nodes</th>
                                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell'>Runs</th>
                                <th className='text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell'>Updated</th>
                                <th className='px-4 py-3' />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((flow) => (
                                <tr key={flow.id} className='border-b border-border hover:bg-secondary/30 transition-colors'>
                                    <td className='px-4 py-3'>
                                        <div className='flex items-center gap-3'>
                                            <div className='rounded p-1' style={{ background: flow.color + '18' }}>
                                                <IconHierarchy2 size={13} style={{ color: flow.color }} />
                                            </div>
                                            <div>
                                                <div className='font-medium text-foreground'>{flow.name}</div>
                                                <div className='text-xs text-muted-foreground truncate max-w-xs hidden sm:block'>{flow.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3 hidden sm:table-cell'>
                                        <Badge variant={flow.deployed ? 'success' : 'secondary'} className='text-[10px]'>
                                            {flow.deployed ? 'Live' : 'Draft'}
                                        </Badge>
                                    </td>
                                    <td className='px-4 py-3 font-mono text-xs hidden md:table-cell'>{flow.nodeCount || 0}</td>
                                    <td className='px-4 py-3 font-mono text-xs hidden lg:table-cell'>{(flow.executionCount || 0).toLocaleString()}</td>
                                    <td className='px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell'>{formatRelativeTime(flow.updatedDate)}</td>
                                    <td className='px-4 py-3'>
                                        <Button variant='ghost' size='icon-sm' onClick={() => navigate(`/canvas/${flow.id}`)}>
                                            <IconEdit size={13} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <IconHierarchy2 size={40} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-lg font-semibold mb-2'>No flows found</h3>
                    <p className='text-muted-foreground text-sm mb-6'>Try a different search or create a new flow</p>
                    <Button variant='gradient' onClick={() => setShowCreate(true)}>
                        <IconPlus size={14} /> Create Flow
                    </Button>
                </div>
            )}
        </div>
    )
}
