import { create } from 'zustand'
import chatflowsData from '@/mock/data/chatflows'
import agentflowsData from '@/mock/data/agentflows'

export const useFlowStore = create((set, get) => ({
    chatflows: chatflowsData,
    agentflows: agentflowsData,

    addChatflow: (flow) =>
        set((s) => ({
            chatflows: [
                { ...flow, id: crypto.randomUUID(), createdDate: new Date().toISOString(), updatedDate: new Date().toISOString() },
                ...s.chatflows
            ]
        })),

    updateChatflow: (id, updates) =>
        set((s) => ({
            chatflows: s.chatflows.map((f) => (f.id === id ? { ...f, ...updates, updatedDate: new Date().toISOString() } : f))
        })),

    deleteChatflow: (id) => set((s) => ({ chatflows: s.chatflows.filter((f) => f.id !== id) })),

    addAgentflow: (flow) =>
        set((s) => ({
            agentflows: [
                { ...flow, id: crypto.randomUUID(), createdDate: new Date().toISOString(), updatedDate: new Date().toISOString() },
                ...s.agentflows
            ]
        })),

    updateAgentflow: (id, updates) =>
        set((s) => ({
            agentflows: s.agentflows.map((f) => (f.id === id ? { ...f, ...updates, updatedDate: new Date().toISOString() } : f))
        })),

    deleteAgentflow: (id) => set((s) => ({ agentflows: s.agentflows.filter((f) => f.id !== id) }))
}))
