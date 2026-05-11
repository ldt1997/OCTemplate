import "@/styles/luoxiaohei-fonts.css";
import { SlidersHorizontal } from "lucide-react";
import { LuoxiaoheiCanvas } from "@/components/luoxiaohei/luoxiaoheiCanvas";
import { LuoxiaoheiPreview } from "@/components/luoxiaohei/luoxiaoheiPreview";
import { LuoxiaoheiToolbar } from "@/components/luoxiaohei/luoxiaoheiToolbar";
import { useLuoxiaoheiEditor } from "@/components/luoxiaohei/useLuoxiaoheiEditor";
import { AppLayout } from "@/components/layout/appLayout";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";

export function LuoxiaoheiPage() {
  const {
    form,
    imageSize,
    fontsReady,
    isExporting,
    handleExport,
    handleImageTransformCommit,
    toolbarProps,
  } = useLuoxiaoheiEditor();

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
        <aside className="hidden h-full w-[21rem] shrink-0 border-r bg-background lg:block">
          <LuoxiaoheiToolbar variant="desktop" {...toolbarProps} />
        </aside>

        <section className="relative min-w-0 flex-1">
          <LuoxiaoheiCanvas>
            {(previewScale) => (
              <LuoxiaoheiPreview
                form={form}
                imageSize={imageSize}
                previewScale={previewScale}
                onImageTransformCommit={handleImageTransformCommit}
              />
            )}
          </LuoxiaoheiCanvas>

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
                  <LuoxiaoheiToolbar variant="mobile" {...toolbarProps} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
