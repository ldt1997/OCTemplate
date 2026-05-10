import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { buildNotmecoreTextScatterLayout } from "@/components/notmecore/notmecoreTextLayout";

const notmecoreTextFontFamily =
  '"Helvetica Neue", Helvetica, Arial, "PingFang SC", sans-serif';

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

export async function readImageSize(
  imageUrl: string,
): Promise<NotmecoreImageSize> {
  const image = await loadImage(imageUrl);

  return {
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  };
}

export async function drawNotmecoreFrame(
  context: CanvasRenderingContext2D,
  imageUrl: string,
  form: Pick<
    NotmecoreFormState,
    | "backgroundColor"
    | "saturation"
    | "text"
    | "textRepeatCount"
    | "textFontSize"
    | "textColor"
    | "textLetterSpacing"
    | "textLineSpacing"
    | "textJitterY"
    | "textScatterSeed"
  >,
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

  const scatterBlocks = buildNotmecoreTextScatterLayout({
    canvasWidth: imageSize.width,
    canvasHeight: imageSize.height,
    text: form.text,
    blockCount: form.textRepeatCount,
    fontSize: form.textFontSize,
    letterSpacing: form.textLetterSpacing,
    lineSpacing: form.textLineSpacing,
    jitterY: form.textJitterY,
    seed: form.textScatterSeed,
  });

  if (scatterBlocks.length === 0) {
    return;
  }

  context.save();
  context.fillStyle = form.textColor;
  context.font = `500 ${form.textFontSize}px ${notmecoreTextFontFamily}`;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  scatterBlocks.forEach((block) => {
    block.characters.forEach((character) => {
      context.fillText(character.value, character.x, character.y);
    });
  });

  context.restore();
}
