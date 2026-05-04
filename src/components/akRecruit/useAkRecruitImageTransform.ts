import { useEffect, useRef, useState } from "react";
import { type RecruitFormState } from "@/components/akRecruit/akRecruitConfig";

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
  const isInteractingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const interactionRef = useRef<{
    mode: "idle" | "drag";
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({
    mode: "idle",
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
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

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) {
      return;
    }

    event.preventDefault();
    isInteractingRef.current = true;
    const state = interactionRef.current;
    state.mode = "drag";
    setIsDragging(true);
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.originX = liveTransformRef.current.imageOffsetX;
    state.originY = liveTransformRef.current.imageOffsetY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) {
      return;
    }

    event.preventDefault();
    const state = interactionRef.current;
    if (state.mode !== "drag") {
      return;
    }

    liveTransformRef.current = {
      ...liveTransformRef.current,
      imageOffsetX:
        state.originX + (event.clientX - state.startX) / previewScale,
      imageOffsetY:
        state.originY + (event.clientY - state.startY) / previewScale,
    };
    syncNodeTransform();
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = interactionRef.current;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
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
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
    },
  };
}
