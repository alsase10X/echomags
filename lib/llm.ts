import { createGroq } from "@ai-sdk/groq";
import type { LanguageModelV1 } from "ai";

const DEFAULT_PROVIDER = "groq";
const DEFAULT_MODEL_ID = "llama-3.3-70b-versatile";

const MODEL_ALIASES: Record<string, string> = {
  "chat-model": DEFAULT_MODEL_ID,
  "chat-model-reasoning": "deepseek-r1-distill-llama-70b",
  "title-model": "llama-3.1-8b-instant",
  "artifact-model": DEFAULT_MODEL_ID,
  "llama-3.1-70b-versatile": DEFAULT_MODEL_ID,
};

export class MissingGroqApiKeyError extends Error {
  constructor() {
    super("Missing GROQ_API_KEY");
    this.name = "MissingGroqApiKeyError";
  }
}

type GroqProvider = ReturnType<typeof createGroq>;

let cachedProvider: GroqProvider | null = null;

function createGroqProvider(): GroqProvider {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new MissingGroqApiKeyError();
  }

  return createGroq({ apiKey });
}

function resolveModelId(modelId?: string): string {
  if (!modelId) {
    return DEFAULT_MODEL_ID;
  }

  return MODEL_ALIASES[modelId] ?? modelId;
}

export function getProvider(): GroqProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const configuredProvider =
    process.env.AI_PROVIDER?.toLowerCase() ?? DEFAULT_PROVIDER;

  if (configuredProvider !== "groq") {
    console.warn(
      `Unsupported AI_PROVIDER "${configuredProvider}", falling back to Groq`
    );
  }

  cachedProvider = createGroqProvider();

  return cachedProvider;
}

export function getModel(modelId?: string): LanguageModelV1 {
  const provider = getProvider();

  return provider.languageModel(resolveModelId(modelId));
}

export function getModelId(modelId?: string): string {
  return resolveModelId(modelId);
}
