import type { Ake2BranchValue, Ake2ProfessionValue } from "./ake2Professions";

export type Ake2Image = {
  url: string;
  name: string;
  width: number;
  height: number;
};

export type Ake2FormState = {
  image: Ake2Image | null;
  scale: number;
  imagePosition: { x: number; y: number };
  themeColor: string;
  name: string;
  enName: string;
  rarity: number;
  profession: Ake2ProfessionValue;
  branch: Ake2BranchValue;
  watermark: string;
  description: string;
};

export const ake2TemplateSpec = {
  canvasWidth: 3000,
  canvasHeight: 2250,
  filePrefix: "ake2",
  image: {
    acceptedTypes: ["image/png", "image/jpeg"] as readonly string[],
    maxBytes: 10 * 1024 * 1024,
    scale: { min: 50, max: 300, step: 1 },
    // 100% 时高度等于画布高度，与 akrecruit 相同。
    initialPosition: { x: 500, y: 60 },
  },
  rarity: { min: 1, max: 6, step: 1 },
  layers: {
    banner: { x: 0, y: 0, width: 2870, height: 1090 },
    logo: { x: 92, y: 111 },
    collabBackground: { x: 187, y: 539 },
    collabText: { x: 255, y: 552, fontSize: 30, lineHeight: 36 },
    largeName: { x: 217, y: 989, fontSize: 310, lineHeight: 372, color: "#EAEAEA", shadow: { x: 0, y: 4, blur: 100, color: "rgba(255,255,255,0.25)" } },
    smallNameBackground: { x: 622, y: 1334 },
    smallName: { x: 670, y: 1352, fontSize: 18, lineHeight: 21.6, letterSpacing: 21.6 },
    name: { x: 174, y: 1250, fontSize: 148, lineHeight: 177.6, shadow: { x: 0, y: 0, blur: 100, color: "#000000" } },
    stars: { x: 213, y: 1421, width: 76, height: 79, gap: -16, shadowBlur: 10 },
    professionBackground: { x: 133, y: 1712, width: 2841, height: 139, color: "rgba(0,0,0,0.8)" },
    professionAccent: { x: 133, y: 1851, width: 1023, height: 20 },
    attention: { x: 2730, y: 1721, width: 120, height: 120 },
    professionLogo: { x: 187, y: 1721, width: 120, height: 120 },
    branchLogo: { x: 348, y: 1721, height: 120 },
    professionLabel: { x: 526, y: 1743, fontSize: 40, lineHeight: 48 },
    arrow: { x: 625, y: 1761, height: 13 },
    branchLabel: { x: 680, y: 1743, fontSize: 40, lineHeight: 48, paddingX: 14, paddingY: 1 },
    professionEnglish: { x: 526, y: 1805, fontSize: 20, lineHeight: 24, color: "#AC9B9B", gap: 10, arrowWidth: 16.5, arrowHeight: 8 },
    rightAccent: { x: 2758, y: 597, width: 92, height: 92 },
    rightDecoration: { x: 2772, y: 507 },
    watermark: { x: 174, y: 2112, fontSize: 32, lineHeight: 38.4 },
    description: { x: 2150, y: 2112, fontSize: 32, lineHeight: 38.4 },
    auxiliaryColor: "#D0CECE",
    white: "#FFFFFF",
  },
  fonts: {
    chineseName: '900 148px "Ake2 Source Han Serif CN"',
    chineseRegular: '400 32px "Ake2 Noto Sans SC"',
    chineseMedium: '500 40px "Ake2 Noto Sans SC"',
    chineseBold: '700 148px "Ake2 Noto Sans SC"',
    englishRegular: '400 18px "Ake2 Geom"',
    englishBold: '700 310px "Ake2 Geom"',
    professionEnglish: '400 20px "Ake2 Novecento Wide"',
    auxiliaryMedium: '500 32px "Ake2 Akt"',
    auxiliaryBold: '700 40px "Ake2 Akt"',
  },
} as const;

export const initialAke2FormState: Ake2FormState = {
  image: null,
  scale: 100,
  imagePosition: { ...ake2TemplateSpec.image.initialPosition },
  themeColor: "#f86c20",
  name: "哈蒂娅",
  enName: "HADIYA",
  rarity: 6,
  profession: "vanguard",
  branch: "charger",
  watermark: "@OCTemplate",
  description: "*图文内容仅作辅助说明使用，具体请以游戏实际情况为准。",
};
