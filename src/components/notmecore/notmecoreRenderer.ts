import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { notmecoreTextFontSpec } from "@/components/notmecore/notmecoreConfig";
import { buildNotmecoreLightenGlitchSlices } from "@/components/notmecore/notmecoreLayout";
import { buildNotmecoreTextScatterLayout } from "@/components/notmecore/notmecoreTextLayout";

const notmecoreFontLoadEntries = Object.values(notmecoreTextFontSpec)
  .map((font) => font.fontLoad)
  .filter((font): font is string => Boolean(font));

let notmecoreFontsLoadPromise: Promise<void> | null = null;

export function ensureNotmecoreFontsLoaded() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }

  if (!notmecoreFontsLoadPromise) {
    notmecoreFontsLoadPromise = Promise.all(
      notmecoreFontLoadEntries.map((font) => document.fonts.load(font)),
    ).then(() => undefined);
  }

  return notmecoreFontsLoadPromise;
}

function drawScatterBlocks(
  context: CanvasRenderingContext2D,
  blocks: ReturnType<typeof buildNotmecoreTextScatterLayout>,
  textColor: string,
  textFontFamily: NotmecoreFormState["textFontFamily"],
  textFontSize: number,
) {
  if (blocks.length === 0) {
    return;
  }

  const fontSpec = notmecoreTextFontSpec[textFontFamily];

  context.save();
  context.fillStyle = textColor;
  context.font = `${fontSpec.fontWeight} ${textFontSize}px ${fontSpec.fontFamily}`;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  blocks.forEach((block) => {
    block.characters.forEach((character) => {
      context.fillText(character.value, character.x, character.y);
    });
  });

  context.restore();
}

function buildImageFilter(
  form: Pick<NotmecoreFormState, "saturation" | "contrast" | "brightness">,
) {
  return [
    `saturate(${form.saturation})`,
    `contrast(${form.contrast})`,
    `brightness(${form.brightness})`,
  ].join(" ");
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  if (sourceWidth === 0 || sourceHeight === 0 || width === 0 || height === 0) {
    return;
  }

  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = width / height;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  let cropX = 0;
  let cropY = 0;

  if (sourceAspect > targetAspect) {
    cropWidth = sourceHeight * targetAspect;
    cropX = (sourceWidth - cropWidth) / 2;
  } else {
    cropHeight = sourceWidth / targetAspect;
    cropY = (sourceHeight - cropHeight) / 2;
  }

  context.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    width,
    height,
  );
}

function drawLightenGlitch(
  context: CanvasRenderingContext2D,
  amount: number,
  imageSize: NotmecoreImageSize,
  renderScale: number,
) {
  const slices = buildNotmecoreLightenGlitchSlices(
    imageSize.width,
    imageSize.height,
    amount,
  );

  if (slices.length === 0) {
    return;
  }

  context.save();
  context.scale(renderScale, renderScale);
  context.globalCompositeOperation = "lighten";
  context.imageSmoothingEnabled = false;

  slices.forEach((slice) => {
    context.drawImage(
      context.canvas,
      slice.sourceX * renderScale,
      slice.sourceY * renderScale,
      slice.sliceWidth * renderScale,
      slice.sliceHeight * renderScale,
      slice.destinationX,
      slice.sourceY,
      slice.sliceWidth,
      slice.sliceHeight,
    );
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
    | "backgroundImageUrl"
    | "backgroundColor"
    | "saturation"
    | "contrast"
    | "brightness"
    | "tintColor"
    | "blendOpacity"
    | "lightenGlitchAmount"
    | "text"
    | "textRepeatCount"
    | "textFontFamily"
    | "textFontSize"
    | "textColor"
    | "textLetterSpacing"
    | "textJitterY"
    | "textLayerMode"
    | "textScatterSeed"
  >,
  imageSize: NotmecoreImageSize,
  renderSize: NotmecoreImageSize,
) {
  const [image, backgroundImage] = await Promise.all([
    loadImage(imageUrl),
    form.backgroundImageUrl ? loadImage(form.backgroundImageUrl) : null,
  ]);
  const renderScale = renderSize.width / imageSize.width;

  context.clearRect(0, 0, renderSize.width, renderSize.height);
  context.fillStyle = form.backgroundColor;
  context.fillRect(0, 0, renderSize.width, renderSize.height);

  if (backgroundImage) {
    drawCoverImage(context, backgroundImage, renderSize.width, renderSize.height);
  }

  const scatterBlocks = buildNotmecoreTextScatterLayout({
    canvasWidth: imageSize.width,
    canvasHeight: imageSize.height,
    text: form.text,
    blockCount: form.textRepeatCount,
    fontSize: form.textFontSize,
    letterSpacing: form.textLetterSpacing,
    jitterY: form.textJitterY,
    layerMode: form.textLayerMode,
    seed: form.textScatterSeed,
  });
  const bottomBlocks = scatterBlocks.filter((block) => block.layer === "bottom");
  const topBlocks = scatterBlocks.filter((block) => block.layer === "top");

  context.save();
  context.scale(renderScale, renderScale);
  drawScatterBlocks(
    context,
    bottomBlocks,
    form.textColor,
    form.textFontFamily,
    form.textFontSize,
  );

  context.filter = buildImageFilter(form);
  context.drawImage(image, 0, 0, imageSize.width, imageSize.height);
  context.restore();

  if (form.lightenGlitchAmount > 0) {
    drawLightenGlitch(
      context,
      form.lightenGlitchAmount,
      imageSize,
      renderScale,
    );
  }

  if (form.blendOpacity > 0) {
    context.save();
    context.globalAlpha = form.blendOpacity;
    context.fillStyle = form.tintColor;
    context.fillRect(0, 0, renderSize.width, renderSize.height);
    context.restore();
  }

  context.save();
  context.scale(renderScale, renderScale);
  drawScatterBlocks(
    context,
    topBlocks,
    form.textColor,
    form.textFontFamily,
    form.textFontSize,
  );
  context.restore();
}
