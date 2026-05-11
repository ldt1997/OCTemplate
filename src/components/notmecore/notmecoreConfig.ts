export const MAX_FILE_SIZE = 8 * 1024 * 1024;
export const acceptedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export type NotmecoreImageSize = {
  width: number;
  height: number;
};

export type NotmecoreTextLayerMode = "random" | "bottom" | "top";
export type NotmecoreTextFontFamily =
  | "pixel-operator"
  | "pixel-operator-bold"
  | "system";

export const notmecoreTextFontOptions: Array<{
  value: NotmecoreTextFontFamily;
  label: string;
}> = [
  { value: "pixel-operator", label: "PixelOperator" },
  { value: "pixel-operator-bold", label: "PixelOperator-Bold" },
  { value: "system", label: "系统字体" },
];

export const notmecoreTextFontSpec: Record<
  NotmecoreTextFontFamily,
  {
    label: string;
    fontFamily: string;
    fontWeight: number;
    fontLoad: string | null;
  }
> = {
  "pixel-operator": {
    label: "PixelOperator",
    fontFamily:
      '"Pixel Operator", "Helvetica Neue", Helvetica, Arial, "PingFang SC", sans-serif',
    fontWeight: 400,
    fontLoad: '16px "Pixel Operator"',
  },
  "pixel-operator-bold": {
    label: "PixelOperator-Bold",
    fontFamily:
      '"Pixel Operator Bold", "Helvetica Neue", Helvetica, Arial, "PingFang SC", sans-serif',
    fontWeight: 400,
    fontLoad: '16px "Pixel Operator Bold"',
  },
  system: {
    label: "系统字体",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", sans-serif',
    fontWeight: 500,
    fontLoad: null,
  },
};

export type NotmecoreFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  backgroundImageFile: File | null;
  backgroundImageUrl: string | null;
  backgroundColor: string;
  saturation: number;
  contrast: number;
  brightness: number;
  posterizeLevels: number;
  tintColor: string;
  blendOpacity: number;
  text: string;
  textRepeatCount: number;
  textFontFamily: NotmecoreTextFontFamily;
  textFontSize: number;
  textColor: string;
  textLetterSpacing: number;
  textJitterY: number;
  textLayerMode: NotmecoreTextLayerMode;
  textScatterSeed: number;
};

export const notmecoreTemplateSpec = {
  filePrefix: "notmecore",
  emptyStateTitle: "上传图片开始预览",
  emptyStateDescription: "画布尺寸会自动匹配原图尺寸，导出保持原始像素。",
  emptyStateBoxHeight: 320,
  saturationRange: { min: 0, max: 2, step: 0.01 },
  contrastRange: { min: 0.4, max: 2.2, step: 0.01 },
  brightnessRange: { min: 0.4, max: 1.8, step: 0.01 },
  posterizeLevelsRange: { min: 0, max: 16, step: 1 },
  blendOpacityRange: { min: 0, max: 1, step: 0.01 },
  textMaxLength: 50,
  textRepeatCountRange: { min: 1, max: 50, step: 1 },
  textFontFamilyOptions: notmecoreTextFontOptions,
  textFontSizeRange: { min: 8, max: 72, step: 1 },
  textLetterSpacingRange: { min: 0, max: 48, step: 1 },
  textJitterYRange: { min: 0, max: 48, step: 1 },
} as const;

export const initialFormState: NotmecoreFormState = {
  imageFile: null,
  imageUrl: null,
  backgroundImageFile: null,
  backgroundImageUrl: null,
  backgroundColor: "#000000",
  saturation: 1,
  contrast: 1,
  brightness: 1,
  posterizeLevels: 0,
  tintColor: "#d8d8d8",
  blendOpacity: 0,
  text: "That's not my name",
  textRepeatCount: 10,
  textFontFamily: "pixel-operator",
  textFontSize: 28,
  textColor: "#ffffff",
  textLetterSpacing: 12,
  textJitterY: 24,
  textLayerMode: "top",
  textScatterSeed: 1,
};
