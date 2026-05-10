import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  notmecoreTemplateSpec,
  type NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { getCanvasSize } from "@/components/notmecore/notmecoreLayout";

type NotmecoreViewportProps = {
  imageSize: NotmecoreImageSize | null;
  children: ReactNode;
};

export function NotmecoreViewport({
  imageSize,
  children,
}: NotmecoreViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const canvasSize = useMemo(() => getCanvasSize(imageSize), [imageSize]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || canvasSize.width === 0 || canvasSize.height === 0) {
        setPreviewScale(1);
        return;
      }

      const nextScale = Math.min(
        entry.contentRect.width / canvasSize.width,
        entry.contentRect.height / canvasSize.height,
      );

      setPreviewScale(nextScale);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [canvasSize.height, canvasSize.width]);

  if (!imageSize) {
    return (
      <div ref={viewportRef} className="flex h-full items-center justify-center px-6">
        <div
          className="flex w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-black/10 bg-white/80 px-8 text-center shadow-sm backdrop-blur"
          style={{ minHeight: notmecoreTemplateSpec.emptyStateBoxHeight }}
        >
          <p className="text-lg font-semibold text-foreground">
            {notmecoreTemplateSpec.emptyStateTitle}
          </p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {notmecoreTemplateSpec.emptyStateDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      className="relative flex h-full items-start justify-center overflow-auto"
    >
      <div
        className="shrink-0 overflow-hidden shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          transform: `scale(${previewScale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
