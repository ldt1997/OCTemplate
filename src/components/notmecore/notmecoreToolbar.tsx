import type { ChangeEvent } from "react";
import type { NotmecoreFormState } from "@/components/notmecore/notmecoreConfig";
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
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NotmecoreToolbarProps = {
  variant: "desktop" | "mobile";
  form: NotmecoreFormState;
  imageError: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBackgroundColorChange: (value: string) => void;
  onSaturationChange: (value: number) => void;
};

export function NotmecoreToolbar({
  variant,
  form,
  imageError,
  onFileChange,
  onBackgroundColorChange,
  onSaturationChange,
}: NotmecoreToolbarProps) {
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
              <FieldLabel htmlFor="notmecore-background">背景</FieldLabel>
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
      key: "filter",
      label: "滤镜",
      desc: "调整图片饱和度，实时影响预览和导出。",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>饱和度</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.saturation]}
                    min={0}
                    max={2}
                    step={0.01}
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
            <TabsList className="grid h-auto w-full grid-cols-2">
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
