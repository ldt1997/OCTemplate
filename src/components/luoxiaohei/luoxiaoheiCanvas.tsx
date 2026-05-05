import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  clamp,
} from "@/components/luoxiaohei/luoxiaoheiConfig";

type LuoxiaoheiCanvasProps = {
  children: (previewScale: number) => ReactNode;
};

export function LuoxiaoheiCanvas({ children }: LuoxiaoheiCanvasProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

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

      const nextScale = Math.min(
        entry.contentRect.width / CANVAS_WIDTH,
        entry.contentRect.height / CANVAS_HEIGHT,
      );
      setPreviewScale(clamp(nextScale, 0.12, 1));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      className="relative flex h-full items-start justify-center overflow-hidden"
    >
      <div
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: "top center",
        }}
      >
        {children(previewScale)}
      </div>
    </div>
  );
}
