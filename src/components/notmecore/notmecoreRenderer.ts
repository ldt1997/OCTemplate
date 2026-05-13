import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { loadNotmecoreImage } from "@/components/notmecore/notmecoreImageResource";
import { notmecoreTextFontSpec } from "@/components/notmecore/notmecoreConfig";
import { createFilteredImageCanvas } from "@/components/notmecore/notmecoreImageFilters";
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
  form: Pick<NotmecoreFormState, "saturation" | "contrast">,
) {
  return [`saturate(${form.saturation})`, `contrast(${form.contrast})`].join(
    " ",
  );
}

function isMobileCanvasFilterUnsafe() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgentData = (
    navigator as Navigator & { userAgentData?: { mobile?: boolean } }
  ).userAgentData;

  if (userAgentData?.mobile) {
    return true;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function canUseNativeCanvasFilter(context: CanvasRenderingContext2D) {
  if (!("filter" in context) || isMobileCanvasFilterUnsafe()) {
    return false;
  }

  return typeof context.filter === "string";
}

function drawImageWithNativeFilter(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  form: Pick<NotmecoreFormState, "saturation" | "contrast">,
) {
  context.save();
  context.filter = buildImageFilter(form);
  context.drawImage(image, 0, 0, width, height);
  context.restore();
}

function drawImageWithPixelFallback(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  renderSize: NotmecoreImageSize,
  form: Pick<NotmecoreFormState, "saturation" | "contrast">,
) {
  const filteredCanvas = createFilteredImageCanvas(
    image,
    renderSize.width,
    renderSize.height,
    form,
  );

  context.drawImage(filteredCanvas, 0, 0, renderSize.width, renderSize.height);
}

function drawFilteredImageLayer(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  renderSize: NotmecoreImageSize,
  form: Pick<NotmecoreFormState, "saturation" | "contrast">,
) {
  if (canUseNativeCanvasFilter(context)) {
    drawImageWithNativeFilter(context, image, renderSize.width, renderSize.height, form);
    return;
  }

  drawImageWithPixelFallback(context, image, renderSize, form);
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

export async function drawNotmecoreFrame(
  context: CanvasRenderingContext2D,
  imageUrl: string,
  form: Pick<
    NotmecoreFormState,
    | "backgroundImageUrl"
    | "backgroundColor"
    | "saturation"
    | "contrast"
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
    loadNotmecoreImage(imageUrl),
    form.backgroundImageUrl
      ? loadNotmecoreImage(form.backgroundImageUrl)
      : null,
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
  context.restore();

  drawFilteredImageLayer(context, image, renderSize, form);

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
