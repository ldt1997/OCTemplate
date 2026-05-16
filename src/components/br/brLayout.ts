import {
  BR_CANVAS_HEIGHT,
  BR_CANVAS_WIDTH,
  brTemplateSpec,
} from "@/components/br/brConfig";

export type BrDisplaySize = {
  width: number;
  height: number;
};

type TextLine = {
  text: string;
  x: number;
  y: number;
  justify: boolean;
};

export type BrProfileLayout = {
  top: number;
  movieTitle: Rect;
  movieBody: Rect;
  novelTitle: Rect;
  novelBody: Rect;
  movieLines: TextLine[];
  novelLines: TextLine[];
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getBrContainDisplaySize(
  availableWidth: number,
  availableHeight: number,
): BrDisplaySize {
  if (availableWidth <= 0 || availableHeight <= 0) {
    return { width: 0, height: 0 };
  }

  const scale = Math.min(
    availableWidth / BR_CANVAS_WIDTH,
    availableHeight / BR_CANVAS_HEIGHT,
    1,
  );

  return {
    width: Math.round(BR_CANVAS_WIDTH * scale),
    height: Math.round(BR_CANVAS_HEIGHT * scale),
  };
}

export function getCoverImageRect(
  image: HTMLImageElement,
  target: Rect,
): Rect {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  const scale = Math.max(target.width / imageWidth, target.height / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;

  return {
    x: target.x + (target.width - width) / 2,
    y: target.y + (target.height - height) / 2,
    width,
    height,
  };
}

export function splitTextToLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  let currentLine = "";

  Array.from(text.trim()).forEach((character) => {
    const candidate = `${currentLine}${character}`;
    if (currentLine && context.measureText(candidate).width > maxWidth) {
      lines.push(currentLine);
      currentLine = character;
      return;
    }

    currentLine = candidate;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function buildBrProfileLayout(
  context: CanvasRenderingContext2D,
  movieProfile: string,
  novelBackground: string,
): BrProfileLayout {
  const spec = brTemplateSpec.layers.profile;
  const bodyTextWidth = spec.width - spec.borderWidth * 2 - 4;
  const title = (y: number): Rect => ({
    x: spec.left,
    y,
    width: spec.width - 2,
    height: spec.titleHeight,
  });
  const body = (y: number, lineCount: number): Rect => ({
    x: spec.left,
    y,
    width: spec.width,
    height: Math.max(
      spec.bodyLineHeight + spec.borderWidth * 2,
      lineCount * spec.bodyLineHeight + spec.borderWidth * 2 + 4,
    ),
  });

  context.save();
  context.font = `400 ${spec.bodyFontSize}px ${brTemplateSpec.fonts.aktRegular.family}`;
  const movieLines = splitTextToLines(context, movieProfile, bodyTextWidth);
  const novelLines = splitTextToLines(context, novelBackground, bodyTextWidth);
  context.restore();

  const movieBodyHeight =
    Math.max(1, movieLines.length) * spec.bodyLineHeight + spec.borderWidth * 2 + 4;
  const novelBodyHeight =
    Math.max(1, novelLines.length) * spec.bodyLineHeight + spec.borderWidth * 2 + 4;
  const totalHeight =
    spec.titleHeight * 2 + movieBodyHeight + novelBodyHeight + spec.gap * 3;
  const top = BR_CANVAS_HEIGHT - spec.bottom - totalHeight;
  const movieTitle = title(top);
  const movieBody = body(movieTitle.y + movieTitle.height + spec.gap, movieLines.length);
  const novelTitle = title(movieBody.y + movieBody.height + spec.gap);
  const novelBody = body(novelTitle.y + novelTitle.height + spec.gap, novelLines.length);
  const lineX = spec.left + spec.borderWidth + 2;

  return {
    top,
    movieTitle,
    movieBody,
    novelTitle,
    novelBody,
    movieLines: movieLines.map((line, index) => ({
      text: line,
      x: lineX,
      y: movieBody.y + spec.borderWidth + 4 + index * spec.bodyLineHeight,
      justify: index < movieLines.length - 1,
    })),
    novelLines: novelLines.map((line, index) => ({
      text: line,
      x: lineX,
      y: novelBody.y + spec.borderWidth + 4 + index * spec.bodyLineHeight,
      justify: index < novelLines.length - 1,
    })),
  };
}

export function getVerticalNameCharacters(name: string) {
  return Array.from(name).slice(0, brTemplateSpec.textLimits.name);
}
