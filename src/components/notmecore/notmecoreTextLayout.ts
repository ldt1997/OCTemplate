export type NotmecoreTextScatterInput = {
  canvasWidth: number;
  canvasHeight: number;
  text: string;
  blockCount: number;
  fontSize: number;
  letterSpacing: number;
  lineSpacing: number;
  jitterY: number;
  seed: number;
};

export type NotmecoreScatterCharacter = {
  value: string;
  x: number;
  y: number;
};

export type NotmecoreScatterBlock = {
  characters: NotmecoreScatterCharacter[];
};

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

export function buildNotmecoreTextScatterLayout(
  input: NotmecoreTextScatterInput,
): NotmecoreScatterBlock[] {
  const lines = sanitizeLines(input.text);
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
  const marginX = Math.max(input.fontSize * 1.5, input.canvasWidth * 0.04);
  const marginY = Math.max(input.fontSize * 1.5, input.canvasHeight * 0.04);
  const maxX = Math.max(marginX, input.canvasWidth - marginX - blockWidth);
  const maxY = Math.max(marginY, input.canvasHeight - marginY - blockHeight);
  const random = createSeededRandom(input.seed);

  return Array.from({ length: input.blockCount }, () => {
    const originX = marginX + (maxX - marginX) * random();
    const originY = marginY + (maxY - marginY) * random();
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

    return { characters };
  });
}
