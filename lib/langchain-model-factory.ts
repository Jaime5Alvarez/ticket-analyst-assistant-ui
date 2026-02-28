import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { getServerConstant } from "@/lib/server-constants";

export const createLangchainModel = () => {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();
  const model = process.env.AI_MODEL ?? "gpt-5-nano";

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
