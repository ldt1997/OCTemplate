import { type ChangeEvent, useEffect, useState } from "react";
import { AkRecruitCanvas } from "@/components/akRecruit/akRecruitCanvas";
import {
  initialFormState,
  MAX_FILE_SIZE,
  type ImageSize,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";
import {
  ensureRecruitFontsLoaded,
  exportRecruitImage,
  loadImage,
} from "@/components/akRecruit/akRecruitPoster";
import { AkRecruitPreview } from "@/components/akRecruit/akRecruitPreview";
import { AkRecruitToolbar } from "@/components/akRecruit/akRecruitToolbar";
import { AppLayout } from "@/components/layout/appLayout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AkRecruitPage() {
  const [form, setForm] = useState(initialFormState);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let active = true;

    void ensureRecruitFontsLoaded()
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
      return;
    }

    void loadImage(form.imageUrl).then((image) => {
      if (cancelled) {
        return;
      }

      setImageSize({
        width: image.width,
        height: image.height,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [form.imageUrl]);

  const updateForm = (
    updater:
      | Partial<RecruitFormState>
      | ((current: RecruitFormState) => RecruitFormState),
  ) => {
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
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0,
        };
      });
      return;
    }

    if (!["image/png", "image/jpeg"].includes(nextFile.type)) {
      setImageError("请上传 PNG 或 JPEG 图片。");
      event.target.value = "";
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setImageError("图片大小不能超过 6MB。");
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
      const dataUrl = await exportRecruitImage(form);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `akrecruit_${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("导出失败", error);
    } finally {
      setIsExporting(false);
    }
  };

  const toolbarProps = {
    form,
    imageError,
    onFileChange: handleFileChange,
    onTextChange: (field: "name" | "enName" | "intro", value: string) =>
      updateForm({ [field]: value } as Partial<RecruitFormState>),
    onSliderChange: (field: "rarity", value: number) =>
      updateForm({ [field]: Math.round(value) } as Partial<RecruitFormState>),
    onOrganizationChange: (organization: RecruitFormState["organization"]) =>
      updateForm({ organization }),
    onProfessionChange: (profession: RecruitFormState["profession"]) =>
      updateForm({ profession }),
  };

  return (
    <AppLayout
      headerActions={
        <Button onClick={handleExport} disabled={isExporting || !fontsReady}>
          {isExporting && <Spinner data-icon="inline-start" />}
          导出
        </Button>
      }
      contentClassName="h-[calc(100vh-65px)] overflow-hidden bg-muted"
    >
      <div className="relative flex h-full">
        <aside className="hidden h-full w-80 shrink-0 border-r bg-background lg:block">
          <AkRecruitToolbar variant="desktop" {...toolbarProps} />
        </aside>

        <section className="relative min-w-0 flex-1">
          <AkRecruitCanvas>
            {(previewScale) => (
              <AkRecruitPreview
                form={form}
                fontsReady={fontsReady}
                imageSize={imageSize}
                previewScale={previewScale}
                onImageTransformCommit={(next) =>
                  setForm((current) => ({
                    ...current,
                    ...next,
                  }))
                }
              />
            )}
          </AkRecruitCanvas>

          <AkRecruitToolbar variant="mobile" {...toolbarProps} />
        </section>
      </div>
    </AppLayout>
  );
}
