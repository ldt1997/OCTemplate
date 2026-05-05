import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  getBaseImageLayout,
  logoAssetMap,
  luoxiaoheiAssets,
  luoxiaoheiTemplateSpec,
  type LuoxiaoheiFormState,
} from "@/components/luoxiaohei/luoxiaoheiConfig";
import { hexToRgbTuple } from "@/lib/chtColor";

const TITLE_FONT = `${luoxiaoheiTemplateSpec.titleFontSize}px "Source Han Serif CN Light"`;
const COLOR_META_FONT = `${luoxiaoheiTemplateSpec.colorMetaFontSize}px Roboto, Arial, sans-serif`;
const NAME_FONT = `${luoxiaoheiTemplateSpec.nameFontSize}px "Source Han Serif CN Light"`;
const TITLE_FONT_LOAD = `${luoxiaoheiTemplateSpec.titleFontSize}px "Source Han Serif CN Light"`;
const NAME_FONT_LOAD = `${luoxiaoheiTemplateSpec.nameFontSize}px "Source Han Serif CN Light"`;

let luoxiaoheiFontsReadyPromise: Promise<void> | null = null;

export type ImageRenderLayout = {
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
};

export type LuoxiaoheiPosterLayout = {
  leftBlock: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rightBlock: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  logo: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nameFrame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export async function loadImage(src: string) {
  return loadImageWithLabel(src, src);
}

export async function loadImageWithLabel(src: string, label: string) {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`图片加载失败: ${label}`));
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      resolve(image);
    }
  });
}

export async function ensureLuoxiaoheiFontsLoaded() {
  if (!luoxiaoheiFontsReadyPromise) {
    luoxiaoheiFontsReadyPromise = Promise.all([
      document.fonts.load(TITLE_FONT_LOAD),
      document.fonts.load(NAME_FONT_LOAD),
    ]).then(() => undefined);
  }

  await luoxiaoheiFontsReadyPromise;
}

export function formatRgbLabel(hex: string) {
  const [red, green, blue] = hexToRgbTuple(hex);
  return `RGB ${red} ${green} ${blue}`;
}

export function formatHueLabel(hex: string) {
  return hex.trim().replace("#", "").toLowerCase();
}

export function getPosterLayout(): LuoxiaoheiPosterLayout {
  return {
    leftBlock: {
      x: 0,
      y: 0,
      width: luoxiaoheiTemplateSpec.colorBlockWidth,
      height: CANVAS_HEIGHT,
    },
    rightBlock: {
      x: luoxiaoheiTemplateSpec.colorBlockWidth,
      y: 0,
      width: luoxiaoheiTemplateSpec.colorBlockWidth,
      height: CANVAS_HEIGHT,
    },
    logo: {
      x: (CANVAS_WIDTH - luoxiaoheiTemplateSpec.logoWidth) / 2,
      y:
        CANVAS_HEIGHT -
        luoxiaoheiTemplateSpec.logoBottom -
        luoxiaoheiTemplateSpec.logoHeight,
      width: luoxiaoheiTemplateSpec.logoWidth,
      height: luoxiaoheiTemplateSpec.logoHeight,
    },
    nameFrame: {
      x: luoxiaoheiTemplateSpec.nameFrameLeft,
      y: luoxiaoheiTemplateSpec.nameFrameTop,
      width: luoxiaoheiTemplateSpec.nameFrameWidth,
      height: luoxiaoheiTemplateSpec.nameFrameHeight,
    },
  };
}

export function getImageRenderLayout(
  imageWidth: number,
  imageHeight: number,
  imageScale: number,
  imageOffsetX: number,
  imageOffsetY: number,
): ImageRenderLayout {
  const baseLayout = getBaseImageLayout(imageWidth, imageHeight);
  if (!baseLayout) {
    return {
      imageWidth: 0,
      imageHeight: 0,
      imageX: 0,
      imageY: 0,
    };
  }

  const nextWidth = baseLayout.baseWidth * imageScale;
  const nextHeight = baseLayout.baseHeight * imageScale;

  return {
    imageWidth: nextWidth,
    imageHeight: nextHeight,
    imageX:
      baseLayout.baseX + imageOffsetX - (nextWidth - baseLayout.baseWidth) / 2,
    imageY:
      baseLayout.baseY +
      imageOffsetY -
      (nextHeight - baseLayout.baseHeight) / 2,
  };
}

function drawVerticalTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  color: string,
) {
  ctx.save();
  ctx.font = TITLE_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  [...text].forEach((char, index) => {
    ctx.fillText(
      char,
      x,
      startY + index * luoxiaoheiTemplateSpec.titleLineHeight,
    );
  });

  ctx.restore();
}

