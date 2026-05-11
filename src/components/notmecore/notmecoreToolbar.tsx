import type { ChangeEvent } from "react";
import {
  notmecoreTextFontOptions,
  notmecoreTemplateSpec,
  type NotmecoreFormState,
  type NotmecoreTextFontFamily,
  type NotmecoreTextLayerMode,
} from "@/components/notmecore/notmecoreConfig";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NotmecoreToolbarProps = {
  variant: "desktop" | "mobile";
  form: NotmecoreFormState;
  imageError: string | null;
  backgroundImageError: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBackgroundImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearBackgroundImage: () => void;
  onBackgroundColorChange: (value: string) => void;
  onSaturationChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onBrightnessChange: (value: number) => void;
  onPosterizeLevelsChange: (value: number) => void;
  onTintColorChange: (value: string) => void;
  onBlendOpacityChange: (value: number) => void;
  onTextChange: (value: string) => void;
  onTextRepeatCountChange: (value: number) => void;
  onTextFontFamilyChange: (value: NotmecoreTextFontFamily) => void;
  onTextFontSizeChange: (value: number) => void;
  onTextColorChange: (value: string) => void;
  onTextLetterSpacingChange: (value: number) => void;
  onTextJitterYChange: (value: number) => void;
  onTextLayerModeChange: (value: NotmecoreTextLayerMode) => void;
  onShuffleTextScatter: () => void;
};

