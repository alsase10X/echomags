"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useWindowSize } from "usehooks-ts";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon, VercelIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();
  const logoLabel = process.env.NEXT_PUBLIC_HEADER_BRAND ?? "EchoMagnet";
  const logoHref = process.env.NEXT_PUBLIC_HEADER_BRAND_HREF ?? "/";
  const logoSrc =
    process.env.NEXT_PUBLIC_HEADER_LOGO_SRC ?? "/images/echomagnet-logo.svg";

  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-4">
      <div className="flex items-center gap-2">
        <SidebarToggle />

        {!isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
          />
        )}
      </div>

      <div className="flex flex-1 justify-center">
        <Link
          className="flex h-12 min-w-[176px] items-center justify-center px-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          href={logoHref}
        >
          {logoSrc ? (
            <>
              <Image
                alt={logoLabel}
                className="h-10 w-auto"
                height={40}
                priority
                src={logoSrc}
                width={200}
              />
              <span className="sr-only">{logoLabel}</span>
            </>
          ) : (
            logoLabel
          )}
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {(!open || windowWidth < 768) && (
          <Button
            className="h-8 px-2 text-white !border-transparent hover:bg-white/10 focus-visible:ring-white md:h-fit md:px-2"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
            variant="outline"
          >
            <PlusIcon />
            <span className="sr-only">New Chat</span>
          </Button>
        )}

        <Button
          asChild
          className="hidden bg-zinc-900 px-2 text-zinc-50 hover:bg-zinc-800 md:flex md:h-fit dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Link
            href={"https://vercel.com/templates/next.js/nextjs-ai-chatbot"}
            rel="noreferrer"
            target="_noblank"
          >
            <VercelIcon size={16} />
            Deploy with Vercel
          </Link>
        </Button>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
