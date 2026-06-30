import type { TemplateItem } from "@/types/template";
import akrecruitPreview from "@/assets/akrecruit/preview.webp";
import luoxiaoheiPreview from "@/assets/luoxiaohei/preview.webp";
import notmecorePreview from "@/assets/notmecore/preview.webp";
import brPreview from "@/assets/br/preview.webp";
import fancamPreview from "@/assets/fancam/mbc_front.webp";

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
    name: "GLITCH & ASCII ART",
    tag: "NOT ME",
    description: "生成故障艺术风格的图像",
    path: "/notmecore",
    previewImage: notmecorePreview,
  },
  {
    id: "br",
    name: "《大逃杀》人物公式书",
    tag: "大逃杀",
    description: "生成《大逃杀》人物公式书风格角色档案图",
    path: "/br",
    previewImage: brPreview,
  },
  {
    id: "fancam",
    name: "舞台直拍封面",
    tag: "舞台直拍",
    description:
      "生成舞台直拍风格封面",
    path: "/fancam",
    previewImage: fancamPreview,
  },
];
