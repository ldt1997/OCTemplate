import type { FancamFormState } from "@/components/fancam/fancamConfig";
import { fancamTemplateSpec } from "@/components/fancam/fancamConfig";
import { drawFancamFrame } from "@/components/fancam/fancamRenderer";
import { ensureFancamFontsLoaded } from "@/components/fancam/fancamResources";

export async function exportFancamImage(form: FancamFormState) {
  const canvas = document.createElement("canvas");
  canvas.width = fancamTemplateSpec.canvasWidth;
  canvas.height = fancamTemplateSpec.canvasHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("当前环境不支持导出画布。");
  }

  await ensureFancamFontsLoaded();
  await drawFancamFrame(context, form);

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
