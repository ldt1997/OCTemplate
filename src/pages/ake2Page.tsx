import "@/styles/ake2-fonts.css";
import { SlidersHorizontal } from "lucide-react";
import { Ake2Canvas } from "@/components/ake2/ake2Canvas";
import { Ake2Toolbar } from "@/components/ake2/ake2Toolbar";
import { Ake2Viewport } from "@/components/ake2/ake2Viewport";
import { useAke2Editor } from "@/components/ake2/useAke2Editor";
import { AppLayout } from "@/components/layout/appLayout";
import { SeoMeta } from "@/components/seo/SeoMeta";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { createWebApplicationJsonLd, seoPages } from "@/data/siteMetadata";

export function Ake2Page() {
  const { resources, resourceError, setResourceError, fontError, fontsReady, toolbarProps } = useAke2Editor();

  return (
    <AppLayout
      headerActions={<Button disabled title="完整海报预览与导出即将开放">导出</Button>}
      contentClassName="h-[calc(100dvh-4rem)] overflow-hidden"
    >
      <SeoMeta metadata={seoPages.ake2} structuredData={createWebApplicationJsonLd(seoPages.ake2)} structuredDataId="ake2" />
      <h1 className="sr-only">明日方舟精二海报生成器</h1>
      <div className="relative flex h-full">
        <aside className="hidden h-full w-[21rem] shrink-0 border-r bg-background lg:block" aria-label="海报参数">
          <Ake2Toolbar variant="desktop" {...toolbarProps} />
        </aside>
        <section className="relative min-w-0 flex-1" aria-label="海报预览">
          <Ake2Viewport>
            {(displayWidth) => (
              <>
                {resourceError ? (
                  <p role="alert" className="p-6 text-sm text-destructive">{resourceError}</p>
                ) : resources ? (
                  <Ake2Canvas displayWidth={displayWidth} resources={resources} onError={setResourceError} />
                ) : (
                  <div role="status" className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">正在加载背景…</div>
                )}
                <div className="space-y-1 px-4 py-3 text-sm text-muted-foreground">
                  <p>当前为基础版本，仅展示背景；完整海报预览与导出即将开放。</p>
                  {fontError ? <p role="alert" className="text-destructive">{fontError}</p> : !fontsReady && <p role="status">正在加载模板字体…</p>}
                </div>
              </>
            )}
          </Ake2Viewport>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom,0px)+32px)] lg:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button type="button" variant="secondary" className="pointer-events-auto rounded-full border bg-background/95 shadow-lg backdrop-blur">
                  <SlidersHorizontal />调整参数
                </Button>
              </DrawerTrigger>
              <DrawerContent overlayClassName="bg-transparent">
                <DrawerTitle className="sr-only">海报参数</DrawerTitle>
                <DrawerDescription className="sr-only">设置立绘、角色和辅助文本。</DrawerDescription>
                <div className="max-h-[50dvh] overflow-y-auto pb-[env(safe-area-inset-bottom,0px)]" data-vaul-no-drag>
                  <Ake2Toolbar variant="mobile" {...toolbarProps} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
