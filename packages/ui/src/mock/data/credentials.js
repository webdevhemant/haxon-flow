export const credentials = [
    {
        id: 'cred-001', name: 'OpenAI Production', type: 'openAIApi', description: 'Main OpenAI API key for production flows',
        lastUsed: '2026-05-22T14:30:00Z', createdDate: '2026-03-01T08:00:00Z', usedInFlows: 28
    },
    {
        id: 'cred-002', name: 'Anthropic Claude', type: 'anthropicApi', description: 'Claude API access for reasoning-heavy workflows',
        lastUsed: '2026-05-21T09:15:00Z', createdDate: '2026-03-05T08:00:00Z', usedInFlows: 12
    },
    {
        id: 'cred-003', name: 'Google Gemini', type: 'googleVertexAI', description: 'Gemini 1.5 Pro for long-context document processing',
        lastUsed: '2026-05-20T16:00:00Z', createdDate: '2026-04-01T08:00:00Z', usedInFlows: 8
    },
    {
        id: 'cred-004', name: 'Pinecone Vector DB', type: 'pineconeApi', description: 'Production vector database for RAG pipelines',
        lastUsed: '2026-05-19T11:00:00Z', createdDate: '2026-03-10T08:00:00Z', usedInFlows: 15
    },
    {
        id: 'cred-005', name: 'PostgreSQL Production', type: 'postgres', description: 'Main production PostgreSQL connection string',
        lastUsed: '2026-05-22T12:00:00Z', createdDate: '2026-02-20T08:00:00Z', usedInFlows: 6
    },
    {
        id: 'cred-006', name: 'Slack Bot Token', type: 'slackBot', description: 'Workspace bot token for notification tools',
        lastUsed: '2026-05-18T10:30:00Z', createdDate: '2026-04-10T08:00:00Z', usedInFlows: 4
    },
]

export default credentials
