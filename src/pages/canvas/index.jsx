import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ReactFlow, Background, Controls, MiniMap, Panel,
    useReactFlow, ReactFlowProvider, BackgroundVariant,
    Handle, Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCanvasStore } from '@/store/useCanvasStore'
import { useFlowStore } from '@/store/useFlowStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    IconArrowLeft, IconDeviceFloppy, IconPlayerPlay, IconLayoutGrid,
    IconBolt, IconBrain, IconTool, IconDatabase, IconCode, IconSearch,
    IconMessage, IconRouter, IconVariable, IconX, IconChevronRight, IconActivity
} from '@tabler/icons-react'

// ─── Node type definitions ────────────────────────────────────────────────────

export const NODE_DEFS = {
    input: {
        label: 'Input', icon: IconBolt, color: '#F97316', group: 'IO',
        description: 'Flow entry point — receives user message',
        outputs: [{ id: 'out', label: 'output' }],
        inputs: [],
        params: []
    },
    output: {
        label: 'Output', icon: IconChevronRight, color: '#84CC16', group: 'IO',
        description: 'Flow result — returns final response',
        outputs: [],
        inputs: [{ id: 'in', label: 'input' }],
        params: []
    },
    llm: {
        label: 'LLM', icon: IconBrain, color: '#6366F1', group: 'AI',
        description: 'Language model — generates text',
        inputs: [{ id: 'prompt', label: 'prompt' }, { id: 'memory', label: 'memory' }, { id: 'tools', label: 'tools' }],
        outputs: [{ id: 'out', label: 'response' }],
        params: [{ key: 'model', label: 'Model', type: 'select', options: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'claude-3-opus', 'gemini-1.5-pro', 'llama-3.1-70b'], default: 'gpt-4o' }, { key: 'temperature', label: 'Temperature', type: 'number', default: 0.7 }, { key: 'maxTokens', label: 'Max Tokens', type: 'number', default: 2048 }]
    },
    prompt: {
        label: 'Prompt', icon: IconMessage, color: '#F59E0B', group: 'AI',
        description: 'System prompt template',
        inputs: [{ id: 'vars', label: 'variables' }],
        outputs: [{ id: 'out', label: 'prompt' }],
        params: [{ key: 'systemMessage', label: 'System Message', type: 'textarea', default: 'You are a helpful AI assistant.' }]
    },
    memory: {
        label: 'Memory', icon: IconDatabase, color: '#A855F7', group: 'AI',
        description: 'Conversation memory buffer',
        inputs: [],
        outputs: [{ id: 'out', label: 'memory' }],
        params: [{ key: 'memoryKey', label: 'Memory Key', type: 'text', default: 'chat_history' }, { key: 'windowSize', label: 'Window Size', type: 'number', default: 5 }]
    },
    retriever: {
        label: 'Retriever', icon: IconSearch, color: '#22D3EE', group: 'Data',
        description: 'Vector store retrieval',
        inputs: [{ id: 'vectorStore', label: 'vector store' }],
        outputs: [{ id: 'out', label: 'documents' }],
        params: [{ key: 'topK', label: 'Top K', type: 'number', default: 4 }, { key: 'searchType', label: 'Search Type', type: 'select', options: ['similarity', 'mmr', 'hybrid'], default: 'similarity' }]
    },
    tool: {
        label: 'Tool', icon: IconTool, color: '#10B981', group: 'Actions',
        description: 'Custom tool / API call',
        inputs: [],
        outputs: [{ id: 'out', label: 'tool' }],
        params: [{ key: 'name', label: 'Tool Name', type: 'text', default: 'my_tool' }, { key: 'description', label: 'Description', type: 'text', default: 'A custom tool' }]
    },
    code: {
        label: 'Code', icon: IconCode, color: '#EF4444', group: 'Actions',
        description: 'Custom JavaScript code',
        inputs: [{ id: 'in', label: 'input' }],
        outputs: [{ id: 'out', label: 'output' }],
        params: [{ key: 'code', label: 'Code', type: 'code', default: 'async function run(input) {\n    return input\n}' }]
    },
    router: {
        label: 'Router', icon: IconRouter, color: '#06B6D4', group: 'Logic',
        description: 'Conditional routing',
        inputs: [{ id: 'in', label: 'input' }],
        outputs: [{ id: 'true', label: 'true' }, { id: 'false', label: 'false' }],
        params: [{ key: 'condition', label: 'Condition', type: 'text', default: 'input.length > 0' }]
    },
    variable: {
        label: 'Variable', icon: IconVariable, color: '#8B5CF6', group: 'Logic',
        description: 'Set or get a variable',
        inputs: [{ id: 'in', label: 'input' }],
        outputs: [{ id: 'out', label: 'value' }],
        params: [{ key: 'varName', label: 'Variable Name', type: 'text', default: 'myVar' }, { key: 'operation', label: 'Operation', type: 'select', options: ['set', 'get'], default: 'set' }]
    },
    analytics: {
        label: 'Analytics', icon: IconActivity, color: '#EC4899', group: 'Actions',
        description: 'Log events and metrics',
        inputs: [{ id: 'in', label: 'input' }],
        outputs: [{ id: 'out', label: 'passthrough' }],
        params: [{ key: 'eventName', label: 'Event Name', type: 'text', default: 'flow_event' }]
    }
}

