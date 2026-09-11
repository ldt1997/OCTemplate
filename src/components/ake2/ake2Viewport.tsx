import { useEffect, useRef, useState, type ReactNode } from "react";

export function Ake2Viewport({ children }: {
  children: (displayWidth: number) => ReactNode;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setDisplayWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-muted/40 pb-28 lg:flex lg:justify-center lg:pb-0">
      <div ref={viewportRef} className="w-full lg:aspect-[4/3] lg:h-full lg:w-auto lg:shrink-0">
        {displayWidth > 0 && children(displayWidth)}
      </div>
    </div>
  );
}
