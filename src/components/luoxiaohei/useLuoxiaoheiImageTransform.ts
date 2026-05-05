import { useEffect, useRef, useState } from "react";
import type { LuoxiaoheiFormState } from "@/components/luoxiaohei/luoxiaoheiConfig";

type TransformState = Pick<
  LuoxiaoheiFormState,
  "imageScale" | "imageOffsetX" | "imageOffsetY"
>;

type UseLuoxiaoheiImageTransformOptions = {
  enabled: boolean;
  previewScale: number;
  value: TransformState;
  onCommit: (next: TransformState) => void;
};

export function useLuoxiaoheiImageTransform({
  enabled,
  previewScale,
  value,
  onCommit,
}: UseLuoxiaoheiImageTransformOptions) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const isInteractingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const liveTransformRef = useRef(value);
  const interactionRef = useRef({
    mode: "idle" as "idle" | "drag",
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const syncNodeTransform = () => {
    const node = imageRef.current;
    if (!node) {
      return;
    }

    const { imageScale, imageOffsetX, imageOffsetY } = liveTransformRef.current;
    node.style.transform = `translate3d(${imageOffsetX}px, ${imageOffsetY}px, 0) scale(${imageScale})`;
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
    interactionRef.current.mode = "drag";
    interactionRef.current.startX = event.clientX;
    interactionRef.current.startY = event.clientY;
    interactionRef.current.originX = liveTransformRef.current.imageOffsetX;
    interactionRef.current.originY = liveTransformRef.current.imageOffsetY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || interactionRef.current.mode !== "drag") {
      return;
    }

    event.preventDefault();
    liveTransformRef.current = {
      ...liveTransformRef.current,
      imageOffsetX:
        interactionRef.current.originX +
        (event.clientX - interactionRef.current.startX) / previewScale,
      imageOffsetY:
        interactionRef.current.originY +
        (event.clientY - interactionRef.current.startY) / previewScale,
    };
    syncNodeTransform();
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    interactionRef.current.mode = "idle";
    isInteractingRef.current = false;
    setIsDragging(false);
    onCommit({ ...liveTransformRef.current });
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
