import { type ChangeEvent, useEffect, useState } from "react";
import {
  acceptedImageTypes,
  initialFormState,
  MAX_FILE_SIZE,
  notmecoreTemplateSpec,
  type NotmecoreFormState,
  type NotmecoreImageSize,
  type NotmecoreTextFontFamily,
  type NotmecoreTextLayerMode,
} from "@/components/notmecore/notmecoreConfig";
import {
  exportNotmecoreImage,
} from "@/components/notmecore/notmecorePoster";
import {
  ensureNotmecoreFontsLoaded,
  readImageSize,
} from "@/components/notmecore/notmecoreRenderer";

type UpdateFormInput =
  | Partial<NotmecoreFormState>
  | ((current: NotmecoreFormState) => NotmecoreFormState);

function createScatterSeed() {
  return Math.floor(Math.random() * 0x7fffffff);
}

function getPreviewRenderSize(imageSize: NotmecoreImageSize | null) {
  if (!imageSize) {
    return null;
  }

  const previewMaxEdge = 1800;
  const longestEdge = Math.max(imageSize.width, imageSize.height);
  if (longestEdge <= previewMaxEdge) {
    return imageSize;
  }

  const scale = previewMaxEdge / longestEdge;
  return {
    width: Math.max(1, Math.round(imageSize.width * scale)),
    height: Math.max(1, Math.round(imageSize.height * scale)),
  };
}

function clearBackgroundImage(current: NotmecoreFormState): NotmecoreFormState {
  if (current.backgroundImageUrl) {
    URL.revokeObjectURL(current.backgroundImageUrl);
  }

  return {
    ...current,
    backgroundImageFile: null,
    backgroundImageUrl: null,
  };
}

export function useNotmecoreEditor() {
  const [form, setForm] = useState(initialFormState);
  const [imageSize, setImageSize] = useState<NotmecoreImageSize | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [backgroundImageError, setBackgroundImageError] = useState<string | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let active = true;

    void ensureNotmecoreFontsLoaded()
      .then(() => {
        if (active) {
          setFontsReady(true);
        }
      })
      .catch((error) => {
        console.error("字体加载失败", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (form.imageUrl) {
        URL.revokeObjectURL(form.imageUrl);
      }
    };
  }, [form.imageUrl]);

  useEffect(() => {
    return () => {
      if (form.backgroundImageUrl) {
        URL.revokeObjectURL(form.backgroundImageUrl);
      }
    };
  }, [form.backgroundImageUrl]);

  useEffect(() => {
    let cancelled = false;

    if (!form.imageUrl) {
      setImageSize(null);
      return;
    }

    void readImageSize(form.imageUrl)
      .then((nextImageSize) => {
        if (!cancelled) {
          setImageSize(nextImageSize);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("图片尺寸读取失败", error);
          setImageError("图片读取失败，请重新上传。");
          setImageSize(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [form.imageUrl]);

  const updateForm = (updater: UpdateFormInput) => {
    setForm((current) =>
      typeof updater === "function"
        ? updater(current)
        : { ...current, ...updater },
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setImageError(null);
      updateForm((current) => {
        if (current.imageUrl) {
          URL.revokeObjectURL(current.imageUrl);
        }

        return {
          ...current,
          imageFile: null,
          imageUrl: null,
        };
      });
      return;
    }

    if (!acceptedImageTypes.includes(nextFile.type as (typeof acceptedImageTypes)[number])) {
      setImageError("请上传 PNG、JPEG 或 WEBP 图片。");
      event.target.value = "";
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setImageError("图片大小不能超过 8MB。");
      event.target.value = "";
      return;
    }

    const nextUrl = URL.createObjectURL(nextFile);
    setImageError(null);
    updateForm((current) => {
      if (current.imageUrl) {
        URL.revokeObjectURL(current.imageUrl);
      }

      return {
        ...current,
        imageFile: nextFile,
        imageUrl: nextUrl,
      };
    });
  };

  const handleBackgroundImageFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setBackgroundImageError(null);
      updateForm(clearBackgroundImage);
      return;
    }

    if (
      !acceptedImageTypes.includes(
        nextFile.type as (typeof acceptedImageTypes)[number],
      )
    ) {
      setBackgroundImageError("请上传 PNG、JPEG 或 WEBP 图片。");
      event.target.value = "";
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setBackgroundImageError("背景图片大小不能超过 8MB。");
      event.target.value = "";
      return;
    }

    const nextUrl = URL.createObjectURL(nextFile);
    setBackgroundImageError(null);
    updateForm((current) => {
      if (current.backgroundImageUrl) {
        URL.revokeObjectURL(current.backgroundImageUrl);
      }

      return {
        ...current,
        backgroundImageFile: nextFile,
        backgroundImageUrl: nextUrl,
      };
    });
  };

  const handleExport = async () => {
    if (!imageSize) {
      return;
    }

    try {
      setIsExporting(true);
      const imageBlob = await exportNotmecoreImage(form, imageSize);
      const downloadUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${notmecoreTemplateSpec.filePrefix}_${Date.now()}.png`;
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 0);
    } catch (error) {
      console.error("导出失败", error);
    } finally {
      setIsExporting(false);
    }
  };

  const previewRenderSize = getPreviewRenderSize(imageSize);

  return {
    form,
    imageSize,
    previewRenderSize,
    fontsReady,
    imageError,
    isExporting,
    canExport: Boolean(imageSize && form.imageUrl && fontsReady),
    handleExport,
    toolbarProps: {
      form,
      imageError,
      backgroundImageError,
      onFileChange: handleFileChange,
      onBackgroundImageFileChange: handleBackgroundImageFileChange,
      onClearBackgroundImage: () => {
        setBackgroundImageError(null);
        updateForm(clearBackgroundImage);
      },
      onBackgroundColorChange: (value: string) =>
        updateForm({ backgroundColor: value }),
      onSaturationChange: (value: number) => updateForm({ saturation: value }),
      onContrastChange: (value: number) => updateForm({ contrast: value }),
      onBrightnessChange: (value: number) =>
        updateForm({ brightness: value }),
      onTintColorChange: (value: string) => updateForm({ tintColor: value }),
      onBlendOpacityChange: (value: number) =>
        updateForm({ blendOpacity: value }),
      onTextChange: (value: string) =>
        updateForm({
          text: value.slice(0, notmecoreTemplateSpec.textMaxLength),
        }),
      onTextRepeatCountChange: (value: number) =>
        updateForm({ textRepeatCount: value }),
      onTextFontFamilyChange: (value: NotmecoreTextFontFamily) =>
        updateForm({ textFontFamily: value }),
      onTextFontSizeChange: (value: number) =>
        updateForm({ textFontSize: value }),
      onTextColorChange: (value: string) => updateForm({ textColor: value }),
      onTextLetterSpacingChange: (value: number) =>
        updateForm({ textLetterSpacing: value }),
      onTextJitterYChange: (value: number) =>
        updateForm({ textJitterY: value }),
      onTextLayerModeChange: (value: NotmecoreTextLayerMode) =>
        updateForm({ textLayerMode: value }),
      onShuffleTextScatter: () =>
        updateForm({ textScatterSeed: createScatterSeed() }),
    },
  };
}
