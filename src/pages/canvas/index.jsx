import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSound } from '@/hooks/useSound'
import { useUIStore } from '@/store/useUIStore'
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    useReactFlow,
    ReactFlowProvider,
    BackgroundVariant,
    Handle,
    Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { NODE_DEFS, CATEGORY_COLORS } from './nodeDefs'
import { useCanvasStore } from '@/store/useCanvasStore'
import { useFlowStore } from '@/store/useFlowStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    IconArrowLeft,
    IconDeviceFloppy,
    IconPlayerPlay,
    IconLayoutGrid,
    IconSearch,
    IconX,
    IconChevronDown,
    IconChevronUp
} from '@tabler/icons-react'

// ─── FlowNode ─────────────────────────────────────────────────────────────────

function FlowNode({ id, data, selected }) {
    const def = NODE_DEFS[data.nodeType]
    if (!def) return null

    const Icon = def.icon
    const color = CATEGORY_COLORS[def.category] || '#6366F1'
    const { deleteNode } = useCanvasStore()
    const inputCount = def.inputAnchors.length
    const outputCount = def.outputAnchors.length

    const paramRows = def.inputParams.slice(0, 2).filter((p) => {
        const val = data.params?.[p.name] ?? p.default
        return val !== undefined && val !== '' && val !== null
    })

    return (
        <div className='relative group select-none' style={{ minWidth: 248, maxWidth: 288 }}>
            {/* Input handles */}
            {def.inputAnchors.map((anchor, idx) => {
                const pct = inputCount === 1 ? 50 : ((idx + 1) / (inputCount + 1)) * 100
                return (
                    <Handle
                        key={anchor.id}
                        type='target'
                        position={Position.Left}
                        id={anchor.id}
                        title={anchor.label}
                        style={{
                            background: anchor.optional ? 'hsl(var(--background))' : color,
                            border: `2.5px solid ${color}`,
                            width: 13, height: 13,
                            top: `${pct}%`,
                            boxShadow: `0 0 10px ${color}55`,
                        }}
                    />
                )
            })}

            {/* Output handles */}
            {def.outputAnchors.map((anchor, idx) => {
                const pct = outputCount === 1 ? 50 : ((idx + 1) / (outputCount + 1)) * 100
                return (
                    <Handle
                        key={anchor.id}
                        type='source'
                        position={Position.Right}
                        id={anchor.id}
                        title={anchor.label}
                        style={{
                            background: color,
                            border: `2.5px solid ${color}90`,
                            width: 13, height: 13,
                            top: `${pct}%`,
                            boxShadow: `0 0 10px ${color}70`,
                        }}
                    />
                )
            })}

            {/* Visual card (overflow-hidden isolates gradient clipping from handles) */}
            <div
                className='rounded-2xl overflow-hidden bg-card'
                style={{
                    border: selected ? `1.5px solid ${color}` : '1px solid hsl(var(--border))',
                    boxShadow: selected
                        ? `0 0 0 3px ${color}22, 0 8px 32px ${color}22, 0 4px 16px rgba(0,0,0,0.35)`
                        : '0 4px 16px rgba(0,0,0,0.28)',
                }}
            >
                {/* Header */}
                <div
                    className='px-3.5 pt-3 pb-2.5'
                    style={{
                        background: `linear-gradient(135deg, ${color}20 0%, ${color}07 100%)`,
                        borderBottom: `1px solid ${color}20`,
                    }}
                >
                    <div className='flex items-center gap-2.5'>
                        <div
                            className='rounded-xl p-2 shrink-0 flex items-center justify-center'
                            style={{ background: color + '22', border: `1px solid ${color}30` }}
                        >
                            <Icon size={15} style={{ color }} />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='font-display text-xs font-semibold text-foreground leading-snug truncate'>
                                {data.label}
                            </p>
                            <p className='text-[9px] font-mono uppercase tracking-widest mt-0.5' style={{ color: color + 'bb' }}>
                                {def.category}
                            </p>
                        </div>
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); deleteNode(id) }}
                            className='opacity-0 group-hover:opacity-100 rounded-lg p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-all nodrag shrink-0'
                        >
                            <IconX size={11} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className='px-3.5 py-2.5 min-h-[36px]'>
                    {paramRows.length > 0 ? (
                        <div className='space-y-1.5'>
                            {paramRows.map((p) => {
                                const val = data.params?.[p.name] ?? p.default
                                return (
                                    <div key={p.name} className='flex items-center gap-2'>
                                        <span className='text-[9px] text-muted-foreground/55 shrink-0 font-medium'>{p.label}</span>
                                        <div className='flex-1 h-px bg-border/25' />
                                        <span className='text-[9px] font-mono text-foreground/80 truncate max-w-[100px]'>
                                            {p.type === 'password' ? '••••••' : String(val).slice(0, 20)}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : def.inputAnchors.length > 0 ? (
                        <div className='flex flex-wrap gap-1'>
                            {def.inputAnchors.slice(0, 3).map((a) => (
                                <span
                                    key={a.id}
                                    className='inline-flex items-center gap-1 text-[9px] font-mono rounded px-1.5 py-0.5'
                                    style={{ background: color + '12', color: color + 'cc', border: `1px solid ${color}20` }}
                                >
                                    <span className='h-1 w-1 rounded-full shrink-0' style={{ background: a.optional ? 'transparent' : color, border: a.optional ? `1px solid ${color}` : 'none' }} />
                                    {a.label}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className='text-[9px] text-muted-foreground/40 italic'>No inputs required</p>
                    )}
                </div>

                {/* Footer */}
                <div
                    className='flex items-center justify-between px-3.5 py-1.5'
                    style={{ background: `${color}09`, borderTop: `1px solid ${color}18` }}
                >
                    <div className='flex items-center gap-1.5'>
                        {def.inputAnchors.slice(0, 4).map((a) => (
                            <div
                                key={a.id}
                                className='h-1.5 w-1.5 rounded-full transition-transform'
                                style={{
                                    background: a.optional ? 'transparent' : color + '90',
                                    border: `1.5px solid ${a.optional ? color + '55' : color}`,
                                }}
                                title={a.label}
                            />
                        ))}
                        {inputCount > 0 && (
                            <span className='text-[9px] font-mono text-muted-foreground/55 ml-0.5'>{inputCount} in</span>
                        )}
                    </div>
                    <div className='flex items-center gap-1.5'>
                        {outputCount > 0 && (
                            <span className='text-[9px] font-mono text-muted-foreground/55 mr-0.5'>{outputCount} out</span>
                        )}
                        {def.outputAnchors.slice(0, 4).map((a) => (
                            <div
                                key={a.id}
                                className='h-1.5 w-1.5 rounded-full'
                                style={{ background: color, boxShadow: `0 0 5px ${color}90` }}
                                title={a.label}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const nodeTypes = { flowNode: FlowNode }

// ─── Node Palette ─────────────────────────────────────────────────────────────

function NodePalette() {
    const [search, setSearch] = useState('')
    const [collapsed, setCollapsed] = useState({})

    const categories = Object.keys(CATEGORY_COLORS)
    const allEntries = Object.entries(NODE_DEFS)

    const filtered = search
        ? allEntries.filter(
              ([, d]) =>
                  d.label.toLowerCase().includes(search.toLowerCase()) ||
                  d.category.toLowerCase().includes(search.toLowerCase()) ||
                  d.description.toLowerCase().includes(search.toLowerCase())
          )
        : allEntries

    const onDragStart = (e, type) => {
        e.dataTransfer.setData('application/reactflow-nodetype', type)
        e.dataTransfer.effectAllowed = 'move'
    }

    const toggleCategory = (cat) => setCollapsed((c) => ({ ...c, [cat]: !c[cat] }))

    return (
        <div className='flex h-full flex-col bg-sidebar'>
            <div className='p-3 border-b border-border shrink-0'>
                <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2'>Add Nodes</p>
                <div className='relative'>
                    <IconSearch size={12} className='absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search nodes…'
                        className='h-7 pl-6 text-xs'
                    />
                </div>
            </div>

            <div className='flex-1 overflow-y-auto py-2'>
                {search ? (
                    <div className='px-2 space-y-0.5'>
                        {filtered.map(([type, def]) => (
                            <PaletteItem key={type} type={type} def={def} onDragStart={onDragStart} />
                        ))}
                        {filtered.length === 0 && <p className='text-center text-[10px] text-muted-foreground py-4'>No nodes found</p>}
                    </div>
                ) : (
                    categories.map((cat) => {
                        const items = filtered.filter(([, d]) => d.category === cat)
                        if (!items.length) return null
                        const isCollapsed = collapsed[cat]
                        return (
                            <div key={cat} className='mb-1'>
                                <button
                                    onClick={() => toggleCategory(cat)}
                                    className='w-full flex items-center justify-between px-3 py-1.5 hover:bg-secondary/50 transition-colors'
                                >
                                    <span
                                        className='text-[10px] font-semibold uppercase tracking-wider'
                                        style={{ color: CATEGORY_COLORS[cat] }}
                                    >
                                        {cat}
                                    </span>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-[9px] text-muted-foreground font-mono'>{items.length}</span>
                                        {isCollapsed ? (
                                            <IconChevronDown size={10} className='text-muted-foreground' />
                                        ) : (
                                            <IconChevronUp size={10} className='text-muted-foreground' />
                                        )}
                                    </div>
                                </button>
                                {!isCollapsed && (
                                    <div className='px-2 space-y-0.5 pb-1'>
                                        {items.map(([type, def]) => (
                                            <PaletteItem key={type} type={type} def={def} onDragStart={onDragStart} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <div className='p-2 border-t border-border shrink-0 text-center'>
                <p className='text-[9px] text-muted-foreground'>Drag onto canvas or click to add</p>
            </div>
        </div>
    )
}

function PaletteItem({ type, def, onDragStart }) {
    const { addNode } = useCanvasStore()
    const reactflow = useReactFlow()
    const color = CATEGORY_COLORS[def.category] || '#6366F1'
    const Icon = def.icon

    const handleClick = () => {
        const pos = reactflow.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
        const nodeId = `${type}-${Date.now()}`
        addNode({
            id: nodeId,
            type: 'flowNode',
            position: { x: pos.x - 110 + Math.random() * 60 - 30, y: pos.y - 60 + Math.random() * 60 - 30 },
            data: { nodeType: type, label: def.label, params: Object.fromEntries(def.inputParams.map((p) => [p.name, p.default ?? ''])) }
        })
        toast.success(`${def.label} added`)
    }

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            onClick={handleClick}
            className='flex items-center gap-2.5 rounded-xl px-2.5 py-2 cursor-grab active:cursor-grabbing group/item transition-all hover:bg-secondary/60 border border-transparent hover:border-border/50'
            title={def.description}
        >
            <div
                className='rounded-lg p-1.5 shrink-0 transition-transform group-hover/item:scale-110'
                style={{ background: color + '20', border: `1px solid ${color}28` }}
            >
                <Icon size={12} style={{ color }} />
            </div>
            <div className='min-w-0 flex-1'>
                <div className='text-[11px] font-medium text-foreground truncate leading-tight'>{def.label}</div>
                <div className='text-[9px] text-muted-foreground/70 truncate'>{def.description}</div>
            </div>
        </div>
    )
}

// ─── Node Inspector ───────────────────────────────────────────────────────────

function ParamField({ param, value, onChange }) {
    const { name, label, type, options, rows, placeholder, optional } = param
    const displayVal = value ?? param.default ?? ''

    if (type === 'options') {
        return (
            <div className='space-y-1'>
                <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
                    {label}
                    {optional && <span className='ml-1 text-muted-foreground/50 normal-case font-normal'>(optional)</span>}
                </label>
                <select
                    value={displayVal}
                    onChange={(e) => onChange(name, e.target.value)}
                    className='w-full h-7 text-xs rounded-md border border-border bg-background px-2 text-foreground'
                >
                    {(options || []).map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            </div>
        )
    }
    if (type === 'boolean') {
        return (
            <div className='flex items-center justify-between'>
                <label className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>{label}</label>
                <button
                    onClick={() => onChange(name, !displayVal)}
                    className={cn(
                        'h-5 w-9 rounded-full transition-colors',
                        displayVal ? 'bg-primary' : 'bg-secondary border border-border'
                    )}
                >
                    <div
                        className={cn(
                            'h-3.5 w-3.5 rounded-full bg-white shadow transition-transform mx-0.5',
                            displayVal ? 'translate-x-4' : 'translate-x-0'
                        )}
                    />
                </button>
            </div>
        )
    }
    if (type === 'textarea' || type === 'code') {
        return (
            <div className='space-y-1'>
                <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>{label}</label>
                <textarea
                    value={displayVal}
                    onChange={(e) => onChange(name, e.target.value)}
                    rows={rows || (type === 'code' ? 8 : 4)}
                    placeholder={placeholder}
                    className={cn(
                        'w-full rounded-md border border-border px-2 py-1.5 text-foreground resize-y leading-relaxed',
                        type === 'code' ? 'text-[10px] font-mono bg-secondary/40' : 'text-xs bg-background'
                    )}
                />
            </div>
        )
    }
    if (type === 'json') {
        return (
            <div className='space-y-1'>
                <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>{label}</label>
                <textarea
                    value={typeof displayVal === 'object' ? JSON.stringify(displayVal, null, 2) : displayVal}
                    onChange={(e) => onChange(name, e.target.value)}
                    rows={3}
                    placeholder={placeholder || '{ }'}
                    className='w-full text-[10px] font-mono rounded-md border border-border bg-secondary/40 px-2 py-1.5 text-foreground resize-y'
                />
            </div>
        )
    }
    if (type === 'file') {
        return (
            <div className='space-y-1'>
                <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>{label}</label>
                <input
                    type='file'
                    accept={param.fileType}
                    className='w-full text-[10px] text-foreground file:text-[10px] file:mr-2 file:rounded file:border-0 file:bg-secondary file:text-foreground file:px-2 file:py-1'
                />
            </div>
        )
    }
    // string, number, password
    return (
        <div className='space-y-1'>
            <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
                {label}
                {optional && <span className='ml-1 text-muted-foreground/50 normal-case font-normal'>(optional)</span>}
            </label>
            <Input
                type={type === 'password' ? 'password' : type === 'number' ? 'number' : 'text'}
                value={displayVal}
                onChange={(e) => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                placeholder={placeholder}
                className='h-7 text-xs'
            />
        </div>
    )
}

function NodeInspector({ node, onClose }) {
    const { updateNodeData } = useCanvasStore()
    const def = NODE_DEFS[node.data.nodeType]
    if (!def) return null

    const color = CATEGORY_COLORS[def.category] || '#6366F1'
    const Icon = def.icon
    const params = node.data.params || {}

    const setParam = (key, val) => {
        updateNodeData(node.id, { params: { ...params, [key]: val } })
    }

    return (
        <div className='flex h-full flex-col bg-sidebar'>
            <div className='flex items-center gap-2 p-3 border-b border-border shrink-0'>
                <div className='rounded-lg p-1.5 shrink-0' style={{ background: color + '20' }}>
                    <Icon size={13} style={{ color }} />
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='text-xs font-semibold text-foreground truncate'>{node.data.label}</p>
                    <p className='text-[10px]' style={{ color }}>
                        {def.category}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className='rounded p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0'
                >
                    <IconX size={13} />
                </button>
            </div>

            <div className='flex-1 overflow-y-auto p-3 space-y-3'>
                {/* Label */}
                <div className='space-y-1'>
                    <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>Label</label>
                    <Input
                        value={node.data.label}
                        onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
                        className='h-7 text-xs'
                    />
                </div>

                {/* Description */}
                <p className='text-[10px] text-muted-foreground leading-relaxed'>{def.description}</p>

                {/* Input anchors info */}
                {def.inputAnchors.length > 0 && (
                    <div className='rounded-lg border border-border/50 p-2 space-y-1'>
                        <p className='text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Input Connections</p>
                        {def.inputAnchors.map((a) => (
                            <div key={a.id} className='flex items-center gap-1.5'>
                                <div className='h-1.5 w-1.5 rounded-full' style={{ background: color }} />
                                <span className='text-[10px] text-foreground'>{a.label}</span>
                                {a.optional && (
                                    <Badge variant='secondary' className='text-[8px] px-1 py-0'>
                                        optional
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* All params */}
                {def.inputParams.map((p) => (
                    <ParamField key={p.name} param={p} value={params[p.name]} onChange={setParam} />
                ))}

                {def.inputParams.length === 0 && (
                    <p className='text-[10px] text-muted-foreground text-center py-2'>No configuration needed</p>
                )}

                {/* Output anchors info */}
                {def.outputAnchors.length > 0 && (
                    <div className='rounded-lg border border-border/50 p-2 space-y-1'>
                        <p className='text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Outputs</p>
                        {def.outputAnchors.map((a) => (
                            <div key={a.id} className='flex items-center gap-1.5'>
                                <div className='h-1.5 w-1.5 rounded-full' style={{ background: color }} />
                                <span className='text-[10px] text-foreground'>{a.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Canvas inner ─────────────────────────────────────────────────────────────

function CanvasInner() {
    const { id } = useParams()
    const navigate = useNavigate()
    const reactflow = useReactFlow()
    const wrapperRef = useRef(null)
    const { play } = useSound()
    const { canvasMusicEnabled } = useUIStore()
    const musicRef = useRef(null)

    // Ambient music: drone oscillators while canvasMusicEnabled is true
    useEffect(() => {
        if (!canvasMusicEnabled) {
            if (musicRef.current) { musicRef.current.stop(); musicRef.current = null }
            return
        }
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const master = ctx.createGain(); master.gain.setValueAtTime(0.06, ctx.currentTime); master.connect(ctx.destination)
            const drones = [55, 82.4, 110, 164.8]
            const oscs = drones.map((freq, i) => {
                const osc = ctx.createOscillator(); const g = ctx.createGain()
                osc.type = i % 2 === 0 ? 'sine' : 'triangle'
                osc.frequency.value = freq
                g.gain.setValueAtTime(0, ctx.currentTime)
                g.gain.linearRampToValueAtTime(1 / drones.length, ctx.currentTime + 2)
                osc.connect(g); g.connect(master); osc.start()
                return { osc, g }
            })
            musicRef.current = { stop: () => { oscs.forEach(({ osc, g }) => { g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); setTimeout(() => { try { osc.stop() } catch {} }, 1200) }); setTimeout(() => { try { ctx.close() } catch {} }, 1500) } }
        } catch {}
        return () => { if (musicRef.current) { musicRef.current.stop(); musicRef.current = null } }
    }, [canvasMusicEnabled])

    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        setSelectedNode,
        selectedNode,
        setFlow,
        flowName,
        setFlowName,
        isDirty,
        markSaved
    } = useCanvasStore()
    const { chatflows, agentflows } = useFlowStore()
    const [showPalette, setShowPalette] = useState(true)

    useEffect(() => {
        const flow = [...chatflows, ...agentflows].find((f) => f.id === id)
        if (flow) {
            const ns = buildInitialNodes(flow)
            const es = buildInitialEdges(ns)
            setFlow(flow.id, flow.name, ns, es)
        }
    }, [id])

    // Always read latest node data from store for inspector
    const inspectorNode = selectedNode ? nodes.find((n) => n.id === selectedNode.id) || null : null

    const onDragOver = useCallback((e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (e) => {
            e.preventDefault()
            const type = e.dataTransfer.getData('application/reactflow-nodetype')
            if (!type || !NODE_DEFS[type]) return
            const def = NODE_DEFS[type]
            const bounds = wrapperRef.current?.getBoundingClientRect()
            const position = reactflow.screenToFlowPosition({ x: e.clientX - (bounds?.left || 0), y: e.clientY - (bounds?.top || 0) })
            const nodeId = `${type}-${Date.now()}`
            addNode({
                id: nodeId,
                type: 'flowNode',
                position,
                data: {
                    nodeType: type,
                    label: def.label,
                    params: Object.fromEntries(def.inputParams.map((p) => [p.name, p.default ?? '']))
                }
            })
            play('nodeDrop')
            toast.success(`${def.label} added`)
        },
        [reactflow, play]
    )

    const handleConnect = useCallback((connection) => {
        onConnect(connection)
        play('nodeConnect')
    }, [onConnect, play])

    const onEdgeDoubleClick = useCallback((_, edge) => {
        onEdgesChange([{ type: 'remove', id: edge.id }])
        toast.success('Connection removed')
    }, [onEdgesChange])

    const onNodeClick = useCallback((_, node) => {
        setSelectedNode(node)
    }, [])
    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
    }, [])
    const handleSave = () => {
        markSaved()
        play('success')
        toast.success('Flow saved')
    }

    return (
        <div className='flex h-screen w-screen flex-col overflow-hidden bg-background'>
            {/* Topbar */}
            <div className='flex items-center gap-3 px-4 h-12 border-b border-border bg-sidebar z-10 shrink-0'>
                <Button variant='ghost' size='icon-sm' onClick={() => navigate(-1)}>
                    <IconArrowLeft size={15} />
                </Button>
                <div className='w-px h-5 bg-border' />
                <Input
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    className='h-7 text-sm font-display font-semibold border-transparent bg-transparent hover:bg-secondary focus:bg-secondary max-w-[280px]'
                />
                {isDirty && (
                    <Badge variant='secondary' className='text-[9px] font-mono shrink-0'>
                        unsaved
                    </Badge>
                )}
                <div className='flex-1' />
                <Button variant='ghost' size='sm' className='gap-1.5 text-xs h-7' onClick={() => setShowPalette((v) => !v)}>
                    <IconLayoutGrid size={13} />
                    {showPalette ? 'Hide' : 'Nodes'}
                </Button>
                <Button variant='outline' size='sm' className='gap-1.5 text-xs h-7' onClick={handleSave}>
                    <IconDeviceFloppy size={13} /> Save
                </Button>
                <Button variant='gradient' size='sm' className='gap-1.5 text-xs h-7' onClick={() => toast.success('Flow deployed!')}>
                    <IconPlayerPlay size={13} /> Deploy
                </Button>
            </div>

            <div className='flex flex-1 overflow-hidden'>
                {showPalette && (
                    <div className='w-56 border-r border-border shrink-0 overflow-hidden'>
                        <NodePalette />
                    </div>
                )}

                <div ref={wrapperRef} className='flex-1 relative' onDragOver={onDragOver} onDrop={onDrop}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={handleConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        onEdgeDoubleClick={onEdgeDoubleClick}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.25 }}
                        className='bg-background'
                        defaultEdgeOptions={{ animated: true, style: { stroke: '#6366F1', strokeWidth: 2 } }}
                        connectionLineStyle={{ stroke: '#6366F1', strokeWidth: 2, strokeDasharray: '6 4' }}
                        deleteKeyCode={['Delete', 'Backspace']}
                        multiSelectionKeyCode='Shift'
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color='rgba(255,255,255,0.07)' />
                        <Controls
                            showInteractive={false}
                            className='!bg-card !border-border [&_button]:!bg-card [&_button]:!border-border [&_button]:!text-muted-foreground [&_button:hover]:!bg-secondary'
                        />
                        <MiniMap
                            className='!bg-card !border-border'
                            maskColor='rgba(0,0,0,0.5)'
                            nodeColor={(n) => CATEGORY_COLORS[NODE_DEFS[n.data?.nodeType]?.category] || '#6366F1'}
                        />
                        <Panel position='top-right'>
                            <div className='text-[10px] text-muted-foreground font-mono bg-card/80 backdrop-blur px-2.5 py-1 rounded-lg border border-border'>
                                {nodes.length} nodes · {edges.length} edges
                            </div>
                        </Panel>
                    </ReactFlow>
                </div>

                {inspectorNode && (
                    <div className='w-72 border-l border-border shrink-0 overflow-hidden'>
                        <NodeInspector node={inspectorNode} onClose={() => setSelectedNode(null)} />
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Initial graph builder ────────────────────────────────────────────────────

function buildInitialNodes(flow) {
    const nodes = []
    const tags = flow.tags || []

    const mk = (id, type, x, y, extra = {}) => ({
        id,
        type: 'flowNode',
        position: { x, y },
        data: {
            nodeType: type,
            label: NODE_DEFS[type]?.label || type,
            params: Object.fromEntries((NODE_DEFS[type]?.inputParams || []).map((p) => [p.name, p.default ?? ''])),
            ...extra
        }
    })

    // Detect flow type from tags
    if (tags.some((t) => ['rag', 'vector-store'].includes(t))) {
        nodes.push(mk('n-pdf', 'PDFLoader', 60, 100))
        nodes.push(mk('n-splitter', 'RecursiveCharacterTextSplitter', 60, 260))
        nodes.push(mk('n-embed', 'OpenAIEmbeddings', 340, 100))
        nodes.push(mk('n-vs', 'Pinecone', 340, 260))
        nodes.push(mk('n-llm', 'ChatOpenAI', 620, 160))
        nodes.push(mk('n-chain', 'RetrievalQAChain', 900, 160))
    } else if (tags.some((t) => ['tools', 'webhook'].includes(t))) {
        nodes.push(mk('n-llm', 'ChatOpenAI', 60, 160))
        nodes.push(mk('n-search', 'SerpAPI', 60, 340))
        nodes.push(mk('n-calc', 'Calculator', 60, 480))
        nodes.push(mk('n-agent', 'OpenAIFunctionAgent', 360, 260))
    } else if (tags.includes('memory')) {
        nodes.push(mk('n-llm', 'ChatOpenAI', 60, 120))
        nodes.push(mk('n-mem', 'BufferWindowMemory', 60, 320))
        nodes.push(mk('n-chain', 'ConversationChain', 360, 200))
    } else {
        nodes.push(mk('n-llm', 'ChatOpenAI', 60, 200))
        nodes.push(mk('n-prompt', 'ChatPromptTemplate', 340, 100))
        nodes.push(mk('n-chain', 'LLMChain', 340, 300))
    }

    return nodes
}

function buildInitialEdges(nodes) {
    const ids = new Set(nodes.map((n) => n.id))
    const edges = []
    let counter = 0
    const link = (src, srcH, tgt, tgtH) => {
        if (ids.has(src) && ids.has(tgt)) {
            edges.push({
                id: `e${counter++}`,
                source: src,
                sourceHandle: srcH,
                target: tgt,
                targetHandle: tgtH,
                animated: true,
                style: { stroke: '#6366F1', strokeWidth: 2 }
            })
        }
    }
    // RAG flow
    link('n-pdf', 'out', 'n-vs', 'document')
    link('n-splitter', 'out', 'n-pdf', 'textSplitter')
    link('n-embed', 'out', 'n-vs', 'embeddings')
    link('n-vs', 'retriever', 'n-chain', 'vectorStoreRetriever')
    link('n-llm', 'out', 'n-chain', 'model')
    // Agent flow
    link('n-llm', 'out', 'n-agent', 'model')
    link('n-search', 'out', 'n-agent', 'tools')
    link('n-calc', 'out', 'n-agent', 'tools')
    // Conversation flow
    link('n-llm', 'out', 'n-chain', 'model')
    link('n-mem', 'out', 'n-chain', 'memory')
    // Simple flow
    link('n-prompt', 'out', 'n-chain', 'prompt')
    link('n-llm', 'out', 'n-chain', 'model')
    return edges
}

export default function CanvasPage() {
    return (
        <ReactFlowProvider>
            <CanvasInner />
        </ReactFlowProvider>
    )
}
