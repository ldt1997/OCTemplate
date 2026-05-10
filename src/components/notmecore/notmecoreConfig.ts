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

export type NotmecoreFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  backgroundColor: string;
  saturation: number;
  text: string;
  textRepeatCount: number;
  textFontSize: number;
  textColor: string;
  textLetterSpacing: number;
  textLineSpacing: number;
  textJitterY: number;
  textScatterSeed: number;
};

export const notmecoreTemplateSpec = {
  filePrefix: "notmecore",
  emptyStateTitle: "上传图片开始预览",
  emptyStateDescription: "画布尺寸会自动匹配原图尺寸，导出保持原始像素。",
  emptyStateBoxHeight: 320,
  textMaxLength: 50,
  textRepeatCountRange: { min: 1, max: 12, step: 1 },
  textFontSizeRange: { min: 8, max: 48, step: 1 },
  textLetterSpacingRange: { min: 0, max: 48, step: 1 },
  textLineSpacingRange: { min: 0, max: 32, step: 1 },
  textJitterYRange: { min: 0, max: 48, step: 1 },
} as const;

export const initialFormState: NotmecoreFormState = {
  imageFile: null,
  imageUrl: null,
  backgroundColor: "#FFFFFF",
  saturation: 1,
  text: "That's not my name",
  textRepeatCount: 3,
  textFontSize: 24,
  textColor: "#0033CC",
  textLetterSpacing: 24,
  textLineSpacing: 0,
  textJitterY: 24,
  textScatterSeed: 1,
};
