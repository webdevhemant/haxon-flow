const agentflows = [
    {
        id: 'af-1',
        name: 'Research & Summarize Agent',
        description: 'Autonomous agent that searches the web, reads documents, and produces structured summaries.',
        deployed: true,
        category: 'Research',
        nodeCount: 9,
        executionCount: 3420,
        tags: ['web-search', 'rag', 'summarize'],
        color: '#A855F7',
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        model: 'gpt-4o'
    },
    {
        id: 'af-2',
        name: 'Customer Support Orchestrator',
        description: 'Multi-step agent that triages tickets, fetches history, and drafts replies.',
        deployed: true,
        category: 'Support',
        nodeCount: 12,
        executionCount: 8900,
        tags: ['crm', 'nlp', 'email'],
        color: '#6366F1',
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        model: 'claude-3-5-sonnet'
    },
    {
        id: 'af-3',
        name: 'Code Review Bot',
        description: 'Reads pull requests, checks best practices, security vulnerabilities, and posts comments.',
        deployed: false,
        category: 'DevTools',
        nodeCount: 7,
        executionCount: 560,
        tags: ['github', 'security', 'code'],
        color: '#10B981',
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        model: 'claude-opus-4'
    },
    {
        id: 'af-4',
        name: 'Data Pipeline Monitor',
        description: 'Watches data pipelines, detects anomalies, and sends Slack alerts with RCA.',
        deployed: true,
        category: 'Data',
        nodeCount: 8,
        executionCount: 14200,
        tags: ['monitoring', 'slack', 'anomaly'],
        color: '#22D3EE',
        updatedDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        model: 'gpt-4o-mini'
    },
    {
        id: 'af-5',
        name: 'Lead Qualification Pipeline',
        description: 'Enriches leads from HubSpot, scores them with AI, and routes to the right rep.',
        deployed: true,
        category: 'Marketing',
        nodeCount: 11,
        executionCount: 2100,
        tags: ['hubspot', 'scoring', 'crm'],
        color: '#F59E0B',
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        model: 'gpt-4o'
    },
    {
        id: 'af-6',
        name: 'Document Compliance Checker',
        description: 'Reviews legal documents against compliance standards and flags issues.',
        deployed: false,
        category: 'Legal',
        nodeCount: 6,
        executionCount: 320,
        tags: ['compliance', 'pdf', 'legal'],
        color: '#06B6D4',
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        model: 'claude-3-5-sonnet'
    }
]

export default agentflows
