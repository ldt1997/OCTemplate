import {
  akRecruitAssets,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  getImageLayout,
  organizationAssetMap,
  professionAssetMap,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";

const NAME_FONT = '120px "Source Han Serif CN"';
const EN_NAME_FONT = '48px "Novecento Wide"';
const INTRO_FONT = '36px "Recruit Intro Sans"';

export const recruitPosterMetrics = {
  organizationLeft: 342,
  organizationTop: 190,
  organizationWidth: 500,
  starSize: 90,
  starOverlap: 35,
  starLeftPadding: 16,
  infoTop: 586,
  infoGap: 18,
  professionWidth: 260,
  professionGap: 4,
  professionTopOffset: 10,
  enNameTopOffset: 132,
  introWidth: 1280,
  introLineHeight: 48,
  introBottom: 36,
  gradientTop: CANVAS_HEIGHT * 0.74,
  gradientHeight: CANVAS_HEIGHT * 0.26,
  gradientStartY: CANVAS_HEIGHT * 0.95,
  gradientEndY: CANVAS_HEIGHT * 0.78,
} as const;

type RecruitInfoLayout = {
  blockLeft: number;
  blockWidth: number;
  starsLeft: number;
  rowTop: number;
  textLeft: number;
};

const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");

function measureTextWidth(text: string, font: string) {
  if (!measureContext) {
    return 0;
  }

  measureContext.font = font;
  return measureContext.measureText(text || " ").width;
}

export async function loadImage(src: string) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  await image.decode();
  return image;
}

export async function ensureRecruitFontsLoaded() {
  await Promise.all([
    document.fonts.load(NAME_FONT),
    document.fonts.load(EN_NAME_FONT),
    document.fonts.load(INTRO_FONT),
  ]);
}

export function getRecruitInfoLayout(form: RecruitFormState): RecruitInfoLayout {
  const professionWidth = form.profession ? recruitPosterMetrics.professionWidth : 0;
  const professionGap = form.profession ? recruitPosterMetrics.professionGap : 0;
  const starsWidth =
    form.rarity > 0
      ? recruitPosterMetrics.starSize * form.rarity -
        recruitPosterMetrics.starOverlap * (form.rarity - 1)
      : 0;
  const textColumnWidth = Math.max(
    measureTextWidth(form.name, NAME_FONT),
    measureTextWidth(form.enName, EN_NAME_FONT),
  );
  const infoRowWidth = professionWidth + professionGap + textColumnWidth;
  const blockWidth = Math.max(
    starsWidth + recruitPosterMetrics.starLeftPadding,
    infoRowWidth,
  );
  const blockLeft = CANVAS_WIDTH / 2 - blockWidth / 2;

  return {
    blockLeft,
    blockWidth,
    starsLeft: blockLeft + recruitPosterMetrics.starLeftPadding,
    rowTop:
      recruitPosterMetrics.infoTop +
      recruitPosterMetrics.starSize +
      recruitPosterMetrics.infoGap,
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
      measureContext.measureText(nextLine).width <= recruitPosterMetrics.introWidth ||
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
    loadImage(akRecruitAssets.bgImage),
    loadImage(organizationAssetMap[form.organization]),
    loadImage(akRecruitAssets.starImage),
  ]);
  const professionMark = form.profession
    ? await loadImage(professionAssetMap[form.profession])
    : null;
  const uploadedImage = form.imageUrl ? await loadImage(form.imageUrl) : null;

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
    recruitPosterMetrics.organizationLeft,
    recruitPosterMetrics.organizationTop,
    recruitPosterMetrics.organizationWidth,
    (organizationMark.height / organizationMark.width) *
      recruitPosterMetrics.organizationWidth,
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

  ctx.textBaseline = "top";

  for (let index = 0; index < form.rarity; index += 1) {
    const currentX =
      infoLayout.starsLeft +
      index * (recruitPosterMetrics.starSize - recruitPosterMetrics.starOverlap);
    ctx.drawImage(
      starMark,
      currentX,
      recruitPosterMetrics.infoTop,
      recruitPosterMetrics.starSize,
      recruitPosterMetrics.starSize,
    );
  }

  if (professionMark) {
    const professionHeight =
      (professionMark.height / professionMark.width) *
      recruitPosterMetrics.professionWidth;
    ctx.drawImage(
      professionMark,
      infoLayout.blockLeft,
      infoLayout.rowTop + recruitPosterMetrics.professionTopOffset,
      recruitPosterMetrics.professionWidth,
      professionHeight,
    );
  }

  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.92)";
  ctx.fillStyle = "#ffffff";

  if (form.name) {
    ctx.font = NAME_FONT;
    ctx.lineWidth = 6;
    ctx.strokeText(form.name, infoLayout.textLeft, infoLayout.rowTop);
    ctx.fillText(form.name, infoLayout.textLeft, infoLayout.rowTop);
  }

  if (form.enName) {
    ctx.font = EN_NAME_FONT;
    ctx.lineWidth = 3;
    ctx.strokeText(
      form.enName,
      infoLayout.textLeft,
      infoLayout.rowTop + recruitPosterMetrics.enNameTopOffset,
    );
    ctx.fillText(
      form.enName,
      infoLayout.textLeft,
      infoLayout.rowTop + recruitPosterMetrics.enNameTopOffset,
    );
  }

  const gradient = ctx.createLinearGradient(
    0,
    recruitPosterMetrics.gradientStartY,
    0,
    recruitPosterMetrics.gradientEndY,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.92)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(
    0,
    recruitPosterMetrics.gradientTop,
    CANVAS_WIDTH,
    recruitPosterMetrics.gradientHeight,
  );

  if (introLines.length > 0) {
    ctx.font = INTRO_FONT;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    const introX = (CANVAS_WIDTH - recruitPosterMetrics.introWidth) / 2;
    const introY =
      CANVAS_HEIGHT -
      recruitPosterMetrics.introBottom -
      introLines.length * recruitPosterMetrics.introLineHeight;

    introLines.forEach((line, index) => {
      ctx.fillText(
        line,
        introX,
        introY + index * recruitPosterMetrics.introLineHeight,
      );
    });
  }

  return canvas.toDataURL("image/png");
}
