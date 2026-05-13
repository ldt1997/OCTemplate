import { useEffect, useRef } from "react";
import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import type { NotmecoreDisplaySize } from "@/components/notmecore/notmecoreLayout";
import { drawNotmecoreFrame } from "@/components/notmecore/notmecoreRenderer";

type NotmecoreCanvasProps = {
  form: NotmecoreFormState;
  fontsReady: boolean;
  imageSize: NotmecoreImageSize | null;
  previewRenderSize: NotmecoreImageSize | null;
  displaySize: NotmecoreDisplaySize;
};

export function NotmecoreCanvas({
  form,
  fontsReady,
  imageSize,
  previewRenderSize,
  displaySize,
}: NotmecoreCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRequestRef = useRef<number | null>(null);
  const drawTokenRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsReady || !form.imageUrl || !imageSize || !previewRenderSize) {
      return;
    }
    const imageUrl = form.imageUrl;

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

      void drawNotmecoreFrame(
        context,
        imageUrl,
        form,
        imageSize,
        previewRenderSize,
      ).catch((error) => {
        if (!cancelled && drawTokenRef.current === drawToken) {
          console.error("预览绘制失败", error);
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
  }, [form, fontsReady, imageSize, previewRenderSize]);

  if (!imageSize || !previewRenderSize || !form.imageUrl) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={previewRenderSize.width}
      height={previewRenderSize.height}
      className="block h-auto max-w-none"
      style={{
        width: `${displaySize.width}px`,
        height: `${displaySize.height}px`,
      }}
    />
  );
}
