import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

const defaultNodes = []
const defaultEdges = []

export const useCanvasStore = create((set, get) => ({
    flowId: null,
    flowName: 'Untitled Flow',
    nodes: defaultNodes,
    edges: defaultEdges,
    selectedNode: null,
    isDirty: false,

    setFlow: (id, name, nodes = [], edges = []) => set({ flowId: id, flowName: name, nodes, edges, isDirty: false }),

    setFlowName: (name) => set({ flowName: name, isDirty: true }),

    onNodesChange: (changes) => set((s) => ({ nodes: applyNodeChanges(changes, s.nodes), isDirty: true })),

    onEdgesChange: (changes) => set((s) => ({ edges: applyEdgeChanges(changes, s.edges), isDirty: true })),

    onConnect: (connection) => set((s) => ({ edges: addEdge({ ...connection, animated: true }, s.edges), isDirty: true })),

    addNode: (node) => set((s) => ({ nodes: [...s.nodes, node], isDirty: true })),

    updateNodeData: (id, data) =>
        set((s) => ({ nodes: s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)), isDirty: true })),

    deleteNode: (id) =>
        set((s) => ({
            nodes: s.nodes.filter((n) => n.id !== id),
            edges: s.edges.filter((e) => e.source !== id && e.target !== id),
            isDirty: true
        })),

    setSelectedNode: (node) => set({ selectedNode: node }),

    markSaved: () => set({ isDirty: false }),

    reset: () => set({ flowId: null, flowName: 'Untitled Flow', nodes: [], edges: [], selectedNode: null, isDirty: false })
}))
