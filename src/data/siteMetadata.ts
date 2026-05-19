export type SeoMetadata = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
};

export const siteMetadata = {
  name: "OCTemplate",
  url: "https://octemplate.top",
  defaultTitle: "OCTemplate - 在线图片模板生成器",
  description:
    "OCTemplate 是一个在线图片模板生成工具，支持上传图片、实时预览并导出角色海报、游戏风格界面和固定尺寸 PNG 图片。",
  locale: "zh_CN",
  image: "/og/og_image.webp",
  themeColor: "#ff385c",
} as const;

export const seoPages = {
  home: {
    title: siteMetadata.defaultTitle,
    description: siteMetadata.description,
    path: "/",
    keywords: [
      "OCTemplate",
      "图片模板生成器",
      "角色海报生成器",
      "在线图片编辑",
      "PNG 导出",
    ],
  },
  akRecruit: {
    title: "明日方舟干员招募界面生成器 - OCTemplate",
    description:
      "使用 OCTemplate 生成仿明日方舟干员招募界面，上传角色图片、调整参数并导出固定尺寸 PNG。",
    path: "/akrecruit",
    keywords: ["明日方舟", "干员招募", "图片模板", "角色卡生成器"],
  },
  luoxiaohei: {
    title: "罗小黑人物双色海报生成器 - OCTemplate",
    description:
      "上传人物图片并提取主题双色，使用 OCTemplate 生成罗小黑风格的人物双色海报。",
    path: "/luoxiaohei",
    keywords: ["罗小黑", "人物海报", "双色海报", "图片模板生成器"],
  },
  notmecore: {
    title: "GLITCH & ASCII ART 图片生成器 - OCTemplate",
    description:
      "使用 OCTemplate 生成故障艺术和 ASCII ART 风格图像，支持上传图片、调整效果并导出 PNG。",
    path: "/notmecore",
    keywords: ["glitch art", "ASCII art", "故障艺术", "图片生成器"],
  },
  br: {
    title: "《大逃杀》人物公式书生成器 - OCTemplate",
    description:
      "使用 OCTemplate 生成《大逃杀》人物公式书风格角色档案图，支持角色图片、文本信息和 PNG 导出。",
    path: "/br",
    keywords: ["大逃杀", "人物公式书", "角色档案", "图片模板生成器"],
  },
} satisfies Record<string, SeoMetadata>;

export function absoluteUrl(path: string) {
  return new URL(path, siteMetadata.url).toString();
}

export function getCanonicalUrl(metadata: SeoMetadata) {
  return absoluteUrl(metadata.path);
}

export function getOgImageUrl(metadata: SeoMetadata) {
  return absoluteUrl(metadata.image ?? siteMetadata.image);
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.name,
    url: siteMetadata.url,
    description: siteMetadata.description,
    inLanguage: "zh-CN",
  };
}

export function createWebApplicationJsonLd(metadata: SeoMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: metadata.title.replace(` - ${siteMetadata.name}`, ""),
    url: getCanonicalUrl(metadata),
    description: metadata.description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    inLanguage: "zh-CN",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

