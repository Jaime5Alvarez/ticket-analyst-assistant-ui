"use client";

import { useEffect, useMemo, useState } from "react";
import { AssistantRuntimeProvider, useAssistantApi } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { Check, ChevronsUpDown } from "lucide-react";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const DEFAULT_MODEL = "anthropic/claude-sonnet-4.6";

const MODELS = [
  { id: "alibaba/qwen3.5-flash", name: "Qwen 3.5 Flash", provider: "alibaba" },
  { id: "openai/gpt-5.3-codex", name: "GPT-5.3 Codex", provider: "openai" },
  {
    id: "google/gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    provider: "google",
  },
  { id: DEFAULT_MODEL, name: "Claude Sonnet 4.6", provider: "anthropic" },
  { id: "minimax/minimax-m2.5", name: "MiniMax M2.5", provider: "minimax" },
  { id: "zai/glm-5", name: "GLM-5", provider: "zai" },
  { id: "moonshotai/kimi-k2.5", name: "Kimi K2.5", provider: "moonshotai" },
  {
    id: "kwaipilot/kat-coder-pro-v1",
    name: "Kat Coder Pro V1",
    provider: "kwaipilot",
  },
] as const;

export const Assistant = () => {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const transport = useMemo(
    () =>
      new AssistantChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const runtime = useChatRuntime({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="https://www.viagogo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      viagogo.com
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Ticket Analyst Assistant</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <HeaderModelSelector
                className="ml-auto"
                model={selectedModel}
                onModelChange={setSelectedModel}
              />
              <ModeToggle />
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};

type HeaderModelSelectorProps = {
  model: string;
  onModelChange: (model: string) => void;
  className?: string;
};

const HeaderModelSelector = ({
  model,
  onModelChange,
  className,
}: HeaderModelSelectorProps) => {
  const api = useAssistantApi();
  const selectedModel = MODELS.find((item) => item.id === model);

  useEffect(() => {
    const unregister = api.modelContext().register({
      getModelContext: () => ({
        config: {
          modelName: model,
        },
      }),
    });

    return () => {
      unregister();
    };
  }, [api, model]);

  return (
    <ModelSelector>
      <ModelSelectorTrigger asChild>
        <Button className={className} variant="outline">
          {selectedModel?.name ?? model}
          <ChevronsUpDown className="size-4 opacity-60" />
        </Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent title="Select Model">
        <ModelSelectorInput placeholder="Search model..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No model found.</ModelSelectorEmpty>
          <ModelSelectorGroup heading="AI Gateway Models">
            {MODELS.map((item) => (
              <ModelSelectorItem
                key={item.id}
                onSelect={() => onModelChange(item.id)}
                value={`${item.name} ${item.id}`}
              >
                <ModelSelectorLogoGroup>
                  <ModelSelectorLogo provider={item.provider} />
                </ModelSelectorLogoGroup>
                <ModelSelectorName>{item.name}</ModelSelectorName>
                {item.id === model ? <Check className="size-4" /> : null}
              </ModelSelectorItem>
            ))}
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
};
