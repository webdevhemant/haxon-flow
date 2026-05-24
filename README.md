# Haxon Flow

A canvas-first AI workflow studio built for exploring and prototyping AI pipelines visually.

> **Inspired by [FlowiseAI](https://flowiseai.com/)** — Haxon Flow takes design inspiration from Flowise's drag-and-drop AI workflow paradigm. Full credit to the FlowiseAI team for pioneering this concept. Haxon Flow is an independent reimplementation built for learning and exploration; it is not derived from Flowise's source code and is not affiliated with FlowiseAI in any way.

---

## Overview

Haxon Flow is a modern React-based AI workflow builder that lets you:

- **Visually compose** AI pipelines by dragging and connecting nodes on an infinite canvas
- **Orchestrate multi-agent flows** with conditional branches and parallel execution
- **Connect to any LLM** — GPT-4o, Claude Opus/Sonnet, Gemini, Llama, Mistral, and more
- **Build RAG pipelines** with document stores, vector search, and embedding model selection
- **Manage prompts** with a full prompt library, variable interpolation, and live preview
- **Evaluate AI quality** with custom evaluators, datasets, and scored evaluation runs
- **Deploy flows as REST APIs** with built-in auth, monitoring, and rate limiting
- **Manage credentials, variables, and API keys** across all your flows

---

## Features

### Canvas Editor
- Drag-and-drop node palette with category grouping
- Color-coded node headers with per-category accent colors
- Input/output handle indicators with connection glow
- Double-click edge to remove, `Delete`/`Backspace` key support
- Smooth pan, zoom, and minimap

### Pages
| Page | Description |
|------|-------------|
| **Chatflows** | Create and manage LLM chat pipelines with grid, compact, and table views |
| **Agentflows** | Multi-agent orchestration flows with model selection |
| **Canvas** | Visual drag-and-drop flow editor powered by React Flow |
| **Assistants** | Pre-configured AI assistants with in-app chat preview |
| **Tools** | Custom tool functions with code editor and category tagging |
| **Prompt Library** | Reusable prompts with `{{variable}}` syntax and fill-and-copy UI |
| **Document Stores** | Vector store management (Pinecone, Qdrant, Weaviate, Chroma, etc.) |
| **Datasets** | Evaluation datasets with CSV/JSON upload |
| **Evaluators** | LLM-judge, heuristic, and code-runner evaluators with pass thresholds |
| **Evaluations** | Run evaluations and track scored results over time |
| **Credentials** | Encrypted API key storage for LLM and service providers |
| **Variables** | Environment variables (string, number, boolean, secret, JSON) |
| **API Keys** | Haxon API key management with rate limiting |
| **Deployments** | Deploy flows as REST endpoints with live latency and uptime metrics |
| **Analytics** | Usage metrics and execution trends |
| **Model Hub** | Browse supported LLM providers and models |
| **Integrations** | Connect external services and platforms |
| **Marketplaces** | Browse community flow templates |
| **Agent Executions** | Trace and inspect agent run history |
| **Server Logs** | Live system log viewer |
| **Account** | Profile, preferences, and settings |
| **Pricing** | Plan and billing overview |

### Auth
- Login, Signup, Reset Password, New Password, Verify Email
- Animated neural background with floating rings and gradient blobs

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| State | Zustand v5 |
| Canvas | `@xyflow/react` (React Flow v12) |
| Routing | React Router v7 |
| UI | shadcn/ui components |
| Notifications | Sonner |
| Icons | Tabler Icons |
| Fonts | Bricolage Grotesque · Manrope · JetBrains Mono |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

The app runs at `http://localhost:5173` by default.

---

## Project Structure

```
src/
├── pages/              # Route-level page components (one folder per page)
│   ├── landing/        # Marketing landing page
│   ├── canvas/         # Flow canvas editor
│   ├── auth/           # Login, signup, reset password, verify email
│   ├── chatflows/      # Chatflow list and management
│   ├── agentflows/     # Agentflow list and management
│   ├── assistants/     # AI assistant cards with chat preview
│   ├── tools/          # Custom tool builder
│   ├── promptlibrary/  # Reusable prompt templates
│   ├── docstore/       # Document store management
│   ├── datasets/       # Evaluation dataset management
│   ├── evaluators/     # Evaluator configuration
│   ├── evaluations/    # Evaluation run history
│   ├── credentials/    # API credential vault
│   ├── variables/      # Environment variable store
│   ├── apikey/         # Haxon API key management
│   ├── deployments/    # Flow deployment endpoints
│   └── ...             # analytics, modelhub, integrations, etc.
├── components/
│   ├── ui/             # shadcn/ui base components
│   ├── dialogs/        # All modal/dialog components
│   └── layout/         # Sidebar, header, shell
├── store/              # Zustand state stores
├── hooks/              # Custom React hooks (useSound, usePageLoading, etc.)
├── mock/               # Mock data for all pages
├── routes/             # React Router route definitions
└── assets/
    ├── css/            # Global CSS and Tailwind config
    └── scss/           # SCSS partials
```

---

## Credits & Inspiration

This project was inspired by **[FlowiseAI](https://flowiseai.com/)**, an open-source low-code platform for building customized LLM flows. We deeply respect their work and encourage you to check out the original project.

- FlowiseAI GitHub: [https://github.com/FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)
- FlowiseAI License: Apache 2.0

Haxon Flow is a separate, independently written project. No source code from FlowiseAI was used.

---

## License

MIT License — see [LICENSE.md](./LICENSE.md)

This project is for learning, exploration, and non-commercial use.
