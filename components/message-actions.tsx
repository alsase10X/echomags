import equal from "fast-deep-equal";
import { memo } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import type { ChatMessage } from "@/lib/types";
import { Action, Actions } from "./elements/actions";
import { CopyIcon, PencilEditIcon } from "./icons";

type MessageActionsProps = {
  message: ChatMessage;
  isLoading: boolean;
  setMode?: (mode: "view" | "edit") => void;
};

export function PureMessageActions({
  message,
  isLoading,
  setMode,
}: MessageActionsProps) {
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading || message.role !== "user") {
    return null;
  }

  const textFromParts = message.parts
    ?.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();

  const handleCopy = async () => {
    if (!textFromParts) {
      toast.error("There's no text to copy!");
      return;
    }

    await copyToClipboard(textFromParts);
    toast.success("Copied to clipboard!");
  };

  return (
    <Actions className="-mr-0.5 justify-end">
      <div className="relative">
        {setMode && (
          <Action
            className="-left-10 absolute top-0 opacity-0 transition-opacity group-hover/message:opacity-100"
            onClick={() => setMode("edit")}
            tooltip="Edit"
          >
            <PencilEditIcon />
          </Action>
        )}
        <Action onClick={handleCopy} tooltip="Copy">
          <CopyIcon />
        </Action>
      </div>
    </Actions>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) {
      return false;
    }
    if (prevProps.message.role !== nextProps.message.role) {
      return false;
    }
    if (!equal(prevProps.message.parts, nextProps.message.parts)) {
      return false;
    }
    if (prevProps.setMode !== nextProps.setMode) {
      return false;
    }

    return true;
  }
);
