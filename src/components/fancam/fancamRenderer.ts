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

function getTopAlignedBaselineY(
  context: CanvasRenderingContext2D,
  text: string,
  topY: number,
  fontSize: number,
) {
  const metrics = context.measureText(text || " ");
  const fallbackAscent = fontSize * 0.88;
  const ascent = metrics.actualBoundingBoxAscent || fallbackAscent;

  return topY + ascent;
}

function drawTextWithStyle(
  context: CanvasRenderingContext2D,
  text: string,
  layer: {
    x: number;
    y: number;
    fontSize: number;
    font: "chironMedium" | "chironBold" | "chironHei";
    fontWeight?: number;
    letterSpacingRatio?: number;
  },
  style: {
    fillColor: string;
    strokeColor?: string;
    strokeWidth?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
  },
) {
  const font = fancamTemplateSpec.fonts[layer.font];
  const fontWeight =
    layer.fontWeight ?? (layer.font === "chironBold" ? 700 : 500);

  context.save();
  context.font = `${fontWeight} ${layer.fontSize}px ${font.family}`;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillStyle = style.fillColor;
  context.strokeStyle = style.strokeColor ?? "transparent";
  context.lineWidth = style.strokeWidth ?? 0;
  context.shadowColor = style.shadowColor ?? "transparent";
  context.shadowBlur = style.shadowBlur ?? 0;
  context.shadowOffsetX = style.shadowOffsetX ?? 0;
  context.shadowOffsetY = style.shadowOffsetY ?? 0;

  const shouldStroke = (style.strokeWidth ?? 0) > 0;
  const baselineY = getTopAlignedBaselineY(
    context,
    text,
    layer.y,
    layer.fontSize,
  );

  const drawGlyph = (glyph: string, x: number, y: number) => {
    if (shouldStroke) {
      context.strokeText(glyph, x, y);
    }

    context.fillText(glyph, x, y);
  };

  if (!layer.letterSpacingRatio) {
    drawGlyph(text, layer.x, baselineY);
    context.restore();
    return;
  }

  const characters = Array.from(text);
  const letterSpacing = layer.fontSize * layer.letterSpacingRatio;
  let currentX = layer.x;

  characters.forEach((character) => {
    drawGlyph(character, currentX, baselineY);
    currentX += context.measureText(character).width + letterSpacing;
  });

  context.restore();
}

function drawMbcText(context: CanvasRenderingContext2D, form: FancamFormState) {
  const textLayer = fancamTemplateSpec.layers.mbcText;
  const style = {
    fillColor: textLayer.fillColor,
    strokeColor: textLayer.strokeColor,
    strokeWidth: textLayer.strokeWidth,
    shadowColor: textLayer.shadowColor,
    shadowBlur: textLayer.shadowBlur,
  };

  drawTextWithStyle(context, form.groupName, textLayer.groupName, style);
  drawTextWithStyle(context, form.memberName, textLayer.memberName, style);
  drawTextWithStyle(context, form.songName, textLayer.songName, style);
}

function drawSbsText(context: CanvasRenderingContext2D, form: FancamFormState) {
  const textLayer = fancamTemplateSpec.layers.sbsText;
  const style = {
    fillColor: textLayer.fillColor,
  };

  drawTextWithStyle(context, form.memberName, textLayer.memberName, style);
  drawTextWithStyle(context, form.groupName, textLayer.groupName, style);
}

function drawShadowedDivider(
  context: CanvasRenderingContext2D,
  layer: typeof fancamTemplateSpec.layers.mcdText.divider & { width: number },
  style: {
    fillColor: string;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
  },
) {
  context.save();
  context.fillStyle = style.fillColor;
  context.shadowColor = style.shadowColor;
  context.shadowBlur = style.shadowBlur;
  context.shadowOffsetX = style.shadowOffsetX;
  context.shadowOffsetY = style.shadowOffsetY;
  context.fillRect(layer.x, layer.y, layer.width, layer.height);
  context.restore();
}

function measureTextLayerWidth(
  context: CanvasRenderingContext2D,
  text: string,
  layer: {
    fontSize: number;
    font: "chironMedium" | "chironBold" | "chironHei";
    fontWeight?: number;
    letterSpacingRatio?: number;
  },
) {
  const font = fancamTemplateSpec.fonts[layer.font];
  const fontWeight =
    layer.fontWeight ?? (layer.font === "chironBold" ? 700 : 500);

  context.save();
  context.font = `${fontWeight} ${layer.fontSize}px ${font.family}`;

  if (!layer.letterSpacingRatio) {
    const width = context.measureText(text).width;
    context.restore();
    return width;
  }

  const characters = Array.from(text);
  const letterSpacing = layer.fontSize * layer.letterSpacingRatio;
  const width = characters.reduce((total, character, index) => {
    const spacing = index === characters.length - 1 ? 0 : letterSpacing;
    return total + context.measureText(character).width + spacing;
  }, 0);

  context.restore();
  return width;
}

function drawMcdText(context: CanvasRenderingContext2D, form: FancamFormState) {
  const textLayer = fancamTemplateSpec.layers.mcdText;
  const style = {
    fillColor: textLayer.fillColor,
    shadowColor: textLayer.shadowColor,
    shadowBlur: textLayer.shadowBlur,
    shadowOffsetX: textLayer.shadowOffsetX,
    shadowOffsetY: textLayer.shadowOffsetY,
  };
  const dividerWidth = measureTextLayerWidth(
    context,
    form.groupName,
    textLayer.groupName,
  );

  drawTextWithStyle(context, form.groupName, textLayer.groupName, style);
  drawShadowedDivider(
    context,
    { ...textLayer.divider, width: dividerWidth },
    style,
  );
  drawTextWithStyle(context, form.memberName, textLayer.memberName, style);
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
    return;
  }

  if (form.template === "sbs") {
    drawSbsText(context, form);
    return;
  }

  if (form.template === "mcd") {
    drawMcdText(context, form);
  }
}
