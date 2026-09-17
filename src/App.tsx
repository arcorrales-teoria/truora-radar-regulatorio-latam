import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import CountryPage from "@/pages/CountryPage";
import LawPage from "@/pages/LawPage";
import AssessmentPage from "@/pages/AssessmentPage";

function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Radar de regulación | Truora";
    window._hsq = window._hsq || [];
    window._hsq.push(["setPath", pathname]);
    window._hsq.push(["trackPageView"]);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Navigate to="/radar-regulatorio" replace />} />
        <Route path="/radar-regulatorio" element={<HomePage />} />
        <Route path="/radar-regulatorio/:pais/assessment" element={<AssessmentPage />} />
        <Route path="/radar-regulatorio/:pais/:ley" element={<LawPage />} />
        <Route path="/radar-regulatorio/:pais" element={<CountryPage />} />
        <Route path="*" element={<Navigate to="/radar-regulatorio" replace />} />
      </Routes>
    </>
  );
}
