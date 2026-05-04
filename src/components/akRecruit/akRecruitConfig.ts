import type { CSSProperties } from "react";
import bgImage from "@/assets/akrecruit/bg.webp";
import starImage from "@/assets/akrecruit/star.svg";
import abyssalHuntersImage from "@/assets/akrecruit/Abyssal_Hunters_white.webp";
import blackSteelImage from "@/assets/akrecruit/Black_Steel_white.webp";
import leithaniaImage from "@/assets/akrecruit/Leithania_white.webp";
import lungmenImage from "@/assets/akrecruit/lungmen.webp";
import penguinLogisticsImage from "@/assets/akrecruit/Penguin_Logistics_white.webp";
import rhineImage from "@/assets/akrecruit/Rhine_Lab_white.webp";
import rhodesIslandImage from "@/assets/akrecruit/rhodes_island_white.webp";
import casterImage from "@/assets/akrecruit/Caster.webp";
import defenderImage from "@/assets/akrecruit/Defender.webp";
import guardImage from "@/assets/akrecruit/guard.webp";
import medicImage from "@/assets/akrecruit/Medic.webp";
import sniperImage from "@/assets/akrecruit/Sniper.webp";
import specialistImage from "@/assets/akrecruit/Specialist.webp";
import supporterImage from "@/assets/akrecruit/Supporter.webp";
import vanguardImage from "@/assets/akrecruit/Vanguard.webp";

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const MAX_FILE_SIZE = 6 * 1024 * 1024;

export const TEXTAREA_CLASSNAME =
  "flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const organizationOptions = [
  { label: "罗德岛", value: "rhodes_island" },
  { label: "莱茵生命", value: "rhine" },
  { label: "龙门", value: "lungmen" },
  { label: "深海猎人", value: "abyssal_hunters" },
  { label: "企鹅物流", value: "penguin_logistics" },
  { label: "黑钢国际", value: "black_steel" },
  { label: "莱塔尼亚", value: "leithania" },
] as const;

export const professionOptions = [
  { label: "先锋", value: "vanguard" },
  { label: "近卫", value: "guard" },
  { label: "重装", value: "defender" },
  { label: "狙击", value: "sniper" },
  { label: "术师", value: "caster" },
  { label: "医疗", value: "medic" },
  { label: "辅助", value: "supporter" },
  { label: "特种", value: "specialist" },
] as const;

export type OrganizationValue = (typeof organizationOptions)[number]["value"];
export type ProfessionValue = (typeof professionOptions)[number]["value"];

export type RecruitFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  organization: OrganizationValue;
  profession: ProfessionValue | "";
  rarity: number;
  name: string;
  enName: string;
  intro: string;
};

export type RenderLayout = {
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

export type ImageSize = {
  width: number;
  height: number;
};

export const organizationAssetMap: Record<OrganizationValue, string> = {
  rhodes_island: rhodesIslandImage,
  rhine: rhineImage,
  lungmen: lungmenImage,
  abyssal_hunters: abyssalHuntersImage,
  penguin_logistics: penguinLogisticsImage,
  black_steel: blackSteelImage,
  leithania: leithaniaImage,
};

export const professionAssetMap: Record<ProfessionValue, string> = {
  vanguard: vanguardImage,
  guard: guardImage,
  defender: defenderImage,
  sniper: sniperImage,
  caster: casterImage,
  medic: medicImage,
  supporter: supporterImage,
  specialist: specialistImage,
};

export const initialFormState: RecruitFormState = {
  imageFile: null,
  imageUrl: null,
  imageScale: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  organization: "lungmen",
  profession: "vanguard",
  rarity: 6,
  name: "中文名称",
  enName: "English Name",
  intro: "博士，好久不见。我知道罗德岛当前状况不容乐观，我会回来提供一份助力。也以防你忘记，我依然是罗德岛的一员。",
};

export const posterNameStyle: CSSProperties = {
  fontFamily: '"Source Han Serif CN", serif',
  WebkitTextStroke: "2px rgba(0, 0, 0, 0.9)",
  paintOrder: "stroke fill",
};

export const posterEnNameStyle: CSSProperties = {
  fontFamily: '"Novecento Wide", sans-serif',
  WebkitTextStroke: "1px rgba(0, 0, 0, 0.9)",
  paintOrder: "stroke fill",
};

export const posterIntroStyle: CSSProperties = {
  fontFamily: '"Source Han Sans TW", "Microsoft YaHei", sans-serif',
};

export const akRecruitAssets = {
  bgImage,
  starImage,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getImageLayout(
  imageWidth: number,
  imageHeight: number,
  imageScale: number,
  imageOffsetX: number,
  imageOffsetY: number,
): RenderLayout {
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
