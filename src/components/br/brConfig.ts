export const BR_CANVAS_WIDTH = 792;
export const BR_CANVAS_HEIGHT = 1224;
export const BR_MAX_FILE_SIZE = 8 * 1024 * 1024;

export const brAcceptedImageTypes = ["image/jpeg", "image/png"] as const;

export type BrGender = "She" | "He";

export type BrFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  backgroundColor: string;
  name: string;
  englishName: string;
  gender: BrGender;
  number: number;
  weapon: string;
  killCount: number;
  deathLocation: string;
  movieProfile: string;
  novelBackground: string;
};

export const brTemplateSpec = {
  filePrefix: "br",
  canvasWidth: BR_CANVAS_WIDTH,
  canvasHeight: BR_CANVAS_HEIGHT,
  emptyStateTitle: "《大逃杀》人物公式书",
  emptyStateDescription: "默认状态已可预览，可上传人物照片并调整文字信息。",
  imageAcceptLabel: "支持 JPEG / PNG，最大 8MB",
  textLimits: {
    name: 50,
    englishName: 25,
    weapon: 50,
    deathLocation: 50,
    profile: 300,
  },
  killCountRange: { min: 0, max: 10, step: 1 },
  numberRange: { min: 0, max: 99 },
  colors: {
    border: "#6B291F",
    darkRed: "#33100A",
    labelRed: "#942727",
    white: "#ffffff",
    black: "#000000",
  },
  fonts: {
    aktRegular: {
      family: '"Akt Regular", "Helvetica Neue", Helvetica, Arial, sans-serif',
      load: '16px "Akt Regular"',
    },
    aktBold: {
      family: '"Akt Bold", "Helvetica Neue", Helvetica, Arial, sans-serif',
      load: '16px "Akt Bold"',
    },
    mochiy: {
      family:
        '"Mochiy Pop One", "Hiragino Sans", "Yu Gothic", "PingFang SC", sans-serif',
      load: '16px "Mochiy Pop One"',
    },
    tradeWinds: {
      family: '"Trade Winds", Georgia, serif',
      load: '16px "Trade Winds"',
    },
  },
  layers: {
    photo: { x: 61, y: 87, width: 410, height: 410, borderWidth: 2 },
    number: { x: 175, y: 560, fontSize: 390 },
    stats: {
      x: 61,
      y: 497,
      labelWidth: 132,
      valueWidth: 150,
      rowHeight: 26,
      rows: 3,
      padding: 4,
      borderWidth: 2,
      labelFontSize: 13,
      valueFontSize: 15,
      skullWidth: 9.95,
      skullHeight: 13,
      skullGap: 2,
    },
    name: {
      x: 592,
      y: 79,
      blockWidth: 143,
      blockHeight: 1050,
      fontSize: 195,
      characterGap: 12,
    },
    englishName: {
      x: 590,
      y: 79,
      width: 1050,
      height: 48,
      fontSize: 40,
    },
    profile: {
      left: 66,
      bottom: 80,
      width: 413,
      gap: 2,
      titleHeight: 26,
      borderWidth: 2,
      titleFontSize: 13,
      bodyFontSize: 13,
      bodyLineHeight: 17,
    },
  },
} as const;

export const initialBrFormState: BrFormState = {
  imageFile: null,
  imageUrl: null,
  backgroundColor: "#942727",
  name: "千草貴子",
  englishName: "takako chigusa",
  gender: "She",
  number: 13,
  weapon: "折りたたみナイフ",
  killCount: 3,
  deathLocation: "G-03 森の中",
  movieProfile:
    "プライドが高く、気の強い性格の女子。両親と妹・彩子の4人暮らしで、ハナコという犬も飼っている。少々きつめの貴族的な顔立ちで、クラスでも一番の美人。メッシュを入れた茶髪の長髪に、金属製アクセサリーを多数身に着けている。",
  novelBackground:
    "プログラムでは開始後、襲撃されるのを警戒して、出発直後に全速力で分校から離れ、杉村か内海あたりと合流しようとするが、途中で新井田と遭遇。最期は杉村に発見され、彼に看取られながら死亡する。19番目の死亡者。",
};
