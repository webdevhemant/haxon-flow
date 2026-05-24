import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useFlowStore } from '@/store/useFlowStore'
import { toast } from 'sonner'
import {
    IconPlus,
    IconSearch,
    IconDots,
    IconRobot,
    IconPlayerPlay,
    IconEdit,
    IconCopy,
    IconTrash,
    IconBolt,
    IconCpu,
    IconBrain,
    IconUsersGroup
} from '@tabler/icons-react'

const CATEGORY_COLORS = {
    Research: '#A855F7',
    Support: '#6366F1',
    DevTools: '#10B981',
    Data: '#22D3EE',
    Marketing: '#F59E0B',
    Legal: '#06B6D4'
}

function CreateAgentDialog({ open, onClose, onSave }) {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [model, setModel] = useState('gpt-4o')

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Name is required')
            return
        }
        onSave({
            name: name.trim(),
            description: desc.trim(),
            model,
            deployed: false,
            nodeCount: 0,
            executionCount: 0,
            tags: [],
            category: 'Research',
            color: '#A855F7'
        })
        setName('')
        setDesc('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconUsersGroup size={16} className='text-primary' /> New Agent Flow
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Agent name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Research Assistant' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this agent do?' />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Base model</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'
                        >
                            {['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'claude-3-opus', 'gemini-1.5-pro'].map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant='gradient' onClick={handleSave}>
                        <IconPlus size={14} /> Create Agent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Agentflows() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [showCreate, setShowCreate] = useState(false)
    const { agentflows, addAgentflow, deleteAgentflow, updateAgentflow } = useFlowStore()

    const filtered = agentflows.filter(
        (f) => f.name.toLowerCase().includes(search.toLowerCase()) || (f.description || '').toLowerCase().includes(search.toLowerCase())
    )

    const handleCreate = (data) => {
        addAgentflow(data)
        setShowCreate(false)
        toast.success('Agent created')
    }

    const handleDelete = (id) => {
        deleteAgentflow(id)
        toast.success('Agent deleted')
    }
    const handleDuplicate = (flow) => {
        addAgentflow({ ...flow, name: flow.name + ' (Copy)', deployed: false })
        toast.success('Duplicated')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <CreateAgentDialog open={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} />

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search agents...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowCreate(true)}>
                    <IconPlus size={14} /> New Agent
                </Button>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {[
                    { label: 'Total Agents', value: agentflows.length, icon: IconRobot, color: 'text-primary' },
                    { label: 'Active', value: agentflows.filter((f) => f.deployed).length, icon: IconBolt, color: 'text-success' },
                    {
                        label: 'Total Runs',
                        value: agentflows.reduce((a, f) => a + (f.executionCount || 0), 0).toLocaleString(),
                        icon: IconPlayerPlay,
                        color: 'text-cyan'
                    },
                    {
                        label: 'Avg Nodes',
                        value: agentflows.length
                            ? Math.round(agentflows.reduce((a, f) => a + (f.nodeCount || 0), 0) / agentflows.length)
                            : 0,
                        icon: IconBrain,
                        color: 'text-accent'
                    }
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

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((flow, i) => {
                    const catColor = CATEGORY_COLORS[flow.category] || flow.color || '#A855F7'
                    return (
                        <div
                            key={flow.id}
                            className={cn(
                                'card-hover glass rounded-xl border border-border overflow-hidden group animate-slide-up',
                                `stagger-${Math.min(i + 1, 8)}`
                            )}
                        >
                            <div className='h-1' style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}60)` }} />
                            <div className='p-4'>
                                <div className='flex items-start justify-between mb-3'>
                                    <div className='flex items-center gap-2'>
                                        <div className='rounded-lg p-1.5' style={{ background: catColor + '18' }}>
                                            <IconRobot size={14} style={{ color: catColor }} />
                                        </div>
                                        <Badge variant={flow.deployed ? 'success' : 'secondary'} className='text-[10px]'>
                                            {flow.deployed ? 'Active' : 'Draft'}
                                        </Badge>
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
                                            <DropdownMenuItem onClick={() => navigate(`/canvas/${flow.id}`)}>
                                                <IconEdit size={13} /> Open in Canvas
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(flow)}>
                                                <IconCopy size={13} /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    updateAgentflow(flow.id, { deployed: !flow.deployed })
                                                    toast.success(flow.deployed ? 'Deactivated' : 'Activated!')
                                                }}
                                            >
                                                <IconBolt size={13} /> {flow.deployed ? 'Deactivate' : 'Activate'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='text-destructive focus:text-destructive'
                                                onClick={() => handleDelete(flow.id)}
                                            >
                                                <IconTrash size={13} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1 truncate'>{flow.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{flow.description}</p>
                                {flow.model && (
                                    <div className='flex items-center gap-2 mb-3 text-xs text-muted-foreground'>
                                        <IconCpu size={11} className='text-primary' />
                                        <span className='font-mono'>{flow.model}</span>
                                    </div>
                                )}
                                <div className='flex items-center justify-between text-xs text-muted-foreground mb-3'>
                                    <span className='font-mono'>{flow.nodeCount || 0} nodes</span>
                                    <span className='font-mono'>{(flow.executionCount || 0).toLocaleString()} runs</span>
                                </div>
                                <div className='flex flex-wrap gap-1 mb-3'>
                                    {(flow.tags || []).slice(0, 3).map((t) => (
                                        <span
                                            key={t}
                                            className='text-[9px] font-mono bg-secondary border border-border rounded px-1.5 py-0.5 text-muted-foreground'
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='w-full text-xs h-7 mt-1'
                                    onClick={() => navigate(`/canvas/${flow.id}`)}
                                >
                                    <IconEdit size={11} /> Edit in Canvas
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <IconRobot size={40} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-lg font-semibold mb-2'>No agents found</h3>
                    <p className='text-muted-foreground text-sm mb-6'>Try a different search or build a new agent</p>
                    <Button variant='gradient' onClick={() => setShowCreate(true)}>
                        <IconPlus size={14} /> New Agent
                    </Button>
                </div>
            )}
        </div>
    )
}
