"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  LogOut,
  Monitor,
  Moon,
  Sun,
  ChevronsUpDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface Window {
    __deferredInstallPrompt?: BeforeInstallPromptEvent;
  }
}

type UserAccountDropdownProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

const getInitials = (nameOrEmail: string) => {
  const chunks = nameOrEmail.trim().split(/\s+/).filter(Boolean);
  if (chunks.length >= 2) {
    return `${chunks[0]?.[0] ?? ""}${chunks[1]?.[0] ?? ""}`.toUpperCase();
  }
  return nameOrEmail.slice(0, 2).toUpperCase();
};

export function UserAccountDropdown({ user }: UserAccountDropdownProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [canInstall, setCanInstall] = useState(false);

  const displayName = user.name?.trim() || "User";
  const displayEmail = user.email?.trim() || "No email";
  const initials = useMemo(
    () => getInitials(user.name?.trim() || displayEmail),
    [displayEmail, user.name],
  );

  const onSignOut = async () => {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    const syncInstallAvailability = () => {
      setCanInstall(!isStandalone && !!window.__deferredInstallPrompt);
    };

    syncInstallAvailability();
    window.addEventListener("pwa-install-available", syncInstallAvailability);
    window.addEventListener("pwa-install-unavailable", syncInstallAvailability);

    return () => {
      window.removeEventListener(
        "pwa-install-available",
        syncInstallAvailability,
      );
      window.removeEventListener(
        "pwa-install-unavailable",
        syncInstallAvailability,
      );
    };
  }, []);

  const onInstallApp = async () => {
    const promptEvent = window.__deferredInstallPrompt;
    if (!promptEvent) return;

    await promptEvent.prompt();
    await promptEvent.userChoice;
    window.__deferredInstallPrompt = undefined;
    setCanInstall(false);
  };

  const currentTheme = theme ?? "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={user.image ?? undefined} alt={displayName} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{displayName}</span>
            <span className="truncate text-muted-foreground text-xs">
              {displayEmail}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.image ?? undefined} alt={displayName} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{displayName}</span>
              <span className="truncate text-muted-foreground text-xs">
                {displayEmail}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={currentTheme}
            onValueChange={(value) => setTheme(value)}
          >
            <DropdownMenuRadioItem value="light">
              <Sun className="size-4" />
              Light mode
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon className="size-4" />
              Dark mode
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor className="size-4" />
              System theme
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {canInstall ? (
          <>
            <DropdownMenuItem onClick={onInstallApp}>
              <Download className="size-4" />
              Install app
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
