import type {
  NotmecoreFormState,
  NotmecoreImageSize,
} from "@/components/notmecore/notmecoreConfig";
import { createFilteredImageCanvas } from "@/components/notmecore/notmecoreImageFilters";

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

export function drawNotmecoreFilteredImageLayer(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  renderSize: NotmecoreImageSize,
  form: Pick<NotmecoreFormState, "saturation" | "contrast">,
) {
  if (canUseNativeCanvasFilter(context)) {
    drawImageWithNativeFilter(
      context,
      image,
      renderSize.width,
      renderSize.height,
      form,
    );
    return;
  }

  drawImageWithPixelFallback(context, image, renderSize, form);
}

export function drawNotmecoreCoverImage(
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
