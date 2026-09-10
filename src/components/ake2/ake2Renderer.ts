import { ake2TemplateSpec, type Ake2FormState } from "./ake2Config";
import { formatAke2English, getAke2ImageLayout, getAke2Profession, getAke2TextBaseline, type Ake2Point, type Ake2Rect } from "./ake2Layout";
import type { Ake2Resources } from "./ake2Resources";

const tintedImages = new WeakMap<HTMLImageElement, Map<string, HTMLCanvasElement>>();

function tintImage(image: HTMLImageElement, color: string) {
  let colors = tintedImages.get(image);
  if (!colors) {
    colors = new Map();
    tintedImages.set(image, colors);
  }
  const cached = colors.get(color);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("无法创建图标画布。");
  context.drawImage(image, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  // 每个图标最多缓存两种颜色，拖动颜色选择器时不累积位图。
  if (colors.size >= 2) colors.delete(colors.keys().next().value!);
  colors.set(color, canvas);
  return canvas;
}

function font(size: number, weight: number, family: string) {
  return `${weight} ${size}px "${family}", "Ake2 Noto Sans SC"`;
}

type TextStyle = Ake2Point & { fontSize: number; lineHeight: number };

function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  style: TextStyle,
  fontDefinition: string,
  color: string,
  letterSpacing = 0,
  verticalAlign: "font" | "glyph" = "font",
) {
  context.font = fontDefinition;
  context.fillStyle = color;
  context.textBaseline = "alphabetic";
  context.textAlign = "left";
  const metrics = context.measureText(text || "Mg国");
  const baseline = style.y + getAke2TextBaseline(metrics, style.fontSize, style.lineHeight, verticalAlign);
  if (!letterSpacing) {
    context.fillText(text, style.x, baseline);
    return context.measureText(text).width;
  }
  let x = style.x;
  for (const character of Array.from(text)) {
    context.fillText(character, x, baseline);
    x += context.measureText(character).width + letterSpacing;
  }
  return Math.max(0, x - style.x - letterSpacing);
}

function fillRect(context: CanvasRenderingContext2D, rect: Ake2Rect, color: string) {
  context.fillStyle = color;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
}

function drawImage(context: CanvasRenderingContext2D, image: HTMLImageElement, point: Ake2Point) {
  context.drawImage(image, point.x, point.y);
}

function withShadow(
  context: CanvasRenderingContext2D,
  shadow: { x: number; y: number; blur: number; color: string },
  draw: () => void,
) {
  context.save();
  // Canvas 阴影不随 transform 缩放，显式换算成当前位图像素。
  const pixelScale = context.canvas.width / ake2TemplateSpec.canvasWidth;
  context.shadowOffsetX = shadow.x * pixelScale;
  context.shadowOffsetY = shadow.y * pixelScale;
  context.shadowBlur = shadow.blur * pixelScale;
  context.shadowColor = shadow.color;
  draw();
  context.restore();
}

