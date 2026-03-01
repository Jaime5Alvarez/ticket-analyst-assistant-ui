import * as React from "react";
import { MessagesSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PersistedThreadList } from "@/components/assistant-ui/persisted-thread-list";
import { UserAccountDropdown } from "@/components/assistant-ui/user-account-dropdown";

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function ThreadListSidebar({
  activeThreadId,
  onSelectThread,
  onCreateThread,
  currentUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
  currentUser: SidebarUser;
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="aui-sidebar-header mb-2 border-b">
        <div className="aui-sidebar-header-content flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="aui-sidebar-header-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <MessagesSquare className="aui-sidebar-header-icon size-4" />
                </div>
                <div className="aui-sidebar-header-heading mr-6 flex flex-col gap-0.5 leading-none">
                  <span className="aui-sidebar-header-title font-semibold">
                    Ticket Analyst
                  </span>
                  <span className="text-xs">Assistant</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent className="aui-sidebar-content px-2">
        <PersistedThreadList
          activeThreadId={activeThreadId}
          onSelectThread={onSelectThread}
          onCreateThread={onCreateThread}
        />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="aui-sidebar-footer border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserAccountDropdown user={currentUser} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
