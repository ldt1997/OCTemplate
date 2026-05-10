import { useEffect, useRef } from "react";
import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import type { NotmecoreDisplaySize } from "@/components/notmecore/notmecoreLayout";
import { drawNotmecoreFrame } from "@/components/notmecore/notmecoreRenderer";

type NotmecoreCanvasProps = {
  form: NotmecoreFormState;
  imageSize: NotmecoreImageSize | null;
  displaySize: NotmecoreDisplaySize;
};

export function NotmecoreCanvas({
  form,
  imageSize,
  displaySize,
}: NotmecoreCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !form.imageUrl || !imageSize) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let cancelled = false;

    void drawNotmecoreFrame(context, form.imageUrl, form, imageSize).catch(
      (error) => {
        if (!cancelled) {
          console.error("预览绘制失败", error);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [form, imageSize]);

  if (!imageSize || !form.imageUrl) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={imageSize.width}
      height={imageSize.height}
      className="block h-auto max-w-none"
      style={{
        width: `${displaySize.width}px`,
        height: `${displaySize.height}px`,
      }}
    />
  );
}
