import { AppLayout } from "@/components/layout/appLayout";
import { TemplateCard } from "@/components/template/templateCard";
import { templateList } from "@/data/templateList";

export function HomePage() {
  return (
    <AppLayout contentClassName="px-4 py-8 sm:px-8">
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
