import "@/styles/fancam-fonts.css";
import { SlidersHorizontal } from "lucide-react";
import { FancamBackgroundCropDialog } from "@/components/fancam/fancamBackgroundCropDialog";
import { FancamCanvas } from "@/components/fancam/fancamCanvas";
import { FancamToolbar } from "@/components/fancam/fancamToolbar";
import { FancamViewport } from "@/components/fancam/fancamViewport";
import { useFancamEditor } from "@/components/fancam/useFancamEditor";
import { AppLayout } from "@/components/layout/appLayout";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { createWebApplicationJsonLd, seoPages } from "@/data/siteMetadata";

export function FancamPage() {
  const {
    isExporting,
    canExport,
    handleExport,
    canvasProps,
    toolbarProps,
    backgroundCropDialogProps,
  } = useFancamEditor();

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
        metadata={seoPages.fancam}
        structuredData={createWebApplicationJsonLd(seoPages.fancam)}
        structuredDataId="fancam"
      />
      <div className="relative flex h-full">
        <h1 className="sr-only">舞台直拍封面生成器</h1>
        <aside className="hidden h-full w-[21rem] shrink-0 border-r bg-background lg:block">
          <FancamToolbar variant="desktop" {...toolbarProps} />
        </aside>

        <section className="relative min-w-0 flex-1">
          <FancamViewport>
            {(displaySize) => (
              <FancamCanvas {...canvasProps} displaySize={displaySize} />
            )}
          </FancamViewport>

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
                  <FancamToolbar variant="mobile" {...toolbarProps} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </section>
      </div>
      <FancamBackgroundCropDialog {...backgroundCropDialogProps} />
    </AppLayout>
  );
}
