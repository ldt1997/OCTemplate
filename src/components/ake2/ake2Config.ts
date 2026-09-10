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
  fonts: {
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
  themeColor: "#FF0000",
  name: "名称",
  enName: "En Name",
  rarity: 6,
  profession: "vanguard",
  branch: "charger",
  watermark: "@OCTemplate",
  description: "*图文内容仅作辅助说明使用，具体请以游戏实际情况为准。",
};
