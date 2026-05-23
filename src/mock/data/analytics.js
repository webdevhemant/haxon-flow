export const analyticsStats = {
    totalExecutions: 87432,
    totalTokens: 142_800_000,
    activeFlows: 24,
    avgResponseMs: 1240,
    successRate: 98.4,
    executionsDelta: +12.3,
    tokensDelta: +8.7,
    activeFlowsDelta: +3,
    responseDelta: -5.2
}

export const executionTimeline = Array.from({ length: 30 }, (_, i) => {
    const d = new Date('2026-04-24')
    d.setDate(d.getDate() + i)
    const base = 2400 + Math.sin(i / 4) * 600
    return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        executions: Math.round(base + Math.random() * 400),
        errors: Math.round(Math.random() * 30)
    }
})

export const tokensByModel = [
    { model: 'GPT-4o', tokens: 58_400_000, color: '#6366F1' },
    { model: 'Claude 3.5', tokens: 42_100_000, color: '#A855F7' },
    { model: 'Gemini 1.5', tokens: 28_600_000, color: '#22D3EE' },
    { model: 'GPT-4o-mini', tokens: 13_700_000, color: '#10B981' }
]

export const flowTypeDistribution = [
    { name: 'Chatflows', value: 52, color: '#6366F1' },
    { name: 'Agentflows', value: 30, color: '#A855F7' },
    { name: 'RAG Pipelines', value: 18, color: '#22D3EE' }
]

export const recentExecutions = [
    { id: 'ex-1', flow: 'Customer Support Bot', status: 'success', duration: 1240, tokens: 1823, time: '2026-05-23T06:12:00Z' },
    { id: 'ex-2', flow: 'Code Review Assistant', status: 'success', duration: 3401, tokens: 4210, time: '2026-05-23T06:08:00Z' },
    { id: 'ex-3', flow: 'Document Q&A', status: 'error', duration: 450, tokens: 312, time: '2026-05-23T05:58:00Z' },
    { id: 'ex-4', flow: 'HR Onboarding', status: 'success', duration: 980, tokens: 1102, time: '2026-05-23T05:45:00Z' },
    { id: 'ex-5', flow: 'Sales Pipeline', status: 'success', duration: 2100, tokens: 2840, time: '2026-05-23T05:32:00Z' },
    { id: 'ex-6', flow: 'IT Helpdesk', status: 'success', duration: 760, tokens: 892, time: '2026-05-23T05:20:00Z' },
    { id: 'ex-7', flow: 'Marketing Copy', status: 'success', duration: 1890, tokens: 3210, time: '2026-05-23T05:05:00Z' },
    { id: 'ex-8', flow: 'Financial Analyst', status: 'error', duration: 5200, tokens: 0, time: '2026-05-23T04:50:00Z' }
]

export default { analyticsStats, executionTimeline, tokensByModel, flowTypeDistribution, recentExecutions }
