import { SlidersHorizontal } from "lucide-react";
import { AkRecruitCanvas } from "@/components/akRecruit/akRecruitCanvas";
import { AkRecruitPreview } from "@/components/akRecruit/akRecruitPreview";
import { AkRecruitToolbar } from "@/components/akRecruit/akRecruitToolbar";
import { useAkRecruitEditor } from "@/components/akRecruit/useAkRecruitEditor";
import { AppLayout } from "@/components/layout/appLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

export function AkRecruitPage() {
  const {
    form,
    imageSize,
    fontsReady,
    isExporting,
    handleExport,
    handleImageTransformCommit,
    toolbarProps,
  } = useAkRecruitEditor();

  return (
    <AppLayout
      headerActions={
        <Button onClick={handleExport} disabled={isExporting || !fontsReady}>
          {isExporting && <Spinner data-icon="inline-start" />}
          导出
        </Button>
      }
      contentClassName="h-[calc(100dvh-4rem)] overflow-hidden bg-muted"
    >
      <div className="relative flex h-full">
        <aside className="hidden h-full w-80 shrink-0 border-r bg-background lg:block">
          <AkRecruitToolbar variant="desktop" {...toolbarProps} />
        </aside>

        <section className="relative min-w-0 flex-1">
          <AkRecruitCanvas>
            {(previewScale) => (
              <AkRecruitPreview
                form={form}
                fontsReady={fontsReady}
                imageSize={imageSize}
                previewScale={previewScale}
                onImageTransformCommit={handleImageTransformCommit}
              />
            )}
          </AkRecruitCanvas>

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

              <DrawerContent>
                <div className="max-h-[min(70dvh,36rem)] overflow-y-auto">
                  <AkRecruitToolbar variant="mobile" {...toolbarProps} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
