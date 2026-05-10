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
};

export const notmecoreTemplateSpec = {
  filePrefix: "notmecore",
  emptyStateTitle: "上传图片开始预览",
  emptyStateDescription: "画布尺寸会自动匹配原图尺寸，导出保持原始像素。",
  emptyStateBoxHeight: 320,
} as const;

export const initialFormState: NotmecoreFormState = {
  imageFile: null,
  imageUrl: null,
  backgroundColor: "#FFFFFF",
  saturation: 1,
};
