import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { getServerConstant } from "@/lib/server-constants";

export const createLangchainModel = (model: string) => {
  const useGateway = getServerConstant("AI_USE_GATEWAY") === "true";

  if (useGateway) {
    return new ChatOpenAI({
      model,
      apiKey: getServerConstant("AI_GATEWAY_API_KEY"),
      streamUsage: true,
      configuration: {
        baseURL: getServerConstant("AI_GATEWAY_BASE_URL"),
      },
    });
  }

  const provider = getServerConstant("AI_PROVIDER").toLowerCase();

  if (provider === "anthropic") {
    return new ChatAnthropic({
      model,
      apiKey: getServerConstant("ANTHROPIC_API_KEY"),
    });
  }

  if (provider === "openai") {
    return new ChatOpenAI({
      model,
      apiKey: getServerConstant("OPENAI_API_KEY"),
      streamUsage: true,
    });
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
};
