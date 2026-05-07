import type { ChangeEvent } from "react";
import {
  MAX_FILE_SIZE_MB,
  MAX_ORGANIZATION_LOGO_FILE_SIZE_MB,
  organizationOptionGroups,
  professionOptions,
  type OrganizationValue,
  type ProfessionValue,
  type RecruitFormState,
} from "@/components/akRecruit/akRecruitConfig";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AkRecruitToolbarProps = {
  variant: "desktop" | "mobile";
  form: RecruitFormState;
  imageError: string | null;
  organizationLogoError: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOrganizationLogoFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (field: "name" | "enName" | "intro", value: string) => void;
  onToggleChange: (
    field: "isNewOperator" | "showSeniorVoucher" | "showHeadhuntingContract",
    value: boolean,
  ) => void;
  onSliderChange: (field: "rarity", value: number) => void;
  onImageScaleChange: (value: number) => void;
  onOrganizationChange: (value: OrganizationValue) => void;
  onProfessionChange: (value: ProfessionValue | "") => void;
};

export function AkRecruitToolbar({
  variant,
  form,
  imageError,
  organizationLogoError,
  onFileChange,
  onOrganizationLogoFileChange,
  onTextChange,
  onToggleChange,
  onSliderChange,
  onImageScaleChange,
  onOrganizationChange,
  onProfessionChange,
}: AkRecruitToolbarProps) {
  const sections = [
    {
      key: "appearance",
      label: "立绘",
      desc: "使用滑杆缩放，直接拖动预览中的立绘调整位置",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="image-upload">上传图片</FieldLabel>
              <FieldContent>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={onFileChange}
                />
                <FieldDescription>
                  支持 PNG / JPEG，最大 {MAX_FILE_SIZE_MB}MB
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
                    min={0.5}
                    max={3}
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
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "organization",
      label: "阵营",
      desc: "选择角色所属阵营",
      content: (
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>阵营</FieldLabel>
              <FieldContent>
                <Select
                  value={form.organization}
                  onValueChange={(value) =>
                    onOrganizationChange(value as OrganizationValue)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择阵营" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationOptionGroups.map((group) => (
                      <SelectGroup key={group.label}>
                        <SelectLabel>{group.label}</SelectLabel>
                        {group.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="organization-logo-upload">
                自定义阵营LOGO
              </FieldLabel>
              <FieldContent>
                <Input
                  id="organization-logo-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={onOrganizationLogoFileChange}
                />
                <FieldDescription>
                  支持 PNG / JPEG，最大 {MAX_ORGANIZATION_LOGO_FILE_SIZE_MB}MB，默认尺寸
                  500*500px
                  {form.customOrganizationLogoFile
                    ? `，当前文件：${form.customOrganizationLogoFile.name}`
                    : ""}
                </FieldDescription>
                {organizationLogoError ? (
                  <p className="text-sm text-destructive">
                    {organizationLogoError}
                  </p>
                ) : null}
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "role",
      label: "角色",
      desc: "选择角色星级职业与招募标记",
      content: (
        <FieldSet>
          <FieldGroup>

            <Field>
              <FieldLabel>职业</FieldLabel>
              <FieldContent>
                <Select
                  value={form.profession || undefined}
                  onValueChange={(value) =>
                    onProfessionChange(value as ProfessionValue)
                  }
                >
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

            <Field>
              <FieldLabel>星级</FieldLabel>
              <FieldContent>
                <div className="space-y-3">
                  <Slider
                    value={[form.rarity]}
                    min={1}
                    max={6}
                    step={1}
                    onValueChange={(value) =>
                      onSliderChange("rarity", value[0] ?? form.rarity)
                    }
                  />
                  <FieldDescription>{form.rarity} 星</FieldDescription>
                </div>
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.isNewOperator}
                      onCheckedChange={(checked) =>
                        onToggleChange("isNewOperator", checked === true)
                      }
                    />
                    <span>NEW</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.showSeniorVoucher}
                      onCheckedChange={(checked) =>
                        onToggleChange("showSeniorVoucher", checked === true)
                      }
                    />
                    <span>高级凭证</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.showHeadhuntingContract}
                      onCheckedChange={(checked) =>
                        onToggleChange(
                          "showHeadhuntingContract",
                          checked === true,
                        )
                      }
                    />
                    <span>寻访数据契约</span>
                  </label>
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      ),
    },
    {
      key: "text",
      label: "文本",
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
                  onChange={(event) =>
                    onTextChange("enName", event.target.value)
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="character-intro">开场白</FieldLabel>
              <FieldContent>
                <Textarea
                  id="character-intro"
                  value={form.intro}
                  placeholder="100字以内"
                  maxLength={100}
                  onChange={(event) =>
                    onTextChange("intro", event.target.value)
                  }
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
        <div className="lg:hidden">
          <Tabs
            defaultValue={sections[0].key}
            className="bg-background p-4"
          >
            <TabsList className="grid h-auto w-full grid-cols-4">
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
                <div>
                  {/* <FieldTitle>{section.label}</FieldTitle>
                  <FieldDescription className="mt-1">
                    {section.desc}
                  </FieldDescription> */}
                  <div className="mt-4 pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
                    {section.content}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </>
  );
}