// ─── FlowNode component ───────────────────────────────────────────────────────

function FlowNode({ id, data, selected }) {
    const def = NODE_DEFS[data.nodeType] || NODE_DEFS.tool
    const Icon = def.icon
    const { deleteNode, setSelectedNode } = useCanvasStore()

    // Spread input handles evenly across the left side, outputs across right
    const inputSpacing = def.inputs.length > 1 ? 100 / (def.inputs.length + 1) : 50
    const outputSpacing = def.outputs.length > 1 ? 100 / (def.outputs.length + 1) : 50

    return (
        <div
            className={cn(
                'relative min-w-[220px] rounded-xl border bg-card shadow-lg transition-all duration-150 group',
                selected ? 'border-primary ring-2 ring-primary/30 shadow-primary/20' : 'border-border hover:border-primary/40'
            )}
            onClick={() => setSelectedNode({ id, data })}
        >
            {/* Input handles — left side */}
            {def.inputs.map((inp, idx) => (
                <Handle
                    key={inp.id}
                    type='target'
                    position={Position.Left}
                    id={inp.id}
                    title={inp.label}
                    style={{
                        background: def.color,
                        border: '2px solid hsl(var(--background))',
                        width: 10,
                        height: 10,
                        top: `${(idx + 1) * inputSpacing}%`
                    }}
                />
            ))}

            {/* Output handles — right side */}
            {def.outputs.map((out, idx) => (
                <Handle
                    key={out.id}
                    type='source'
                    position={Position.Right}
                    id={out.id}
                    title={out.label}
                    style={{
                        background: def.color,
                        border: '2px solid hsl(var(--background))',
                        width: 10,
                        height: 10,
                        top: `${(idx + 1) * outputSpacing}%`
                    }}
                />
            ))}

            {/* Color strip */}
            <div className='h-1 rounded-t-xl' style={{ background: def.color }} />

            <div className='p-3'>
                <div className='flex items-center gap-2 mb-2'>
                    <div className='rounded-lg p-1.5' style={{ background: def.color + '20' }}>
                        <Icon size={13} style={{ color: def.color }} />
                    </div>
                    <span className='font-display text-xs font-semibold text-foreground flex-1'>{data.label}</span>
                    <button
                        onMouseDown={(e) => { e.stopPropagation(); deleteNode(id) }}
                        className='opacity-0 group-hover:opacity-100 rounded p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all nodrag'
                    >
                        <IconX size={11} />
                    </button>
                </div>

                {/* Param previews */}
                <div className='space-y-1 mt-2'>
                    {def.params.slice(0, 2).map((p) => {
                        const val = data.params?.[p.key] ?? p.default
                        if (!val) return null
                        return (
                            <div key={p.key} className='text-[9px] text-muted-foreground font-mono truncate'>
                                {p.label}: <span className='text-foreground'>{String(val).slice(0, 28)}</span>
                            </div>
                        )
                    })}
                </div>

                {/* I/O hints */}
                <div className='flex items-center justify-between mt-2 pt-2 border-t border-border/50'>
                    <span className='text-[9px] text-muted-foreground font-mono'>{def.inputs.length} in</span>
                    <span className='text-[9px] font-semibold' style={{ color: def.color }}>{def.label}</span>
                    <span className='text-[9px] text-muted-foreground font-mono'>{def.outputs.length} out</span>
                </div>
            </div>
        </div>
    )
}

const nodeTypes = { flowNode: FlowNode }

// ─── Node palette sidebar ─────────────────────────────────────────────────────

