import { Route, Routes } from "react-router";
import NotFound from "../components/NotFound";
import AdesionNova from "../pages/AdesionExterno";

export const Initial = () => {

  return (
    <Routes>    
    <Route path="*" element={<NotFound/>} />   
    <Route path="/NovaAdesao"  element={<AdesionNova />} /> 
  </Routes>
  );
};
