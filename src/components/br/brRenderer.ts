import type { BrFormState } from "@/components/br/brConfig";
import { brTemplateSpec } from "@/components/br/brConfig";
import {
  buildBrProfileLayout,
  getCoverImageRect,
  getVerticalNameCharacters,
} from "@/components/br/brLayout";
import {
  loadBrBackgroundImage,
  loadBrImage,
  loadBrSkullImage,
} from "@/components/br/brResources";

let brNoiseCanvas: HTMLCanvasElement | null = null;

type PixelBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function getOpaquePixelBounds(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): PixelBounds | null {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha === 0) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

function createBrNoiseCanvas() {
  const texture = brTemplateSpec.texture;
  const canvas = document.createElement("canvas");
  canvas.width = texture.grainWidth;
  canvas.height = texture.grainHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    return canvas;
  }

  const imageData = context.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let index = 0; index < data.length; index += 4) {
    const isHighlight = Math.random() > 0.55;
    const alpha = Math.random() > 0.45 ? texture.grainPixelAlpha : 0;

    data[index] = isHighlight ? 210 : 36;
    data[index + 1] = isHighlight ? 190 : 12;
    data[index + 2] = isHighlight ? 170 : 8;
    data[index + 3] = alpha;
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
}

function getBrNoiseCanvas() {
  if (!brNoiseCanvas) {
    brNoiseCanvas = createBrNoiseCanvas();
  }

  return brNoiseCanvas;
}

function drawGlobalGrain(
  context: CanvasRenderingContext2D,
  grainLevel: BrFormState["grainLevel"],
) {
  const grainAlpha = brTemplateSpec.texture.grainAlphaByLevel[grainLevel];
  if (grainAlpha <= 0) {
    return;
  }

  const noiseCanvas = getBrNoiseCanvas();

  context.save();
  context.imageSmoothingEnabled = false;
  context.globalAlpha = grainAlpha;
  context.globalCompositeOperation = "source-over";
  context.drawImage(
    noiseCanvas,
    0,
    0,
    brTemplateSpec.canvasWidth,
    brTemplateSpec.canvasHeight,
  );
  context.restore();
}

function renderJapaneseNameToCanvas(
  characters: string[],
  layer: typeof brTemplateSpec.layers.name,
) {
  const padding = layer.fontSize;
  const rawLineHeight = layer.fontSize * 0.93;
  const estimatedWidth = layer.fontSize * 2 + padding * 2;
  const estimatedHeight =
    characters.length * rawLineHeight +
    Math.max(0, characters.length - 1) * layer.characterGap +
    padding * 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(estimatedWidth);
  canvas.height = Math.ceil(estimatedHeight);
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = brTemplateSpec.colors.white;
  context.font = `400 ${layer.fontSize}px ${brTemplateSpec.fonts.mochiy.family}`;
  context.textAlign = "center";
  context.textBaseline = "top";

  characters.forEach((character, index) => {
    context.fillText(
      character,
      canvas.width / 2,
      padding + index * (rawLineHeight + layer.characterGap),
    );
  });

  return { canvas, context };
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  target: { x: number; y: number; width: number; height: number },
) {
  const source = getCoverImageRect(image, target);

  context.save();
  context.beginPath();
  context.rect(target.x, target.y, target.width, target.height);
  context.clip();
  context.drawImage(image, source.x, source.y, source.width, source.height);
  context.restore();
}

function drawJustifiedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
) {
  const characters = Array.from(text);

  if (characters.length <= 1) {
    context.fillText(text, x, y);
    return;
  }

  const textWidth = context.measureText(text).width;
  const gap = Math.max(0, (width - textWidth) / (characters.length - 1));
  let currentX = x;

  characters.forEach((character) => {
    context.fillText(character, currentX, y);
    currentX += context.measureText(character).width + gap;
  });
}

function drawCenteredText(
  context: CanvasRenderingContext2D,
  text: string,
  rect: { x: number; y: number; width: number; height: number },
) {
  context.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);
}

function drawPhoto(context: CanvasRenderingContext2D, form: BrFormState) {
  const photo = brTemplateSpec.layers.photo;

  context.save();
  context.fillStyle = form.backgroundColor;
  context.fillRect(photo.x, photo.y, photo.width, photo.height);
  context.restore();
}

