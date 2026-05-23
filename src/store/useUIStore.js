import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }))
        }),
        { name: 'haxon-ui' }
    )
)
