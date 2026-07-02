import { useEffect, useRef } from "react";
import type { FancamFormState } from "@/components/fancam/fancamConfig";
import { fancamTemplateSpec } from "@/components/fancam/fancamConfig";
import type { FancamDisplaySize } from "@/components/fancam/fancamLayout";
import { drawFancamFrame } from "@/components/fancam/fancamRenderer";

type FancamCanvasProps = {
  form: FancamFormState;
  fontsReady: boolean;
  displaySize: FancamDisplaySize;
  onCharacterDrag: (deltaX: number, deltaY: number) => void;
};

export function FancamCanvas({
  form,
  fontsReady,
  displaySize,
  onCharacterDrag,
}: FancamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRequestRef = useRef<number | null>(null);
  const drawTokenRef = useRef(0);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsReady) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let cancelled = false;
    const drawToken = drawTokenRef.current + 1;
    drawTokenRef.current = drawToken;

    if (drawRequestRef.current !== null) {
      cancelAnimationFrame(drawRequestRef.current);
    }

    drawRequestRef.current = requestAnimationFrame(() => {
      drawRequestRef.current = null;

      void drawFancamFrame(context, form).catch((error) => {
        if (!cancelled && drawTokenRef.current === drawToken) {
          console.error("Fancam 预览绘制失败", error);
        }
      });
    });

    return () => {
      cancelled = true;

      if (drawRequestRef.current !== null) {
        cancelAnimationFrame(drawRequestRef.current);
        drawRequestRef.current = null;
      }
    };
  }, [form, fontsReady]);

  const canvasScale = fancamTemplateSpec.canvasWidth / Math.max(1, displaySize.width);

  return (
    <canvas
      ref={canvasRef}
      width={fancamTemplateSpec.canvasWidth}
      height={fancamTemplateSpec.canvasHeight}
      className="block h-auto max-w-none bg-black select-none touch-none"
      style={{
        width: `${displaySize.width}px`,
        height: `${displaySize.height}px`,
        cursor: form.characterUrl ? "grab" : "default",
      }}
      onPointerDown={(event) => {
        if (!form.characterUrl) {
          return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        dragStartRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        if (!dragStartRef.current) {
          return;
        }

        const nextPointer = { x: event.clientX, y: event.clientY };
        onCharacterDrag(
          (nextPointer.x - dragStartRef.current.x) * canvasScale,
          (nextPointer.y - dragStartRef.current.y) * canvasScale,
        );
        dragStartRef.current = nextPointer;
      }}
      onPointerUp={(event) => {
        dragStartRef.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        dragStartRef.current = null;
      }}
    />
  );
}