/** 预览和 PNG 导出使用相同图层顺序、文本度量及最终尺寸坐标。 */
export function drawAke2Frame(
  context: CanvasRenderingContext2D,
  form: Ake2FormState,
  resources: Ake2Resources,
) {
  const { canvasWidth, canvasHeight, layers: spec } = ake2TemplateSpec;
  const { profession, branch } = getAke2Profession(form);
  const color = form.themeColor;
  context.save();
  try {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.scale(context.canvas.width / canvasWidth, context.canvas.height / canvasHeight);
    context.beginPath();
    context.rect(0, 0, canvasWidth, canvasHeight);
    context.clip();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(resources.background, 0, 0, canvasWidth, canvasHeight);

    const banner = spec.banner;
    context.drawImage(tintImage(resources.banner, color), banner.x, banner.y, banner.width, banner.height);
    drawImage(context, resources.logo, spec.logo);
    drawImage(context, resources.collabBackground, spec.collabBackground);
    const collabFont = font(spec.collabText.fontSize, 400, "Ake2 Noto Sans SC");
    const prefixWidth = drawText(context, "限定联动活动", spec.collabText, collabFont, spec.white, 0, "glyph");
    drawText(context, "新增干员", { ...spec.collabText, x: spec.collabText.x + prefixWidth }, collabFont, color, 0, "glyph");

    const englishName = form.enName.toUpperCase();
    withShadow(context, spec.largeName.shadow, () => {
      drawText(context, englishName, spec.largeName, font(spec.largeName.fontSize, 700, "Ake2 Geom"), spec.largeName.color);
    });
    drawImage(context, resources.smallNameBackground, spec.smallNameBackground);
    drawText(context, englishName, spec.smallName, font(spec.smallName.fontSize, 400, "Ake2 Geom"), color, spec.smallName.letterSpacing);
    withShadow(context, spec.name.shadow, () => {
      drawText(context, form.name, spec.name, ake2TemplateSpec.fonts.chineseName, spec.white);
    });

    const star = spec.stars;
    const starImage = tintImage(resources.star, color);
    withShadow(context, { x: 0, y: 0, blur: star.shadowBlur, color }, () => {
      for (let i = 0; i < form.rarity; i += 1) {
        context.drawImage(starImage, star.x + i * (star.width + star.gap), star.y, star.width, star.height);
      }
    });

    fillRect(context, spec.professionBackground, spec.professionBackground.color);
    fillRect(context, spec.professionAccent, color);
    const attention = spec.attention;
    context.drawImage(resources.attention, attention.x, attention.y, attention.width, attention.height);
    const professionLogo = spec.professionLogo;
    context.drawImage(resources.profession, professionLogo.x, professionLogo.y, professionLogo.width, professionLogo.height);
    const branchLogo = spec.branchLogo;
    context.drawImage(resources.branch, branchLogo.x, branchLogo.y,
      branchLogo.height * resources.branch.naturalWidth / resources.branch.naturalHeight, branchLogo.height);
    drawText(context, profession.label, spec.professionLabel, font(spec.professionLabel.fontSize, 700, "Ake2 Noto Sans SC"), spec.white);
    const arrow = spec.arrow;
    context.drawImage(tintImage(resources.arrow, color), arrow.x, arrow.y,
      arrow.height * resources.arrow.naturalWidth / resources.arrow.naturalHeight, arrow.height);

    const badge = spec.branchLabel;
    const badgeFont = font(badge.fontSize, 500, "Ake2 Noto Sans SC");
    context.font = badgeFont;
    fillRect(context, {
      x: badge.x - badge.paddingX, y: badge.y - badge.paddingY,
      width: context.measureText(branch.label).width + badge.paddingX * 2,
      height: badge.lineHeight + badge.paddingY * 2,
    }, color);
    drawText(context, branch.label, badge, badgeFont, spec.white, 0, "glyph");

    const english = spec.professionEnglish;
    const englishFont = font(english.fontSize, 400, "Ake2 Novecento Wide");
    const professionWidth = drawText(context, formatAke2English(profession.value), english, englishFont, english.color);
    const arrowX = english.x + professionWidth + english.gap;
    context.drawImage(tintImage(resources.arrow, english.color), arrowX,
      english.y + (english.lineHeight - english.arrowHeight) / 2, english.arrowWidth, english.arrowHeight);
    drawText(context, formatAke2English(branch.value), {
      ...english, x: arrowX + english.arrowWidth + english.gap,
    }, englishFont, english.color);

    fillRect(context, spec.rightAccent, color);
    drawImage(context, resources.rightDecoration, spec.rightDecoration);
    drawText(context, form.watermark, spec.watermark, font(spec.watermark.fontSize, 500, "Ake2 Akt"), spec.auxiliaryColor);
    // 保留手动换行，不自动换行、缩小或截断长文本；画布边界自然裁切。
    form.description.split(/\r?\n/).forEach((line, index) => {
      drawText(context, line, { ...spec.description, y: spec.description.y + index * spec.description.lineHeight },
        font(spec.description.fontSize, 500, "Ake2 Akt"), spec.auxiliaryColor);
    });

    const character = getAke2ImageLayout(form);
    if (character && resources.character) {
      context.drawImage(resources.character, character.x, character.y, character.width, character.height);
    }
  } finally {
    context.restore();
  }
}
