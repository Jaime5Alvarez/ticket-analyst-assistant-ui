Ticket analyst UI with assistant-ui + LangChain agent + Playwright MCP.

## Getting Started

1. Configure environment variables in `.env`:

```bash
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
AI_PROVIDER=openai
AI_MODEL=gpt-5-nano
PLAYWRIGHT_MCP_SERVER=http://localhost:8931/mcp
```

2. Start the Playwright MCP server (in another terminal):

```bash
bunx @playwright/mcp@latest --port 8931 --device "iPhone 15"
```

3. Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
