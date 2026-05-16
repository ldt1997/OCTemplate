import type { ChangeEvent } from "react";
import type { BrFormState, BrGender } from "@/components/br/brConfig";
import { brTemplateSpec } from "@/components/br/brConfig";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BrToolbarProps = {
  variant: "desktop" | "mobile";
  form: BrFormState;
  imageError: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBackgroundColorChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onEnglishNameChange: (value: string) => void;
  onGenderChange: (value: BrGender) => void;
  onNumberChange: (value: number) => void;
  onWeaponChange: (value: string) => void;
  onKillCountChange: (value: number) => void;
  onDeathLocationChange: (value: string) => void;
  onMovieProfileChange: (value: string) => void;
  onNovelBackgroundChange: (value: string) => void;
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

export function BrToolbar({
  variant,
  form,
  imageError,
  onFileChange,
  onBackgroundColorChange,
  onNameChange,
  onEnglishNameChange,
  onGenderChange,
  onNumberChange,
  onWeaponChange,
  onKillCountChange,
  onDeathLocationChange,
  onMovieProfileChange,
  onNovelBackgroundChange,
}: BrToolbarProps) {
  const sections = [
    {
      key: "image",
      label: "图片",
      content: (
        <SectionChrome legend="图片" desc="设置人物图片与背景颜色。">
          <Field>
            <FieldLabel htmlFor="br-image">上传图片</FieldLabel>
            <FieldContent>
              <Input
                id="br-image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={onFileChange}
              />
              <FieldDescription>
                {brTemplateSpec.imageAcceptLabel}
                {form.imageFile ? `，当前文件：${form.imageFile.name}` : ""}
              </FieldDescription>
              {imageError ? (
                <p className="text-sm text-destructive">{imageError}</p>
              ) : null}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="br-background-color">背景色</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-3">
                <Input
                  id="br-background-color"
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
        </SectionChrome>
      ),
    },
    {
      key: "identity",
      label: "身份",
      content: (
        <SectionChrome legend="身份" desc="设置人物的基础身份信息。">
          <Field>
            <FieldLabel htmlFor="br-name">姓名</FieldLabel>
            <FieldContent>
              <Input
                id="br-name"
                value={form.name}
                maxLength={brTemplateSpec.textLimits.name}
                placeholder="请输入姓名"
                onChange={(event) => onNameChange(event.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="br-english-name">英文名</FieldLabel>
            <FieldContent>
              <Input
                id="br-english-name"
                value={form.englishName}
                maxLength={brTemplateSpec.textLimits.englishName}
                placeholder="请输入英文名"
                onChange={(event) => onEnglishNameChange(event.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>性别</FieldLabel>
            <FieldContent>
              <div className="grid grid-cols-2 gap-2">
                {(["She", "He"] as const).map((gender) => (
                  <Button
                    key={gender}
                    type="button"
                    variant={form.gender === gender ? "default" : "outline"}
                    onClick={() => onGenderChange(gender)}
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="br-number">番号</FieldLabel>
            <FieldContent>
              <Input
                id="br-number"
                type="number"
                value={form.number}
                min={brTemplateSpec.numberRange.min}
                max={brTemplateSpec.numberRange.max}
                onChange={(event) => onNumberChange(Number(event.target.value))}
              />
            </FieldContent>
          </Field>
        </SectionChrome>
      ),
    },
    {
      key: "battle",
      label: "战况",
      content: (
        <SectionChrome legend="战况" desc="设置武器、击杀与死亡地点。">
          <Field>
            <FieldLabel htmlFor="br-weapon">武器</FieldLabel>
            <FieldContent>
              <Input
                id="br-weapon"
                value={form.weapon}
                maxLength={brTemplateSpec.textLimits.weapon}
                placeholder="请输入武器"
                onChange={(event) => onWeaponChange(event.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>击杀数</FieldLabel>
            <FieldContent>
              <div className="space-y-3">
                <Slider
                  value={[form.killCount]}
                  min={brTemplateSpec.killCountRange.min}
                  max={brTemplateSpec.killCountRange.max}
                  step={brTemplateSpec.killCountRange.step}
                  onValueChange={(value) =>
                    onKillCountChange(value[0] ?? form.killCount)
                  }
                />
                <FieldDescription>当前值：{form.killCount}</FieldDescription>
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="br-death-location">死亡地点</FieldLabel>
            <FieldContent>
              <Input
                id="br-death-location"
                value={form.deathLocation}
                maxLength={brTemplateSpec.textLimits.deathLocation}
                placeholder="请输入死亡地点"
                onChange={(event) => onDeathLocationChange(event.target.value)}
              />
            </FieldContent>
          </Field>
        </SectionChrome>
      ),
    },
    {
      key: "profile",
      label: "介绍",
      content: (
        <SectionChrome legend="介绍" desc="设置电影与小说中的介绍文本。">
          <Field>
            <FieldLabel htmlFor="br-movie-profile">电影设定</FieldLabel>
            <FieldContent>
              <Textarea
                id="br-movie-profile"
                value={form.movieProfile}
                maxLength={brTemplateSpec.textLimits.profile}
                rows={5}
                placeholder="请输入电影人物介绍"
                onChange={(event) => onMovieProfileChange(event.target.value)}
              />
              <FieldDescription>
                {form.movieProfile.length}/{brTemplateSpec.textLimits.profile}
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="br-novel-background">小说背景</FieldLabel>
            <FieldContent>
              <Textarea
                id="br-novel-background"
                value={form.novelBackground}
                maxLength={brTemplateSpec.textLimits.profile}
                rows={5}
                placeholder="请输入小说背景介绍"
                onChange={(event) =>
                  onNovelBackgroundChange(event.target.value)
                }
              />
              <FieldDescription>
                {form.novelBackground.length}/{brTemplateSpec.textLimits.profile}
              </FieldDescription>
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
        <TabsList className="grid w-full grid-cols-4">
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
