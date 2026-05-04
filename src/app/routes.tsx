import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AkRecruitPage } from "@/pages/akRecruitPage";
import { HomePage } from "@/pages/homePage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/akrecruit" element={<AkRecruitPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

