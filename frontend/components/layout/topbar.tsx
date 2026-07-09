"use client";
import * as React from "react";
import { Search, Bell, ChevronDown, Menu, LogOut, User, CreditCard, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationsPanel } from "@/components/layout/notifications-panel";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { currentUser, notifications } from "@/lib/mock-data";
import { CommandPalette } from "@/components/layout/command-palette";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
      <button onClick={onOpenMobileNav} className="rounded-lg p-2 text-foreground-muted hover:bg-surface-muted lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={() => setPaletteOpen(true)}
        className="hidden max-w-md flex-1 items-center gap-2.5 rounded-[10px] border border-border bg-surface-muted px-3.5 py-2 text-sm text-foreground-subtle transition-colors hover:border-foreground-subtle/40 sm:flex"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search obligations, clauses, documents, tasks...</span>
        <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-foreground-muted">⌘K</kbd>
      </button>

      <button onClick={() => setPaletteOpen(true)} className="ml-auto rounded-lg p-2 text-foreground-muted hover:bg-surface-muted sm:hidden">
        <Search className="h-5 w-5" />
      </button>

      <div className="ml-auto hidden items-center gap-2 sm:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-surface-muted">
              <span className="hidden max-w-[140px] truncate md:inline">{currentUser.workspace}</span>
              <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuItem>FinSecure Advisors</DropdownMenuItem>
            <DropdownMenuItem>Vantage Capital Partners</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>+ Add workspace</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success-tint px-2.5 py-1.5 text-[11px] font-medium text-success">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          AI Active
        </div>
      </div>

      <NotificationsPanel>
        <button className="relative rounded-lg p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-semibold text-white ring-2 ring-surface">
              {unread}
            </span>
          )}
        </button>
      </NotificationsPanel>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{currentUser.initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="font-semibold text-foreground">{currentUser.name}</p>
            <p className="text-xs font-normal text-foreground-muted">{currentUser.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><User className="h-4 w-4" /> View Profile</DropdownMenuItem>
          <DropdownMenuItem><CreditCard className="h-4 w-4" /> Billing</DropdownMenuItem>
          <DropdownMenuItem><HelpCircle className="h-4 w-4" /> Help & Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger focus:text-danger"><LogOut className="h-4 w-4" /> Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
