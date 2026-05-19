import { AppLayout } from "@/components/layout/appLayout";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { TemplateCard } from "@/components/template/templateCard";
import { templateList } from "@/data/templateList";
import { createWebsiteJsonLd, seoPages } from "@/data/siteMetadata";

export function HomePage() {
  return (
    <AppLayout contentClassName="px-4 py-8 sm:px-8">
      <SeoMeta
        metadata={seoPages.home}
        structuredData={createWebsiteJsonLd()}
        structuredDataId="website"
      />
      <section className="sr-only">
        <h1>OCTemplate</h1>
        <p>
          在线图片模板生成器。选择模板、上传图片、调整参数，实时预览并导出固定尺寸 PNG。
        </p>
      </section>
      <section
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="模板列表"
      >
        {templateList.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </section>
    </AppLayout>
  );
}
