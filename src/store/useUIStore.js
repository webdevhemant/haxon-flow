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
            toggleCanvasMusic: () => set((s) => ({ canvasMusicEnabled: !s.canvasMusicEnabled })),

            // color theme: 'default' | 'midnight' | 'ocean' | 'forest' | 'sunset' | 'rose'
            colorTheme: 'default',
            setColorTheme: (val) => set({ colorTheme: val }),

            // font size: 'sm' | 'md' | 'lg'
            fontSize: 'md',
            setFontSize: (val) => set({ fontSize: val }),

            // sound pack: 'default' | 'crisp' | 'soft' | 'retro'
            soundPack: 'default',
            setSoundPack: (val) => set({ soundPack: val }),

            // compact density
            compactMode: false,
            setCompactMode: (val) => set({ compactMode: val }),
            toggleCompactMode: () => set((s) => ({ compactMode: !s.compactMode })),

            // reduced motion
            reducedMotion: false,
            setReducedMotion: (val) => set({ reducedMotion: val })
        }),
        { name: 'haxon-ui' }
    )
)
