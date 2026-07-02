import type { ChangeEvent } from "react";
import {
  fancamEffectOptions,
  fancamTemplateOptions,
  fancamTemplateSpec,
  type FancamEffect,
  type FancamFormState,
  type FancamTemplate,
} from "@/components/fancam/fancamConfig";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import { cn } from "@/lib/utils";

type FancamToolbarProps = {
  variant: "desktop" | "mobile";
  form: FancamFormState;
  characterError: string | null;
  backgroundError: string | null;
  onCharacterFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBackgroundFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBackgroundImageClear: () => void;
  onOpenBackgroundCrop: () => void;
  onCharacterScaleChange: (value: number) => void;
  onResetCharacterPosition: () => void;
  onTemplateChange: (template: FancamTemplate) => void;
  onBackgroundColorChange: (value: string) => void;
  onEffectChange: (effect: FancamEffect) => void;
  onGroupNameChange: (value: string) => void;
  onMemberNameChange: (value: string) => void;
  onSongNameChange: (value: string) => void;
};

function SectionChrome({
  legend,
  desc,
  children,
}: {
  legend: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <FieldSet>
      <FieldLegend>{legend}</FieldLegend>
      <FieldDescription>{desc}</FieldDescription>
      <FieldGroup>{children}</FieldGroup>
    </FieldSet>
  );
}

export function FancamToolbar({
  variant,
  form,
  characterError,
  backgroundError,
  onCharacterFileChange,
  onBackgroundFileChange,
  onBackgroundImageClear,
  onOpenBackgroundCrop,
  onCharacterScaleChange,
  onResetCharacterPosition,
  onTemplateChange,
  onBackgroundColorChange,
  onEffectChange,
  onGroupNameChange,
  onMemberNameChange,
  onSongNameChange,
}: FancamToolbarProps) {
  const sections = [
    {
      key: "image",
      label: "图片",
      content: (
        <SectionChrome legend="图片" desc="设置角色立绘、缩放、背景颜色与背景图片。">
          <Field>
            <FieldLabel htmlFor="fancam-character-image">角色立绘</FieldLabel>
            <FieldContent>
              <Input
                id="fancam-character-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onCharacterFileChange}
              />
              <FieldDescription>
                {fancamTemplateSpec.imageAcceptLabel}，最大 8MB
                {form.characterFile ? `，当前文件：${form.characterFile.name}` : ""}
              </FieldDescription>
              {characterError ? (
                <p className="text-sm text-destructive">{characterError}</p>
              ) : null}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>缩放</FieldLabel>
            <FieldContent>
              <div className="space-y-3">
                <Slider
                  value={[form.characterScale]}
                  min={fancamTemplateSpec.characterScaleRange.min}
                  max={fancamTemplateSpec.characterScaleRange.max}
                  step={fancamTemplateSpec.characterScaleRange.step}
                  onValueChange={(value) =>
                    onCharacterScaleChange(value[0] ?? form.characterScale)
                  }
                />
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{Math.round(form.characterScale * 100)}%</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onResetCharacterPosition}
                  >
                    重置位置
                  </Button>
                </div>
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="fancam-background-color">背景颜色</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-3">
                <Input
                  id="fancam-background-color"
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

          <Field>
            <FieldLabel htmlFor="fancam-background-image">背景图片</FieldLabel>
            <FieldContent>
              <Input
                key={form.backgroundUrl ?? "empty-background"}
                id="fancam-background-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onBackgroundFileChange}
              />
              <FieldDescription>
                建议 1920x1080，支持 16:9 裁剪，最大 10MB
                {form.backgroundFile ? `，当前文件：${form.backgroundFile.name}` : ""}
              </FieldDescription>
              {backgroundError ? (
                <p className="text-sm text-destructive">{backgroundError}</p>
              ) : null}
              {form.backgroundUrl ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onOpenBackgroundCrop}
                  >
                    重新裁剪
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBackgroundImageClear}
                  >
                    清空背景图片
                  </Button>
                </div>
              ) : null}
            </FieldContent>
          </Field>
        </SectionChrome>
      ),
    },
    {
      key: "effect",
      label: "效果",
      content: (
        <SectionChrome legend="效果" desc="设置封面模板与装饰效果。">
          <Field>
            <FieldLabel>模板</FieldLabel>
            <FieldContent>
              <ButtonGroup className="w-full">
                {fancamTemplateOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={form.template === option.value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => onTemplateChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>装饰效果</FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-2 gap-2">
                {fancamEffectOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={form.effect === option.value ? "default" : "outline"}
                    onClick={() => onEffectChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </FieldContent>
          </Field>
        </SectionChrome>
      ),
    },
    {
      key: "text",
      label: "文字",
      content: (
        <SectionChrome legend="文字" desc="设置组合、人物与歌曲名称。">
          <Field>
            <FieldLabel htmlFor="fancam-group-name">组合名称</FieldLabel>
            <FieldContent>
              <Input
                id="fancam-group-name"
                value={form.groupName}
                maxLength={fancamTemplateSpec.textLimits.groupName}
                placeholder="请输入组合名称"
                onChange={(event) => onGroupNameChange(event.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="fancam-member-name">人物名称</FieldLabel>
            <FieldContent>
              <Input
                id="fancam-member-name"
                value={form.memberName}
                maxLength={fancamTemplateSpec.textLimits.memberName}
                placeholder="请输入人物名称"
                onChange={(event) => onMemberNameChange(event.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="fancam-song-name">歌曲名称</FieldLabel>
            <FieldContent>
              <Input
                id="fancam-song-name"
                value={form.songName}
                maxLength={fancamTemplateSpec.textLimits.songName}
                placeholder="请输入歌曲名称"
                onChange={(event) => onSongNameChange(event.target.value)}
              />
            </FieldContent>
          </Field>
        </SectionChrome>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "h-full bg-background",
        variant === "desktop" ? "overflow-y-auto p-5" : "p-4",
      )}
    >
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {sections.map((section) => (
            <TabsTrigger key={section.key} value={section.key}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.key} value={section.key} className="mt-5">
            {section.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
