import { Routes, Route, Navigate } from "react-router-dom";
import NovaAdesao from "../pages/AdesionExterno";
import NotFound from "../components/NotFound";

export function App() {
  return (
    <Routes>
      {/* Redireciona raiz para /NovaAdesao */}
      <Route path="/" element={<Navigate to="/NovaAdesao" replace />} />
      <Route path="/NovaAdesao" element={<NovaAdesao />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}