import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { drawNotmecoreFrame } from "@/components/notmecore/notmecoreRenderer";

export async function exportNotmecoreImage(
  form: NotmecoreFormState,
  imageSize: NotmecoreImageSize,
) {
  if (!form.imageUrl) {
    throw new Error("请先上传图片。");
  }

  const canvas = document.createElement("canvas");
  canvas.width = imageSize.width;
  canvas.height = imageSize.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("当前环境不支持导出画布。");
  }

  await drawNotmecoreFrame(context, form.imageUrl, form, imageSize);

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
