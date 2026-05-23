export const assistants = [
    {
        id: 'asst-001', name: 'Aria — Support', description: 'Empathetic customer support assistant with escalation and ticket management capabilities',
        model: 'gpt-4o', type: 'custom', conversations: 2341, createdDate: '2026-04-01T08:00:00Z',
        systemPrompt: 'You are Aria, a helpful customer support specialist for Haxon Corp...',
        tools: ['ticket_create', 'order_lookup', 'web_search']
    },
    {
        id: 'asst-002', name: 'Dev Buddy', description: 'Code-focused assistant with access to documentation, code execution, and Git tools',
        model: 'claude-3-5-sonnet', type: 'custom', conversations: 1820, createdDate: '2026-04-10T08:00:00Z',
        systemPrompt: 'You are Dev Buddy, an expert software engineering assistant...',
        tools: ['code_execute', 'web_search', 'file_read', 'git_commit']
    },
    {
        id: 'asst-003', name: 'Research Pro', description: 'In-depth research assistant with web search, paper retrieval, and citation management',
        model: 'gemini-1.5-pro', type: 'custom', conversations: 934, createdDate: '2026-04-20T08:00:00Z',
        systemPrompt: 'You are Research Pro, a meticulous academic research assistant...',
        tools: ['web_search', 'arxiv_search', 'pdf_reader']
    },
    {
        id: 'asst-004', name: 'OpenAI Assistant (GPT-4o)', description: 'Managed OpenAI assistant with file handling and code interpreter',
        model: 'gpt-4o', type: 'openai', conversations: 456, createdDate: '2026-05-01T08:00:00Z',
        tools: ['code_interpreter', 'file_search']
    },
]

export default assistants
