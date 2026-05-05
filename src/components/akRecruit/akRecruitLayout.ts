import {
  akRecruitTemplateSpec,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";

const NAME_FONT = `${akRecruitTemplateSpec.nameFontSize}px "Source Han Serif CN"`;
const EN_NAME_FONT = `${akRecruitTemplateSpec.enNameFontSize}px "Novecento Wide"`;
const INTRO_FONT = `${akRecruitTemplateSpec.introFontSize}px "Source Han Sans TW", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`;

export type ImageRenderLayout = {
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
};

export type BaseImageLayout = {
  baseWidth: number;
  baseHeight: number;
  baseX: number;
  baseY: number;
};

export type RecruitInfoLayout = {
  blockLeft: number;
  blockWidth: number;
  starsLeft: number;
  rowTop: number;
  textLeft: number;
};

export type RecruitIntroLayout = {
  x: number;
  y: number;
  width: number;
};

export type RecruitGradientLayout = {
  top: number;
  height: number;
  previewBackground: string;
};

export type RecruitIntroTextAlign = "left" | "center";

const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");

function measureTextWidth(text: string, font: string) {
  if (!measureContext) {
    return 0;
  }

  measureContext.font = font;
  return measureContext.measureText(text || " ").width;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getBaseImageLayout(
  imageWidth: number,
  imageHeight: number,
): BaseImageLayout | null {
  if (imageWidth === 0 || imageHeight === 0) {
    return null;
  }

  const baseHeight = CANVAS_HEIGHT;
  const baseWidth = (imageWidth / imageHeight) * baseHeight;

  return {
    baseWidth,
    baseHeight,
    baseX: (CANVAS_WIDTH - baseWidth) / 2,
    baseY: (CANVAS_HEIGHT - baseHeight) / 2,
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
  const nextX =
    baseLayout.baseX + imageOffsetX - (nextWidth - baseLayout.baseWidth) / 2;
  const nextY =
    baseLayout.baseY + imageOffsetY - (nextHeight - baseLayout.baseHeight) / 2;

  return {
    imageWidth: nextWidth,
    imageHeight: nextHeight,
    imageX: nextX,
    imageY: nextY,
  };
}

export function getRecruitInfoLayout(
  form: RecruitFormState,
): RecruitInfoLayout {
  const professionWidth = form.profession
    ? akRecruitTemplateSpec.professionWidth
    : 0;
  const professionGap = form.profession
    ? akRecruitTemplateSpec.professionGap
    : 0;
  const starsWidth =
    form.rarity > 0
      ? akRecruitTemplateSpec.starSize * form.rarity -
        akRecruitTemplateSpec.starOverlap * (form.rarity - 1)
      : 0;
  const textColumnWidth = Math.max(
    measureTextWidth(form.name, NAME_FONT),
    measureTextWidth(form.enName?.toUpperCase() || "", EN_NAME_FONT),
  );
  const infoRowWidth = professionWidth + professionGap + textColumnWidth;
  const blockWidth = Math.max(
    starsWidth + akRecruitTemplateSpec.starLeftPadding,
    infoRowWidth,
  );
  const blockLeft = CANVAS_WIDTH / 2 - blockWidth / 2;

  return {
    blockLeft,
    blockWidth,
    starsLeft: blockLeft + akRecruitTemplateSpec.starLeftPadding,
    rowTop:
      akRecruitTemplateSpec.infoTop +
      akRecruitTemplateSpec.starSize +
      akRecruitTemplateSpec.infoGap,
    textLeft: blockLeft + professionWidth + professionGap,
  };
}

export function wrapRecruitIntroLines(text: string) {
  if (!measureContext || !text) {
    return [];
  }

  measureContext.font = INTRO_FONT;
  const lines: string[] = [];
  let currentLine = "";

  for (const char of text) {
    const nextLine = `${currentLine}${char}`;
    if (
      measureContext.measureText(nextLine).width <=
        akRecruitTemplateSpec.introWidth ||
      currentLine.length === 0
    ) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = char;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function getRecruitIntroLayout(lineCount: number): RecruitIntroLayout {
  return {
    x: (CANVAS_WIDTH - akRecruitTemplateSpec.introWidth) / 2,
    y:
      CANVAS_HEIGHT -
      akRecruitTemplateSpec.introBottom -
      lineCount * akRecruitTemplateSpec.introLineHeight,
    width: akRecruitTemplateSpec.introWidth,
  };
}

export function getRecruitGradientLayout(): RecruitGradientLayout {
  const transparentStop =
    ((CANVAS_HEIGHT - akRecruitTemplateSpec.gradientEndY) /
      akRecruitTemplateSpec.gradientHeight) *
    100;

  return {
    top: akRecruitTemplateSpec.gradientTop,
    height: akRecruitTemplateSpec.gradientHeight,
    previewBackground: `linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.92) 19.23%, rgba(0, 0, 0, 0) ${transparentStop}%)`,
  };
}

export function getRecruitIntroTextAlign(
  lineCount: number,
): RecruitIntroTextAlign {
  return lineCount <= 1 ? "center" : "left";
}

export function getRecruitIntroDrawX(
  layout: RecruitIntroLayout,
  textAlign: RecruitIntroTextAlign,
) {
  return textAlign === "center" ? layout.x + layout.width / 2 : layout.x;
}