async function drawUploadedPhoto(
  context: CanvasRenderingContext2D,
  form: BrFormState,
) {
  const photo = brTemplateSpec.layers.photo;

  if (form.imageUrl) {
    const image = await loadBrImage(form.imageUrl);
    if (form.imageCrop) {
      context.drawImage(
        image,
        form.imageCrop.x,
        form.imageCrop.y,
        form.imageCrop.width,
        form.imageCrop.height,
        photo.x,
        photo.y,
        photo.width,
        photo.height,
      );
    } else {
      drawCoverImage(context, image, photo);
    }
  }

  context.save();
  context.strokeStyle = brTemplateSpec.colors.border;
  context.lineWidth = photo.borderWidth;
  context.strokeRect(photo.x, photo.y, photo.width, photo.height);
  context.restore();
}

function drawNumber(context: CanvasRenderingContext2D, number: number) {
  const layer = brTemplateSpec.layers.number;

  context.save();
  context.fillStyle = brTemplateSpec.colors.darkRed;
  context.font = `400 ${layer.fontSize}px ${brTemplateSpec.fonts.tradeWinds.family}`;
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(String(number), layer.x, layer.y);
  context.restore();
}

function drawStatsGrid(
  context: CanvasRenderingContext2D,
  form: BrFormState,
  skullImage: HTMLImageElement,
) {
  const layer = brTemplateSpec.layers.stats;
  const width = layer.labelWidth + layer.valueWidth;
  const height = layer.rowHeight * layer.rows;
  const labelTexts = [
    "Weapon:",
    `Friends ${form.gender.toLowerCase()} pinned:`,
    `${form.gender} was pinned at:`,
  ];
  const valueTexts = [form.weapon, "", form.deathLocation];

  context.save();
  context.strokeStyle = brTemplateSpec.colors.border;
  context.lineWidth = layer.borderWidth;
  context.strokeRect(layer.x, layer.y, width, height);

  for (let row = 1; row < layer.rows; row += 1) {
    const y = layer.y + row * layer.rowHeight;
    context.beginPath();
    context.moveTo(layer.x, y);
    context.lineTo(layer.x + width, y);
    context.stroke();
  }

  context.beginPath();
  context.moveTo(layer.x + layer.labelWidth, layer.y);
  context.lineTo(layer.x + layer.labelWidth, layer.y + height);
  context.stroke();

  context.textBaseline = "middle";

  labelTexts.forEach((label, row) => {
    const rowY = layer.y + row * layer.rowHeight;

    context.font = `700 ${layer.labelFontSize}px ${brTemplateSpec.fonts.aktBold.family}`;
    context.fillStyle = brTemplateSpec.colors.labelRed;
    context.textAlign = "left";
    drawJustifiedText(
      context,
      label,
      layer.x + layer.padding,
      rowY + layer.rowHeight / 2,
      layer.labelWidth - layer.padding * 2,
    );

    context.font = `400 ${layer.valueFontSize}px ${brTemplateSpec.fonts.aktRegular.family}`;
    context.fillStyle = brTemplateSpec.colors.white;
    context.textAlign = "left";

    if (row === 1) {
      const skullY = rowY + (layer.rowHeight - layer.skullHeight) / 2;
      for (let index = 0; index < form.killCount; index += 1) {
        const skullX =
          layer.x +
          layer.labelWidth +
          layer.padding +
          index * (layer.skullWidth + layer.skullGap);
        context.drawImage(
          skullImage,
          skullX,
          skullY,
          layer.skullWidth,
          layer.skullHeight,
        );
      }
      return;
    }

    context.fillText(
      valueTexts[row],
      layer.x + layer.labelWidth + layer.padding,
      rowY + layer.rowHeight / 2,
      layer.valueWidth - layer.padding * 2,
    );
  });

  context.restore();
}

