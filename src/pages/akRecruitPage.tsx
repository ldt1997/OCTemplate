import {
  type ChangeEvent,
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Download } from "lucide-react";
import bgImage from "@/assets/akrecruit/bg.webp";
import starImage from "@/assets/akrecruit/star.svg";
import abyssalHuntersImage from "@/assets/akrecruit/Abyssal_Hunters_white.webp";
import blackSteelImage from "@/assets/akrecruit/Black_Steel_white.webp";
import leithaniaImage from "@/assets/akrecruit/Leithania_white.webp";
import lungmenImage from "@/assets/akrecruit/lungmen.webp";
import penguinLogisticsImage from "@/assets/akrecruit/Penguin_Logistics_white.webp";
import rhineImage from "@/assets/akrecruit/Rhine_Lab_white.webp";
import rhodesIslandImage from "@/assets/akrecruit/rhodes_island_white.webp";
import casterImage from "@/assets/akrecruit/Caster.webp";
import defenderImage from "@/assets/akrecruit/Defender.webp";
import guardImage from "@/assets/akrecruit/guard.webp";
import medicImage from "@/assets/akrecruit/Medic.webp";
import sniperImage from "@/assets/akrecruit/Sniper.webp";
import specialistImage from "@/assets/akrecruit/Specialist.webp";
import supporterImage from "@/assets/akrecruit/Supporter.webp";
import vanguardImage from "@/assets/akrecruit/Vanguard.webp";
import { AppLayout } from "@/components/layout/appLayout";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const TEXTAREA_CLASSNAME =
  "flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const organizationOptions = [
  { label: "罗德岛", value: "rhodes_island" },
  { label: "莱茵生命", value: "rhine" },
  { label: "龙门", value: "lungmen" },
  { label: "深海猎人", value: "abyssal_hunters" },
  { label: "企鹅物流", value: "penguin_logistics" },
  { label: "黑钢国际", value: "black_steel" },
  { label: "莱塔尼亚", value: "leithania" },
] as const;

const professionOptions = [
  { label: "先锋", value: "vanguard" },
  { label: "近卫", value: "guard" },
  { label: "重装", value: "defender" },
  { label: "狙击", value: "sniper" },
  { label: "术师", value: "caster" },
  { label: "医疗", value: "medic" },
  { label: "辅助", value: "supporter" },
  { label: "特种", value: "specialist" },
] as const;

type OrganizationValue = (typeof organizationOptions)[number]["value"];
type ProfessionValue = (typeof professionOptions)[number]["value"];

type RecruitFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  scale: number;
  offsetX: number;
  offsetY: number;
  organization: OrganizationValue;
  profession: ProfessionValue | "";
  rarity: number;
  name: string;
  enName: string;
  intro: string;
};

type CanvasTransform = {
  zoom: number;
  x: number;
  y: number;
};

type RenderLayout = {
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
};

type ImageSize = {
  width: number;
  height: number;
};

const organizationAssetMap: Record<OrganizationValue, string> = {
  rhodes_island: rhodesIslandImage,
  rhine: rhineImage,
  lungmen: lungmenImage,
  abyssal_hunters: abyssalHuntersImage,
  penguin_logistics: penguinLogisticsImage,
  black_steel: blackSteelImage,
  leithania: leithaniaImage,
};

const professionAssetMap: Record<ProfessionValue, string> = {
  vanguard: vanguardImage,
  guard: guardImage,
  defender: defenderImage,
  sniper: sniperImage,
  caster: casterImage,
  medic: medicImage,
  supporter: supporterImage,
  specialist: specialistImage,
};

const initialFormState: RecruitFormState = {
  imageFile: null,
  imageUrl: null,
  scale: 0.5,
  offsetX: 0.5,
  offsetY: 0.5,
  organization: "lungmen",
  profession: "",
  rarity: 6,
  name: "",
  enName: "",
  intro: "",
};

