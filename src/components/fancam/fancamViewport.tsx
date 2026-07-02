import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  getFancamContainDisplaySize,
  type FancamDisplaySize,
} from "@/components/fancam/fancamLayout";

type FancamViewportProps = {
  children: (displaySize: FancamDisplaySize) => ReactNode;
};

const VIEWPORT_PADDING = 16;

export function FancamViewport({ children }: FancamViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [displaySize, setDisplaySize] = useState<FancamDisplaySize>({
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
        getFancamContainDisplaySize(
          Math.max(0, entry.contentRect.width - VIEWPORT_PADDING * 2),
          Math.max(0, entry.contentRect.height - VIEWPORT_PADDING * 2),
        ),
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      className="relative h-full overflow-auto bg-muted/40"
      style={{ overflow: "auto" }}
    >
      <div
        className="mx-auto shadow-sm"
        style={{
          width: `${displaySize.width}px`,
          height: `${displaySize.height}px`,
          marginTop: `${VIEWPORT_PADDING}px`,
          marginBottom: `${VIEWPORT_PADDING}px`,
        }}
      >
        {displaySize.width > 0 && displaySize.height > 0
          ? children(displaySize)
          : null}
      </div>
    </div>
  );
}
