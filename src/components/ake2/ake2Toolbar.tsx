import { useEffect, useState, type ReactNode } from "react";
import { ake2TemplateSpec } from "./ake2Config";
import { ake2Professions } from "./ake2Professions";
import type { useAke2Editor } from "./useAke2Editor";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Ake2ToolbarProps = ReturnType<typeof useAke2Editor>["toolbarProps"] & {
  variant: "desktop" | "mobile";
};

function Section({ legend, description, children }: {
  legend: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <FieldSet>
      <FieldLegend>{legend}</FieldLegend>
      <FieldDescription>{description}</FieldDescription>
      <FieldGroup>{children}</FieldGroup>
    </FieldSet>
  );
}

export function Ake2Toolbar({
  variant, form, imageError, isImageLoading, onUpload, onRemoveImage, onResetImage,
  onProfessionChange, onBranchChange, onNumberChange, onTextChange, onThemeColorChange,
}: Ake2ToolbarProps) {
  const id = (field: string) => `ake2-${variant}-${field}`;
  const profession = ake2Professions.find((item) => item.value === form.profession)!;
  const branch = profession.branches.find((item) => item.value === form.branch);
  const [colorText, setColorText] = useState(form.themeColor);
  useEffect(() => setColorText(form.themeColor), [form.themeColor]);
  const colorValid = /^#[\da-f]{6}$/i.test(colorText);

  const sections = [
    {
      key: "image", label: "立绘",
      content: (
        <Section legend="立绘" description="设置角色立绘图片及显示效果">
          <Field>
            <FieldLabel htmlFor={id("image")}>上传图片</FieldLabel>
            <FieldContent>
              <Input
                id={id("image")}
                type="file"
                accept={ake2TemplateSpec.image.acceptedTypes.join(",")}
                aria-describedby={id("image-help")}
                aria-invalid={!!imageError}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  void onUpload(file);
                }}
              />
              <FieldDescription id={id("image-help")}>支持 PNG、JPEG，最大 10 MB。</FieldDescription>
              {isImageLoading && <p role="status" className="text-sm text-muted-foreground">正在读取图片…</p>}
              {imageError && <p role="alert" className="text-sm text-destructive">{imageError}</p>}
              {form.image && (
                <>
                  <FieldDescription className="break-all">
                    当前文件：{form.image.name}（{form.image.width} × {form.image.height}）
                  </FieldDescription>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onResetImage}>重置位置与缩放</Button>
                    <Button type="button" variant="outline" onClick={onRemoveImage}>移除图片</Button>
                  </div>
                  <FieldDescription>在画布上拖动立绘调整位置，超出画布的部分会被裁切。</FieldDescription>
                </>
              )}
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel id={id("scale-label")}>缩放：{form.scale}%</FieldLabel>
            <FieldContent>
              <Slider
                aria-labelledby={id("scale-label")}
                value={[form.scale]}
                {...ake2TemplateSpec.image.scale}
                onValueChange={([value]) => onNumberChange("scale", value)}
              />
              <FieldDescription>50%–300%，100% 时立绘高度与画布一致。</FieldDescription>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor={id("theme-color")}>主题色</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-3">
                <Input
                  id={id("theme-color")}
                  type="color"
                  className="h-10 w-16 shrink-0 rounded-none p-1"
                  value={form.themeColor}
                  onChange={(event) => onThemeColorChange(event.target.value)}
                />
                <Input
                  aria-label="主题色十六进制值"
                  aria-invalid={!colorValid}
                  value={colorText}
                  placeholder="#FF0000"
                  maxLength={7}
                  onChange={(event) => {
                    setColorText(event.target.value);
                    onThemeColorChange(event.target.value);
                  }}
                  onBlur={() => setColorText(form.themeColor)}
                />
              </div>
              {!colorValid && <FieldDescription>请输入完整的六位颜色值，例如 #FF0000。</FieldDescription>}
            </FieldContent>
          </Field>
        </Section>
      ),
    },
    {
      key: "character", label: "角色",
      content: (
        <Section legend="角色" description="设置角色名称、星级、职业与分支">
          <Field>
            <FieldLabel htmlFor={id("name")}>中文名称</FieldLabel>
            <FieldContent>
              <Input id={id("name")} value={form.name} placeholder="名称" onChange={(event) => onTextChange("name", event.target.value)} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor={id("en-name")}>英文名称</FieldLabel>
            <FieldContent>
              <Input id={id("en-name")} value={form.enName} placeholder="En Name" onChange={(event) => onTextChange("enName", event.target.value)} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel id={id("rarity-label")}>星级：{form.rarity}</FieldLabel>
            <FieldContent>
              <Slider aria-labelledby={id("rarity-label")} value={[form.rarity]} {...ake2TemplateSpec.rarity} onValueChange={([value]) => onNumberChange("rarity", value)} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor={id("profession")}>职业</FieldLabel>
            <FieldContent>
              <Select value={form.profession} onValueChange={onProfessionChange}>
                <SelectTrigger id={id("profession")}><SelectValue placeholder="选择职业" /></SelectTrigger>
                <SelectContent>
                  {ake2Professions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor={id("branch")}>分支</FieldLabel>
            <FieldContent>
              <Select value={form.branch} onValueChange={onBranchChange}>
                <SelectTrigger id={id("branch")} aria-describedby={id("branch-description")}>
                  <SelectValue placeholder="选择分支">{branch?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]">
                  {profession.branches.map((item) => (
                    <SelectItem key={item.value} value={item.value} textValue={item.label} className="items-start">
                      <span className="block">{item.label}</span>
                      <span className="mt-1 block whitespace-normal text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription id={id("branch-description")}>{branch?.description}</FieldDescription>
            </FieldContent>
          </Field>
        </Section>
      ),
    },
    {
      key: "auxiliary", label: "辅助文本",
      content: (
        <Section legend="辅助文本" description="设置模板中的辅助说明文本">
          <Field>
            <FieldLabel htmlFor={id("watermark")}>水印</FieldLabel>
            <FieldContent>
              <Input id={id("watermark")} value={form.watermark} placeholder="@OCTemplate" onChange={(event) => onTextChange("watermark", event.target.value)} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor={id("description")}>说明</FieldLabel>
            <FieldContent>
              <Textarea id={id("description")} value={form.description} rows={5} placeholder="*图文内容仅作辅助说明使用，具体请以游戏实际情况为准。" onChange={(event) => onTextChange("description", event.target.value)} />
            </FieldContent>
          </Field>
        </Section>
      ),
    },
  ];

  return (
    <div className={cn("h-full bg-background", variant === "desktop" ? "overflow-y-auto p-5" : "p-4")}>
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {sections.map((section) => <TabsTrigger key={section.key} value={section.key}>{section.label}</TabsTrigger>)}
        </TabsList>
        {sections.map((section) => (
          <TabsContent key={section.key} value={section.key} className="mt-5">{section.content}</TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
