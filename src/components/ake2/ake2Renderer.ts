import { ake2TemplateSpec } from "./ake2Config";
import type { Ake2Resources } from "./ake2Resources";

/** 绘制统一使用最终画布坐标；后续海报图层与导出共用此入口。 */
export function drawAke2Frame(
  context: CanvasRenderingContext2D,
  resources: Ake2Resources,
) {
  const { canvasWidth, canvasHeight } = ake2TemplateSpec;
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.scale(context.canvas.width / canvasWidth, context.canvas.height / canvasHeight);
  context.drawImage(resources.background, 0, 0, canvasWidth, canvasHeight);
  context.restore();
}
