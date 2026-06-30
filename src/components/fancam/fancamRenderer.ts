import type { FancamFormState } from "@/components/fancam/fancamConfig";
import { fancamTemplateSpec } from "@/components/fancam/fancamConfig";
import {
  getCharacterRenderRect,
  getCoverImageRect,
  type FancamRect,
} from "@/components/fancam/fancamLayout";
import {
  loadFancamEffectImage,
  loadFancamImage,
  loadFancamTemplateImage,
} from "@/components/fancam/fancamResources";

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  target: FancamRect,
) {
  const source = getCoverImageRect(image, target);

  context.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    target.x,
    target.y,
    target.width,
    target.height,
  );
}

function drawFullImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
) {
  const layer = fancamTemplateSpec.layers.full;
  context.drawImage(image, layer.x, layer.y, layer.width, layer.height);
}

function drawCharacter(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  form: FancamFormState,
) {
  const layer = fancamTemplateSpec.layers.full;
  const rect = getCharacterRenderRect(image, form);

  context.save();
  context.beginPath();
  context.rect(layer.x, layer.y, layer.width, layer.height);
  context.clip();
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  context.restore();
}

function drawTextWithStyle(
  context: CanvasRenderingContext2D,
  text: string,
  layer: {
    x: number;
    y: number;
    fontSize: number;
    font: "chironMedium" | "chironBold";
    letterSpacingRatio?: number;
  },
) {
  const textLayer = fancamTemplateSpec.layers.mbcText;
  const font = fancamTemplateSpec.fonts[layer.font];

  context.save();
  context.font = `${layer.font === "chironBold" ? 700 : 500} ${layer.fontSize}px ${font.family}`;
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillStyle = textLayer.fillColor;
  context.strokeStyle = textLayer.strokeColor;
  context.lineWidth = textLayer.strokeWidth;
  context.shadowColor = textLayer.shadowColor;
  context.shadowBlur = textLayer.shadowBlur;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  if (!layer.letterSpacingRatio) {
    context.strokeText(text, layer.x, layer.y);
    context.fillText(text, layer.x, layer.y);
    context.restore();
    return;
  }

  const characters = Array.from(text);
  const letterSpacing = layer.fontSize * layer.letterSpacingRatio;
  let currentX = layer.x;

  characters.forEach((character) => {
    context.strokeText(character, currentX, layer.y);
    context.fillText(character, currentX, layer.y);
    currentX += context.measureText(character).width + letterSpacing;
  });

  context.restore();
}

function drawMbcText(context: CanvasRenderingContext2D, form: FancamFormState) {
  const textLayer = fancamTemplateSpec.layers.mbcText;

  drawTextWithStyle(context, form.groupName, textLayer.groupName);
  drawTextWithStyle(context, form.memberName, textLayer.memberName);
  drawTextWithStyle(context, form.songName, textLayer.songName);
}

export async function drawFancamFrame(
  context: CanvasRenderingContext2D,
  form: FancamFormState,
) {
  const fullLayer = fancamTemplateSpec.layers.full;
  context.clearRect(0, 0, fullLayer.width, fullLayer.height);
  context.fillStyle = form.backgroundColor;
  context.fillRect(fullLayer.x, fullLayer.y, fullLayer.width, fullLayer.height);

  if (form.backgroundUrl) {
    const backgroundImage = await loadFancamImage(form.backgroundUrl);
    if (form.backgroundCrop) {
      context.drawImage(
        backgroundImage,
        form.backgroundCrop.x,
        form.backgroundCrop.y,
        form.backgroundCrop.width,
        form.backgroundCrop.height,
        fullLayer.x,
        fullLayer.y,
        fullLayer.width,
        fullLayer.height,
      );
    } else {
      drawCoverImage(context, backgroundImage, fullLayer);
    }
  }

  const effectImageRequest = loadFancamEffectImage(form.effect);
  if (effectImageRequest) {
    drawFullImage(context, await effectImageRequest);
  }

  if (form.characterUrl) {
    const characterImage = await loadFancamImage(form.characterUrl);
    drawCharacter(context, characterImage, form);
  }

  const templateImage = await loadFancamTemplateImage(form.template);
  drawFullImage(context, templateImage);

  if (form.template === "mbc") {
    drawMbcText(context, form);
  }
}
