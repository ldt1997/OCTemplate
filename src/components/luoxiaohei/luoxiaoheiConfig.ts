import type { CSSProperties } from "react";
import bambooImage from "@/assets/luoxiaohei/bamboo.webp";
import logoBlackImage from "@/assets/luoxiaohei/luoxiaoheilogo_black.webp";
import logoBlueImage from "@/assets/luoxiaohei/luoxiaoheilogo_blue.webp";
import logoGreenImage from "@/assets/luoxiaohei/luoxiaoheilogo_green.webp";
import logoRedImage from "@/assets/luoxiaohei/luoxiaoheilogo_red.webp";
import logoWhiteImage from "@/assets/luoxiaohei/luoxiaoheilogo_white.webp";
import logoYellowImage from "@/assets/luoxiaohei/luoxiaoheilogo_yellow.webp";
import nameframeImage from "@/assets/luoxiaohei/nameframe.png";
import { chtPalette, type PaletteColor } from "@/lib/chtColor";
import type { ColorPair } from "@/lib/colorRecommendation";

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1920;
export const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const luoxiaoheiTemplateSpec = {
  imageAreaHeightRatio: 0.7,
  imageAreaMaxWidth: CANVAS_WIDTH,
  colorBlockWidth: CANVAS_WIDTH / 2,
  gradientStop: 0.5,
  titleFontSize: 220,
  titleLineHeight: 198,
  titleLetterSpacing: 6,
  titlePaddingTop: 58,
  titlePaddingSide: 10,
  leftTextTop: 10,
  rightTextTop: 10,
  colorMetaFontSize: 30,
  colorMetaLineHeight: 36,
  colorMetaGap: 6,
  titleMetaGap: 22,
  bambooOpacity: 0.3,
  logoWidth: 604,
  logoHeight: 300,
  logoBottom: 58,
  nameFrameWidth: 360,
  nameFrameHeight: 382,
  nameFrameLeft: 760,
  nameFrameTop: 1150,
  nameFontSize: 74,
  nameFontWeight: 300,
  nameFrameTextTop: 52,
  nameFrameTextRight: 108,
  nameFrameTextLineHeight: 66,
  previewShadow: "0 30px 60px rgba(15, 23, 42, 0.18)",
} as const;

export type LogoColorValue =
  | "black"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "white";

export type LuoxiaoheiFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  bgColor1: string;
  bgColor2: string;
  titleLeft: string;
  titleRight: string;
  name: string;
  logoColor: LogoColorValue;
  selectedPresetId: string;
};

export type ImageSize = {
  width: number;
  height: number;
};

export type BaseImageLayout = {
  baseWidth: number;
  baseHeight: number;
  baseX: number;
  baseY: number;
};

export const logoColorOptions: Array<{
  label: string;
  value: LogoColorValue;
  swatch: string;
}> = [
  { label: "黑色", value: "black", swatch: "#000000" },
  { label: "红色", value: "red", swatch: "#560f0c" },
  { label: "黄色", value: "yellow", swatch: "#564b0c" },
  { label: "绿色", value: "green", swatch: "#0c561f" },
  { label: "蓝色", value: "blue", swatch: "#120d57" },
  { label: "白色", value: "white", swatch: "#FFFFFF" },
] as const;

export const logoAssetMap: Record<LogoColorValue, string> = {
  black: logoBlackImage,
  red: logoRedImage,
  yellow: logoYellowImage,
  green: logoGreenImage,
  blue: logoBlueImage,
  white: logoWhiteImage,
};

function createPresetPair(leftKey: string, rightKey: string): ColorPair {
  const left = chtPalette.find((item) => item.key === leftKey);
  const right = chtPalette.find((item) => item.key === rightKey);

  if (!left || !right) {
    throw new Error(`未找到推荐色卡颜色: ${leftKey} / ${rightKey}`);
  }

  return {
    id: `${left.key}-${right.key}`,
    left,
    right,
  };
}

export const fallbackPresetPairs: ColorPair[] = [
  createPresetPair("妃色", "鴉青"),
  createPresetPair("杏黃", "黛藍"),
  createPresetPair("竹青", "藕荷色"),
];

export const initialFormState: LuoxiaoheiFormState = {
  imageFile: null,
  imageUrl: null,
  imageScale: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  bgColor1: fallbackPresetPairs[0].left.value,
  bgColor2: fallbackPresetPairs[0].right.value,
  titleLeft: fallbackPresetPairs[0].left.key,
  titleRight: fallbackPresetPairs[0].right.key,
  name: "罗小黑",
  logoColor: "black",
  selectedPresetId: fallbackPresetPairs[0].id,
};

export const luoxiaoheiAssets = {
  bambooImage,
  nameframeImage,
};

export const sourceHanTitleStyle: CSSProperties = {
  fontFamily: '"Source Han Serif CN Light", serif',
};

export const sourceHanNameStyle: CSSProperties = {
  fontFamily: '"Source Han Serif CN Light", serif',
};

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

  const maxHeight = CANVAS_HEIGHT * luoxiaoheiTemplateSpec.imageAreaHeightRatio;
  const maxWidth = luoxiaoheiTemplateSpec.imageAreaMaxWidth;
  const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
  const baseWidth = imageWidth * scale;
  const baseHeight = imageHeight * scale;

  return {
    baseWidth,
    baseHeight,
    baseX: (CANVAS_WIDTH - baseWidth) / 2,
    baseY: (CANVAS_HEIGHT - baseHeight) / 2,
  };
}

export function getPaletteColorByHex(hex: string): PaletteColor | null {
  return (
    chtPalette.find(
      (item) => item.value.toLowerCase() === hex.trim().toLowerCase(),
    ) ?? null
  );
}
