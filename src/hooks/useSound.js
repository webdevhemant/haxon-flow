import { useRef, useCallback } from 'react'
import { useUIStore } from '@/store/useUIStore'

let sharedCtx = null

function getCtx() {
    if (!sharedCtx || sharedCtx.state === 'closed') {
        sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (sharedCtx.state === 'suspended') sharedCtx.resume()
    return sharedCtx
}

function tone(ctx, freq, type, duration, vol, attack = 0.005, decay = 0.08) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration + 0.05)
}

const SOUNDS = {
    click() {
        const ctx = getCtx()
        tone(ctx, 880, 'sine', 0.06, 0.06)
        tone(ctx, 1320, 'sine', 0.04, 0.02)
    },
    hover() {
        const ctx = getCtx()
        tone(ctx, 660, 'sine', 0.03, 0.015, 0.001, 0.02)
    },
    success() {
        const ctx = getCtx()
        tone(ctx, 523, 'sine', 0.15, 0.08)
        setTimeout(() => tone(ctx, 659, 'sine', 0.15, 0.07), 80)
        setTimeout(() => tone(ctx, 784, 'sine', 0.25, 0.12), 160)
    },
    error() {
        const ctx = getCtx()
        tone(ctx, 300, 'sawtooth', 0.1, 0.06, 0.005, 0.08)
        setTimeout(() => tone(ctx, 220, 'sawtooth', 0.12, 0.05), 90)
    },
    nodeConnect() {
        const ctx = getCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.2)
    },
    nodeDrop() {
        const ctx = getCtx()
        tone(ctx, 200, 'sine', 0.08, 0.05)
        tone(ctx, 400, 'sine', 0.05, 0.03)
    },
    open() {
        const ctx = getCtx()
        tone(ctx, 400, 'sine', 0.12, 0.04)
        setTimeout(() => tone(ctx, 600, 'sine', 0.1, 0.04), 60)
    },
    close() {
        const ctx = getCtx()
        tone(ctx, 500, 'sine', 0.08, 0.03)
        setTimeout(() => tone(ctx, 350, 'sine', 0.06, 0.03), 60)
    }
}

export function useSound() {
    const soundEnabled = useUIStore((s) => s.soundEnabled)

    const play = useCallback(
        (type) => {
            if (!soundEnabled) return
            try {
                SOUNDS[type]?.()
            } catch {
                // AudioContext blocked (needs user gesture first)
            }
        },
        [soundEnabled]
    )

    return { play }
}