const initialTransform: CanvasTransform = {
  zoom: 1,
  x: 0,
  y: 0,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getImageLayout(imageWidth: number, imageHeight: number, scale: number, offsetX: number, offsetY: number): RenderLayout {
  const nextHeight = CANVAS_HEIGHT * scale;
  const nextWidth = imageHeight === 0 ? 0 : (imageWidth / imageHeight) * nextHeight;
  const availableX = CANVAS_WIDTH - nextWidth;
  const availableY = CANVAS_HEIGHT - nextHeight;

  return {
    imageWidth: nextWidth,
    imageHeight: nextHeight,
    imageX: availableX * offsetX,
    imageY: availableY * offsetY,
  };
}

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

function wrapIntroLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let currentLine = "";

  for (const char of text) {
    const nextLine = `${currentLine}${char}`;
    if (ctx.measureText(nextLine).width <= maxWidth || currentLine.length === 0) {
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
    loadImage(bgImage),
    loadImage(organizationAssetMap[form.organization]),
    loadImage(starImage),
  ]);

  const professionMark = form.profession ? await loadImage(professionAssetMap[form.profession]) : null;
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
  ctx.drawImage(organizationMark, 342, 190, 500, (organizationMark.height / organizationMark.width) * 500);

  if (uploadedImage) {
    const layout = getImageLayout(
      uploadedImage.width,
      uploadedImage.height,
      form.scale,
      form.offsetX,
      form.offsetY,
    );
    ctx.drawImage(uploadedImage, layout.imageX, layout.imageY, layout.imageWidth, layout.imageHeight);
  }

  const starSize = 90;
  const starOverlap = 35;
  const starsWidth = form.rarity > 0 ? starSize * form.rarity - starOverlap * (form.rarity - 1) : 0;

  ctx.textBaseline = "top";

  const professionWidth = professionMark ? 150 : 0;
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
    const professionHeight = (professionMark.height / professionMark.width) * professionWidth;
    ctx.drawImage(professionMark, blockLeft, rowTop + 26, professionWidth, professionHeight);
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

  const gradient = ctx.createLinearGradient(0, CANVAS_HEIGHT * 0.95, 0, CANVAS_HEIGHT * 0.78);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.92)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, CANVAS_HEIGHT * 0.74, CANVAS_WIDTH, CANVAS_HEIGHT * 0.26);

  if (form.intro) {
    ctx.font = '36px "Recruit Intro Sans"';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    const introLines = wrapIntroLines(ctx, form.intro, CANVAS_WIDTH * 0.8);
    const lineHeight = 48;
    const introY = CANVAS_HEIGHT - 120 - introLines.length * lineHeight;
    introLines.forEach((line, index) => {
      ctx.fillText(line, CANVAS_WIDTH / 2, introY + index * lineHeight);
    });
  }

  return canvas.toDataURL("image/png");
}

function PreviewPoster({
  form,
  imageSize,
}: {
  form: RecruitFormState;
  imageSize: ImageSize | null;
}) {
  const professionAsset = form.profession ? professionAssetMap[form.profession] : null;
  const imageLayout = useMemo(() => {
    if (!form.imageUrl || !imageSize) {
      return null;
    }

    return getImageLayout(
      imageSize.width,
      imageSize.height,
      form.scale,
      form.offsetX,
      form.offsetY,
    );
  }, [form.imageUrl, form.offsetX, form.offsetY, form.scale, imageSize]);

  return (
    <div
      className="relative overflow-hidden bg-cover bg-center shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <img
        src={organizationAssetMap[form.organization]}
        alt=""
        className="pointer-events-none absolute select-none"
        style={{ left: 342, top: 190, width: 500 }}
      />

      {form.imageUrl && imageLayout ? (
        <img
          src={form.imageUrl}
          alt="上传的角色图片"
          className="pointer-events-none absolute select-none"
          style={{
            left: imageLayout.imageX,
            top: imageLayout.imageY,
            width: imageLayout.imageWidth,
            height: imageLayout.imageHeight,
          }}
        />
      ) : null}

      <div
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-start"
        style={{ top: 586 }}
      >
        <div className="ml-4 flex items-center">
          {Array.from({ length: form.rarity }).map((_, index) => (
            <img
              key={`star-${index}`}
              src={starImage}
              alt=""
              className={`h-[90px] w-[90px] ${index === 0 ? "" : "-ml-[35px]"}`}
            />
          ))}
        </div>

        <div className="mt-[18px] flex items-start gap-1">
          {professionAsset ? (
            <img
              src={professionAsset}
              alt=""
              className="mt-6 h-auto w-[150px] shrink-0"
            />
          ) : null}

          <div className="flex flex-col items-start">
            <div
              className="text-[120px] font-black leading-none text-white"
              style={posterNameStyle}
            >
              {form.name || " "}
            </div>
            <div
              className="mt-2 text-5xl uppercase leading-none text-white"
              style={posterEnNameStyle}
            >
              {form.enName || " "}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.58) 18%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        className="absolute bottom-[120px] left-1/2 w-[80%] -translate-x-1/2 text-center text-[36px] leading-[1.35] text-white"
        style={posterIntroStyle}
      >
        {form.intro}
      </div>
    </div>
  );
}

