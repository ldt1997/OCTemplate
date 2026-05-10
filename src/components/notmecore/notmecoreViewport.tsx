import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  notmecoreTemplateSpec,
  type NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import {
  getContainDisplaySize,
  type NotmecoreCanvasSize,
  type NotmecoreDisplaySize,
} from "@/components/notmecore/notmecoreLayout";

type NotmecoreViewportProps = {
  imageSize: NotmecoreImageSize | null;
  children: (displaySize: NotmecoreDisplaySize) => ReactNode;
};

export function NotmecoreViewport({
  imageSize,
  children,
}: NotmecoreViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [displaySize, setDisplaySize] = useState<NotmecoreDisplaySize>({
    width: 0,
    height: 0,
  });
  const canvasSize = useMemo<NotmecoreCanvasSize>(
    () =>
      imageSize
        ? {
            width: imageSize.width,
            height: imageSize.height,
          }
        : { width: 0, height: 0 },
    [imageSize],
  );

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || canvasSize.width === 0 || canvasSize.height === 0) {
        setDisplaySize({ width: 0, height: 0 });
        return;
      }

      const nextDisplaySize = getContainDisplaySize(
        canvasSize,
        entry.contentRect.width,
        entry.contentRect.height,
      );
      setDisplaySize(nextDisplaySize);
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
      className="relative flex h-full items-center justify-center overflow-hidden"
      style={{ overflow: "clip" }}
    >
      <div
        className="overflow-hidden"
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
