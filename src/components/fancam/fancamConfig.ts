export const FANCAM_CANVAS_WIDTH = 1920;
export const FANCAM_CANVAS_HEIGHT = 1080;
export const FANCAM_CHARACTER_MAX_FILE_SIZE = 8 * 1024 * 1024;
export const FANCAM_BACKGROUND_MAX_FILE_SIZE = 10 * 1024 * 1024;

export const fancamAcceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type FancamTemplate = "mbc";
export type FancamEffect = "none" | "bubble" | "ribbon" | "star";

export type FancamFormState = {
  characterFile: File | null;
  characterUrl: string | null;
  characterScale: number;
  characterOffsetX: number;
  characterOffsetY: number;
  template: FancamTemplate;
  backgroundColor: string;
  effect: FancamEffect;
  backgroundFile: File | null;
  backgroundUrl: string | null;
  backgroundCrop: FancamImageCropArea | null;
  groupName: string;
  memberName: string;
  songName: string;
};

export type FancamImageCropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const fancamTemplateOptions = [
  { label: "MBC", value: "mbc", asset: "mbc_front.webp" },
] as const;

export const fancamEffectOptions = [
  { label: "None", value: "none", asset: null },
  { label: "Bubble", value: "bubble", asset: "effect_01.webp" },
  { label: "Ribbon", value: "ribbon", asset: "effect_02.webp" },
  { label: "Star", value: "star", asset: "effect_03.webp" },
] as const;

export const fancamTemplateSpec = {
  filePrefix: "fancam",
  canvasWidth: FANCAM_CANVAS_WIDTH,
  canvasHeight: FANCAM_CANVAS_HEIGHT,
  imageAcceptLabel: "支持 JPEG / PNG / WEBP",
  characterScaleRange: { min: 0.5, max: 3, step: 0.01 },
  textLimits: {
    groupName: 50,
    memberName: 50,
    songName: 100,
  },
  crop: {
    aspect: FANCAM_CANVAS_WIDTH / FANCAM_CANVAS_HEIGHT,
    minZoom: 1,
    maxZoom: 4,
    zoomStep: 0.01,
    initialZoom: 1,
  },
  fonts: {
    chironMedium: {
      family:
        '"Chiron GoRound TC Medium", "PingFang TC", "PingFang SC", "Microsoft JhengHei", sans-serif',
      load: '16px "Chiron GoRound TC Medium"',
    },
    chironBold: {
      family:
        '"Chiron GoRound TC Bold", "PingFang TC", "PingFang SC", "Microsoft JhengHei", sans-serif',
      load: '16px "Chiron GoRound TC Bold"',
    },
  },
  layers: {
    full: { x: 0, y: 0, width: FANCAM_CANVAS_WIDTH, height: FANCAM_CANVAS_HEIGHT },
    character: {
      defaultCenterX: FANCAM_CANVAS_WIDTH / 2,
      defaultBottomY: FANCAM_CANVAS_HEIGHT,
      baseHeight: FANCAM_CANVAS_HEIGHT,
    },
    mbcText: {
      shadowColor: "rgba(0, 0, 0, 0.5)",
      shadowBlur: 15,
      strokeColor: "rgba(0, 0, 0, 0.2)",
      strokeWidth: 1,
      fillColor: "#ffffff",
      groupName: {
        x: 106,
        y: 285,
        fontSize: 85,
        font: "chironMedium",
      },
      memberName: {
        x: 106,
        y: 390,
        fontSize: 230,
        font: "chironBold",
        letterSpacingRatio: -0.05,
      },
      songName: {
        x: 106,
        y: 638,
        fontSize: 90,
        font: "chironMedium",
      },
    },
  },
} as const;

export const initialFancamFormState: FancamFormState = {
  characterFile: null,
  characterUrl: null,
  characterScale: 1,
  characterOffsetX: 0,
  characterOffsetY: 0,
  template: "mbc",
  backgroundColor: "#4BDBFF",
  effect: "bubble",
  backgroundFile: null,
  backgroundUrl: null,
  backgroundCrop: null,
  groupName: "GROUP NAME",
  memberName: "이름",
  songName: "SONG TITLE",
};
