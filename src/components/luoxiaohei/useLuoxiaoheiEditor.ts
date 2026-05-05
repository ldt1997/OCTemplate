import { type ChangeEvent, useEffect, useState } from "react";
import {
  fallbackPresetPairs,
  initialFormState,
  MAX_FILE_SIZE,
  type ImageSize,
  type LuoxiaoheiFormState,
} from "@/components/luoxiaohei/luoxiaoheiConfig";
import {
  ensureLuoxiaoheiFontsLoaded,
  exportLuoxiaoheiImage,
  loadImage,
} from "@/components/luoxiaohei/luoxiaoheiPoster";
import { chtPalette } from "@/lib/chtColor";
import {
  buildColorPairsFromImage,
  type ColorPair,
} from "@/lib/colorRecommendation";

type UpdateFormInput =
  | Partial<LuoxiaoheiFormState>
  | ((current: LuoxiaoheiFormState) => LuoxiaoheiFormState);

export function useLuoxiaoheiEditor() {
  const [form, setForm] = useState(initialFormState);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  );
  const [presetPairs, setPresetPairs] =
    useState<ColorPair[]>(fallbackPresetPairs);
  const [fontsReady, setFontsReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExtractingColors, setIsExtractingColors] = useState(false);

  useEffect(() => {
    let active = true;

    void ensureLuoxiaoheiFontsLoaded()
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
    let cancelled = false;

    if (!form.imageUrl) {
      setImageSize(null);
      setPresetPairs(fallbackPresetPairs);
      setRecommendationError(null);
      setIsExtractingColors(false);
      return;
    }

    void loadImage(form.imageUrl)
      .then((image) => {
        if (cancelled) {
          return;
        }

        setImageSize({
          width: image.width,
          height: image.height,
        });
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("图片尺寸读取失败", error);
        }
      });

    setIsExtractingColors(true);
    setRecommendationError(null);

    void buildColorPairsFromImage(form.imageUrl, chtPalette, 3)
      .then((pairs) => {
        if (cancelled) {
          return;
        }

        const nextPairs =
          pairs.length > 0 ? pairs.slice(0, 3) : fallbackPresetPairs;
        setPresetPairs(nextPairs);
        setForm((current) => ({
          ...current,
          selectedPresetId: nextPairs[0].id,
          bgColor1: nextPairs[0].left.value,
          bgColor2: nextPairs[0].right.value,
          titleLeft: nextPairs[0].left.key,
          titleRight: nextPairs[0].right.key,
        }));
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        console.error("推荐色卡生成失败", error);
        setRecommendationError("主题色提取失败，已回退到默认推荐色卡。");
        setPresetPairs(fallbackPresetPairs);
      })
      .finally(() => {
        if (!cancelled) {
          setIsExtractingColors(false);
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

  const applyPresetPair = (pair: ColorPair) => {
    updateForm({
      selectedPresetId: pair.id,
      bgColor1: pair.left.value,
      bgColor2: pair.right.value,
      titleLeft: pair.left.key,
      titleRight: pair.right.key,
    });
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
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0,
          selectedPresetId: fallbackPresetPairs[0].id,
          bgColor1: fallbackPresetPairs[0].left.value,
          bgColor2: fallbackPresetPairs[0].right.value,
          titleLeft: fallbackPresetPairs[0].left.key,
          titleRight: fallbackPresetPairs[0].right.key,
        };
      });
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(nextFile.type)) {
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
        imageScale: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
      };
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await exportLuoxiaoheiImage(form);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `luoxiaohei_${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("导出失败", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImageTransformCommit = (
    next: Pick<
      LuoxiaoheiFormState,
      "imageScale" | "imageOffsetX" | "imageOffsetY"
    >,
  ) => {
    updateForm(next);
  };

  return {
    form,
    imageSize,
    imageError,
    recommendationError,
    presetPairs,
    fontsReady,
    isExporting,
    isExtractingColors,
    updateForm,
    handleFileChange,
    handleExport,
    handleImageTransformCommit,
    toolbarProps: {
      form,
      imageError,
      recommendationError,
      isExtractingColors,
      presetPairs,
      onFileChange: handleFileChange,
      onTextChange: (
        field: "titleLeft" | "titleRight" | "name",
        value: string,
      ) => updateForm({ [field]: value } as Partial<LuoxiaoheiFormState>),
      onColorChange: (field: "bgColor1" | "bgColor2", value: string) =>
        updateForm({ [field]: value } as Partial<LuoxiaoheiFormState>),
      onImageScaleChange: (imageScale: number) => updateForm({ imageScale }),
      onPresetSelect: applyPresetPair,
      onLogoColorChange: (logoColor: LuoxiaoheiFormState["logoColor"]) =>
        updateForm({ logoColor }),
    },
  };
}
