import { type ChangeEvent, useEffect, useState } from "react";
import { Download } from "lucide-react";
import { AkRecruitCanvas } from "@/components/akRecruit/akRecruitCanvas";
import {
  akRecruitAssets,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  getImageLayout,
  initialFormState,
  MAX_FILE_SIZE,
  organizationAssetMap,
  professionAssetMap,
  type ImageSize,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";
import { AkRecruitPreview } from "@/components/akRecruit/akRecruitPreview";
import { AkRecruitToolbar } from "@/components/akRecruit/akRecruitToolbar";
import { AppLayout } from "@/components/layout/appLayout";
import { Button } from "@/components/ui/button";

async function loadImage(src: string) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  await image.decode();
  return image;
}

async function ensureRecruitFontsLoaded() {
  await Promise.all([
    document.fonts.load('120px "Source Han Serif CN"'),
    document.fonts.load('48px "Novecento Wide"'),
    document.fonts.load('36px "Recruit Intro Sans"'),
  ]);
}

function wrapIntroLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  let currentLine = "";

  for (const char of text) {
    const nextLine = `${currentLine}${char}`;
    if (
      ctx.measureText(nextLine).width <= maxWidth ||
      currentLine.length === 0
    ) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = char;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function exportRecruitImage(form: RecruitFormState) {
  const [background, organizationMark, starMark] = await Promise.all([
    loadImage(akRecruitAssets.bgImage),
    loadImage(organizationAssetMap[form.organization]),
    loadImage(akRecruitAssets.starImage),
  ]);

  const professionMark = form.profession
    ? await loadImage(professionAssetMap[form.profession])
    : null;
  const uploadedImage = form.imageUrl ? await loadImage(form.imageUrl) : null;

  await ensureRecruitFontsLoaded();

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("当前环境不支持导出画布。");
  }

  ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(
    organizationMark,
    342,
    190,
    500,
    (organizationMark.height / organizationMark.width) * 500,
  );

  if (uploadedImage) {
    const layout = getImageLayout(
      uploadedImage.width,
      uploadedImage.height,
      form.imageScale,
      form.imageOffsetX,
      form.imageOffsetY,
    );
    ctx.drawImage(
      uploadedImage,
      layout.imageX,
      layout.imageY,
      layout.imageWidth,
      layout.imageHeight,
    );
  }

  const starSize = 90;
  const starOverlap = 35;
  const starsWidth =
    form.rarity > 0
      ? starSize * form.rarity - starOverlap * (form.rarity - 1)
      : 0;

  ctx.textBaseline = "top";

  const professionWidth = professionMark ? 260 : 0;
  const professionGap = professionMark ? 4 : 0;

  ctx.font = '120px "Source Han Serif CN"';
  const nameWidth = ctx.measureText(form.name || " ").width;

  ctx.font = '48px "Novecento Wide"';
  const enNameWidth = ctx.measureText(form.enName || " ").width;

  const textColumnWidth = Math.max(nameWidth, enNameWidth);
  const infoRowWidth = professionWidth + professionGap + textColumnWidth;
  const blockWidth = Math.max(starsWidth + 16, infoRowWidth);
  const blockLeft = CANVAS_WIDTH / 2 - blockWidth / 2;
  const starsLeft = blockLeft + 16;
  const infoTop = 586;
  const rowTop = infoTop + starSize + 18;
  const textLeft = blockLeft + professionWidth + professionGap;

  for (let index = 0; index < form.rarity; index += 1) {
    const currentX = starsLeft + index * (starSize - starOverlap);
    ctx.drawImage(starMark, currentX, infoTop, starSize, starSize);
  }

  if (professionMark) {
    const professionHeight =
      (professionMark.height / professionMark.width) * professionWidth;
    ctx.drawImage(
      professionMark,
      blockLeft,
      rowTop + 10,
      professionWidth,
      professionHeight,
    );
  }

  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.92)";
  ctx.fillStyle = "#ffffff";

  if (form.name) {
    ctx.font = '120px "Source Han Serif CN"';
    ctx.lineWidth = 6;
    ctx.strokeText(form.name, textLeft, rowTop);
    ctx.fillText(form.name, textLeft, rowTop);
  }

  if (form.enName) {
    ctx.font = '48px "Novecento Wide"';
    ctx.lineWidth = 3;
    ctx.strokeText(form.enName, textLeft, rowTop + 132);
    ctx.fillText(form.enName, textLeft, rowTop + 132);
  }

  const gradient = ctx.createLinearGradient(
    0,
    CANVAS_HEIGHT * 0.95,
    0,
    CANVAS_HEIGHT * 0.78,
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.92)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, CANVAS_HEIGHT * 0.74, CANVAS_WIDTH, CANVAS_HEIGHT * 0.26);

  if (form.intro) {
    ctx.font = '36px "Recruit Intro Sans"';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    const introLines = wrapIntroLines(ctx, form.intro, 1280);
    const lineHeight = 48;
    const introX = (CANVAS_WIDTH - 1280) / 2;
    const introY = CANVAS_HEIGHT - 36 - introLines.length * lineHeight;
    introLines.forEach((line, index) => {
      ctx.fillText(line, introX, introY + index * lineHeight);
    });
  }

  return canvas.toDataURL("image/png");
}

export function AkRecruitPage() {
  const [form, setForm] = useState(initialFormState);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    void ensureRecruitFontsLoaded();
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setImageError(null);
      setForm((current) => {
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
    setForm((current) => {
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
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AppLayout
      headerActions={
        <Button onClick={handleExport} disabled={isExporting}>
          <Download />
          {isExporting ? "导出中..." : "导出"}
        </Button>
      }
      contentClassName="h-[calc(100vh-65px)] overflow-hidden bg-[#f5f5f5]"
    >
      <div className="relative flex h-full">
        <aside className="hidden h-full w-80 shrink-0 border-r bg-background lg:block">
          <AkRecruitToolbar
            form={form}
            imageError={imageError}
            onFileChange={handleFileChange}
            onTextChange={(field, value) =>
              setForm((current) => ({ ...current, [field]: value }))
            }
            onSliderChange={(field, value) =>
              setForm((current) => ({
                ...current,
                [field]: Math.round(value),
              }))
            }
            onOrganizationChange={(value) =>
              setForm((current) => ({ ...current, organization: value }))
            }
            onProfessionChange={(value) =>
              setForm((current) => ({ ...current, profession: value }))
            }
          />
        </aside>

        <section className="relative min-w-0 flex-1">
          <AkRecruitCanvas
            hint={
              <div className="absolute left-4 top-4 z-10 rounded-full bg-background/90 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                滚轮或双指缩放图片，拖动调整位置
              </div>
            }
          >
            {(previewScale) => (
              <AkRecruitPreview
                form={form}
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

          <AkRecruitToolbar
            form={form}
            imageError={imageError}
            onFileChange={handleFileChange}
            onTextChange={(field, value) =>
              setForm((current) => ({ ...current, [field]: value }))
            }
            onSliderChange={(field, value) =>
              setForm((current) => ({
                ...current,
                [field]: Math.round(value),
              }))
            }
            onOrganizationChange={(value) =>
              setForm((current) => ({ ...current, organization: value }))
            }
            onProfessionChange={(value) =>
              setForm((current) => ({ ...current, profession: value }))
            }
          />
        </section>
      </div>
    </AppLayout>
  );
}
