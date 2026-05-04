import { useEffect, useRef, useState } from "react";
import { clamp, type RecruitFormState } from "@/components/akRecruit/akRecruitConfig";

type TransformState = Pick<
  RecruitFormState,
  "imageScale" | "imageOffsetX" | "imageOffsetY"
>;

type UseAkRecruitImageTransformOptions = {
  enabled: boolean;
  previewScale: number;
  value: TransformState;
  onCommit: (next: TransformState) => void;
};

export function useAkRecruitImageTransform({
  enabled,
  previewScale,
  value,
  onCommit,
}: UseAkRecruitImageTransformOptions) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const wheelCommitTimeoutRef = useRef<number | null>(null);
  const isInteractingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const interactionRef = useRef<{
    mode: "idle" | "drag" | "pinch";
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    initialScale: number;
    initialDistance: number;
    pointers: Map<number, { x: number; y: number }>;
  }>({
    mode: "idle",
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    initialScale: 1,
    initialDistance: 0,
    pointers: new Map(),
  });
  const liveTransformRef = useRef(value);

  const syncNodeTransform = () => {
    const node = imageRef.current;
    if (!node) {
      return;
    }

    const { imageScale, imageOffsetX, imageOffsetY } = liveTransformRef.current;
    node.style.transform = `translate3d(${imageOffsetX}px, ${imageOffsetY}px, 0) scale(${imageScale})`;
  };

  const commitTransform = () => {
    onCommit({ ...liveTransformRef.current });
  };

  useEffect(() => {
    if (isInteractingRef.current) {
      return;
    }

    liveTransformRef.current = value;
    syncNodeTransform();
  }, [value]);

  useEffect(() => {
    return () => {
      if (wheelCommitTimeoutRef.current !== null) {
        window.clearTimeout(wheelCommitTimeoutRef.current);
      }
    };
  }, []);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!enabled) {
      return;
    }

    event.preventDefault();
    liveTransformRef.current = {
      ...liveTransformRef.current,
      imageScale: clamp(
        liveTransformRef.current.imageScale + (event.deltaY < 0 ? 0.08 : -0.08),
        0.5,
        3,
      ),
    };
    syncNodeTransform();

    if (wheelCommitTimeoutRef.current !== null) {
      window.clearTimeout(wheelCommitTimeoutRef.current);
    }

    wheelCommitTimeoutRef.current = window.setTimeout(() => {
      commitTransform();
    }, 120);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) {
      return;
    }

    event.preventDefault();
    isInteractingRef.current = true;
    const state = interactionRef.current;
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.pointers.size === 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialScale = liveTransformRef.current.imageScale;
      state.initialDistance = Math.hypot(
        second.x - first.x,
        second.y - first.y,
      );
      setIsDragging(false);
      return;
    }

    state.mode = "drag";
    setIsDragging(true);
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.originX = liveTransformRef.current.imageOffsetX;
    state.originY = liveTransformRef.current.imageOffsetY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const state = interactionRef.current;
    if (!state.pointers.has(event.pointerId)) {
      return;
    }

    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.mode === "pinch" && state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);

      if (state.initialDistance > 0) {
        liveTransformRef.current = {
          ...liveTransformRef.current,
          imageScale: clamp(
            state.initialScale * (distance / state.initialDistance),
            0.5,
            3,
          ),
        };
        syncNodeTransform();
      }
      return;
    }

    if (state.mode === "drag") {
      liveTransformRef.current = {
        ...liveTransformRef.current,
        imageOffsetX:
          state.originX + (event.clientX - state.startX) / previewScale,
        imageOffsetY:
          state.originY + (event.clientY - state.startY) / previewScale,
      };
      syncNodeTransform();
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = interactionRef.current;
    state.pointers.delete(event.pointerId);

    if (state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialScale = liveTransformRef.current.imageScale;
      state.initialDistance = Math.hypot(
        second.x - first.x,
        second.y - first.y,
      );
      setIsDragging(false);
      return;
    }

    if (state.pointers.size === 1) {
      const [remaining] = Array.from(state.pointers.values());
      state.mode = "drag";
      state.startX = remaining.x;
      state.startY = remaining.y;
      state.originX = liveTransformRef.current.imageOffsetX;
      state.originY = liveTransformRef.current.imageOffsetY;
      setIsDragging(true);
      return;
    }

    state.mode = "idle";
    isInteractingRef.current = false;
    setIsDragging(false);
    commitTransform();
  };

  return {
    imageRef,
    isDragging,
    overlayHandlers: {
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
    },
  };
}
