"use client";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { navItems } from "@/lib/nav";

export function Breadcrumb() {
  const pathname = usePathname();
  const current = navItems.find((i) => i.href === pathname);

  return (
    <div className="flex items-center gap-1.5 text-[13px] text-foreground-muted">
      <Home className="h-3.5 w-3.5" />
      <ChevronRight className="h-3 w-3" />
      <span className={pathname === "/" ? "font-medium text-foreground" : ""}>
        {pathname === "/" ? "Dashboard" : "Dashboard"}
      </span>
      {current && pathname !== "/" && (
        <>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{current.label}</span>
        </>
      )}
    </div>
  );
}
