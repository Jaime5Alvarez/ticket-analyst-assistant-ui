import { convertModelMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createAgent } from "langchain";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { createLangchainModel } from "@/lib/langchain-model-factory";
import { getTicketAnalystSystemPrompt } from "@/lib/ticket-analyst-system-prompt";
import { getServerConstant } from "@/lib/server-constants";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const {
    messages,
    system,
    model,
    config,
  }: {
    messages: UIMessage[];
    system?: string;
    model?: string;
    config?: {
      modelName?: string;
    };
  } = await req.json();
  const selectedModel = model ?? config?.modelName;
  if (!selectedModel) {
    throw new Error("model is required");
  }

  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      playwright: {
        url: getServerConstant("PLAYWRIGHT_MCP_SERVER"),
      },
    },
  });

  try {
    const tools = await mcpClient.getTools();
    const llm = createLangchainModel(selectedModel);
    const agent = createAgent({
      model: llm,
      tools,
    });
    const modelMessages = await convertToModelMessages(messages);
    const langchainMessages = convertModelMessages([
      {
        role: "system",
        content: system ?? getTicketAnalystSystemPrompt(),
      },
      ...modelMessages,
    ]);

    const langchainStream = await agent.stream(
      { messages: langchainMessages },
      { streamMode: ["values", "messages"], recursionLimit: 100 },
    );

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute: async ({ writer }) => {
          writer.merge(
            toUIMessageStream(langchainStream as AsyncIterable<never>),
          );
        },
        generateId: () => crypto.randomUUID(),
        onFinish: async () => {
          await mcpClient.close();
        },
      }),
    });
  } catch (error) {
    await mcpClient.close();
    throw error;
  }
}
