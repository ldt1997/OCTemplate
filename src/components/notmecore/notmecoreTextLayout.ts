export type NotmecoreTextScatterInput = {
  canvasWidth: number;
  canvasHeight: number;
  text: string;
  blockCount: number;
  fontSize: number;
  letterSpacing: number;
  lineSpacing: number;
  jitterY: number;
  layerMode: "random" | "bottom" | "top";
  seed: number;
};

export type NotmecoreScatterCharacter = {
  value: string;
  x: number;
  y: number;
};

export type NotmecoreScatterBlock = {
  layer: "bottom" | "top";
  characters: NotmecoreScatterCharacter[];
};

const notmecoreTextWrapWidthRatio = 0.8;

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function estimateGlyphAdvance(fontSize: number, letterSpacing: number) {
  return fontSize * 0.62 + letterSpacing;
}

function estimateLineWidth(
  line: string,
  fontSize: number,
  letterSpacing: number,
) {
  if (line.length === 0) {
    return 0;
  }

  return line.length * fontSize * 0.62 + (line.length - 1) * letterSpacing;
}

function sanitizeLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function wrapLineByEstimatedWidth(
  line: string,
  maxLineWidth: number,
  fontSize: number,
  letterSpacing: number,
) {
  if (line.length === 0 || maxLineWidth <= 0) {
    return [];
  }

  const wrappedLines: string[] = [];
  let currentLine = "";
  let currentWidth = 0;

  Array.from(line).forEach((character) => {
    const nextWidth =
      currentLine.length === 0
        ? fontSize * 0.62
        : estimateGlyphAdvance(fontSize, letterSpacing);

    if (currentLine.length > 0 && currentWidth + nextWidth > maxLineWidth) {
      wrappedLines.push(currentLine);
      currentLine = character;
      currentWidth = fontSize * 0.62;
      return;
    }

    currentLine += character;
    currentWidth += nextWidth;
  });

  if (currentLine.length > 0) {
    wrappedLines.push(currentLine);
  }

  return wrappedLines;
}

function buildWrappedLines(
  text: string,
  canvasWidth: number,
  fontSize: number,
  letterSpacing: number,
) {
  const maxLineWidth = Math.max(
    fontSize,
    canvasWidth * notmecoreTextWrapWidthRatio,
  );

  return sanitizeLines(text).flatMap((line) =>
    wrapLineByEstimatedWidth(line, maxLineWidth, fontSize, letterSpacing),
  );
}

export function buildNotmecoreTextScatterLayout(
  input: NotmecoreTextScatterInput,
): NotmecoreScatterBlock[] {
  const lines = buildWrappedLines(
    input.text,
    input.canvasWidth,
    input.fontSize,
    input.letterSpacing,
  );
  if (
    lines.length === 0 ||
    input.canvasWidth <= 0 ||
    input.canvasHeight <= 0 ||
    input.blockCount <= 0
  ) {
    return [];
  }

  const lineHeight = input.fontSize + input.lineSpacing;
  const blockHeight =
    lines.length * input.fontSize +
    Math.max(0, lines.length - 1) * input.lineSpacing;
  const blockWidth = Math.max(
    ...lines.map((line) =>
      estimateLineWidth(line, input.fontSize, input.letterSpacing),
    ),
  );
  const overflowX = blockWidth * 0.35;
  const overflowY = blockHeight * 0.25;
  const minX = -overflowX;
  const maxX = Math.max(minX, input.canvasWidth - blockWidth + overflowX);
  const minY = -overflowY;
  const maxY = Math.max(minY, input.canvasHeight - blockHeight + overflowY);
  const random = createSeededRandom(input.seed);

  return Array.from({ length: input.blockCount }, () => {
    const originX = minX + (maxX - minX) * random();
    const originY = minY + (maxY - minY) * random();
    const layer =
      input.layerMode === "random"
        ? random() < 0.5
          ? "bottom"
          : "top"
        : input.layerMode;
    const characters: NotmecoreScatterCharacter[] = [];

    lines.forEach((line, lineIndex) => {
      const baselineY = originY + lineIndex * lineHeight + input.fontSize;

      Array.from(line).forEach((character, charIndex) => {
        const jitterOffset = (random() * 2 - 1) * input.jitterY;
        characters.push({
          value: character,
          x:
            originX +
            charIndex *
              estimateGlyphAdvance(input.fontSize, input.letterSpacing),
          y: baselineY + jitterOffset,
        });
      });
    });

    return { layer, characters };
  });
}