function drawMetaText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign,
) {
  ctx.save();
  ctx.font = COLOR_META_FONT;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawVerticalName(
  ctx: CanvasRenderingContext2D,
  text: string,
  frame: LuoxiaoheiPosterLayout["nameFrame"],
) {
  ctx.save();
  ctx.font = NAME_FONT;
  ctx.fillStyle = "#111111";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const maxChars = Math.max(
    1,
    Math.floor(
      (frame.height - luoxiaoheiTemplateSpec.nameFrameTextTop * 2) /
        luoxiaoheiTemplateSpec.nameFrameTextLineHeight,
    ),
  );
  const displayText = (text || " ").slice(0, maxChars);
  const textX =
    frame.x +
    frame.width -
    luoxiaoheiTemplateSpec.nameFrameTextRight -
    luoxiaoheiTemplateSpec.nameFontSize;
  const textY = frame.y + luoxiaoheiTemplateSpec.nameFrameTextTop;

  [...displayText].forEach((char, index) => {
    ctx.fillText(
      char,
      textX,
      textY + index * luoxiaoheiTemplateSpec.nameFrameTextLineHeight,
    );
  });
  ctx.restore();
}

function fillGradientBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  width: number,
  color: string,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, color);
  gradient.addColorStop(luoxiaoheiTemplateSpec.gradientStop, color);
  gradient.addColorStop(1, "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, 0, width, CANVAS_HEIGHT);
}

export async function exportLuoxiaoheiImage(form: LuoxiaoheiFormState) {
  const [bamboo, nameframe, logo, uploadedImage] = await Promise.all([
    loadImageWithLabel(luoxiaoheiAssets.bambooImage, "竹子背景"),
    loadImageWithLabel(luoxiaoheiAssets.nameframeImage, "姓名牌"),
    loadImageWithLabel(logoAssetMap[form.logoColor], "罗小黑 LOGO"),
    form.imageUrl ? loadImageWithLabel(form.imageUrl, "上传图片") : null,
  ]);

  await ensureLuoxiaoheiFontsLoaded();

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("当前环境不支持导出画布。");
  }

  const layout = getPosterLayout();
  fillGradientBlock(
    context,
    layout.leftBlock.x,
    layout.leftBlock.width,
    form.bgColor1,
  );
  fillGradientBlock(
    context,
    layout.rightBlock.x,
    layout.rightBlock.width,
    form.bgColor2,
  );

  context.drawImage(bamboo, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (uploadedImage) {
    const imageLayout = getImageRenderLayout(
      uploadedImage.width,
      uploadedImage.height,
      form.imageScale,
      form.imageOffsetX,
      form.imageOffsetY,
    );

    context.drawImage(
      uploadedImage,
      imageLayout.imageX,
      imageLayout.imageY,
      imageLayout.imageWidth,
      imageLayout.imageHeight,
    );
  }

  const leftMetaColor = form.bgColor2;
  const rightMetaColor = form.bgColor1;
  const leftTitleHeight =
    [...form.titleLeft].length * luoxiaoheiTemplateSpec.titleLineHeight;
  const leftTitleX = luoxiaoheiTemplateSpec.titlePaddingSide;
  const leftTitleY = luoxiaoheiTemplateSpec.leftTextTop;

  drawVerticalTitle(
    context,
    form.titleLeft,
    leftTitleX,
    leftTitleY,
    leftMetaColor,
  );
  drawMetaText(
    context,
    formatRgbLabel(form.bgColor1),
    leftTitleX,
    leftTitleY +
      leftTitleHeight +
      luoxiaoheiTemplateSpec.titleMetaGap,
    leftMetaColor,
    "left",
  );
  drawMetaText(
    context,
    formatHueLabel(form.bgColor1),
    leftTitleX,
    leftTitleY +
      leftTitleHeight +
      luoxiaoheiTemplateSpec.titleMetaGap +
      luoxiaoheiTemplateSpec.colorMetaLineHeight +
      luoxiaoheiTemplateSpec.colorMetaGap,
    leftMetaColor,
    "left",
  );

  const rightTitleHeight =
    [...form.titleRight].length * luoxiaoheiTemplateSpec.titleLineHeight;
  const rightTitleX = CANVAS_WIDTH - luoxiaoheiTemplateSpec.titlePaddingSide;
  const rightTitleY = luoxiaoheiTemplateSpec.rightTextTop;

  drawVerticalTitle(
    context,
    form.titleRight,
    rightTitleX - luoxiaoheiTemplateSpec.titleFontSize,
    rightTitleY,
    rightMetaColor,
  );
  drawMetaText(
    context,
    formatRgbLabel(form.bgColor2),
    rightTitleX,
    rightTitleY +
      rightTitleHeight +
      luoxiaoheiTemplateSpec.titleMetaGap,
    rightMetaColor,
    "right",
  );
  drawMetaText(
    context,
    formatHueLabel(form.bgColor2),
    rightTitleX,
    rightTitleY +
      rightTitleHeight +
      luoxiaoheiTemplateSpec.titleMetaGap +
      luoxiaoheiTemplateSpec.colorMetaLineHeight +
      luoxiaoheiTemplateSpec.colorMetaGap,
    rightMetaColor,
    "right",
  );

  context.drawImage(
    nameframe,
    layout.nameFrame.x,
    layout.nameFrame.y,
    layout.nameFrame.width,
    layout.nameFrame.height,
  );
  drawVerticalName(context, form.name, layout.nameFrame);

  context.drawImage(
    logo,
    layout.logo.x,
    layout.logo.y,
    layout.logo.width,
    layout.logo.height,
  );

  return canvas.toDataURL("image/png");
}
