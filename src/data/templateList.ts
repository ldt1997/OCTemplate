import type { TemplateItem } from "@/types/template";
import akrecruitPreview from "@/assets/akrecruit/preview.webp";
import luoxiaoheiPreview from "@/assets/luoxiaohei/preview.webp";
import notmecorePreview from "@/assets/notmecore/preview.webp";

export const templateList: TemplateItem[] = [
  {
    id: "ak-recruit",
    name: "明日方舟干员招募界面",
    tag: "明日方舟",
    description: "生成仿明日方舟干员招募界面",
    path: "/akrecruit",
    previewImage: akrecruitPreview,
  },
  {
    id: "luoxiaohei",
    name: "罗小黑人物双色海报",
    tag: "罗小黑",
    description: "上传图片并提取主题双色，一键生成风格统一的人物海报",
    path: "/luoxiaohei",
    previewImage: luoxiaoheiPreview,
  },
  {
    id: "notmecore",
    name: "'NOT ME' CORE",
    tag: "NOT ME",
    description: "ascii art & glitch",
    path: "/notmecore",
    previewImage: notmecorePreview,
  },
];
