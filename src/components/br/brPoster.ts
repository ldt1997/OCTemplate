import type { BrFormState } from "@/components/br/brConfig";
import { brTemplateSpec } from "@/components/br/brConfig";
import { ensureBrFontsLoaded } from "@/components/br/brResources";
import { drawBrFrame } from "@/components/br/brRenderer";

export async function exportBrImage(form: BrFormState) {
  const canvas = document.createElement("canvas");
  canvas.width = brTemplateSpec.canvasWidth;
  canvas.height = brTemplateSpec.canvasHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("当前环境不支持导出画布。");
  }

  await ensureBrFontsLoaded();
  await drawBrFrame(context, form);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("导出图片失败。"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}
