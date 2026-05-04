import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  clamp,
} from "@/components/akRecruit/akRecruitConfig";

type CanvasTransform = {
  zoom: number;
  x: number;
  y: number;
};

type PointerState = {
  mode: "idle" | "pan" | "pinch";
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  initialZoom: number;
  initialDistance: number;
  pointers: Map<number, { x: number; y: number }>;
};

type AkRecruitCanvasProps = PropsWithChildren<{
  hint?: ReactNode;
}>;

const initialTransform: CanvasTransform = {
  zoom: 1,
  x: 0,
  y: 0,
};

export function AkRecruitCanvas({ children, hint }: AkRecruitCanvasProps) {
  const [transform, setTransform] = useState(initialTransform);
  const [baseScale, setBaseScale] = useState(1);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pointerStateRef = useRef<PointerState>({
    mode: "idle",
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    initialZoom: 1,
    initialDistance: 0,
    pointers: new Map(),
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

      const nextScale = Math.min(
        entry.contentRect.width / CANVAS_WIDTH,
        entry.contentRect.height / CANVAS_HEIGHT,
      );
      setBaseScale(clamp(nextScale, 0.12, 1));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.12 : -0.12;
    setTransform((current) => ({
      ...current,
      zoom: clamp(current.zoom + delta, 0.5, 3),
    }));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.pointers.size === 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialZoom = transform.zoom;
      state.initialDistance = Math.hypot(second.x - first.x, second.y - first.y);
      return;
    }

    if (state.pointers.size === 1) {
      state.mode = "pan";
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.originX = transform.x;
      state.originY = transform.y;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    if (!state.pointers.has(event.pointerId)) {
      return;
    }

    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.mode === "pinch" && state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      if (state.initialDistance > 0) {
        setTransform((current) => ({
          ...current,
          zoom: clamp(state.initialZoom * (distance / state.initialDistance), 0.5, 3),
        }));
      }
      return;
    }

    if (state.mode === "pan") {
      setTransform((current) => ({
        ...current,
        x: state.originX + event.clientX - state.startX,
        y: state.originY + event.clientY - state.startY,
      }));
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    state.pointers.delete(event.pointerId);

    if (state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialZoom = transform.zoom;
      state.initialDistance = Math.hypot(second.x - first.x, second.y - first.y);
      return;
    }

    if (state.pointers.size === 1) {
      const [remaining] = Array.from(state.pointers.values());
      state.mode = "pan";
      state.startX = remaining.x;
      state.startY = remaining.y;
      state.originX = transform.x;
      state.originY = transform.y;
      return;
    }

    state.mode = "idle";
  };

  return (
    <div
      ref={viewportRef}
      className={`relative flex h-full items-center justify-center overflow-hidden touch-none px-4 py-4 lg:items-start lg:px-10 lg:py-6 ${
        pointerStateRef.current.mode === "pan" ? "cursor-grabbing" : "cursor-grab"
      }`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
    >
      {hint}

      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${baseScale * transform.zoom})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
