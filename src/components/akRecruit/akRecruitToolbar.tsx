import type { ChangeEvent } from "react";
import {
  organizationOptions,
  professionOptions,
  TEXTAREA_CLASSNAME,
  type OrganizationValue,
  type ProfessionValue,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";
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

type AkRecruitToolbarProps = {
  form: RecruitFormState;
  imageError: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (field: "name" | "enName" | "intro", value: string) => void;
  onSliderChange: (field: "scale" | "offsetX" | "offsetY" | "rarity", value: number) => void;
  onOrganizationChange: (value: OrganizationValue) => void;
  onProfessionChange: (value: ProfessionValue | "") => void;
};

export function AkRecruitToolbar({
  form,
  imageError,
  onFileChange,
  onTextChange,
  onSliderChange,
  onOrganizationChange,
  onProfessionChange,
}: AkRecruitToolbarProps) {
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

            <AkRecruitSliderField
              label="图片缩放"
              value={form.scale}
              min={0.1}
              max={1}
              step={0.01}
              displayValue={form.scale.toFixed(2)}
              onValueChange={(value) => onSliderChange("scale", value)}
            />
            <AkRecruitSliderField
              label="水平偏移 (X)"
              value={form.offsetX}
              min={0}
              max={1}
              step={0.01}
              displayValue={form.offsetX.toFixed(2)}
              onValueChange={(value) => onSliderChange("offsetX", value)}
            />
            <AkRecruitSliderField
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

            <AkRecruitSliderField
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

function AkRecruitSliderField({
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
