import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}

