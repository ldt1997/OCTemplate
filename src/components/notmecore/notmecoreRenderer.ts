import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { buildNotmecoreTextScatterLayout } from "@/components/notmecore/notmecoreTextLayout";

const notmecoreTextFontFamily =
  '"Helvetica Neue", Helvetica, Arial, "PingFang SC", sans-serif';

function drawScatterBlocks(
  context: CanvasRenderingContext2D,
  blocks: ReturnType<typeof buildNotmecoreTextScatterLayout>,
  textColor: string,
  textFontSize: number,
) {
  if (blocks.length === 0) {
    return;
  }

  context.save();
  context.fillStyle = textColor;
  context.font = `500 ${textFontSize}px ${notmecoreTextFontFamily}`;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  blocks.forEach((block) => {
    block.characters.forEach((character) => {
      context.fillText(character.value, character.x, character.y);
    });
  });

  context.restore();
}

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
    | "tintColor"
    | "blendOpacity"
    | "text"
    | "textRepeatCount"
    | "textFontSize"
    | "textColor"
    | "textLetterSpacing"
    | "textLineSpacing"
    | "textJitterY"
    | "textLayerMode"
    | "textScatterSeed"
  >,
  imageSize: NotmecoreImageSize,
) {
  const image = await loadImage(imageUrl);

  context.clearRect(0, 0, imageSize.width, imageSize.height);
  context.fillStyle = form.backgroundColor;
  context.fillRect(0, 0, imageSize.width, imageSize.height);

  const scatterBlocks = buildNotmecoreTextScatterLayout({
    canvasWidth: imageSize.width,
    canvasHeight: imageSize.height,
    text: form.text,
    blockCount: form.textRepeatCount,
    fontSize: form.textFontSize,
    letterSpacing: form.textLetterSpacing,
    lineSpacing: form.textLineSpacing,
    jitterY: form.textJitterY,
    layerMode: form.textLayerMode,
    seed: form.textScatterSeed,
  });
  const bottomBlocks = scatterBlocks.filter((block) => block.layer === "bottom");
  const topBlocks = scatterBlocks.filter((block) => block.layer === "top");

  drawScatterBlocks(context, bottomBlocks, form.textColor, form.textFontSize);

  context.save();
  context.filter = `saturate(${form.saturation})`;
  context.drawImage(image, 0, 0, imageSize.width, imageSize.height);
  context.restore();

  if (form.blendOpacity > 0) {
    context.save();
    context.globalAlpha = form.blendOpacity;
    context.fillStyle = form.tintColor;
    context.fillRect(0, 0, imageSize.width, imageSize.height);
    context.restore();
  }

  drawScatterBlocks(context, topBlocks, form.textColor, form.textFontSize);
}
