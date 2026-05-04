import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/shared/themeToggle";

type SiteHeaderProps = {
  actions?: ReactNode;
};

export function SiteHeader({ actions }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-[-0.02em] text-[#ff385c]"
        >
          OCTemplate
        </Link>

        <div className="flex flex-row-reverse items-center gap-3">
          <ThemeToggle />
          {actions}
        </div>
      </div>
    </header>
  );
}
