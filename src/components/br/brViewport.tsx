import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { getBrContainDisplaySize, type BrDisplaySize } from "@/components/br/brLayout";

type BrViewportProps = {
  children: (displaySize: BrDisplaySize) => ReactNode;
};

export function BrViewport({ children }: BrViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [displaySize, setDisplaySize] = useState<BrDisplaySize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setDisplaySize(
        getBrContainDisplaySize(entry.contentRect.width, entry.contentRect.height),
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      className="relative flex h-full items-start justify-center overflow-hidden bg-muted/40 p-4"
      style={{ overflow: "clip" }}
    >
      <div
        className="overflow-hidden shadow-sm"
        style={{
          width: `${displaySize.width}px`,
          height: `${displaySize.height}px`,
        }}
      >
        {children(displaySize)}
      </div>
    </div>
  );
}