function NodePalette() {
    const [search, setSearch] = useState('')
    const groups = [...new Set(Object.values(NODE_DEFS).map((d) => d.group))]

    const entries = Object.entries(NODE_DEFS).filter(([, d]) =>
        !search || d.label.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase())
    )

    const onDragStart = (e, type) => {
        e.dataTransfer.setData('application/reactflow-nodetype', type)
        e.dataTransfer.effectAllowed = 'move'
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='p-3 border-b border-border shrink-0'>
                <p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2'>Nodes</p>
                <div className='relative'>
                    <IconSearch size={12} className='absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search…' className='h-7 pl-6 text-xs' />
                </div>
            </div>

            <div className='flex-1 overflow-y-auto p-2 space-y-3'>
                {(search ? [''] : groups).map((group) => {
                    const items = search
                        ? entries
                        : entries.filter(([, d]) => d.group === group)
                    if (!items.length) return null
                    return (
                        <div key={group}>
                            {!search && (
                                <p className='text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-1 mb-1'>{group}</p>
                            )}
                            <div className='space-y-1'>
                                {items.map(([type, def]) => {
                                    const Icon = def.icon
                                    return (
                                        <div
                                            key={type}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, type)}
                                            className='flex items-center gap-2.5 rounded-lg px-2 py-2 cursor-grab hover:bg-secondary transition-colors active:cursor-grabbing'
                                        >
                                            <div className='rounded-md p-1 shrink-0' style={{ background: def.color + '20' }}>
                                                <Icon size={12} style={{ color: def.color }} />
                                            </div>
                                            <div className='min-w-0'>
                                                <div className='text-xs font-medium text-foreground'>{def.label}</div>
                                                <div className='text-[10px] text-muted-foreground truncate'>{def.description}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className='p-3 border-t border-border shrink-0'>
                <p className='text-[9px] text-muted-foreground text-center'>Drag nodes onto the canvas</p>
            </div>
        </div>
    )
}

// ─── Node inspector ────────────────────────────────────────────────────────────

function NodeInspector({ node, onClose }) {
    const { updateNodeData } = useCanvasStore()
    const def = NODE_DEFS[node.data.nodeType] || NODE_DEFS.tool
    const Icon = def.icon
    const params = node.data.params || {}

    const setParam = (key, val) => updateNodeData(node.id, { params: { ...(node.data.params || {}), [key]: val } })

    return (
        <div className='flex h-full flex-col'>
            <div className='flex items-center gap-2 p-3 border-b border-border shrink-0'>
                <div className='rounded-lg p-1.5' style={{ background: def.color + '20' }}>
                    <Icon size={13} style={{ color: def.color }} />
                </div>
                <div className='flex-1 min-w-0'>
                    <p className='text-xs font-semibold text-foreground truncate'>{node.data.label}</p>
                    <p className='text-[10px] text-muted-foreground'>{def.label}</p>
                </div>
                <button onClick={onClose} className='rounded p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0'>
                    <IconX size={13} />
                </button>
            </div>

            <div className='flex-1 overflow-y-auto p-3 space-y-3'>
                {/* Label */}
                <div className='space-y-1'>
                    <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>Label</label>
                    <Input value={node.data.label} onChange={(e) => updateNodeData(node.id, { label: e.target.value })} className='h-7 text-xs' />
                </div>

                {/* Dynamic params */}
                {def.params.map((p) => {
                    const val = params[p.key] ?? p.default
                    return (
                        <div key={p.key} className='space-y-1'>
                            <label className='block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>{p.label}</label>
                            {p.type === 'select' && (
                                <select value={val} onChange={(e) => setParam(p.key, e.target.value)}
                                    className='w-full h-7 text-xs rounded-md border border-border bg-background px-2 text-foreground'>
                                    {p.options.map((o) => <option key={o} value={o}>{o}</option>)}
                                </select>
                            )}
                            {p.type === 'number' && (
                                <Input type='number' value={val} onChange={(e) => setParam(p.key, parseFloat(e.target.value))} className='h-7 text-xs font-mono' />
                            )}
                            {p.type === 'text' && (
                                <Input value={val} onChange={(e) => setParam(p.key, e.target.value)} className='h-7 text-xs' />
                            )}
                            {(p.type === 'textarea' || p.type === 'code') && (
                                <textarea
                                    value={val}
                                    onChange={(e) => setParam(p.key, e.target.value)}
                                    rows={p.type === 'code' ? 8 : 4}
                                    className={cn('w-full rounded-md border border-border bg-background px-2 py-1.5 text-foreground resize-none', p.type === 'code' ? 'text-[10px] font-mono bg-secondary/40' : 'text-xs')}
                                />
                            )}
                        </div>
                    )
                })}

                {/* I/O info */}
                <div className='rounded-lg bg-secondary/40 p-3 space-y-2'>
                    {def.inputs.length > 0 && (
                        <div>
                            <p className='text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Inputs</p>
                            <div className='space-y-1'>
                                {def.inputs.map((inp) => (
                                    <div key={inp.id} className='flex items-center gap-2'>
                                        <div className='h-2 w-2 rounded-full' style={{ background: def.color }} />
                                        <span className='text-[10px] font-mono text-foreground'>{inp.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {def.outputs.length > 0 && (
                        <div>
                            <p className='text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1'>Outputs</p>
                            <div className='space-y-1'>
                                {def.outputs.map((out) => (
                                    <div key={out.id} className='flex items-center gap-2'>
                                        <div className='h-2 w-2 rounded-full' style={{ background: def.color }} />
                                        <span className='text-[10px] font-mono text-foreground'>{out.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
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

    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelectedNode, selectedNode, setFlow, flowName, setFlowName, isDirty, markSaved } = useCanvasStore()
    const { chatflows } = useFlowStore()
    const [showPalette, setShowPalette] = useState(true)

    // Always derive inspector node from live nodes array so edits reflect immediately
    const inspectorNode = selectedNode ? nodes.find((n) => n.id === selectedNode.id) || selectedNode : null

    useEffect(() => {
        const flow = chatflows.find((f) => f.id === id)
        if (flow) {
            const ns = buildInitialNodes(flow)
            const es = buildInitialEdges(ns)
            setFlow(flow.id, flow.name, ns, es)
        }
    }, [id])

    const onDragOver = useCallback((e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback((e) => {
        e.preventDefault()
        const type = e.dataTransfer.getData('application/reactflow-nodetype')
        if (!type || !NODE_DEFS[type]) return

        const bounds = wrapperRef.current?.getBoundingClientRect()
        const position = reactflow.screenToFlowPosition({ x: e.clientX - (bounds?.left || 0), y: e.clientY - (bounds?.top || 0) })
        const def = NODE_DEFS[type]
        const nodeId = `${type}-${Date.now()}`
        addNode({
            id: nodeId,
            type: 'flowNode',
            position,
            data: { nodeType: type, label: def.label, params: Object.fromEntries(def.params.map((p) => [p.key, p.default])) }
        })
        toast.success(`${def.label} added`)
    }, [reactflow])

    const onNodeClick = useCallback((_, node) => {
        setSelectedNode(node)
    }, [])

    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
    }, [])

    const handleSave = () => { markSaved(); toast.success('Flow saved') }

    return (
        <div className='flex h-screen w-screen flex-col overflow-hidden bg-background'>
            {/* Topbar */}
            <div className='flex items-center gap-3 px-4 h-12 border-b border-border bg-sidebar z-10 shrink-0'>
                <Button variant='ghost' size='icon-sm' onClick={() => navigate('/chatflows')}>
                    <IconArrowLeft size={15} />
                </Button>
                <div className='w-px h-5 bg-border' />
                <Input
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    className='h-7 text-sm font-display font-semibold border-transparent bg-transparent hover:bg-secondary focus:bg-secondary max-w-[280px]'
                />
                {isDirty && <Badge variant='secondary' className='text-[9px] font-mono shrink-0'>unsaved</Badge>}
                <div className='flex-1' />
                <Button variant='ghost' size='sm' className='gap-1.5 text-xs' onClick={() => setShowPalette((v) => !v)}>
                    <IconLayoutGrid size={13} />
                    {showPalette ? 'Hide Nodes' : 'Show Nodes'}
                </Button>
                <Button variant='outline' size='sm' className='gap-1.5 text-xs h-7' onClick={handleSave}>
                    <IconDeviceFloppy size={13} /> Save
                </Button>
                <Button variant='gradient' size='sm' className='gap-1.5 text-xs h-7' onClick={() => toast.success('Flow deployed!')}>
                    <IconPlayerPlay size={13} /> Deploy
                </Button>
            </div>

            {/* Canvas area */}
            <div className='flex flex-1 overflow-hidden'>
                {showPalette && (
                    <div className='w-56 border-r border-border bg-sidebar shrink-0 overflow-hidden'>
                        <NodePalette />
                    </div>
                )}

                <div ref={wrapperRef} className='flex-1 relative' onDragOver={onDragOver} onDrop={onDrop}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        className='bg-background'
                        defaultEdgeOptions={{ animated: true, style: { stroke: '#6366F1', strokeWidth: 1.5 } }}
                        connectionLineStyle={{ stroke: '#6366F1', strokeWidth: 1.5, strokeDasharray: '5 5' }}
                        deleteKeyCode='Delete'
                        multiSelectionKeyCode='Shift'
                    >
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color='rgba(255,255,255,0.06)' />
                        <Controls className='!bg-card !border-border [&_button]:!bg-card [&_button]:!border-border [&_button]:!text-foreground [&_button:hover]:!bg-secondary' />
                        <MiniMap
                            className='!bg-card !border-border'
                            maskColor='rgba(0,0,0,0.4)'
                            nodeColor={(n) => NODE_DEFS[n.data?.nodeType]?.color || '#6366F1'}
                        />
                        <Panel position='top-right' className='text-[10px] text-muted-foreground font-mono bg-card/80 backdrop-blur px-2 py-1 rounded-lg border border-border'>
                            {nodes.length} nodes · {edges.length} edges
                        </Panel>
                    </ReactFlow>
                </div>

                {inspectorNode && (
                    <div className='w-64 border-l border-border bg-sidebar shrink-0 overflow-hidden'>
                        <NodeInspector node={inspectorNode} onClose={() => setSelectedNode(null)} />
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Initial nodes builder ────────────────────────────────────────────────────

function buildInitialNodes(flow) {
    const nodes = []
    nodes.push({ id: 'n-input', type: 'flowNode', position: { x: 80, y: 220 }, data: { nodeType: 'input', label: 'User Input', params: {} } })

    if (flow.tags?.some((t) => ['rag', 'vector-store'].includes(t))) {
        nodes.push({ id: 'n-retriever', type: 'flowNode', position: { x: 320, y: 100 }, data: { nodeType: 'retriever', label: 'Vector Retriever', params: { topK: 4, searchType: 'similarity' } } })
    }
    if (flow.tags?.includes('memory')) {
        nodes.push({ id: 'n-memory', type: 'flowNode', position: { x: 320, y: 320 }, data: { nodeType: 'memory', label: 'Conversation Memory', params: { memoryKey: 'chat_history', windowSize: 5 } } })
    }
    if (flow.tags?.includes('tools')) {
        nodes.push({ id: 'n-tool', type: 'flowNode', position: { x: 560, y: 80 }, data: { nodeType: 'tool', label: 'Tool Executor', params: { name: 'executor', description: 'Executes tools' } } })
    }

    nodes.push({ id: 'n-prompt', type: 'flowNode', position: { x: 560, y: 220 }, data: { nodeType: 'prompt', label: 'System Prompt', params: { systemMessage: 'You are a helpful AI assistant.' } } })
    nodes.push({ id: 'n-llm', type: 'flowNode', position: { x: 840, y: 220 }, data: { nodeType: 'llm', label: 'LLM', params: { model: flow.tags?.[0] || 'gpt-4o', temperature: 0.7, maxTokens: 2048 } } })
    nodes.push({ id: 'n-output', type: 'flowNode', position: { x: 1120, y: 220 }, data: { nodeType: 'output', label: 'Response', params: {} } })

    return nodes
}

function buildInitialEdges(nodes) {
    const ids = new Set(nodes.map((n) => n.id))
    const edges = []
    const link = (src, srcHandle, tgt, tgtHandle) => {
        if (ids.has(src) && ids.has(tgt)) {
            edges.push({ id: `e-${src}-${tgt}`, source: src, sourceHandle: srcHandle, target: tgt, targetHandle: tgtHandle, animated: true, style: { stroke: '#6366F1', strokeWidth: 1.5 } })
        }
    }
    link('n-input', 'out', 'n-prompt', 'vars')
    link('n-retriever', 'out', 'n-prompt', 'vars')
    link('n-memory', 'out', 'n-llm', 'memory')
    link('n-tool', 'out', 'n-llm', 'tools')
    link('n-prompt', 'out', 'n-llm', 'prompt')
    link('n-llm', 'out', 'n-output', 'in')
    return edges
}

// ─── Export ────────────────────────────────────────────────────────────────────

export default function CanvasPage() {
    return (
        <ReactFlowProvider>
            <CanvasInner />
        </ReactFlowProvider>
    )
}
