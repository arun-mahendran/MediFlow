import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Brand } from "./Brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface Props {
  nav: NavItem[];
  roleLabel: string;
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode | undefined;
  children: ReactNode;
}

export function DashboardLayout({ nav, roleLabel, title, subtitle, actions, children }: Props) {
  const { name, email, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="dashboard-app min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <div className="px-2 py-2">
          <Brand />
        </div>
        <p className="mt-10 mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {roleLabel}
        </p>
        {links}
        <div className="mt-auto space-y-3 border-t border-sidebar-border pt-4">
          <div className="px-3">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => void signOut()}
            className="flex w-full justify-start gap-3 px-3 text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <LogOut className="size-4.5" /> Sign out
          </Button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar p-4">
            <div className="flex items-center justify-between">
              <Brand />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="size-5" />
              </Button>
            </div>
            <p className="mt-6 mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {roleLabel}
            </p>
            {links}
            <Button
              variant="ghost"
              onClick={() => void signOut()}
              className="mt-auto flex justify-start gap-3 px-3 text-muted-foreground"
            >
              <LogOut className="size-4.5" /> Sign out
            </Button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="dashboard-header sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-card/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="mb-1 hidden text-[11px] font-bold uppercase tracking-widest text-primary sm:block">{roleLabel} workspace</p>
            <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
          </div>
          {actions}
        </header>
        <main className="dashboard-content mx-auto w-full max-w-[1600px] space-y-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8" key={location.pathname}>{children}</main>
      </div>
      <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-lift backdrop-blur-xl lg:hidden">
        {nav.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} aria-current={active ? "page" : undefined} className={cn("relative flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-center text-[10px] font-semibold transition-colors", active ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
              {active && <span className="absolute inset-x-1/4 top-0 h-0.5 rounded-full bg-primary" />}
              <item.icon className="size-5 shrink-0" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
