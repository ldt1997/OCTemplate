import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ake2TemplateSpec, type Ake2FormState } from "./ake2Config";
import { containsAke2Point, getAke2ImageLayout, type Ake2Point } from "./ake2Layout";
import { drawAke2Frame } from "./ake2Renderer";
import type { Ake2Resources } from "./ake2Resources";

type Ake2CanvasProps = {
  displayWidth: number;
  form: Ake2FormState;
  resources: Ake2Resources;
  onError: (message: string) => void;
  onImagePositionChange: (position: Ake2Point) => void;
};

export function Ake2Canvas({ displayWidth, form, resources, onError, onImagePositionChange }: Ake2CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ pointerId: number; start: Ake2Point; origin: Ake2Point } | null>(null);
  const [dragging, setDragging] = useState(false);
  const pixelWidth = Math.min(
    ake2TemplateSpec.canvasWidth,
    Math.max(1, Math.round(displayWidth * (window.devicePixelRatio || 1))),
  );
  const pixelHeight = Math.round(pixelWidth * ake2TemplateSpec.canvasHeight / ake2TemplateSpec.canvasWidth);

  useEffect(() => {
    const request = requestAnimationFrame(() => {
      const context = canvasRef.current?.getContext("2d");
      if (!context) {
        onError("当前浏览器无法创建画布，请更换浏览器重试。");
        return;
      }
      try {
        drawAke2Frame(context, form, resources);
      } catch {
        onError("预览绘制失败，请刷新页面重试。");
      }
    });
    return () => cancelAnimationFrame(request);
  }, [form, resources, pixelWidth, pixelHeight, onError]);

  useEffect(() => {
    dragRef.current = null;
    setDragging(false);
  }, [form.image?.url, form.scale, displayWidth]);

  const getPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * ake2TemplateSpec.canvasWidth / rect.width,
      y: (event.clientY - rect.top) * ake2TemplateSpec.canvasHeight / rect.height,
    };
  };

  const finishDrag = (event: PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={pixelWidth}
      height={pixelHeight}
      className="block h-auto w-full"
      style={{
        height: displayWidth * ake2TemplateSpec.canvasHeight / ake2TemplateSpec.canvasWidth,
        touchAction: form.image ? "none" : "pan-y",
        cursor: form.image ? (dragging ? "grabbing" : "grab") : "default",
      }}
      role="img"
      aria-label="明日方舟精二海报预览"
      aria-description={form.image ? "拖动立绘调整位置，使用缩放滑块调整大小。聚焦后可用方向键微调，Shift 加方向键快速移动。" : undefined}
      tabIndex={form.image ? 0 : undefined}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        const image = getAke2ImageLayout(form);
        const point = getPoint(event);
        if (!image || !containsAke2Point(image, point)) return;
        event.preventDefault();
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { pointerId: event.pointerId, start: point, origin: form.imagePosition };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const point = getPoint(event);
        onImagePositionChange({
          x: drag.origin.x + point.x - drag.start.x,
          y: drag.origin.y + point.y - drag.start.y,
        });
      }}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onLostPointerCapture={finishDrag}
      onKeyDown={(event) => {
        if (!form.image) return;
        const offsets: Record<string, Ake2Point> = {
          ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
          ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        };
        const offset = offsets[event.key];
        if (!offset) return;
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        onImagePositionChange({ x: form.imagePosition.x + offset.x * step, y: form.imagePosition.y + offset.y * step });
      }}
    />
  );
}
