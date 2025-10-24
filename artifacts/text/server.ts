import { smoothStream, streamText } from "ai";
import { updateDocumentPrompt } from "@/lib/ai/prompts";
import { getModel, MissingGroqApiKeyError } from "@/lib/llm";
import { createDocumentHandler } from "@/lib/artifacts/server";

function resolveArtifactModel() {
  try {
    return getModel("artifact-model");
  } catch (error) {
    if (error instanceof MissingGroqApiKeyError) {
      throw new Error("Missing GROQ_API_KEY");
    }

    throw error;
  }
}

export const textDocumentHandler = createDocumentHandler<"text">({
  kind: "text",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const model = resolveArtifactModel();

    const { fullStream } = streamText({
      model,
      system:
        "Write about the given topic. Markdown is supported. Use headings wherever appropriate.",
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: title,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "text-delta") {
        const { text } = delta;

        draftContent += text;

        dataStream.write({
          type: "data-textDelta",
          data: text,
          transient: true,
        });
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const model = resolveArtifactModel();

    const { fullStream } = streamText({
      model,
      system: updateDocumentPrompt(document.content, "text"),
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: description,
      providerOptions: {
        openai: {
          prediction: {
            type: "content",
            content: document.content,
          },
        },
      },
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "text-delta") {
        const { text } = delta;

        draftContent += text;

        dataStream.write({
          type: "data-textDelta",
          data: text,
          transient: true,
        });
      }
    }

    return draftContent;
  },
});
