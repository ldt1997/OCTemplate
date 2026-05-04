import type { PropsWithChildren, ReactNode } from "react";
import { SiteHeader } from "@/components/layout/siteHeader";

type AppLayoutProps = PropsWithChildren<{
  headerActions?: ReactNode;
  contentClassName?: string;
}>;

export function AppLayout({
  children,
  headerActions,
  contentClassName,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/70 text-foreground">
      <SiteHeader actions={headerActions} />
      <main className={contentClassName}>{children}</main>
    </div>
  );
}

