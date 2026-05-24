import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

            soundEnabled: true,
            setSoundEnabled: (val) => set({ soundEnabled: val }),
            toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

            canvasMusicEnabled: false,
            setCanvasMusicEnabled: (val) => set({ canvasMusicEnabled: val }),
            toggleCanvasMusic: () => set((s) => ({ canvasMusicEnabled: !s.canvasMusicEnabled }))
        }),
        { name: 'haxon-ui' }
    )
)