export function NotmecoreToolbar({
  variant,
  form,
  imageError,
  backgroundImageError,
  onFileChange,
  onBackgroundImageFileChange,
  onClearBackgroundImage,
  onBackgroundColorChange,
  onSaturationChange,
  onContrastChange,
  onBrightnessChange,
  onPosterizeLevelsChange,
  onTintColorChange,
  onBlendOpacityChange,
  onTextChange,
  onTextRepeatCountChange,
  onTextFontFamilyChange,
  onTextFontSizeChange,
  onTextColorChange,
  onTextLetterSpacingChange,
  onTextJitterYChange,
  onTextLayerModeChange,
  onShuffleTextScatter,
}: NotmecoreToolbarProps) {
  const textLayerModeOptions: Array<{
    value: NotmecoreTextLayerMode;
    label: string;
  }> = [
    { value: "top", label: "顶部" },
    { value: "bottom", label: "底部" },
    { value: "random", label: "随机" }
  ];

  const sections = [
    {
      key: "image",
      label: "图片",
      desc: "上传原图并设置导出背景色。",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="notmecore-image">上传图片</FieldLabel>
              <FieldContent>
                <Input
                  id="notmecore-image"
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
              <FieldLabel htmlFor="notmecore-background-image">背景图片</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  <Input
                    id="notmecore-background-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={onBackgroundImageFileChange}
                  />
                  {form.backgroundImageUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClearBackgroundImage}
                    >
                      清除
                    </Button>
                  ) : null}
                </div>
                <FieldDescription>
                  支持 PNG / JPEG / WEBP，最大 8MB
                  {form.backgroundImageFile
                    ? `，当前文件：${form.backgroundImageFile.name}`
                    : ""}
                </FieldDescription>
                {backgroundImageError ? (
                  <p className="text-sm text-destructive">{backgroundImageError}</p>
                ) : null}
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="notmecore-background">背景颜色</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  <Input
                    id="notmecore-background"
                    type="color"
                    value={form.backgroundColor}
                    className="h-10 w-16 rounded-none p-1"
                    onChange={(event) =>
                      onBackgroundColorChange(event.target.value)
                    }
                  />
                  <Input
                    value={form.backgroundColor}
                    onChange={(event) =>
                      onBackgroundColorChange(event.target.value)
                    }
                  />
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "text",
      label: "文字",
      desc: "设置装饰文字内容、数量和基础视觉样式。",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="notmecore-text">文字</FieldLabel>
              <FieldContent>
                <Textarea
                  id="notmecore-text"
                  value={form.text}
                  maxLength={notmecoreTemplateSpec.textMaxLength}
                  rows={3}
                  onChange={(event) => onTextChange(event.target.value)}
                />
                <FieldDescription>
                  不超过 {notmecoreTemplateSpec.textMaxLength} 字，当前
                  {form.text.length} 字。
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>文字块数量</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.textRepeatCount]}
                    min={notmecoreTemplateSpec.textRepeatCountRange.min}
                    max={notmecoreTemplateSpec.textRepeatCountRange.max}
                    step={notmecoreTemplateSpec.textRepeatCountRange.step}
                    onValueChange={(value) =>
                      onTextRepeatCountChange(value[0] ?? form.textRepeatCount)
                    }
                  />
                  <FieldDescription>
                    当前值：{form.textRepeatCount}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>字体</FieldLabel>
              <FieldContent>
                <Select
                  value={form.textFontFamily}
                  onValueChange={(value) =>
                    onTextFontFamilyChange(value as NotmecoreTextFontFamily)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择字体" />
                  </SelectTrigger>
                  <SelectContent>
                    {notmecoreTextFontOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="notmecore-text-color">字体大小</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      id="notmecore-text-color"
                      type="color"
                      value={form.textColor}
                      className="h-10 w-10 shrink-0 rounded-none p-1"
                      onChange={(event) => onTextColorChange(event.target.value)}
                    />
                    <Slider
                      value={[form.textFontSize]}
                      min={notmecoreTemplateSpec.textFontSizeRange.min}
                      max={notmecoreTemplateSpec.textFontSizeRange.max}
                      step={notmecoreTemplateSpec.textFontSizeRange.step}
                      onValueChange={(value) =>
                        onTextFontSizeChange(value[0] ?? form.textFontSize)
                      }
                    />
                  </div>
                  <FieldDescription>
                    当前值：{form.textFontSize}px
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "scatter",
      label: "分布",
      desc: "控制文字块在画布中的层级、间距和随机散布方式。",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>文字层级</FieldLabel>
              <FieldContent>
                <div className="flex flex-wrap gap-2">
                  {textLayerModeOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      size="sm"
                      variant={
                        form.textLayerMode === option.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() => onTextLayerModeChange(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>字符间距</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.textLetterSpacing]}
                    min={notmecoreTemplateSpec.textLetterSpacingRange.min}
                    max={notmecoreTemplateSpec.textLetterSpacingRange.max}
                    step={notmecoreTemplateSpec.textLetterSpacingRange.step}
                    onValueChange={(value) =>
                      onTextLetterSpacingChange(
                        value[0] ?? form.textLetterSpacing,
                      )
                    }
                  />
                  <FieldDescription>
                    当前值：{form.textLetterSpacing}px
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>上下偏移</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.textJitterY]}
                    min={notmecoreTemplateSpec.textJitterYRange.min}
                    max={notmecoreTemplateSpec.textJitterYRange.max}
                    step={notmecoreTemplateSpec.textJitterYRange.step}
                    onValueChange={(value) =>
                      onTextJitterYChange(value[0] ?? form.textJitterY)
                    }
                  />
                  <FieldDescription>
                    当前值：{form.textJitterY}px
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Button
              type="button"
              variant="outline"
              onClick={onShuffleTextScatter}
            >
              随机分布
            </Button>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "filter",
      label: "滤镜",
      desc: "调整图片效果。",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>饱和度</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.saturation]}
                    min={notmecoreTemplateSpec.saturationRange.min}
                    max={notmecoreTemplateSpec.saturationRange.max}
                    step={notmecoreTemplateSpec.saturationRange.step}
                    onValueChange={(value) =>
                      onSaturationChange(value[0] ?? form.saturation)
                    }
                  />
                  <FieldDescription>
                    当前值：{form.saturation.toFixed(2)}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>对比度</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.contrast]}
                    min={notmecoreTemplateSpec.contrastRange.min}
                    max={notmecoreTemplateSpec.contrastRange.max}
                    step={notmecoreTemplateSpec.contrastRange.step}
                    onValueChange={(value) =>
                      onContrastChange(value[0] ?? form.contrast)
                    }
                  />
                  <FieldDescription>
                    当前值：{form.contrast.toFixed(2)}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>亮度</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.brightness]}
                    min={notmecoreTemplateSpec.brightnessRange.min}
                    max={notmecoreTemplateSpec.brightnessRange.max}
                    step={notmecoreTemplateSpec.brightnessRange.step}
                    onValueChange={(value) =>
                      onBrightnessChange(value[0] ?? form.brightness)
                    }
                  />
                  <FieldDescription>
                    当前值：{form.brightness.toFixed(2)}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>色阶层数</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.posterizeLevels]}
                    min={notmecoreTemplateSpec.posterizeLevelsRange.min}
                    max={notmecoreTemplateSpec.posterizeLevelsRange.max}
                    step={notmecoreTemplateSpec.posterizeLevelsRange.step}
                    onValueChange={(value) =>
                      onPosterizeLevelsChange(value[0] ?? form.posterizeLevels)
                    }
                  />
                  <FieldDescription>
                    {form.posterizeLevels === 0
                      ? "当前值：关闭"
                      : `当前值：${form.posterizeLevels}`}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="notmecore-tint-color">偏色强度</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      id="notmecore-tint-color"
                      type="color"
                      value={form.tintColor}
                      className="h-10 w-10 shrink-0 rounded-none p-1"
                      onChange={(event) => onTintColorChange(event.target.value)}
                    />
                    <Slider
                      value={[form.blendOpacity]}
                      min={notmecoreTemplateSpec.blendOpacityRange.min}
                      max={notmecoreTemplateSpec.blendOpacityRange.max}
                      step={notmecoreTemplateSpec.blendOpacityRange.step}
                      onValueChange={(value) =>
                        onBlendOpacityChange(value[0] ?? form.blendOpacity)
                      }
                    />
                  </div>
                  <FieldDescription>
                    当前值：{form.blendOpacity.toFixed(2)}
                  </FieldDescription>
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
  ] as const;

  return (
    <>
      {variant === "desktop" ? (
        <div className="flex h-full flex-col bg-background p-4">
          <Tabs
            defaultValue={sections[0].key}
            orientation="vertical"
            className="min-h-0 flex flex-1 gap-4"
          >
            <TabsList className="flex h-auto w-18 shrink-0 flex-col items-stretch justify-start gap-1 rounded-xl p-1">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.key}
                  value={section.key}
                  className="h-auto justify-start px-3 py-2 text-left whitespace-normal"
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
                  className="mt-0"
                >
                  <div>
                    <FieldLegend>{section.label}</FieldLegend>
                    <FieldDescription>{section.desc}</FieldDescription>
                    <div className="mt-4">{section.content}</div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      ) : (
        <div className={cn("lg:hidden")}>
          <Tabs defaultValue={sections[0].key} className="bg-background p-4">
            <TabsList className="grid h-auto w-full grid-cols-3">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.key}
                  value={section.key}
                  className="px-2 py-2 text-xs"
                >
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent
                key={section.key}
                value={section.key}
                className="mt-4"
              >
                <div className="mt-4 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
                  {section.content}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
}