function ToolbarPanel({
  form,
  imageError,
  onFileChange,
  onTextChange,
  onSliderChange,
  onOrganizationChange,
  onProfessionChange,
}: {
  form: RecruitFormState;
  imageError: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (field: "name" | "enName" | "intro", value: string) => void;
  onSliderChange: (field: "scale" | "offsetX" | "offsetY" | "rarity", value: number) => void;
  onOrganizationChange: (value: OrganizationValue) => void;
  onProfessionChange: (value: ProfessionValue | "") => void;
}) {
  const sections = [
    {
      key: "appearance",
      label: "形象设置",
      desc: "调整人物图片的显示效果与位置",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="image-upload">人物图片</FieldLabel>
              <FieldContent>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={onFileChange}
                />
                <FieldDescription>
                  支持 PNG / JPEG，最大 5MB{form.imageFile ? `，当前文件：${form.imageFile.name}` : ""}
                </FieldDescription>
                {imageError ? (
                  <p className="text-sm text-destructive">{imageError}</p>
                ) : null}
              </FieldContent>
            </Field>

            <SliderField
              label="图片缩放"
              value={form.scale}
              min={0.1}
              max={1}
              step={0.01}
              displayValue={form.scale.toFixed(2)}
              onValueChange={(value) => onSliderChange("scale", value)}
            />
            <SliderField
              label="水平偏移 (X)"
              value={form.offsetX}
              min={0}
              max={1}
              step={0.01}
              displayValue={form.offsetX.toFixed(2)}
              onValueChange={(value) => onSliderChange("offsetX", value)}
            />
            <SliderField
              label="垂直偏移 (Y)"
              value={form.offsetY}
              min={0}
              max={1}
              step={0.01}
              displayValue={form.offsetY.toFixed(2)}
              onValueChange={(value) => onSliderChange("offsetY", value)}
            />
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "role",
      label: "角色信息",
      desc: "选择角色星级职业和所属组织",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>所属组织</FieldLabel>
              <FieldContent>
                <Select value={form.organization} onValueChange={(value) => onOrganizationChange(value as OrganizationValue)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择组织" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>职业</FieldLabel>
              <FieldContent>
                <Select value={form.profession || undefined} onValueChange={(value) => onProfessionChange(value as ProfessionValue)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择职业" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <SliderField
              label="星级"
              value={form.rarity}
              min={1}
              max={6}
              step={1}
              displayValue={`${form.rarity} 星`}
              onValueChange={(value) => onSliderChange("rarity", value)}
            />
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "text",
      label: "文本信息",
      desc: "设置角色展示文本",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="character-name">名称</FieldLabel>
              <FieldContent>
                <Input
                  id="character-name"
                  value={form.name}
                  placeholder="10个字以内"
                  maxLength={10}
                  onChange={(event) => onTextChange("name", event.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="character-en-name">英文名称</FieldLabel>
              <FieldContent>
                <Input
                  id="character-en-name"
                  value={form.enName}
                  placeholder="20个字以内"
                  maxLength={20}
                  onChange={(event) => onTextChange("enName", event.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="character-intro">开场白</FieldLabel>
              <FieldContent>
                <textarea
                  id="character-intro"
                  className={TEXTAREA_CLASSNAME}
                  value={form.intro}
                  placeholder="100字以内"
                  maxLength={100}
                  onChange={(event) => onTextChange("intro", event.target.value)}
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
  ] as const;

  return (
    <>
      <div className="hidden h-full lg:block">
        <div className="flex h-full flex-col bg-background p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">模板参数</h2>
            <p className="mt-1 text-sm text-muted-foreground">修改配置后会实时更新右侧画布预览。</p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="space-y-6">
              {sections.map((section) => (
                <section key={section.key} className="rounded-xl border bg-background p-4">
                  <FieldLegend>{section.label}</FieldLegend>
                  <FieldDescription>{section.desc}</FieldDescription>
                  <div className="mt-4">{section.content}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-3 z-20 lg:hidden">
        <Tabs defaultValue={sections[0].key} className="rounded-2xl border bg-background/95 p-3 shadow-xl backdrop-blur">
          <TabsList className="grid h-auto w-full grid-cols-3">
            {sections.map((section) => (
              <TabsTrigger key={section.key} value={section.key} className="px-2 py-2 text-xs">
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.key} value={section.key} className="mt-4">
              <div className="rounded-xl border p-4">
                <FieldTitle>{section.label}</FieldTitle>
                <FieldDescription className="mt-1">{section.desc}</FieldDescription>
                <div className="mt-4">{section.content}</div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onValueChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onValueChange: (value: number) => void;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">当前值</span>
          <span>{displayValue}</span>
        </div>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={(values) => onValueChange(values[0] ?? value)}
        />
      </FieldContent>
    </Field>
  );
}

const posterNameStyle: CSSProperties = {
  fontFamily: '"Source Han Serif CN", serif',
  WebkitTextStroke: "2px rgba(0, 0, 0, 0.9)",
  paintOrder: "stroke fill",
};

const posterEnNameStyle: CSSProperties = {
  fontFamily: '"Novecento Wide", sans-serif',
  WebkitTextStroke: "1px rgba(0, 0, 0, 0.9)",
  paintOrder: "stroke fill",
};

const posterIntroStyle: CSSProperties = {
  fontFamily: '"Recruit Intro Sans", "Microsoft YaHei", sans-serif',
};

export function AkRecruitPage() {
  const [form, setForm] = useState(initialFormState);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [transform, setTransform] = useState(initialTransform);
  const [baseScale, setBaseScale] = useState(1);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pointerStateRef = useRef<{
    mode: "idle" | "pan" | "pinch";
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    initialZoom: number;
    initialDistance: number;
    pointers: Map<number, { x: number; y: number }>;
  }>({
    mode: "idle",
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    initialZoom: 1,
    initialDistance: 0,
    pointers: new Map(),
  });

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

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const nextScale = Math.min(
        entry.contentRect.width / CANVAS_WIDTH,
        entry.contentRect.height / CANVAS_HEIGHT,
      );
      setBaseScale(clamp(nextScale, 0.12, 1));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
      setImageError("图片大小不能超过 5MB。");
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

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.12 : -0.12;
    setTransform((current) => ({
      ...current,
      zoom: clamp(current.zoom + delta, 0.5, 3),
    }));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.pointers.size === 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialZoom = transform.zoom;
      state.initialDistance = Math.hypot(second.x - first.x, second.y - first.y);
      return;
    }

    if (state.pointers.size === 1) {
      state.mode = "pan";
      state.startX = event.clientX;
      state.startY = event.clientY;
      state.originX = transform.x;
      state.originY = transform.y;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    if (!state.pointers.has(event.pointerId)) {
      return;
    }

    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (state.mode === "pinch" && state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      if (state.initialDistance > 0) {
        setTransform((current) => ({
          ...current,
          zoom: clamp(state.initialZoom * (distance / state.initialDistance), 0.5, 3),
        }));
      }
      return;
    }

    if (state.mode === "pan") {
      setTransform((current) => ({
        ...current,
        x: state.originX + event.clientX - state.startX,
        y: state.originY + event.clientY - state.startY,
      }));
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    state.pointers.delete(event.pointerId);

    if (state.pointers.size >= 2) {
      const [first, second] = Array.from(state.pointers.values());
      state.mode = "pinch";
      state.initialZoom = transform.zoom;
      state.initialDistance = Math.hypot(second.x - first.x, second.y - first.y);
      return;
    }

    if (state.pointers.size === 1) {
      const [remaining] = Array.from(state.pointers.values());
      state.mode = "pan";
      state.startX = remaining.x;
      state.startY = remaining.y;
      state.originX = transform.x;
      state.originY = transform.y;
      return;
    }

    state.mode = "idle";
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
          <ToolbarPanel
            form={form}
            imageError={imageError}
            onFileChange={handleFileChange}
            onTextChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
            onSliderChange={(field, value) =>
              setForm((current) => ({
                ...current,
                [field]: field === "rarity" ? Math.round(value) : value,
              }))
            }
            onOrganizationChange={(value) => setForm((current) => ({ ...current, organization: value }))}
            onProfessionChange={(value) => setForm((current) => ({ ...current, profession: value }))}
          />
        </aside>

        <section className="relative min-w-0 flex-1">
          <div
            ref={viewportRef}
            className={`relative flex h-full items-center justify-center overflow-hidden touch-none px-4 py-4 lg:px-10 lg:py-8 ${pointerStateRef.current.mode === "pan" ? "cursor-grabbing" : "cursor-grab"}`}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
          >
            <div className="absolute left-4 top-4 z-10 rounded-full bg-background/90 px-3 py-1 text-xs text-muted-foreground shadow-sm">
              滚轮或双指缩放，拖动画布查看细节
            </div>

            <div
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${baseScale * transform.zoom})`,
                transformOrigin: "center center",
              }}
            >
              <PreviewPoster form={form} imageSize={imageSize} />
            </div>
          </div>

          <ToolbarPanel
            form={form}
            imageError={imageError}
            onFileChange={handleFileChange}
            onTextChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
            onSliderChange={(field, value) =>
              setForm((current) => ({
                ...current,
                [field]: field === "rarity" ? Math.round(value) : value,
              }))
            }
            onOrganizationChange={(value) => setForm((current) => ({ ...current, organization: value }))}
            onProfessionChange={(value) => setForm((current) => ({ ...current, profession: value }))}
          />
        </section>
      </div>
    </AppLayout>
  );
}
