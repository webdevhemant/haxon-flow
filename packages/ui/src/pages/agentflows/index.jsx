import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import agentflows from '@/mock/data/agentflows'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconRobot, IconPlayerPlay, IconEdit, IconCopy, IconTrash, IconBolt, IconCpu, IconBrain } from '@tabler/icons-react'

const CATEGORY_COLORS = {
    Research: '#A855F7', Support: '#6366F1', DevTools: '#10B981',
    Data: '#22D3EE', Marketing: '#F59E0B', Legal: '#06B6D4',
}

export default function Agentflows() {
    const [search, setSearch] = useState('')
    const [flows, setFlows] = useState(agentflows)

    const filtered = flows.filter(
        (f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (id) => {
        setFlows((prev) => prev.filter((f) => f.id !== id))
        toast.success('Agent deleted')
    }

    const handleDuplicate = (flow) => {
        const copy = { ...flow, id: `af-${Date.now()}`, name: flow.name + ' (Copy)', deployed: false }
        setFlows((prev) => [copy, ...prev])
        toast.success('Agent duplicated')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search agents...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Agent canvas coming soon!')}>
                    <IconPlus size={14} /> New Agent
                </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {[
                    { label: 'Total Agents', value: flows.length, icon: IconRobot, color: 'text-primary' },
                    { label: 'Active', value: flows.filter((f) => f.deployed).length, icon: IconBolt, color: 'text-success' },
                    { label: 'Total Runs', value: flows.reduce((a, f) => a + f.executionCount, 0).toLocaleString(), icon: IconPlayerPlay, color: 'text-cyan' },
                    { label: 'Avg Nodes', value: Math.round(flows.reduce((a, f) => a + f.nodeCount, 0) / flows.length), icon: IconBrain, color: 'text-accent' },
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
                    const catColor = CATEGORY_COLORS[flow.category] || flow.color
                    return (
                        <div key={flow.id} className={cn('card-hover glass rounded-xl border border-border overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}>
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
                                            <Button variant='ghost' size='icon-sm' className='opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => toast.info('Canvas coming soon!')}><IconEdit size={13} /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(flow)}><IconCopy size={13} /> Duplicate</DropdownMenuItem>
                                            <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => handleDelete(flow.id)}><IconTrash size={13} /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1 truncate'>{flow.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{flow.description}</p>
                                <div className='flex items-center gap-2 mb-3 text-xs text-muted-foreground'>
                                    <IconCpu size={11} className='text-primary' />
                                    <span className='font-mono'>{flow.model}</span>
                                </div>
                                <div className='flex items-center justify-between text-xs text-muted-foreground mb-3'>
                                    <span className='font-mono'>{flow.nodeCount} nodes</span>
                                    <span className='font-mono'>{flow.executionCount.toLocaleString()} runs</span>
                                </div>
                                <div className='flex flex-wrap gap-1 mb-3'>
                                    {flow.tags.slice(0, 3).map((t) => (
                                        <span key={t} className='text-[9px] font-mono bg-secondary border border-border rounded px-1.5 py-0.5 text-muted-foreground'>{t}</span>
                                    ))}
                                </div>
                                <Button variant='outline' size='sm' className='w-full text-xs h-7 mt-1' onClick={() => toast.info('Canvas coming soon!')}>
                                    <IconEdit size={11} /> Edit Agent
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
                    <Button variant='gradient' onClick={() => toast.info('Canvas coming soon!')}><IconPlus size={14} /> New Agent</Button>
                </div>
            )}
        </div>
    )
}
