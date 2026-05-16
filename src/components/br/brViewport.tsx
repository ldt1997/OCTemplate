import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  clamp,
  getBrContainDisplaySize,
  type BrDisplaySize,
} from "@/components/br/brLayout";

type BrViewportProps = {
  children: (displaySize: BrDisplaySize) => ReactNode;
};

type BrViewportTransform = {
  scale: number;
  x: number;
  y: number;
};

type BrPointerPosition = {
  x: number;
  y: number;
};

const MIN_VIEW_SCALE = 0.5;
const MAX_VIEW_SCALE = 4;
const VIEWPORT_PADDING = 16;

function getDistance(a: BrPointerPosition, b: BrPointerPosition) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getCenter(a: BrPointerPosition, b: BrPointerPosition) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function getResetTransform(
  viewportSize: BrDisplaySize,
  displaySize: BrDisplaySize,
): BrViewportTransform {
  return {
    scale: 1,
    x: Math.max(VIEWPORT_PADDING, (viewportSize.width - displaySize.width) / 2),
    y: VIEWPORT_PADDING,
  };
}

function scaleTransformAtPoint(
  transform: BrViewportTransform,
  nextScale: number,
  center: BrPointerPosition,
): BrViewportTransform {
  const contentX = (center.x - transform.x) / transform.scale;
  const contentY = (center.y - transform.y) / transform.scale;

  return {
    scale: nextScale,
    x: center.x - contentX * nextScale,
    y: center.y - contentY * nextScale,
  };
}

export function BrViewport({ children }: BrViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activePointersRef = useRef<Map<number, BrPointerPosition>>(new Map());
  const panStartRef = useRef<{
    pointer: BrPointerPosition;
    transform: BrViewportTransform;
  } | null>(null);
  const pinchStartRef = useRef<{
    distance: number;
    center: BrPointerPosition;
    transform: BrViewportTransform;
  } | null>(null);
  const transformRef = useRef<BrViewportTransform>({
    scale: 1,
    x: VIEWPORT_PADDING,
    y: VIEWPORT_PADDING,
  });
  const [viewportSize, setViewportSize] = useState<BrDisplaySize>({
    width: 0,
    height: 0,
  });
  const [displaySize, setDisplaySize] = useState<BrDisplaySize>({
    width: 0,
    height: 0,
  });
  const [transform, setTransform] = useState<BrViewportTransform>(
    transformRef.current,
  );

  const updateTransform = (nextTransform: BrViewportTransform) => {
    transformRef.current = nextTransform;
    setTransform(nextTransform);
  };

  const getLocalPointerPosition = (event: React.PointerEvent | React.WheelEvent) => {
    const node = viewportRef.current;
    if (!node) {
      return { x: 0, y: 0 };
    }

    const rect = node.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const resetTransform = (
    nextViewportSize = viewportSize,
    nextDisplaySize = displaySize,
  ) => {
    updateTransform(getResetTransform(nextViewportSize, nextDisplaySize));
  };

  const startPinchGesture = () => {
    const pointers = Array.from(activePointersRef.current.values());
    if (pointers.length < 2) {
      pinchStartRef.current = null;
      return;
    }

    const [firstPointer, secondPointer] = pointers;
    pinchStartRef.current = {
      distance: Math.max(1, getDistance(firstPointer, secondPointer)),
      center: getCenter(firstPointer, secondPointer),
      transform: transformRef.current,
    };
  };

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

      const nextViewportSize = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
      const nextDisplaySize = getBrContainDisplaySize(
        Math.max(0, entry.contentRect.width - VIEWPORT_PADDING * 2),
        Math.max(0, entry.contentRect.height - VIEWPORT_PADDING * 2),
      );

      setViewportSize(nextViewportSize);
      setDisplaySize(nextDisplaySize);
      updateTransform(getResetTransform(nextViewportSize, nextDisplaySize));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      className="relative h-full cursor-grab overflow-hidden bg-muted/40 touch-none select-none active:cursor-grabbing"
      style={{ overflow: "clip" }}
      onDoubleClick={() => resetTransform()}
      onWheel={(event) => {
        event.preventDefault();
        const direction = event.deltaY > 0 ? -1 : 1;
        const nextScale = clamp(
          transformRef.current.scale * (1 + direction * 0.12),
          MIN_VIEW_SCALE,
          MAX_VIEW_SCALE,
        );
        updateTransform(
          scaleTransformAtPoint(
            transformRef.current,
            nextScale,
            getLocalPointerPosition(event),
          ),
        );
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        const pointer = getLocalPointerPosition(event);
        activePointersRef.current.set(event.pointerId, pointer);

        if (activePointersRef.current.size >= 2) {
          startPinchGesture();
          panStartRef.current = null;
          return;
        }

        panStartRef.current = {
          pointer,
          transform: transformRef.current,
        };
      }}
      onPointerMove={(event) => {
        if (!activePointersRef.current.has(event.pointerId)) {
          return;
        }

        const pointer = getLocalPointerPosition(event);
        activePointersRef.current.set(event.pointerId, pointer);

        if (activePointersRef.current.size >= 2) {
          const pinchStart = pinchStartRef.current;
          const pointers = Array.from(activePointersRef.current.values());
          if (!pinchStart || pointers.length < 2) {
            return;
          }

          const [firstPointer, secondPointer] = pointers;
          const nextDistance = Math.max(
            1,
            getDistance(firstPointer, secondPointer),
          );
          const nextCenter = getCenter(firstPointer, secondPointer);
          const nextScale = clamp(
            pinchStart.transform.scale *
              (nextDistance / Math.max(1, pinchStart.distance)),
            MIN_VIEW_SCALE,
            MAX_VIEW_SCALE,
          );
          const scaledTransform = scaleTransformAtPoint(
            pinchStart.transform,
            nextScale,
            pinchStart.center,
          );

          updateTransform({
            ...scaledTransform,
            x: scaledTransform.x + nextCenter.x - pinchStart.center.x,
            y: scaledTransform.y + nextCenter.y - pinchStart.center.y,
          });
          return;
        }

        const panStart = panStartRef.current;
        if (!panStart) {
          return;
        }

        updateTransform({
          ...panStart.transform,
          x: panStart.transform.x + pointer.x - panStart.pointer.x,
          y: panStart.transform.y + pointer.y - panStart.pointer.y,
        });
      }}
      onPointerUp={(event) => {
        activePointersRef.current.delete(event.pointerId);
        event.currentTarget.releasePointerCapture(event.pointerId);

        const remainingPointers = Array.from(activePointersRef.current.values());
        if (remainingPointers.length === 1) {
          panStartRef.current = {
            pointer: remainingPointers[0],
            transform: transformRef.current,
          };
          pinchStartRef.current = null;
          return;
        }

        panStartRef.current = null;
        pinchStartRef.current = null;
      }}
      onPointerCancel={(event) => {
        activePointersRef.current.delete(event.pointerId);
        panStartRef.current = null;
        pinchStartRef.current = null;
      }}
    >
      <div
        className="absolute left-0 top-0 overflow-hidden shadow-sm will-change-transform"
        style={{
          width: `${displaySize.width}px`,
          height: `${displaySize.height}px`,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {children(displaySize)}
      </div>
    </div>
  );
}
