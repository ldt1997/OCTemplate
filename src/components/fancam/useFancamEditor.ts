import { type ChangeEvent, useEffect, useState } from "react";
import {
  FANCAM_BACKGROUND_MAX_FILE_SIZE,
  FANCAM_CHARACTER_MAX_FILE_SIZE,
  fancamAcceptedImageTypes,
  fancamTemplateSpec,
  initialFancamFormState,
  type FancamEffect,
  type FancamFormState,
  type FancamImageCropArea,
  type FancamTemplate,
} from "@/components/fancam/fancamConfig";
import { clamp } from "@/components/fancam/fancamLayout";
import { exportFancamImage } from "@/components/fancam/fancamPoster";
import {
  disposeFancamObjectUrl,
  ensureFancamFontsLoaded,
} from "@/components/fancam/fancamResources";

type UpdateFormInput =
  | Partial<FancamFormState>
  | ((current: FancamFormState) => FancamFormState);

function isAcceptedImageType(file: File) {
  return fancamAcceptedImageTypes.includes(
    file.type as (typeof fancamAcceptedImageTypes)[number],
  );
}

export function useFancamEditor() {
  const [form, setForm] = useState<FancamFormState>(initialFancamFormState);
  const [characterError, setCharacterError] = useState<string | null>(null);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackgroundCropOpen, setIsBackgroundCropOpen] = useState(false);

  useEffect(() => {
    let active = true;

    void ensureFancamFontsLoaded()
      .then(() => {
        if (active) {
          setFontsReady(true);
        }
      })
      .catch((error) => {
        console.error("Fancam 字体加载失败", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (form.characterUrl) {
        disposeFancamObjectUrl(form.characterUrl);
      }

      if (form.backgroundUrl) {
        disposeFancamObjectUrl(form.backgroundUrl);
      }
    };
  }, [form.characterUrl, form.backgroundUrl]);

  const updateForm = (updater: UpdateFormInput) => {
    setForm((current) =>
      typeof updater === "function"
        ? updater(current)
        : { ...current, ...updater },
    );
  };

  const handleCharacterFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setCharacterError(null);
      updateForm((current) => {
        if (current.characterUrl) {
          disposeFancamObjectUrl(current.characterUrl);
        }

        return {
          ...current,
          characterFile: null,
          characterUrl: null,
          characterOffsetX: 0,
          characterOffsetY: 0,
        };
      });
      return;
    }

    if (!isAcceptedImageType(nextFile)) {
      setCharacterError("请上传 JPEG、PNG 或 WEBP 图片。");
      event.target.value = "";
      return;
    }

    if (nextFile.size > FANCAM_CHARACTER_MAX_FILE_SIZE) {
      setCharacterError("角色立绘大小不能超过 8MB。");
      event.target.value = "";
      return;
    }

    const nextUrl = URL.createObjectURL(nextFile);
    setCharacterError(null);
    updateForm((current) => {
      if (current.characterUrl) {
        disposeFancamObjectUrl(current.characterUrl);
      }

      return {
        ...current,
        characterFile: nextFile,
        characterUrl: nextUrl,
        characterOffsetX: 0,
        characterOffsetY: 0,
      };
    });
  };

  const handleBackgroundFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setBackgroundError(null);
      updateForm((current) => {
        if (current.backgroundUrl) {
          disposeFancamObjectUrl(current.backgroundUrl);
        }

        return {
          ...current,
          backgroundFile: null,
          backgroundUrl: null,
          backgroundCrop: null,
        };
      });
      setIsBackgroundCropOpen(false);
      return;
    }

    if (!isAcceptedImageType(nextFile)) {
      setBackgroundError("请上传 JPEG、PNG 或 WEBP 图片。");
      event.target.value = "";
      return;
    }

    if (nextFile.size > FANCAM_BACKGROUND_MAX_FILE_SIZE) {
      setBackgroundError("背景图片大小不能超过 10MB。");
      event.target.value = "";
      return;
    }

    const nextUrl = URL.createObjectURL(nextFile);
    setBackgroundError(null);
    updateForm((current) => {
      if (current.backgroundUrl) {
        disposeFancamObjectUrl(current.backgroundUrl);
      }

      return {
        ...current,
        backgroundFile: nextFile,
        backgroundUrl: nextUrl,
        backgroundCrop: null,
      };
    });
    setIsBackgroundCropOpen(true);
  };

  const handleBackgroundCropConfirm = (cropArea: FancamImageCropArea) => {
    updateForm({ backgroundCrop: cropArea });
    setIsBackgroundCropOpen(false);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const imageBlob = await exportFancamImage(form);
      const downloadUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${fancamTemplateSpec.filePrefix}_${Date.now()}.png`;
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 0);
    } catch (error) {
      console.error("Fancam 导出失败", error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    form,
    fontsReady,
    isExporting,
    canExport: fontsReady,
    handleExport,
    backgroundCropDialogProps: {
      open: isBackgroundCropOpen,
      imageUrl: form.backgroundUrl,
      onCancel: () => setIsBackgroundCropOpen(false),
      onConfirm: handleBackgroundCropConfirm,
    },
    canvasProps: {
      form,
      fontsReady,
      onCharacterDrag: (deltaX: number, deltaY: number) =>
        updateForm((current) => ({
          ...current,
          characterOffsetX: current.characterOffsetX + deltaX,
          characterOffsetY: current.characterOffsetY + deltaY,
        })),
    },
    toolbarProps: {
      form,
      characterError,
      backgroundError,
      onCharacterFileChange: handleCharacterFileChange,
      onBackgroundFileChange: handleBackgroundFileChange,
      onOpenBackgroundCrop: () => {
        if (form.backgroundUrl) {
          setIsBackgroundCropOpen(true);
        }
      },
      onCharacterScaleChange: (value: number) =>
        updateForm({
          characterScale: clamp(
            value,
            fancamTemplateSpec.characterScaleRange.min,
            fancamTemplateSpec.characterScaleRange.max,
          ),
        }),
      onResetCharacterPosition: () =>
        updateForm({ characterOffsetX: 0, characterOffsetY: 0 }),
      onTemplateChange: (template: FancamTemplate) => updateForm({ template }),
      onBackgroundColorChange: (value: string) =>
        updateForm({ backgroundColor: value }),
      onEffectChange: (effect: FancamEffect) => updateForm({ effect }),
      onGroupNameChange: (value: string) =>
        updateForm({
          groupName: value.slice(0, fancamTemplateSpec.textLimits.groupName),
        }),
      onMemberNameChange: (value: string) =>
        updateForm({
          memberName: value.slice(0, fancamTemplateSpec.textLimits.memberName),
        }),
      onSongNameChange: (value: string) =>
        updateForm({
          songName: value.slice(0, fancamTemplateSpec.textLimits.songName),
        }),
    },
  };
}
