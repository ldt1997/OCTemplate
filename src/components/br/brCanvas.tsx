import { useEffect, useRef } from "react";
import type { BrFormState } from "@/components/br/brConfig";
import { brTemplateSpec } from "@/components/br/brConfig";
import type { BrDisplaySize } from "@/components/br/brLayout";
import { drawBrFrame } from "@/components/br/brRenderer";

type BrCanvasProps = {
  form: BrFormState;
  fontsReady: boolean;
  displaySize: BrDisplaySize;
};

export function BrCanvas({ form, fontsReady, displaySize }: BrCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRequestRef = useRef<number | null>(null);
  const drawTokenRef = useRef(0);

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

      void drawBrFrame(context, form).catch((error) => {
        if (!cancelled && drawTokenRef.current === drawToken) {
          console.error("BR 预览绘制失败", error);
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

  return (
    <canvas
      ref={canvasRef}
      width={brTemplateSpec.canvasWidth}
      height={brTemplateSpec.canvasHeight}
      className="block h-auto max-w-none bg-black"
      style={{
        width: `${displaySize.width}px`,
        height: `${displaySize.height}px`,
      }}
    />
  );
}
