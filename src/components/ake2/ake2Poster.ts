import { ake2TemplateSpec, type Ake2FormState } from "./ake2Config";
import { getAke2SelectionKey } from "./ake2Layout";
import { drawAke2Frame } from "./ake2Renderer";
import { ensureAke2FontsLoaded, type Ake2Resources } from "./ake2Resources";

export async function exportAke2Image(form: Ake2FormState, resources: Ake2Resources) {
  if (resources.selectionKey !== getAke2SelectionKey(form)) throw new Error("图片资源仍在加载，请稍后再试。");
  await ensureAke2FontsLoaded();
  const canvas = document.createElement("canvas");
  canvas.width = ake2TemplateSpec.canvasWidth;
  canvas.height = ake2TemplateSpec.canvasHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("无法创建导出画布。");
  try {
    drawAke2Frame(context, form, resources);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PNG 生成失败，请重试。"));
      }, "image/png");
    });
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}
