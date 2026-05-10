export type NotmecoreCanvasSize = {
  width: number;
  height: number;
};

export type NotmecoreDisplaySize = {
  width: number;
  height: number;
};

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
