import { create } from 'zustand'

const INITIAL = [
    { id: '1', type: 'error', title: 'Flow execution failed', body: 'customer-support-agent · TypeError: Cannot read property "output"', time: Date.now() - 4 * 60000, read: false },
    { id: '2', type: 'warning', title: 'Rate limit at 82%', body: 'You have used 8.2M / 10M tokens this month', time: Date.now() - 18 * 60000, read: false },
    { id: '3', type: 'success', title: 'Evaluation completed', body: 'RAG accuracy eval · Score: 91.4% (↑3.2% vs baseline)', time: Date.now() - 2 * 3600000, read: false },
    { id: '4', type: 'info', title: 'New model available', body: 'Gemini 2.5 Pro is now available in the Model Hub', time: Date.now() - 5 * 3600000, read: true },
    { id: '5', type: 'success', title: 'Deployment live', body: 'product-recommender-v2 deployed to api.haxon.dev', time: Date.now() - 24 * 3600000, read: true },
]

export const useNotificationStore = create((set, get) => ({
    notifications: INITIAL,

    unreadCount: () => get().notifications.filter((n) => !n.read).length,

    markRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    })),

    markAllRead: () => set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true }))
    })),

    dismiss: (id) => set((s) => ({
        notifications: s.notifications.filter((n) => n.id !== id)
    })),

    clearAll: () => set({ notifications: [] }),

    addNotification: (notif) => set((s) => ({
        notifications: [{ ...notif, id: Date.now().toString(), time: Date.now(), read: false }, ...s.notifications]
    }))
}))
