import {
  akRecruitAssets,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  getImageLayout,
  organizationAssetMap,
  professionAssetMap,
  akRecruitTemplateSpec,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";

const NAME_FONT = `${akRecruitTemplateSpec.nameFontSize}px "Source Han Serif CN"`;
const EN_NAME_FONT = `${akRecruitTemplateSpec.enNameFontSize}px "Novecento Wide"`;
const INTRO_FONT = `${akRecruitTemplateSpec.introFontSize}px "Source Han Sans TW", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`;
const INTRO_FONT_LOAD = `${akRecruitTemplateSpec.introFontSize}px "Source Han Sans TW"`;

let recruitFontsReadyPromise: Promise<void> | null = null;

type RecruitInfoLayout = {
  blockLeft: number;
  blockWidth: number;
  starsLeft: number;
  rowTop: number;
  textLeft: number;
};

const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");

function getFontPixelSize(font: string) {
  const match = font.match(/(\d+(?:\.\d+)?)px/);
  return match ? Number(match[1]) : 0;
}

function measureTextWidth(text: string, font: string) {
  if (!measureContext) {
    return 0;
  }

  measureContext.font = font;
  return measureContext.measureText(text || " ").width;
}

function drawTopAlignedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  topY: number,
  font: string,
) {
  ctx.save();
  ctx.font = font;
  ctx.textBaseline = "alphabetic";

  const metrics = ctx.measureText(text || " ");
  const fallbackAscent = getFontPixelSize(font) * 0.88;
  const ascent = metrics.actualBoundingBoxAscent || fallbackAscent;
  const baselineY = topY + ascent;

  ctx.strokeText(text, x, baselineY);
  ctx.fillText(text, x, baselineY);
  ctx.restore();
}

export async function loadImage(src: string) {
  return loadImageWithLabel(src, src);
}

export async function loadImageWithLabel(src: string, label: string) {
  const image = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`图片加载失败: ${label}`));
    };
    image.src = src;

    if (image.complete && image.naturalWidth > 0) {
      resolve(image);
    }
  });
}

export async function ensureRecruitFontsLoaded() {
  if (!recruitFontsReadyPromise) {
    recruitFontsReadyPromise = Promise.all([
      document.fonts.load(NAME_FONT),
      document.fonts.load(EN_NAME_FONT),
      document.fonts.load(INTRO_FONT_LOAD),
    ]).then(() => undefined);
  }

  await recruitFontsReadyPromise;
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

export async function exportRecruitImage(form: RecruitFormState) {
  const [background, organizationMark, starMark] = await Promise.all([
    loadImageWithLabel(akRecruitAssets.bgImage, "背景图"),
    loadImageWithLabel(organizationAssetMap[form.organization], "组织标识"),
    loadImageWithLabel(akRecruitAssets.starImage, "星标"),
  ]);
  const professionMark = form.profession
    ? await loadImageWithLabel(professionAssetMap[form.profession], "职业标识")
    : null;
  const uploadedImage = form.imageUrl
    ? await loadImageWithLabel(form.imageUrl, "上传图片")
    : null;

  await ensureRecruitFontsLoaded();

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("当前环境不支持导出画布。");
  }

  const infoLayout = getRecruitInfoLayout(form);
  const introLines = wrapRecruitIntroLines(form.intro);
  ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(
    organizationMark,
    akRecruitTemplateSpec.organizationLeft,
    akRecruitTemplateSpec.organizationTop,
    akRecruitTemplateSpec.organizationWidth,
    (organizationMark.height / organizationMark.width) *
      akRecruitTemplateSpec.organizationWidth,
  );

  if (uploadedImage) {
    const layout = getImageLayout(
      uploadedImage.width,
      uploadedImage.height,
      form.imageScale,
      form.imageOffsetX,
      form.imageOffsetY,
    );
    ctx.drawImage(
      uploadedImage,
      layout.imageX,
      layout.imageY,
      layout.imageWidth,
      layout.imageHeight,
    );
  }

  for (let index = 0; index < form.rarity; index += 1) {
    const currentX =
      infoLayout.starsLeft +
      index *
        (akRecruitTemplateSpec.starSize - akRecruitTemplateSpec.starOverlap);
    ctx.drawImage(
      starMark,
      currentX,
      akRecruitTemplateSpec.infoTop,
      akRecruitTemplateSpec.starSize,
      akRecruitTemplateSpec.starSize,
    );
  }

  if (professionMark) {
    const professionHeight =
      (professionMark.height / professionMark.width) *
      akRecruitTemplateSpec.professionWidth;
    ctx.drawImage(
      professionMark,
      infoLayout.blockLeft,
      infoLayout.rowTop + akRecruitTemplateSpec.professionTopOffset,
      akRecruitTemplateSpec.professionWidth,
      professionHeight,
    );
  }

  ctx.lineJoin = "round";
  ctx.strokeStyle = akRecruitTemplateSpec.textStrokeColor;
  ctx.fillStyle = akRecruitTemplateSpec.textColor;

  if (form.name) {
    ctx.lineWidth = akRecruitTemplateSpec.textStrokeWidth;
    drawTopAlignedText(
      ctx,
      form.name,
      infoLayout.textLeft,
      infoLayout.rowTop,
      NAME_FONT,
    );
  }

  if (form.enName) {
    const exportEnName = akRecruitTemplateSpec.enNameUppercase
      ? form.enName.toUpperCase()
      : form.enName;
    ctx.lineWidth = akRecruitTemplateSpec.textStrokeWidth;
    drawTopAlignedText(
      ctx,
      exportEnName,
      infoLayout.textLeft,
      infoLayout.rowTop + akRecruitTemplateSpec.enNameTopOffset,
      EN_NAME_FONT,
    );
  }

  const gradient = ctx.createLinearGradient(
    0,
    akRecruitTemplateSpec.gradientStartY,
    0,
    akRecruitTemplateSpec.gradientEndY,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.92)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(
    0,
    akRecruitTemplateSpec.gradientTop,
    CANVAS_WIDTH,
    akRecruitTemplateSpec.gradientHeight,
  );

  if (introLines.length > 0) {
    ctx.font = INTRO_FONT;
    ctx.fillStyle = akRecruitTemplateSpec.textColor;
    ctx.textAlign = akRecruitTemplateSpec.introTextAlign;
    ctx.textBaseline = "top";
    const introX = (CANVAS_WIDTH - akRecruitTemplateSpec.introWidth) / 2;
    const introY =
      CANVAS_HEIGHT -
      akRecruitTemplateSpec.introBottom -
      introLines.length * akRecruitTemplateSpec.introLineHeight;

    introLines.forEach((line, index) => {
      ctx.fillText(
        line,
        introX,
        introY + index * akRecruitTemplateSpec.introLineHeight,
      );
    });
  }

  return canvas.toDataURL("image/png");
}
