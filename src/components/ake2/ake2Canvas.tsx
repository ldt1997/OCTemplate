import { useEffect, useRef } from "react";
import { ake2TemplateSpec } from "./ake2Config";
import { drawAke2Frame } from "./ake2Renderer";
import type { Ake2Resources } from "./ake2Resources";

type Ake2CanvasProps = {
  displayWidth: number;
  resources: Ake2Resources;
  onError: (message: string) => void;
};

export function Ake2Canvas({ displayWidth, resources, onError }: Ake2CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        drawAke2Frame(context, resources);
      } catch {
        onError("预览绘制失败，请刷新页面重试。");
      }
    });
    return () => cancelAnimationFrame(request);
  }, [resources, pixelWidth, pixelHeight, onError]);

  return (
    <canvas
      ref={canvasRef}
      width={pixelWidth}
      height={pixelHeight}
      className="block h-auto w-full"
      role="img"
      aria-label="明日方舟精二海报背景预览"
    />
  );
}
