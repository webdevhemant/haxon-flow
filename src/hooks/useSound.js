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

// ── Sound pack definitions ────────────────────────────────────────────────────
const PACKS = {
    default: {
        click() { const c = getCtx(); tone(c, 880, 'sine', 0.06, 0.06); tone(c, 1320, 'sine', 0.04, 0.02) },
        hover() { const c = getCtx(); tone(c, 660, 'sine', 0.03, 0.015, 0.001, 0.02) },
        success() { const c = getCtx(); tone(c, 523, 'sine', 0.15, 0.08); setTimeout(() => tone(c, 659, 'sine', 0.15, 0.07), 80); setTimeout(() => tone(c, 784, 'sine', 0.25, 0.12), 160) },
        error() { const c = getCtx(); tone(c, 300, 'sawtooth', 0.1, 0.06, 0.005, 0.08); setTimeout(() => tone(c, 220, 'sawtooth', 0.12, 0.05), 90) },
        nodeConnect() {
            const c = getCtx(); const o = c.createOscillator(); const g = c.createGain()
            o.connect(g); g.connect(c.destination); o.type = 'sine'
            o.frequency.setValueAtTime(440, c.currentTime); o.frequency.exponentialRampToValueAtTime(880, c.currentTime + 0.12)
            g.gain.setValueAtTime(0, c.currentTime); g.gain.linearRampToValueAtTime(0.08, c.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18)
            o.start(c.currentTime); o.stop(c.currentTime + 0.2)
        },
        nodeDrop() { const c = getCtx(); tone(c, 200, 'sine', 0.08, 0.05); tone(c, 400, 'sine', 0.05, 0.03) },
        open() { const c = getCtx(); tone(c, 400, 'sine', 0.12, 0.04); setTimeout(() => tone(c, 600, 'sine', 0.1, 0.04), 60) },
        close() { const c = getCtx(); tone(c, 500, 'sine', 0.08, 0.03); setTimeout(() => tone(c, 350, 'sine', 0.06, 0.03), 60) }
    },

    crisp: {
        click() { const c = getCtx(); tone(c, 1200, 'triangle', 0.04, 0.07); tone(c, 1800, 'triangle', 0.03, 0.025) },
        hover() { const c = getCtx(); tone(c, 1000, 'triangle', 0.025, 0.018, 0.001, 0.015) },
        success() { const c = getCtx(); tone(c, 698, 'triangle', 0.1, 0.07); setTimeout(() => tone(c, 880, 'triangle', 0.1, 0.07), 70); setTimeout(() => tone(c, 1047, 'triangle', 0.15, 0.1), 140) },
        error() { const c = getCtx(); tone(c, 400, 'triangle', 0.08, 0.07, 0.003, 0.06); setTimeout(() => tone(c, 280, 'triangle', 0.1, 0.06), 80) },
        nodeConnect() {
            const c = getCtx(); const o = c.createOscillator(); const g = c.createGain()
            o.connect(g); g.connect(c.destination); o.type = 'triangle'
            o.frequency.setValueAtTime(600, c.currentTime); o.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.1)
            g.gain.setValueAtTime(0, c.currentTime); g.gain.linearRampToValueAtTime(0.07, c.currentTime + 0.008); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15)
            o.start(c.currentTime); o.stop(c.currentTime + 0.18)
        },
        nodeDrop() { const c = getCtx(); tone(c, 600, 'triangle', 0.06, 0.06); tone(c, 300, 'triangle', 0.04, 0.03) },
        open() { const c = getCtx(); tone(c, 600, 'triangle', 0.08, 0.05); setTimeout(() => tone(c, 900, 'triangle', 0.07, 0.04), 50) },
        close() { const c = getCtx(); tone(c, 800, 'triangle', 0.07, 0.04); setTimeout(() => tone(c, 500, 'triangle', 0.05, 0.03), 50) }
    },

    soft: {
        click() { const c = getCtx(); tone(c, 660, 'sine', 0.08, 0.03); tone(c, 990, 'sine', 0.06, 0.012) },
        hover() { const c = getCtx(); tone(c, 440, 'sine', 0.04, 0.008, 0.002, 0.025) },
        success() { const c = getCtx(); tone(c, 392, 'sine', 0.18, 0.04); setTimeout(() => tone(c, 523, 'sine', 0.18, 0.04), 100); setTimeout(() => tone(c, 659, 'sine', 0.3, 0.06), 200) },
        error() { const c = getCtx(); tone(c, 220, 'sine', 0.14, 0.03, 0.01, 0.1); setTimeout(() => tone(c, 185, 'sine', 0.16, 0.025), 110) },
        nodeConnect() {
            const c = getCtx(); const o = c.createOscillator(); const g = c.createGain()
            o.connect(g); g.connect(c.destination); o.type = 'sine'
            o.frequency.setValueAtTime(330, c.currentTime); o.frequency.exponentialRampToValueAtTime(660, c.currentTime + 0.15)
            g.gain.setValueAtTime(0, c.currentTime); g.gain.linearRampToValueAtTime(0.05, c.currentTime + 0.015); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.22)
            o.start(c.currentTime); o.stop(c.currentTime + 0.25)
        },
        nodeDrop() { const c = getCtx(); tone(c, 165, 'sine', 0.1, 0.035); tone(c, 330, 'sine', 0.07, 0.02) },
        open() { const c = getCtx(); tone(c, 330, 'sine', 0.15, 0.025); setTimeout(() => tone(c, 494, 'sine', 0.12, 0.025), 70) },
        close() { const c = getCtx(); tone(c, 440, 'sine', 0.1, 0.02); setTimeout(() => tone(c, 294, 'sine', 0.08, 0.02), 70) }
    },

    retro: {
        click() { const c = getCtx(); tone(c, 440, 'square', 0.05, 0.05); tone(c, 880, 'square', 0.04, 0.015) },
        hover() { const c = getCtx(); tone(c, 660, 'square', 0.03, 0.01, 0.001, 0.015) },
        success() { const c = getCtx(); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(c, f, 'square', 0.1, 0.05), i * 60)) },
        error() { const c = getCtx(); [220, 180, 150].forEach((f, i) => setTimeout(() => tone(c, f, 'square', 0.08, 0.05), i * 70)) },
        nodeConnect() {
            const c = getCtx()
            ;[440, 550, 660, 880].forEach((f, i) => setTimeout(() => tone(c, f, 'square', 0.07, 0.04), i * 30))
        },
        nodeDrop() { const c = getCtx(); [300, 200, 150].forEach((f, i) => setTimeout(() => tone(c, f, 'square', 0.06, 0.04), i * 25)) },
        open() { const c = getCtx(); [330, 440, 550].forEach((f, i) => setTimeout(() => tone(c, f, 'square', 0.07, 0.04), i * 40)) },
        close() { const c = getCtx(); [550, 440, 330].forEach((f, i) => setTimeout(() => tone(c, f, 'square', 0.06, 0.04), i * 40)) }
    }
}

export function useSound() {
    const soundEnabled = useUIStore((s) => s.soundEnabled)
    const soundPack = useUIStore((s) => s.soundPack)

    const play = useCallback(
        (type) => {
            if (!soundEnabled) return
            try {
                const pack = PACKS[soundPack] || PACKS.default
                pack[type]?.()
            } catch {
                // AudioContext blocked (needs user gesture first)
            }
        },
        [soundEnabled, soundPack]
    )

    return { play }
}
