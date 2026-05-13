import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { notmecoreTextFontSpec } from "@/components/notmecore/notmecoreConfig";
import { drawNotmecoreCoverImage, drawNotmecoreFilteredImageLayer } from "@/components/notmecore/notmecoreImageDraw";
import { loadNotmecoreImage } from "@/components/notmecore/notmecoreResources";
import { buildNotmecoreLightenGlitchSlices } from "@/components/notmecore/notmecoreLayout";
import { buildNotmecoreTextScatterLayout } from "@/components/notmecore/notmecoreTextLayout";

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
    drawNotmecoreCoverImage(
      context,
      backgroundImage,
      renderSize.width,
      renderSize.height,
    );
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

  drawNotmecoreFilteredImageLayer(context, image, renderSize, form);

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