function drawJapaneseName(context: CanvasRenderingContext2D, name: string) {
  const layer = brTemplateSpec.layers.name;
  const characters = getVerticalNameCharacters(name);

  if (characters.length === 0) {
    return;
  }

  const renderedName = renderJapaneseNameToCanvas(characters, layer);
  if (!renderedName) {
    return;
  }

  const bounds = getOpaquePixelBounds(
    renderedName.context,
    renderedName.canvas.width,
    renderedName.canvas.height,
  );

  if (!bounds) {
    return;
  }

  context.save();
  context.beginPath();
  context.rect(layer.x, layer.y, layer.blockWidth, layer.blockHeight);
  context.clip();
  context.drawImage(
    renderedName.canvas,
    bounds.minX,
    bounds.minY,
    bounds.maxX - bounds.minX + 1,
    bounds.maxY - bounds.minY + 1,
    layer.x,
    layer.y,
    layer.blockWidth,
    layer.blockHeight,
  );
  context.restore();
}

function drawEnglishName(context: CanvasRenderingContext2D, englishName: string) {
  const layer = brTemplateSpec.layers.englishName;

  context.save();
  context.translate(layer.x, layer.y);
  context.rotate(Math.PI / 2);
  context.fillStyle = brTemplateSpec.colors.white;
  context.font = `400 ${layer.fontSize}px ${brTemplateSpec.fonts.aktRegular.family}`;
  context.textAlign = "left";
  context.textBaseline = "middle";
  drawJustifiedText(context, englishName, 0, layer.height / 2, layer.width);
  context.restore();
}

function drawTitleBox(
  context: CanvasRenderingContext2D,
  title: string,
  rect: { x: number; y: number; width: number; height: number },
) {
  context.save();
  context.fillStyle = brTemplateSpec.colors.black;
  context.strokeStyle = brTemplateSpec.colors.border;
  context.lineWidth = brTemplateSpec.layers.profile.borderWidth;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
  context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  context.font = `700 ${brTemplateSpec.layers.profile.titleFontSize}px ${brTemplateSpec.fonts.aktBold.family}`;
  context.fillStyle = brTemplateSpec.colors.labelRed;
  context.textAlign = "center";
  context.textBaseline = "middle";
  drawCenteredText(context, title, rect);
  context.restore();
}

function drawProfileText(
  context: CanvasRenderingContext2D,
  lines: ReturnType<typeof buildBrProfileLayout>["movieLines"],
) {
  const profile = brTemplateSpec.layers.profile;
  const textWidth = profile.width - profile.borderWidth * 2 - 4;

  context.save();
  context.fillStyle = brTemplateSpec.colors.white;
  context.font = `400 ${profile.bodyFontSize}px ${brTemplateSpec.fonts.aktRegular.family}`;
  context.textAlign = "left";
  context.textBaseline = "top";

  lines.forEach((line) => {
    if (line.justify) {
      drawJustifiedText(context, line.text, line.x, line.y, textWidth);
      return;
    }

    context.fillText(line.text, line.x, line.y, textWidth);
  });

  context.restore();
}

function drawProfiles(context: CanvasRenderingContext2D, form: BrFormState) {
  const layout = buildBrProfileLayout(
    context,
    form.movieProfile,
    form.novelBackground,
  );

  drawTitleBox(context, "movie", layout.movieTitle);
  drawProfileText(context, layout.movieLines);
  drawTitleBox(context, "novel's back ground", layout.novelTitle);
  drawProfileText(context, layout.novelLines);
}

export async function drawBrFrame(
  context: CanvasRenderingContext2D,
  form: BrFormState,
) {
  const [backgroundImage, skullImage] = await Promise.all([
    loadBrBackgroundImage(),
    loadBrSkullImage(),
  ]);

  context.clearRect(
    0,
    0,
    brTemplateSpec.canvasWidth,
    brTemplateSpec.canvasHeight,
  );
  context.drawImage(
    backgroundImage,
    0,
    0,
    brTemplateSpec.canvasWidth,
    brTemplateSpec.canvasHeight,
  );

  drawNumber(context, form.number);
  drawPhoto(context, form);
  await drawUploadedPhoto(context, form);
  drawStatsGrid(context, form, skullImage);
  drawJapaneseName(context, form.name);
  drawEnglishName(context, form.englishName);
  drawProfiles(context, form);
  drawGlobalGrain(context, form.grainLevel);
}
