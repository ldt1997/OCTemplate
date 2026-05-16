import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/homePage";

const AkRecruitPage = lazy(async () => {
  const module = await import("@/pages/akRecruitPage");
  return { default: module.AkRecruitPage };
});

const LuoxiaoheiPage = lazy(async () => {
  const module = await import("@/pages/luoxiaoheiPage");
  return { default: module.LuoxiaoheiPage };
});

const NotmecorePage = lazy(async () => {
  const module = await import("@/pages/notmecorePage");
  return { default: module.NotmecorePage };
});

const BrPage = lazy(async () => {
  const module = await import("@/pages/brPage");
  return { default: module.BrPage };
});

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-sm text-muted-foreground">
      正在加载模板资源...
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/akrecruit" element={<AkRecruitPage />} />
          <Route path="/luoxiaohei" element={<LuoxiaoheiPage />} />
          <Route path="/notmecore" element={<NotmecorePage />} />
          <Route path="/br" element={<BrPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
