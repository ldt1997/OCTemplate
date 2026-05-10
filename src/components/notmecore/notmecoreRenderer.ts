import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";

export async function loadImage(src: string) {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`图片加载失败: ${src}`));
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      resolve(image);
    }
  });
}

export async function drawNotmecoreFrame(
  context: CanvasRenderingContext2D,
  imageUrl: string,
  form: Pick<NotmecoreFormState, "backgroundColor" | "saturation">,
  imageSize: NotmecoreImageSize,
) {
  const image = await loadImage(imageUrl);

  context.clearRect(0, 0, imageSize.width, imageSize.height);
  context.fillStyle = form.backgroundColor;
  context.fillRect(0, 0, imageSize.width, imageSize.height);

  context.save();
  context.filter = `saturate(${form.saturation})`;
  context.drawImage(image, 0, 0, imageSize.width, imageSize.height);
  context.restore();
}
