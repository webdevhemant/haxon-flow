export const datasets = [
    {
        id: 'ds-1',
        name: 'Customer Support Tickets Q1',
        description: 'Labeled support tickets with intent and resolution data.',
        rows: 4200,
        status: 'ready',
        tags: ['nlp', 'classification'],
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
        id: 'ds-2',
        name: 'Product FAQ Pairs',
        description: 'Question-answer pairs from product documentation for RAG evaluation.',
        rows: 850,
        status: 'ready',
        tags: ['qa', 'rag'],
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
        id: 'ds-3',
        name: 'Code Review Benchmark',
        description: 'Code snippets with annotated issues for evaluating code review agents.',
        rows: 1100,
        status: 'processing',
        tags: ['code', 'benchmark'],
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        updatedDate: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
        id: 'ds-4',
        name: 'Legal Document Summaries',
        description: 'Contract excerpts paired with human-written summaries.',
        rows: 620,
        status: 'ready',
        tags: ['legal', 'summarization'],
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
        id: 'ds-5',
        name: 'Multi-turn Conversation Logs',
        description: 'Real chatbot conversations with satisfaction scores.',
        rows: 9300,
        status: 'draft',
        tags: ['dialogue', 'satisfaction'],
        createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
    }
]

export const evaluators = [
    {
        id: 'ev-1',
        name: 'Faithfulness Judge',
        description: 'LLM-as-judge that checks if the response is grounded in the context provided.',
        type: 'llm-judge',
        model: 'gpt-4o',
        category: 'RAG',
        passThreshold: 0.85
    },
    {
        id: 'ev-2',
        name: 'Answer Relevancy',
        description: 'Scores how relevant the generated answer is to the input question.',
        type: 'llm-judge',
        model: 'claude-3-5-sonnet',
        category: 'RAG',
        passThreshold: 0.8
    },
    {
        id: 'ev-3',
        name: 'Toxicity Detector',
        description: 'Flags responses containing harmful, offensive, or biased content.',
        type: 'heuristic',
        model: null,
        category: 'Safety',
        passThreshold: 0.95
    },
    {
        id: 'ev-4',
        name: 'JSON Schema Validator',
        description: 'Verifies structured outputs conform to the expected JSON schema.',
        type: 'heuristic',
        model: null,
        category: 'Correctness',
        passThreshold: 1.0
    },
    {
        id: 'ev-5',
        name: 'Conciseness Scorer',
        description: 'Penalizes verbose responses that contain unnecessary filler.',
        type: 'llm-judge',
        model: 'gpt-4o-mini',
        category: 'Quality',
        passThreshold: 0.7
    },
    {
        id: 'ev-6',
        name: 'Code Executability',
        description: 'Runs generated code snippets in a sandbox and checks for runtime errors.',
        type: 'code-runner',
        model: null,
        category: 'Code',
        passThreshold: 1.0
    }
]

export const evaluations = [
    {
        id: 'eval-1',
        name: 'Support Bot v2 — RAG Eval',
        dataset: 'Customer Support Tickets Q1',
        evaluators: ['Faithfulness Judge', 'Answer Relevancy'],
        status: 'passed',
        score: 0.91,
        passed: 38,
        total: 42,
        runDate: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
        id: 'eval-2',
        name: 'FAQ Bot Regression Test',
        dataset: 'Product FAQ Pairs',
        evaluators: ['Answer Relevancy', 'Conciseness Scorer'],
        status: 'failed',
        score: 0.72,
        passed: 61,
        total: 85,
        runDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
        id: 'eval-3',
        name: 'Code Review Safety Gate',
        dataset: 'Code Review Benchmark',
        evaluators: ['Code Executability', 'Toxicity Detector'],
        status: 'passed',
        score: 0.97,
        passed: 107,
        total: 110,
        runDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    },
    {
        id: 'eval-4',
        name: 'Legal Summarizer Audit',
        dataset: 'Legal Document Summaries',
        evaluators: ['Faithfulness Judge'],
        status: 'running',
        score: null,
        passed: 28,
        total: 62,
        runDate: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    }
]

export default datasets
