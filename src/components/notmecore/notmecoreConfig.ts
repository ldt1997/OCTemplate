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

export type NotmecoreFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  backgroundColor: string;
  saturation: number;
  contrast: number;
  brightness: number;
  tintColor: string;
  blendOpacity: number;
  text: string;
  textRepeatCount: number;
  textFontSize: number;
  textColor: string;
  textLetterSpacing: number;
  textLineSpacing: number;
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
  blendOpacityRange: { min: 0, max: 1, step: 0.01 },
  textMaxLength: 50,
  textRepeatCountRange: { min: 1, max: 15, step: 1 },
  textFontSizeRange: { min: 8, max: 72, step: 1 },
  textLetterSpacingRange: { min: 0, max: 48, step: 1 },
  textLineSpacingRange: { min: 0, max: 32, step: 1 },
  textJitterYRange: { min: 0, max: 48, step: 1 },
} as const;

export const initialFormState: NotmecoreFormState = {
  imageFile: null,
  imageUrl: null,
  backgroundColor: "#FFFFFF",
  saturation: 1,
  contrast: 1,
  brightness: 1,
  tintColor: "#d8d8d8",
  blendOpacity: 0.2,
  text: "That's not my name",
  textRepeatCount: 6,
  textFontSize: 28,
  textColor: "#0000ff",
  textLetterSpacing: 12,
  textLineSpacing: 16,
  textJitterY: 24,
  textLayerMode: "top",
  textScatterSeed: 1,
};
