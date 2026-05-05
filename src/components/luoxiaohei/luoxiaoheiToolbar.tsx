import type { ChangeEvent } from "react";
import {
  fallbackPresetPairs,
  logoColorOptions,
  type LogoColorValue,
  type LuoxiaoheiFormState,
} from "@/components/luoxiaohei/luoxiaoheiConfig";
import type { ColorPair } from "@/lib/colorRecommendation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LuoxiaoheiToolbarProps = {
  variant: "desktop" | "mobile";
  form: LuoxiaoheiFormState;
  imageError: string | null;
  recommendationError: string | null;
  isExtractingColors: boolean;
  presetPairs: ColorPair[];
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (
    field: "titleLeft" | "titleRight" | "name",
    value: string,
  ) => void;
  onColorChange: (field: "bgColor1" | "bgColor2", value: string) => void;
  onImageScaleChange: (value: number) => void;
  onPresetSelect: (pair: ColorPair) => void;
  onLogoColorChange: (value: LogoColorValue) => void;
};

function ColorSwatch({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-block h-4 w-4 border border-black/20", className)}
      style={{ backgroundColor: color }}
    />
  );
}

export function LuoxiaoheiToolbar({
  variant,
  form,
  imageError,
  recommendationError,
  isExtractingColors,
  presetPairs,
  onFileChange,
  onTextChange,
  onColorChange,
  onImageScaleChange,
  onPresetSelect,
  onLogoColorChange,
}: LuoxiaoheiToolbarProps) {
  const colorPairs = presetPairs.length > 0 ? presetPairs : fallbackPresetPairs;

  const sections = [
    {
      key: "base",
      label: "基础设置",
      desc: "上传人物图并设置标题、主色和角色名",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="luoxiaohei-image">上传图片</FieldLabel>
              <FieldContent>
                <Input
                  id="luoxiaohei-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onFileChange}
                />
                <FieldDescription>
                  支持 PNG / JPEG / WEBP，最大 8MB
                  {form.imageFile ? `，当前文件：${form.imageFile.name}` : ""}
                </FieldDescription>
                {imageError ? (
                  <p className="text-sm text-destructive">{imageError}</p>
                ) : null}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>缩放</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.imageScale]}
                    min={0.1}
                    max={2}
                    step={0.01}
                    disabled={!form.imageUrl}
                    onValueChange={(value) =>
                      onImageScaleChange(value[0] ?? form.imageScale)
                    }
                  />
                  <FieldDescription>
                    {form.imageUrl
                      ? `${Math.round(form.imageScale * 100)}%`
                      : "上传图片后可调整缩放"}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>推荐色卡</FieldLabel>
              <FieldContent>
                <div className="grid grid-cols-1 gap-2">
                  {colorPairs.map((pair) => {
                    const isActive = form.selectedPresetId === pair.id;

                    return (
                      <button
                        key={pair.id}
                        type="button"
                        className={cn(
                          "flex items-center justify-between border px-3 py-2 text-left transition-colors",
                          isActive
                            ? "border-primary bg-primary/8"
                            : "border-border bg-background hover:bg-accent",
                        )}
                        onClick={() => onPresetSelect(pair)}
                      >
                        <span className="flex items-center gap-2">
                          <ColorSwatch color={pair.left.value} />
                          <ColorSwatch color={pair.right.value} />
                        </span>
                        <span className="text-sm">
                          {pair.left.key} / {pair.right.key}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <FieldDescription>
                  {isExtractingColors
                    ? "正在根据上传图片提取推荐双色..."
                    : form.imageUrl
                      ? "色卡已根据图片主题色自动生成"
                      : "当前显示的是默认推荐色卡"}
                </FieldDescription>
                {recommendationError ? (
                  <p className="text-sm text-destructive">
                    {recommendationError}
                  </p>
                ) : null}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="luoxiaohei-bg-1">背景色 1</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  <Input
                    id="luoxiaohei-bg-1"
                    type="color"
                    value={form.bgColor1}
                    className="h-10 w-16 rounded-none p-1"
                    onChange={(event) =>
                      onColorChange("bgColor1", event.target.value)
                    }
                  />
                  <Input
                    value={form.bgColor1}
                    onChange={(event) =>
                      onColorChange("bgColor1", event.target.value)
                    }
                  />
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="luoxiaohei-bg-2">背景色 2</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  <Input
                    id="luoxiaohei-bg-2"
                    type="color"
                    value={form.bgColor2}
                    className="h-10 w-16 rounded-none p-1"
                    onChange={(event) =>
                      onColorChange("bgColor2", event.target.value)
                    }
                  />
                  <Input
                    value={form.bgColor2}
                    onChange={(event) =>
                      onColorChange("bgColor2", event.target.value)
                    }
                  />
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="luoxiaohei-title-left">左侧标题</FieldLabel>
              <FieldContent>
                <Input
                  id="luoxiaohei-title-left"
                  value={form.titleLeft}
                  placeholder="朝"
                  maxLength={4}
                  onChange={(event) =>
                    onTextChange("titleLeft", event.target.value)
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="luoxiaohei-title-right">
                右侧标题
              </FieldLabel>
              <FieldContent>
                <Input
                  id="luoxiaohei-title-right"
                  value={form.titleRight}
                  placeholder="夜"
                  maxLength={4}
                  onChange={(event) =>
                    onTextChange("titleRight", event.target.value)
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="luoxiaohei-name">人物名称</FieldLabel>
              <FieldContent>
                <Input
                  id="luoxiaohei-name"
                  value={form.name}
                  placeholder="请输入角色名称"
                  maxLength={12}
                  onChange={(event) => onTextChange("name", event.target.value)}
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "logo",
      label: "LOGO",
      desc: "选择底部 LOGO 的颜色版本",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>LOGO 颜色</FieldLabel>
              <FieldContent>
                <div className="grid grid-cols-2 gap-2">
                  {logoColorOptions.map((option) => {
                    const isActive = form.logoColor === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "flex items-center justify-between border px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "border-primary bg-primary/8"
                            : "border-border bg-background hover:bg-accent",
                        )}
                        onClick={() => onLogoColorChange(option.value)}
                      >
                        <span>{option.label}</span>
                        <ColorSwatch
                          color={option.swatch}
                          className={cn(
                            option.value === "white" && "border-black/50",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
  ] as const;

  if (variant === "desktop") {
    return (
      <div className="flex h-full flex-col bg-background p-4">
        <Tabs
          defaultValue={sections[0].key}
          orientation="vertical"
          className="min-h-0 flex flex-1 gap-4"
        >
          <TabsList className="flex h-auto w-22 shrink-0 flex-col items-stretch justify-start gap-1 rounded-none p-1">
            {sections.map((section) => (
              <TabsTrigger
                key={section.key}
                value={section.key}
                className="h-auto justify-start rounded-none px-3 py-2 text-left whitespace-normal"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {sections.map((section) => (
              <TabsContent
                key={section.key}
                value={section.key}
                className="mt-0 space-y-4"
              >
                <div>
                  <FieldLegend className="mb-1">{section.label}</FieldLegend>
                  <p className="text-muted-foreground text-sm">
                    {section.desc}
                  </p>
                </div>
                {section.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-background px-4 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-4">
      {sections.map((section) => (
        <section key={section.key} className="space-y-4">
          <div>
            <FieldLegend className="mb-1">{section.label}</FieldLegend>
            <p className="text-muted-foreground text-sm">{section.desc}</p>
          </div>
          {section.content}
        </section>
      ))}

      <Button type="button" variant="outline" onClick={() => onPresetSelect(colorPairs[0])}>
        重置为当前推荐首选色卡
      </Button>
    </div>
  );
}
