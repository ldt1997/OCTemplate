import "@/styles/notmecore-fonts.css";
import { SlidersHorizontal } from "lucide-react";
import { NotmecoreCanvas } from "@/components/notmecore/notmecoreCanvas";
import { NotmecoreToolbar } from "@/components/notmecore/notmecoreToolbar";
import { NotmecoreViewport } from "@/components/notmecore/notmecoreViewport";
import { useNotmecoreEditor } from "@/components/notmecore/useNotmecoreEditor";
import { AppLayout } from "@/components/layout/appLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

export function NotmecorePage() {
  const {
    form,
    imageSize,
    previewRenderSize,
    fontsReady,
    isExporting,
    canExport,
    handleExport,
    toolbarProps,
  } = useNotmecoreEditor();

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
      <div className="relative flex h-full">
        <aside className="hidden h-full w-[21rem] shrink-0 border-r bg-background lg:block">
          <NotmecoreToolbar variant="desktop" {...toolbarProps} />
        </aside>

        <section className="relative min-w-0 flex-1">
          <NotmecoreViewport imageSize={imageSize}>
            {(displaySize) => (
              <NotmecoreCanvas
                form={form}
                fontsReady={fontsReady}
                imageSize={imageSize}
                previewRenderSize={previewRenderSize}
                displaySize={displaySize}
              />
            )}
          </NotmecoreViewport>

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
                <div className="max-h-[min(72dvh,40rem)] overflow-y-auto">
                  <NotmecoreToolbar variant="mobile" {...toolbarProps} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
