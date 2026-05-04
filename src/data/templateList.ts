import type { TemplateItem } from "@/types/template";

const placeholderImage = "/templatePlaceholder.svg";

export const templateList: TemplateItem[] = [
  {
    id: "ak-recruit",
    name: "明日方舟干员招募",
    tag: "Featured",
    description: "上传角色图片和基础文案，快速生成统一风格的招募展示图。",
    path: "/akrecruit",
    previewImage: placeholderImage,
  },
  {
    id: "coming-soon-1",
    name: "角色资料卡",
    tag: "Coming",
    description: "后续扩展用的角色档案模板，适合做世界观和人物展示。",
    path: "/akrecruit",
    previewImage: placeholderImage,
  },
  {
    id: "coming-soon-2",
    name: "角色头像海报",
    tag: "Coming",
    description: "面向社媒发布的头像海报模板，先作为首页列表占位展示。",
    path: "/akrecruit",
    previewImage: placeholderImage,
  },
];
