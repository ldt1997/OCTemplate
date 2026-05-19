import "@/styles/br-fonts.css";
import { SlidersHorizontal } from "lucide-react";
import { BrCanvas } from "@/components/br/brCanvas";
import { BrImageCropDialog } from "@/components/br/brImageCropDialog";
import { BrToolbar } from "@/components/br/brToolbar";
import { BrViewport } from "@/components/br/brViewport";
import { useBrEditor } from "@/components/br/useBrEditor";
import { AppLayout } from "@/components/layout/appLayout";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { createWebApplicationJsonLd, seoPages } from "@/data/siteMetadata";

export function BrPage() {
  const {
    form,
    fontsReady,
    isExporting,
    canExport,
    handleExport,
    cropDialogProps,
    toolbarProps,
  } = useBrEditor();

  return (
    <AppLayout
      headerActions={
        <Button onClick={handleExport} disabled={!canExport || isExporting}>
          {isExporting && <Spinner data-icon="inline-start" />}
          导出
        </Button>
      }
      contentClassName="h-[calc(100dvh-4rem)] overflow-hidden"
    >
      <SeoMeta
        metadata={seoPages.br}
        structuredData={createWebApplicationJsonLd(seoPages.br)}
        structuredDataId="br"
      />
      <div className="relative flex h-full">
        <h1 className="sr-only">《大逃杀》人物公式书生成器</h1>
        <aside className="hidden h-full w-[21rem] shrink-0 border-r bg-background lg:block">
          <BrToolbar variant="desktop" {...toolbarProps} />
        </aside>

        <section className="relative min-w-0 flex-1">
          <BrViewport>
            {(displaySize) => (
              <BrCanvas
                form={form}
                fontsReady={fontsReady}
                displaySize={displaySize}
              />
            )}
          </BrViewport>

          <div className="absolute inset-x-0 bottom-0 z-20 lg:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <div className="pointer-events-none flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom,0px)+32px)]">
                  <Button
                    type="button"
                    variant="secondary"
                    className="pointer-events-auto rounded-full border bg-background/95 shadow-lg backdrop-blur"
                  >
                    <SlidersHorizontal />
                    调整参数
                  </Button>
                </div>
              </DrawerTrigger>

              <DrawerContent overlayClassName="bg-transparent">
                <div className="max-h-[50dvh] overflow-y-auto">
                  <BrToolbar variant="mobile" {...toolbarProps} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </section>
      </div>
      <BrImageCropDialog {...cropDialogProps} />
    </AppLayout>
  );
}
