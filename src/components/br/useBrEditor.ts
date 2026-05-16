import { type ChangeEvent, useEffect, useState } from "react";
import {
  BR_MAX_FILE_SIZE,
  brAcceptedImageTypes,
  brTemplateSpec,
  initialBrFormState,
  type BrImageCropArea,
  type BrFormState,
  type BrGender,
  type BrGrainLevel,
} from "@/components/br/brConfig";
import { exportBrImage } from "@/components/br/brPoster";
import {
  disposeBrObjectUrl,
  ensureBrFontsLoaded,
} from "@/components/br/brResources";
import { clamp } from "@/components/br/brLayout";

type UpdateFormInput =
  | Partial<BrFormState>
  | ((current: BrFormState) => BrFormState);

export function useBrEditor() {
  const [form, setForm] = useState<BrFormState>(initialBrFormState);
  const [imageError, setImageError] = useState<string | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImageCropOpen, setIsImageCropOpen] = useState(false);

  useEffect(() => {
    let active = true;

    void ensureBrFontsLoaded()
      .then(() => {
        if (active) {
          setFontsReady(true);
        }
      })
      .catch((error) => {
        console.error("BR 字体加载失败", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (form.imageUrl) {
        disposeBrObjectUrl(form.imageUrl);
      }
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
          disposeBrObjectUrl(current.imageUrl);
        }

        return {
          ...current,
          imageFile: null,
          imageUrl: null,
          imageCrop: null,
        };
      });
      setIsImageCropOpen(false);
      return;
    }

    if (!brAcceptedImageTypes.includes(nextFile.type as (typeof brAcceptedImageTypes)[number])) {
      setImageError("请上传 JPEG、PNG 或 WEBP 图片。");
      event.target.value = "";
      return;
    }

    if (nextFile.size > BR_MAX_FILE_SIZE) {
      setImageError("图片大小不能超过 8MB。");
      event.target.value = "";
      return;
    }

    const nextUrl = URL.createObjectURL(nextFile);
    setImageError(null);
    updateForm((current) => {
      if (current.imageUrl) {
        disposeBrObjectUrl(current.imageUrl);
      }

      return {
        ...current,
        imageFile: nextFile,
        imageUrl: nextUrl,
        imageCrop: null,
      };
    });
    setIsImageCropOpen(true);
  };

  const handleImageCropConfirm = (cropArea: BrImageCropArea) => {
    updateForm({ imageCrop: cropArea });
    setIsImageCropOpen(false);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const imageBlob = await exportBrImage(form);
      const downloadUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${brTemplateSpec.filePrefix}_${Date.now()}.png`;
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 0);
    } catch (error) {
      console.error("BR 导出失败", error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    form,
    fontsReady,
    imageError,
    isExporting,
    canExport: fontsReady,
    handleExport,
    cropDialogProps: {
      open: isImageCropOpen,
      imageUrl: form.imageUrl,
      onCancel: () => setIsImageCropOpen(false),
      onConfirm: handleImageCropConfirm,
    },
    toolbarProps: {
      form,
      imageError,
      onFileChange: handleFileChange,
      onOpenImageCrop: () => {
        if (form.imageUrl) {
          setIsImageCropOpen(true);
        }
      },
      onBackgroundColorChange: (value: string) =>
        updateForm({ backgroundColor: value }),
      onGrainLevelChange: (value: BrGrainLevel) =>
        updateForm({ grainLevel: value }),
      onNameChange: (value: string) =>
        updateForm({ name: value.slice(0, brTemplateSpec.textLimits.name) }),
      onEnglishNameChange: (value: string) =>
        updateForm({
          englishName: value.slice(0, brTemplateSpec.textLimits.englishName),
        }),
      onGenderChange: (value: BrGender) => updateForm({ gender: value }),
      onNumberChange: (value: number) =>
        updateForm({
          number: Math.round(
            clamp(
              value,
              brTemplateSpec.numberRange.min,
              brTemplateSpec.numberRange.max,
            ),
          ),
        }),
      onWeaponChange: (value: string) =>
        updateForm({ weapon: value.slice(0, brTemplateSpec.textLimits.weapon) }),
      onKillCountChange: (value: number) =>
        updateForm({
          killCount: Math.round(
            clamp(
              value,
              brTemplateSpec.killCountRange.min,
              brTemplateSpec.killCountRange.max,
            ),
          ),
        }),
      onDeathLocationChange: (value: string) =>
        updateForm({
          deathLocation: value.slice(0, brTemplateSpec.textLimits.deathLocation),
        }),
      onMovieProfileChange: (value: string) =>
        updateForm({
          movieProfile: value.slice(0, brTemplateSpec.textLimits.profile),
        }),
      onNovelBackgroundChange: (value: string) =>
        updateForm({
          novelBackground: value.slice(0, brTemplateSpec.textLimits.profile),
        }),
    },
  };
}
