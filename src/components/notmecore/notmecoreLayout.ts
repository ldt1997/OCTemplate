export type NotmecoreCanvasSize = {
  width: number;
  height: number;
};

export type NotmecoreDisplaySize = {
  width: number;
  height: number;
};

export type NotmecoreLightenGlitchSlice = {
  sourceX: number;
  sourceY: number;
  sliceWidth: number;
  sliceHeight: number;
  destinationX: number;
};

const notmecoreLightenGlitchSeed = 0x4e4f544d;

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function getContainDisplaySize(
  canvasSize: NotmecoreCanvasSize,
  viewportWidth: number,
  viewportHeight: number,
): NotmecoreDisplaySize {
  if (
    canvasSize.width === 0 ||
    canvasSize.height === 0 ||
    viewportWidth === 0 ||
    viewportHeight === 0
  ) {
    return { width: 0, height: 0 };
  }

  const scale = Math.min(
    viewportWidth / canvasSize.width,
    viewportHeight / canvasSize.height,
  );

  return {
    width: canvasSize.width * scale,
    height: canvasSize.height * scale,
  };
}

export function getLightenGlitchMaxAmount(height: number) {
  if (height <= 0) {
    return 0;
  }

  return Math.max(0, Math.round(height / 2));
}

export function buildNotmecoreLightenGlitchSlices(
  canvasWidth: number,
  canvasHeight: number,
  amount: number,
): NotmecoreLightenGlitchSlice[] {
  if (canvasWidth <= 0 || canvasHeight <= 0 || amount <= 0) {
    return [];
  }

  const sliceHeight = canvasHeight / amount;
  const random = createSeededRandom(
    notmecoreLightenGlitchSeed ^ canvasWidth ^ (canvasHeight << 1),
  );

  return Array.from({ length: amount }, (_, index) => {
    const sourceY = index * sliceHeight;
    const sourceX = random() * (canvasWidth / 2);
    const sliceWidth =
      canvasWidth * (0.3 + random() * 0.7);
    const maxDestinationX = Math.max(0, canvasWidth - sliceWidth * 0.4);
    const destinationX = random() * maxDestinationX;

    return {
      sourceX,
      sourceY,
      sliceWidth,
      sliceHeight,
      destinationX,
    };
  });
}
